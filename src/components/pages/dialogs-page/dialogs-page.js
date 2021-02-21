import React from 'react';
import { DialogsRow } from '../../table-rows'
import { HeaderRow } from '../../table-rows'

import './dialogs-page.css';


const DialogsPage = () => {
    const thLabels = ['Related contract', 'Last message'];
    const dialogsList = [
        {
            contractId: 1,
            messageEntities: {
                participantsList: ['Everybody'],
                datetime: '01.01.2021',
                author: 'Dmitry Navalny',
                text: 'Hi, bro',
                isRead: false,
                currentPage: 'dialogs'
            }
        },
        {
            contractId: 2,
            messageEntities: {
                participantsList: ['I' , 'Susana Fatima'],
                datetime: '02.01.2021',
                author: 'Susana Fatima',
                messagetext: 'Bye, mom',
                isRead: true,
                currentPage: 'dialogs'
            }
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
                dialogsList.map((dialog) => {
                    return (
                        <DialogsRow
                            key={dialog.contractId}
                            contractId={dialog.contractId}
                            messageEntities={dialog.messageEntities} />
                    )
                })
            }
            </tbody>
        </table>
    )
};


export default DialogsPage;
