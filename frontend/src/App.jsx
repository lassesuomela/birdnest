import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import PilotTable from "./components/PilotTable";

function App() {

  const [drones, setDrones] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [count, setCount] = useState(0);

  const fetchNDZData = async () => {
    try {

      const response = await axios.get(import.meta.env.VITE_DEV_URL + "/drones");

      if(response.status !== 200){
        return console.error("Error with the server: " + response);
      }

      const droneData = [];
      const pilotData = [];

      response.data.list.forEach(data => {
        droneData.push(data.drone);
        pilotData.push(data.pilot);
      });

      setCount(response.data.count);

      setDrones(droneData);
      setPilots(pilotData);

    } catch (error) {
      console.error("Error with the server: " + error);
    }
  }

  useEffect(() => {

    fetchNDZData();

    setInterval(async () => {

      fetchNDZData();
    }, 5000);
    
  }, [])

  return (
    <>
      <h2>Violation count: {count}</h2>
      
      <PilotTable pilots={pilots} />
    </>
  )
}

export default App
