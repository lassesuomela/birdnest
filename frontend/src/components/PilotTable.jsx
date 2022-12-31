import React from 'react'

export default function PilotTable(props) {
  return (
    <>
        <h2>Pilots:</h2>

        <div>
            <table>
                <thead>
                    <tr>
                        <th>Pilot ID</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Phonenumber</th>
                        <th>Created</th>
                        <th>Last seen</th>
                        <th>Closest distance (m)</th>
                        <th>Drone SN</th>
                    </tr>
                </thead>
                <tbody>
                {
                    props.pilots.map(pilot => {
                        return <tr key={pilot.pilotId}>
                            <td>{pilot.pilotId}</td>
                            <td>{pilot.firstName}</td>
                            <td>{pilot.lastName}</td>
                            <td>{pilot.email}</td>
                            <td>{pilot.phoneNumber}</td>
                            <td>{pilot.createdDt}</td>
                            <td>{pilot.lastSeen}</td>
                            <td>{pilot.closestDistanceToNest}</td>
                            <td>{pilot.drone}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </>
  )
}
