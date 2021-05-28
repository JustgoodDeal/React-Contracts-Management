import React, {useContext} from 'react';
import { Link } from "react-router-dom";

import { NavbarContext } from '../../../context'

import './invitations-row.css';


const InvitationsRow = ({ invitation, followedFrom, handleActionChoice }) => {
    const { changeActiveLink } = useContext(NavbarContext);

    const { id, contractId, creationDate, creatorName, creatorCompany, recipientName, recipientCompany, purpose, status,
        actions, userIsCreator } = invitation;
    const creator = userIsCreator ? 'I' : `${creatorName} (${creatorCompany})`;
    const recipient = userIsCreator ? `${recipientName} (${recipientCompany})` : 'I';
    let actionsDisplay = '-';
    if (actions) {
        actionsDisplay = (
            <div className="dropdown">
                <button className="btn btn-outline-success btn-sm dropdown-toggle w-75" type="button"
                        data-toggle="dropdown" aria-expanded="false">
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" onClick={() => handleActionChoice(id, 'accepted')}>
                            Accept
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => handleActionChoice(id, 'declined')}>
                            Decline
                        </button>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <tr>
            {
                followedFrom !== 'contracts' &&
                    <td className="text-center align-middle">
                        <Link to={`/contract/${contractId}`}
                              onClick={() => changeActiveLink('Contracts')} >
                            {contractId}
                        </Link>
                    </td>
            }
            <td className="text-center align-middle">{creationDate}</td>
            <td className="text-center align-middle">{creator}</td>
            <td className="text-center align-middle">{recipient}</td>
            <td className="text-center align-middle">{purpose}</td>
            <td className="text-center align-middle">{status}</td>
            <td className="text-center align-middle">{actionsDisplay}</td>
        </tr>
    )
};


export default InvitationsRow;
