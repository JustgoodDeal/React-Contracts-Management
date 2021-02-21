import React from 'react';

import './acceptance-status.css';


const AcceptanceStatus = ({ acceptanceStatusList }) => {
    return (
        <div className="position-absolute contract-status-details bg-light d-none">
            {
                acceptanceStatusList.map((acceptanceStatus, ind) => {
                    const [companyName, status] = acceptanceStatus;
                    let colorClass = status === 'Agreed' ? 'text-success': 'text-warning';
                    return (
                        <p key={ind}>{companyName}:
                            <span className={colorClass}> {status}</span>
                        </p>
                    )
                })
            }
        </div>
    );
};


export default AcceptanceStatus;
