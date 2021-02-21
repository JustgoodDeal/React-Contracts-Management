import React from 'react';

import './contract-history-row.css';


const ContractHistoryRow = ({ contractHistoryEntities }) => {
    const { datetime, status } = contractHistoryEntities;
    return (
        <tr>
            <td className="text-center">{datetime}</td>
            <td className="text-center">
                <p>{status}</p>
            </td>
            <td className="text-center">
                <div className="dropdown">
                    <button className="btn btn-outline-success btn-sm dropdown-toggle w-75"
                            type="button" data-toggle="dropdown" aria-expanded="false">
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" data-toggle="modal"
                               data-target="#historyDetailsModal">View contract text</a></li>
                        <li><a className="dropdown-item" href="#" data-toggle="modal"
                               data-target="#historyMajorConfirmModal">Make it major</a></li>
                        <li><a className="dropdown-item" href="#" data-toggle="modal"
                               data-target="#historyDelConfirmModal">Delete this version</a></li>
                    </ul>
                </div>
            </td>
        </tr>
    )
};


export default ContractHistoryRow;
