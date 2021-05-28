import React, { useContext } from 'react';
import { Link } from "react-router-dom";

import { NavbarContext } from '../../../context'

import './contracts-row.css';


const ContractsRow = ({ contract, handleDeleteClick }) => {
    const { changeActiveLink } = useContext(NavbarContext);

    const { id, creationDate, companies, status } = contract;
    return (
        <tr>
            <td className="text-center align-middle">{id}</td>
            <td className="text-center align-middle">{creationDate}</td>
            <td className="text-center align-middle">{companies.join(', ')}</td>
            <td className="text-center align-middle">{status}</td>
            <td className="text-center align-middle">
                <div className="dropdown">
                    <button className="btn btn-outline-success btn-sm dropdown-toggle w-75" type="button" data-toggle="dropdown" aria-expanded="false">
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to={`/contract/${id}`} className="dropdown-item"
                                  onClick={() => changeActiveLink('Contracts')} >
                                Details
                            </Link>
                        </li>
                        <li>
                            <Link to={`/invitations/contract/${id}?followed_from=contracts`}
                                  className="dropdown-item"
                                  onClick={() => changeActiveLink('Contracts')} >
                                Invitations
                            </Link>
                        </li>
                        <li>
                            <Link to={`/notifications/contract/${id}?followed_from=contracts`}
                                  className="dropdown-item"
                                  onClick={() => changeActiveLink('Contracts')} >
                                Notifications
                            </Link>
                        </li>
                        <li><button className="dropdown-item" data-toggle="modal" data-target="#confirmationModal"
                        onClick={() => handleDeleteClick(id)}>Delete</button></li>
                    </ul>
            </div>
            </td>
        </tr>
    )
};


export default ContractsRow;
