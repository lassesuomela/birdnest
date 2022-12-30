const axios = require('axios');
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

        const data = response.data;

        cache.set("drones", data)

        res.json(response.data)
    }catch(err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getDrones
}