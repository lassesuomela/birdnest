import React from 'react'

export default function PilotTable(props) {
  return (
    <>
        <h2>Pilots:</h2>

        <div>
            <table>
                <thead>
                    <tr>
                        <th>Pilot name</th>
                        <th>Email</th>
                        <th>Phonenumber</th>
                        <th>Last seen</th>
                        <th>Closest distance (m)</th>
                    </tr>
                </thead>
                <tbody>
                {
                    props.pilots.map(pilot => {
                        return <tr key={pilot.pilotId}>
                            <td>{pilot.firstName + " " + pilot.lastName}</td>
                            <td>{pilot.email}</td>
                            <td>{pilot.phoneNumber}</td>
                            <td>{pilot.lastSeen}</td>
                            <td>{pilot.closestDistanceToNest}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </>
  )
}
