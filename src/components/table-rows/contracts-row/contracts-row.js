import React from 'react';
import { NavLink } from "react-router-dom";

import './contracts-row.css';


const ContractsRow = ({ contract, handleDeleteClick }) => {
    const { id, creationDate, companies, status } = contract;
    return (
        <tr>
            <td className="text-center">{id}</td>
            <td className="text-center">{creationDate}</td>
            <td className="text-center">{companies.join(', ')}</td>
            <td className="text-center">{status}</td>
            <td className="text-center">
                <div className="dropdown">
                    <button className="btn btn-outline-success btn-sm dropdown-toggle w-75" type="button" data-toggle="dropdown" aria-expanded="false">
                    </button>
                    <ul className="dropdown-menu">
                        <li><NavLink to={`/contract/${id}`} className="dropdown-item" href="#">Details</NavLink></li>
                        <li><button className="dropdown-item" data-toggle="modal" data-target="#confirmationModal"
                        onClick={() => handleDeleteClick(id)}>Delete</button></li>
                    </ul>
            </div>
            </td>
        </tr>
    )
};


export default ContractsRow;
