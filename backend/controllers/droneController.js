const axios = require('axios');
const xmlParser = require('xml-js');

const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

const getPilotData = async (sn) => {
    const response = await axios.get("https://assignments.reaktor.com/birdnest/pilots/" + sn);

    if(response.status !== 200){
        console.log("Could not find pilot data")
        return null;
    }

    return response.data;
}

const getDrones = async (req, res) => {

    const droneList = [];
    const outerDroneList = [];

    try {
        const response = await axios.get("http://assignments.reaktor.com/birdnest/drones");

        if(response.status !== 200){
            return res.status(500).json({message:"Could not get drone data"})
        }

        const data = JSON.parse(xmlParser.xml2json(response.data));

        const timestamp = data.elements[0].elements[1].attributes.snapshotTimestamp;

        const drones = data.elements[0].elements[1].elements;

        drones.forEach(drone => {
            const sn = drone.elements[0].elements[0].text;

            const y = drone.elements[7].elements[0].text;
            const x = drone.elements[8].elements[0].text;

            // https://www.youtube.com/watch?v=S6BHQMk8C_A
            // distance to origin point of the nest converted to meters
            const distanceToNest = Math.sqrt((x-250000)**2 + (y-250000)**2) / 1000;

            const droneData = {
                lastSeen: timestamp,
                sn: sn,
                closestDistanceToNest: distanceToNest,
                x: x,
                y: y
            };

            if(Math.sqrt((x-250000)**2 + (y-250000)**2) <= 100000){

                droneList.push(droneData);
            }else {
                outerDroneList.push(droneData);
            }
        });

    }catch(err) {
        console.error(err);
        return res.status(500).json({error: err.message});
    }

    for (const drone of droneList) {

        // save new record to cache
        if(!cache.get(drone.sn)){

            const pilotData = await getPilotData(drone.sn);

            if(pilotData){
                cache.set(drone.sn, JSON.stringify({drone: drone, pilot: pilotData}));

                console.log("Saved new record: " + drone.sn);
            }

        }else{
            // alter old record and refresh ttl

            let oldData = JSON.parse(cache.take(drone.sn));

            oldData.drone.lastSeen = drone.lastSeen;
            oldData.drone.closestDistanceToNest = oldData.drone.closestDistanceToNest < drone.closestDistanceToNest ? oldData.drone.closestDistanceToNest : drone.closestDistanceToNest;
            oldData.drone.x = drone.x;
            oldData.drone.y = drone.y;

            cache.set(drone.sn, JSON.stringify(oldData));

            console.log("Altered old record: " + drone.sn)
        }

    };

    const droneAndPilotList = [];

    cache.keys().forEach(key => {
        try {
            droneAndPilotList.push(JSON.parse(cache.get(key)));
        }  catch(err) {
            console.log("Unable to parse cache key: " + key);
        }
    })

    res.json({
        count: cache.getStats().keys,
        list: droneAndPilotList,
        notInNDZ: outerDroneList
    });
}

module.exports = {
    getDrones
}