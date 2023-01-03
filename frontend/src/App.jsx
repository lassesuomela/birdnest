import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import PilotTable from "./components/PilotTable";
import Radar from "./components/Radar";

function App() {

  const [drones, setDrones] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [outerDrones, setOuterDrones] = useState([]);
  const [count, setCount] = useState(0);

  // https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
  const formatTimestamp = (date) => {

    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;

    interval = seconds / 2592000;
    interval = seconds / 86400;
    interval = seconds / 3600;
    interval = seconds / 60;

    if (interval > 1) {
      return `${Math.floor(interval)} minutes ago`
    }

    if(interval > 0){
      return `${Math.floor(seconds)} seconds ago`
    }else{
      return "now";
    }
  }

  const fetchDroneData = async () => {
    try {

      const response = await axios.get(import.meta.env.VITE_URL + "/drones");

      if(response.status !== 200){
        return console.error("Error with the server: " + response);
      }

      const droneData = [];
      const pilotData = [];
      const outerDroneData = [];

      response.data.list.forEach(data => {

        let droneStuff = data.drone;
        let pilotStuff = data.pilot;

        droneStuff.pilot = data.pilot.firstName + " " + data.pilot.lastName;

        droneData.push(droneStuff);

        pilotStuff.lastSeen = formatTimestamp(data.drone.lastSeen);
        pilotStuff.closestDistanceToNest = data.drone.closestDistanceToNest.toFixed(1);

        pilotData.push(pilotStuff);
      });

      response.data.notInNDZ.forEach(data => {
        outerDroneData.push(data);
      });

      setCount(response.data.count);

      setDrones(droneData);
      setOuterDrones(outerDroneData);
      setPilots(pilotData);

    } catch (error) {
      console.error("Error with the server: " + error);
    }
  }

  useEffect(() => {

    fetchDroneData();

    setInterval(async () => {

      fetchDroneData();
    }, 4000);
    
  }, [])

  return (
    <>
    <div className="container text-center pt-4">

      <h2>Birdnest - Drone Watcher</h2>

      <h4>Intruder count: {count}</h4>

      <div className="wrapper pt-4">
        
        <PilotTable pilots={pilots} />

        <div className="radar">
          <Radar drones={drones} outerDrones={outerDrones} />

          <a href="https://github.com/lassesuomela/birdnest">GitHub</a>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
