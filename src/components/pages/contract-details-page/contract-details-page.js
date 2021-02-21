import React from 'react';

import { Accordion } from '../../hoc';
import {ContractHistoryRow, ContractRow, HeaderRow} from "../../table-rows";
import { ConfirmationModal, HistoryDetailsModal, SendingInvitationModal, SendingMessageModal } from "../../modals";
import DialogMessage from "../../dialog-message";

import './contract-details-page.css';


const ContractDetailsPage = (props) => {
    const historyThLabels = ['Creation date', 'Status', 'Actions'];
    const contractThLabels = ['ID', 'Creation date', 'Companies involved', 'Status'];
    const contractHistoryEntitiesList = [
        {
            datetime: '1.1.2021',
            status: 'Signed',
        },
        {
            datetime: '2.2.2021',
            status: 'Archived',
        },
    ];
    const messageEntitiesList = [
        {
                participantsList: ['Everybody'],
                datetime: '01.01.2021',
                author: 'Dmitry Navalny',
                text: 'Hi, bro',
                isRead: false,
                currentPage: 'dialogs'
        },
        {
                participantsList: ['I' , 'Susana Fatima'],
                datetime: '02.01.2021',
                author: 'Susana Fatima',
                messagetext: 'Bye, mom',
                isRead: true,
                currentPage: 'dialogs'
        },
    ];
    const contractId = props.match.params.id;
    const contractEntities = {
        id: contractId,
        datetime: '1.1.2021',
        companiesInvolvedList: ['ABC', 'Zila'],
        status: 'Signed',
    };
    const nextContractStatus = 'Sign';
    const recipientsOptions = [
        {value: "All", text: "All"},
        {value: "Ivan (ABC)", text: "Ivan (ABC)"},
        {value: "Dmitriy (Zila)", text: "Dmitriy (Zila)"}
    ];
    const companiesOptions = [
        {value: "Company 1", text: "Company 1"},
        {value: "Company 2", text: "Company 2"},
        {value: "Company 3", text: "Company 3"}
    ];
    const acceptanceStatusList = [
        ['Company 1', 'Agreed'],
        ['Company 2', 'Pending'],
        ['Company 3', 'Agreed'],
    ];
    return (
        <div>
            <div className="contract-history mt-4">
                <Accordion
                    collapseId="historyCollapse"
                    headerText="Contract history">
                    <table className="table">
                        <thead>
                            <HeaderRow
                                labels={historyThLabels} />
                        </thead>
                        <tbody>
                            {
                                contractHistoryEntitiesList.map((contractHistoryEntities, ind) => {
                                    return (
                                        <ContractHistoryRow
                                            key={ind}
                                            contractHistoryEntities={contractHistoryEntities} />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </Accordion>
            </div>
            <div className="mt-3">
                <Accordion
                    collapseId="dialogsCollapse"
                    headerText="Contract dialogs">
                    <div className="list-group">
                        {
                            messageEntitiesList.map((messageEntities, ind) => {
                                return (
                                    <DialogMessage
                                        key={ind}
                                        messageEntities={messageEntities} />
                                )
                            })
                        }
                    </div>
                </Accordion>
            </div>
            <h3 className="text-center mt-4">Current contract</h3>
            <div className="buttons mt-4">
                <div className="d-flex justify-content-lg-around">
                    <div className="btn-group" role="group">
                        <button className="btn btn-success font-weight-bold" data-toggle="modal" data-target="#statusChangeConfirmModal">
                            {nextContractStatus}
                        </button>
                        <button className="btn btn-success font-weight-bold" data-toggle="modal"
                                data-target="#inviteModal">Invite
                        </button>
                        <button className="btn btn-success font-weight-bold" data-toggle="modal"
                                data-target="#sendMessageModal">Send message
                        </button>
                    </div>
                </div>
            </div>
            <table className="table mt-4">
                <thead>
                    <HeaderRow
                        labels={contractThLabels} />
                </thead>
                <tbody>
                <ContractRow
                    contractEntities={contractEntities}
                    acceptanceStatusList={acceptanceStatusList} />
                </tbody>
            </table>
            <div className="buttons mt-4">
                <div className="d-flex justify-content-lg-around">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-success font-weight-bold">Save</button>
                        <button type="button" className="btn btn-success font-weight-bold">Save & Add to history</button>
                    </div>
                </div>
            </div>
            <div className="form-group mt-4 w-100">
                <label htmlFor="contractText">Contract text:</label>
                <textarea className="form-control" id="contractText" placeholder="Contract text" style={{height: '300px'}}></textarea>
            </div>
            <ConfirmationModal
                id='historyMajorConfirmModal'
                bodyText='Current major contract will be replaced by this one. All statuses will be lost'
                btnText='Apply' />
            <ConfirmationModal
                id='historyDelConfirmModal'
                bodyText='Selected contract version will be removed'
                btnText='Remove' />
            <ConfirmationModal
                id='statusChangeConfirmModal'
                bodyText=''
                btnText={nextContractStatus} />
            <HistoryDetailsModal/>
            <SendingInvitationModal
                companiesOptions={companiesOptions} />
            <SendingMessageModal
                recipientsOptions={recipientsOptions} />
        </div>
    )
};


export default ContractDetailsPage;
