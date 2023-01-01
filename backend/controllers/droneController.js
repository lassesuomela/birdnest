const axios = require('axios');
const xmlParser = require('xml-js');

const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

const getPilotData = async (sn) => {
    const response = await axios.get("https://assignments.reaktor.com/birdnest/pilots/" + sn);

    if(response.status !== 200){
        return null;
    }

    return response.data;
}

const getDrones = async (req, res) => {

    const droneList = [];

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

            // distance to point (250000, 250000) converted to meters
            const distanceToNest = Math.sqrt((x - 250000)**2 + (y - 250000)**2) / 1000;

            if((Math.abs(x - 250000) + Math.abs(y - 250000)) / 1000 <= 100){

                droneList.push({
                    lastSeen: timestamp,
                    sn: sn,
                    closestDistanceToNest: distanceToNest,
                    x: x,
                    y: y
                });
            }

        });

    }catch(err) {
        console.error(err);
        return res.status(500).json({error: err.message});
    }

    await Promise.all(droneList.map(async (drone, i) => {

        // save new record to cache
        if(!cache.get(droneList[i].sn)){

            const pilotData = await getPilotData(drone.sn);

            if(pilotData){
                cache.set(droneList[i].sn, JSON.stringify({drone: droneList[i], pilot: pilotData}));

                console.log("Saved new record: " + droneList[i].sn);
            }

        }else{
            // alter old record and refresh ttl

            let oldData = JSON.parse(cache.take(droneList[i].sn));

            oldData.drone.lastSeen = droneList[i].lastSeen;
            oldData.drone.closestDistanceToNest = oldData.drone.closestDistanceToNest < droneList[i].closestDistanceToNest ? oldData.drone.closestDistanceToNest : droneList[i].closestDistanceToNest;
            oldData.drone.x = droneList[i].x;
            oldData.drone.y = droneList[i].y;

            cache.set(droneList[i].sn, JSON.stringify(oldData));

            console.log("Altered old record: " + droneList[i].sn)
        }

    }));

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
        list:droneAndPilotList
    });
}

module.exports = {
    getDrones
}