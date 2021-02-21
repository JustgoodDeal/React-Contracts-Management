import React, { Fragment } from 'react';
import { ContractsRow, HeaderRow } from '../../table-rows'
import { ConfirmationModal } from '../../modals'


import './contracts-page.css';


const ContractsPage = () => {
    const thLabels = ['Contract ID', 'Creation date', 'Companies involved', 'Contract status', 'Actions'];
    const contractEntitiesList = [
        {
            id: '1',
            datetime: '1.1.2021',
            companiesInvolvedList: ['ABC', 'Zila'],
            status: 'Signed',
        },
        {
            id: '2',
            datetime: '2.2.2021',
            companiesInvolvedList: ['ABC', 'Danone'],
            status: 'Archived',
        },
    ];
    return (
        <Fragment>
            <table className="table mt-4">
                <thead>
                <HeaderRow
                    labels={thLabels} />
                </thead>
                <tbody>
                {
                    contractEntitiesList.map((contractEntities) => {
                        return (
                            <ContractsRow
                                key={contractEntities.id}
                                contractEntities={contractEntities} />
                        )
                    })
                }
                </tbody>
            </table>
            <ConfirmationModal
                id='confirmationModal'
                bodyText='Selected contract will be permanently removed'
                btnText='Remove' />
        </Fragment>
    )
};


export default ContractsPage;
