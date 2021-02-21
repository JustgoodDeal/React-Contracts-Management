import React from 'react';

import AcceptanceStatus from '../../acceptance-status'

import './contract-row.css';


const ContractRow = ({ contractEntities, acceptanceStatusList }) => {
    const { id, datetime, companiesInvolvedList, status } = contractEntities;
    let hoverClass = '';
    if (acceptanceStatusList) {
        hoverClass = 'contract-status'
    }
    return (
        <tr>
            <td className="text-center">{id}</td>
            <td className="text-center">{datetime}</td>
            <td className="text-center">{companiesInvolvedList.join(', ')}</td>
            <td className="text-center">
                <div className="position-relative">
                    <p className={hoverClass}>{status}</p>
                    {
                        acceptanceStatusList && <AcceptanceStatus
                                                    acceptanceStatusList={acceptanceStatusList} />
                    }
                </div>
            </td>
        </tr>
    )
};


export default ContractRow;
