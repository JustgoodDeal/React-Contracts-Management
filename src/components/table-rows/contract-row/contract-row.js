import React from 'react';

import AcceptanceStatus from '../../acceptance-status'

import './contract-row.css';


const ContractRow = ({ contract, companiesAcceptances }) => {
    const { id, creationDate, companies, status } = contract;
    let hoverClass = '';
    if (companiesAcceptances) {
        hoverClass = 'contract-status'
    }
    return (
        <tr>
            <td className="text-center">{id}</td>
            <td className="text-center">{creationDate}</td>
            <td className="text-center">{companies.join(', ')}</td>
            <td className="text-center">
                <div className="position-relative">
                    <p className={hoverClass}>{status}</p>
                    {
                        companiesAcceptances && <AcceptanceStatus
                            companiesAcceptances={companiesAcceptances}/>
                    }
                </div>
            </td>
        </tr>
    )
};


export default ContractRow;
