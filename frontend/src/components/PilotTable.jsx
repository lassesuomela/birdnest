import React from 'react'

export default function PilotTable(props) {
  return (
    <>
        <h2>Pilots:</h2>

        <div>
            <table>
                <tr>
                    <th>Pilot ID</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th>
                    <th>Phonenumber</th>
                    <th>Created</th>
                </tr>

                {
                    props.pilots.map(pilot => {
                        return <tr key={pilot.pilotId}>
                            <td>{pilot.pilotId}</td>
                            <td>{pilot.firstName}</td>
                            <td>{pilot.lastName}</td>
                            <td>{pilot.email}</td>
                            <td>{pilot.phoneNumber}</td>
                            <td>{pilot.createdDt}</td>
                        </tr>
                    })
                }
            </table>
        </div>
    </>
  )
}
