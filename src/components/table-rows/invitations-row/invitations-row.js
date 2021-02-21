import React from 'react';

import './invitations-row.css';


const InvitationsRow = ({ invitationEntities }) => {
    const { contractId, datetime, creator, recipient, purpose, status, actions } = invitationEntities;
    let actionsDisplay = '-';
    if (actions) {
        actionsDisplay = (
            <div className="dropdown">
                <button className="btn btn-outline-success btn-sm dropdown-toggle w-75" type="button"
                        data-toggle="dropdown" aria-expanded="false">
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Accept</a></li>
                    <li><a className="dropdown-item" href="#">Decline</a></li>
                </ul>
            </div>
        )
    }
    return (
        <tr>
            <td className="text-center">{contractId}</td>
            <td className="text-center">{datetime}</td>
            <td className="text-center">{creator}</td>
            <td className="text-center">{recipient}</td>
            <td className="text-center">{purpose}</td>
            <td className="text-center">{status}</td>
            <td className="text-center">{actionsDisplay}</td>
        </tr>
    )
};


export default InvitationsRow;
