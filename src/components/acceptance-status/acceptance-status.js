import React from 'react';

import './acceptance-status.css';


const AcceptanceStatus = ({ companiesAcceptances }) => {
    return (
        <div className="position-absolute contract-status-details bg-light d-none">
            {
                companiesAcceptances.map((acceptanceStatus, ind) => {
                    const [companyName, status] = acceptanceStatus;
                    let colorClass = status === 'pending' ? 'text-warning': 'text-success';
                    return (
                        <p key={ind}>{companyName}:
                            <span className={colorClass}>{status}</span>
                        </p>
                    )
                })
            }
        </div>
    );
};


export default AcceptanceStatus;
