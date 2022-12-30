const axios = require('axios');
const xmlParser = require('xml-js');

const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const getDrones = async (req, res) => {

    if(cache.get("drones")){
        res.header("X-Cache", "HIT");

        const ts = cache.getTtl("drones");

        const expireDate = new Date(ts);

        res.header("X-Cache-Expire", expireDate.toUTCString());

        return res.json(cache.get("drones"))
    }else{
        res.header("X-Cache", "MISS");
    }

    try {
        const response = await axios.get("http://assignments.reaktor.com/birdnest/drones");

        if(response.status !== 200){
            return res.status(500).json({message:"Could not get drone data"})
        }

        const data = JSON.parse(xmlParser.xml2json(response.data));

        const timestamp = data.elements[0].elements[1].attributes.snapshotTimestamp;

        const drones = data.elements[0].elements[1].elements;

        let droneList = [];

        drones.forEach(drone => {
            const sn = drone.elements[0].elements[0].text;

            const y = drone.elements[7].elements[0].text;
            const x = drone.elements[8].elements[0].text;

            const distanceToNest = Math.sqrt((x-250000)**2+(y-250000)**2);

            if(((x-250000)**2 + (y - 250000)**2) > 100**2){
                droneList.push({
                    lastSeen: timestamp,
                    sn:sn,
                    distanceToNest:distanceToNest,
                    x:x,
                    y:y
                })
            }

        });

        const payload = {
            drones: droneList
        };

        if(payload[drones] > 0){
            cache.set("drones", {payload})
        }

        res.json({payload})
    }catch(err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getDrones
}