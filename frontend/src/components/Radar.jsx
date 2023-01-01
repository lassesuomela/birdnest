import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

export default function Radar(props) {

    const [drones, setDrones] = useState([]);
    const [outerDrones, setOuterDrones] = useState([]);

    useEffect(() => {
        setDrones(props.drones);
        setOuterDrones(props.outerDrones);
    }, [props.drones, props.outerDrones])

    const options = {
        aspectRatio: 1,
        responsive: true,
        scales: {
            y: {
                max:500,
                min:0
            },
            x: {
                max:500,
                min:0
            }
        },
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: {
                    point1: {
                        type: 'ellipse',
                        xMin: 150,
                        xMax: 350,
                        yMin: 150,
                        yMax: 350,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgb(59, 112, 128)',
                        borderWidth: 2,
                        adjustScaleRange: false
                    }
                }
            }
          }
    };
      
    const data = {
        datasets: drones.map(drone => (
        {
            label: drone.sn,
            data: [{x:drone.x / 1000, y:drone.y / 1000}],
            backgroundColor: 'rgb(238, 46, 49)'
        }))
    };

    outerDrones.map(drone => (
        data.datasets.push(
            {
                label: drone.sn,
                data: [{x:drone.x / 1000, y:drone.y / 1000}],
                backgroundColor: 'rgb(89, 89, 89)'
            }
        )
    ))

    data.datasets.push({
        label: "Nest",
        data: [{x:250, y:250}],
        backgroundColor: 'rgb(59, 112, 128)'
    });
    
    return <Scatter options={options} data={data} />;
}
