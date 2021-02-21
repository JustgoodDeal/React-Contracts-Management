import React from 'react';
import { HeaderRow, InvitationsRow } from '../../table-rows'


import './invitations-page.css';


const InvitationsPage = () => {
    const thLabels = ['Related contract', 'Date', 'Creator', 'Recipient', 'Purpose', 'Status', 'Actions'];
    const invitationEntitiesList = [
        {
            contractId: '2',
            datetime: '2.2.2021',
            creator: 'I',
            recipient: 'Nikolay Eltsin',
            purpose: 'Signing',
            status: 'Accepted',
            actions: false
        },
        {
            contractId: '1',
            datetime: '1.1.2021',
            creator: 'Boris Burda',
            recipient: 'I',
            purpose: 'Editing',
            status: 'Pending',
            actions: true
        },
    ];
    return (
        <table className="table mt-4">
            <thead>
            <HeaderRow
                labels={thLabels} />
            </thead>
            <tbody>
            {
                invitationEntitiesList.map((invitationEntities) => {
                    return (
                        <InvitationsRow
                            key={invitationEntities.contractId}
                            invitationEntities={invitationEntities} />
                    )
                })
            }
            </tbody>
        </table>
    )
};


export default InvitationsPage;
