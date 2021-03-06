import React, { useContext, useEffect, useReducer } from 'react';

import { Accordion } from '../../hoc';
import {ContractHistoryRow, ContractRow, HeaderRow} from "../../table-rows";
import { ConfirmationModal, HistoryDetailsModal, SendingInvitationModal, SendingMessageModal } from "../../modals";
import DialogMessage from "../../dialog-message";
import {ContractReducer} from "../../../reducers";
import CmService from "../../../services";
import { FETCH_CONTRACT_SUCCESS, SET_CONFIRMATION_MODAL } from "../../../reducers/types";
import { AuthContext } from '../../../context'

import './contract-details-page.css';


const ContractDetailsPage = (props) => {
    const historyThLabels = ['Creation date', 'Status', 'Actions'];
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

    const initialState = {
        contract: '',
        companiesAcceptances: [],
        actionOnStatus: '',
        confirmationModal: {
            bodyText: '',
            btnText: '',
            cancelType: '',
            confirmType: ''
        }
    };
    const [state, dispatch] = useReducer(ContractReducer, initialState);

    const service = new CmService();

    const contractId = props.match.params.id;
    const { userId } = useContext(AuthContext);

    const updateContract = () => {
        service.getContract(contractId, userId)
            .then((result) => {
                dispatch({
                    type: FETCH_CONTRACT_SUCCESS,
                    payload: result
                })
            })
            .catch((err) => console.log(err))
    };

    const handleModalConfirm = confirmType => {
        if (['Archive', 'Harmonize', 'Sign', ].includes(confirmType)) {
            service.updateContractStatus(contractId, userId, state.actionOnStatus)
                .then((result) => {
                    if (result === 'Updated') {
                        updateContract()
                    }
                })
                .catch((err) => console.log(err))
        }
    };

    const handleUpdateStatusClick = () => {
        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                bodyText: '',
                btnText: state.actionOnStatus,
                confirmType: state.actionOnStatus
            }
        });
    };

    useEffect(() => {
        updateContract()
    }, []);

    const contractThLabels = ['ID', 'Creation date', 'Companies involved', 'Status'];
    const {
        actionOnStatus, companiesAcceptances, contract,
        confirmationModal: {bodyText, btnText, confirmType}
    } = state;
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
                        {
                            actionOnStatus &&
                            <button className="btn btn-success font-weight-bold" data-toggle="modal" data-target="#confirmationModal"
                                    onClick={handleUpdateStatusClick} >
                                        {actionOnStatus}
                            </button>
                        }
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
                {
                    contract
                        ? <ContractRow contract={contract} companiesAcceptances={companiesAcceptances} />
                        : null
                }
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
                <textarea defaultValue={contract.text} className="form-control" id="contractText" placeholder="Contract text" style={{height: '300px'}}>
                </textarea>
            </div>
            {/*<ConfirmationModal*/}
            {/*    id='historyMajorConfirmModal'*/}
            {/*    bodyText='Current major contract will be replaced by this one. All statuses will be lost'*/}
            {/*    btnText='Apply' />*/}
            {/*<ConfirmationModal*/}
            {/*    id='historyDelConfirmModal'*/}
            {/*    bodyText='Selected contract version will be removed'*/}
            {/*    btnText='Remove' />*/}
            <ConfirmationModal
                id='confirmationModal'
                bodyText={bodyText}
                btnText={btnText}
                confirmType={confirmType}
                handleCancel={() => console.log('Canceled')}
                handleConfirm={handleModalConfirm} />
            <HistoryDetailsModal/>
            <SendingInvitationModal
                companiesOptions={companiesOptions} />
            <SendingMessageModal
                recipientsOptions={recipientsOptions} />
        </div>
    )
};


export default ContractDetailsPage;
