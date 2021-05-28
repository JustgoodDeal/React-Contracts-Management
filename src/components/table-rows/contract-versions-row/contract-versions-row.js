import React from 'react';

import './contract-versions-row.css';


const ContractVersionsRow = ({ version, handleActionsClick }) => {
    const { id: versionId, creationDate, status, text: versionText } = version;
    return (
        <tr>
            <td className="text-center">{creationDate}</td>
            <td className="text-center">
                <p>{status}</p>
            </td>
            <td className="text-center">
                <div className="dropdown">
                    <button className="btn btn-outline-success btn-sm dropdown-toggle w-75"
                            type="button" data-toggle="dropdown" aria-expanded="false">
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#versionsDetailsModal"
                               onClick={() => handleActionsClick({actionType: 'ViewVersion', versionId, versionText})}>
                                View text
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#confirmationModal"
                               onClick={() => handleActionsClick({actionType: 'Replace', versionId, versionText})}>
                                Replace current contract
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#confirmationModal"
                               onClick={() => handleActionsClick({actionType: 'DeleteVersion', versionId, versionText})}>
                                Delete
                            </a>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    )
};


export default ContractVersionsRow;
