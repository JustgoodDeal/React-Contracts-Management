import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { Accordion } from '../../hoc';
import { ContractVersionsRow, ContractRow, HeaderRow } from "../../table-rows";
import { ConfirmationModal, VersionsDetailsModal, SendingInvitationModal, SendingMessageModal } from "../../modals";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";
import DialogMessage from "../../dialog-message";
import { ContractReducer } from "../../../reducers";
import CmService from "../../../services";
import {
    CHANGE_CONTRACT_TEXT, FETCH_CONTRACT_SUCCESS, FETCH_DIALOG_VARIANTS_SUCCESS, FETCH_DIALOGS_SUCCESS,
    FETCH_INVITATION_VARIANTS_SUCCESS, FETCH_VERSIONS_SUCCESS, SET_CONFIRMATION_MODAL, SET_SELECTED_VERSION
} from "../../../reducers/types";
import { AuthContext, LoadingAndErrorContext } from '../../../context'

import './contract-details-page.css';


const ContractDetailsPage = () => {
    const initialState = {
        contract: {
            id: '',
            text: '',
            newText: '',
            companies: [],
            creationDate: '',
            status: '',
            companiesAcceptances: [],
            actionOnStatus: '',
        },
        dialogs: [],
        versions: [],
        selectedVersion: {
            id: '',
            text: '',
        },
        dialogVariants: [],
        invitationVariants: {},
        confirmationModal: {
            headerText: '',
            bodyText: '',
            btnText: '',
            cancelType: '',
            confirmType: ''
        }
    };
    const [state, dispatch] = useReducer(ContractReducer, initialState);

    const { userId, userName } = useContext(AuthContext);
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { id: contractId } = useParams();

    const service = new CmService();

    const handleTextChange = (event, editor) => {
        dispatch({
            type: CHANGE_CONTRACT_TEXT,
            payload: editor.getData()
        });
    };

    const handleModalConfirm = confirmType => {
        const {
            contract: { newText, actionOnStatus: action },
            selectedVersion: { id: versionId, text: versionText } } = state;

        let initMethodName, finalMethod, props, result;
        switch (confirmType) {
            case 'UpdateStatus':
                [initMethodName, finalMethod, props, result] =
                    ['updateContractStatus', getContract,{contractId, userId, [action]: action}, 'Updated'];
                break;
            case 'Save':
                [initMethodName, finalMethod, props, result] =
                    ['updateContract', getContract, {data: {id: contractId, text: newText}}, 'Updated'];
                break;
            case 'SaveVersion':
                [initMethodName, finalMethod, props, result] =
                    ['saveContractVersion', getContractVersions, {contractId, userId}, 'Saved'];
                break;
            case 'Replace':
                [initMethodName, finalMethod, props, result] =
                    ['updateContract', getContract, {data: {id: contractId, text: versionText}}, 'Updated'];
                break;
            case 'DeleteVersion':
                [initMethodName, finalMethod, props, result] =
                    ['deleteContractVersion', getContractVersions, {versionId}, 'Deleted'];
        }

        service[initMethodName](...Object.values(props))
            .then(response => {
                if (response === result) {
                    finalMethod()
                }
            })
            .catch(handleError)
    };

    const handleInvitationModalConfirm = (selectedReason, selectedCompany) => {
        const invitationEntities = {contractId, senderId: userId, reason: selectedReason, company: selectedCompany};
        service.createInvitations(invitationEntities)
            .then(result => {
                if (result === 'Created') {
                    console.log('Invitations created');
                }
            })
            .catch(handleError)
    };

    const handleDialogModalConfirm = (messageText, recipient) => {
        service.createDialog({contractId, userId, userName, messageText, recipient})
            .then(result => {
                if (result === 'Created') {
                    getDialogs();
                }
            })
            .catch(handleError)
    };

    const handleVersionsActionsClick = ({ actionType, versionId, versionText }) => {
        dispatch({
            type: SET_SELECTED_VERSION,
            payload: {id: versionId, text: versionText}
        });
        switch (actionType) {
            case 'Replace':
                const { contract: { text: contractText } } = state;
                const [headerText, bodyText, btnText] = versionText === contractText ?
                    ['', "Current contract is the same as selected version", ''] :
                    ['Are you sure?', 'Major contract will be replaced by this one, its status will be reset to "creating"', 'Apply'];
                dispatch({
                    type: SET_CONFIRMATION_MODAL,
                    payload: {
                        headerText,
                        bodyText,
                        btnText,
                        confirmType: 'Replace'
                    }
                });
                break;
            case 'DeleteVersion':
                dispatch({
                    type: SET_CONFIRMATION_MODAL,
                    payload: {
                        headerText: 'Are you sure?',
                        bodyText: 'Selected contract version will be removed',
                        btnText: 'Delete',
                        confirmType: 'DeleteVersion'
                    }
                });
        }
    };

    const handleInviteClick = () => {
        service.getInvitationVariants(contractId, userId)
            .then(invitationVariants => {
                dispatch({
                    type: FETCH_INVITATION_VARIANTS_SUCCESS,
                    payload: invitationVariants
                })
            })
            .catch(handleError)
    };

    const handleSaveVersionClick = () => {
        const { contract: { text: contractText }, versions } = state;
        const sameVersionExists = versions.length && versions[versions.length - 1].text === contractText;
        const [headerText, bodyText, btnText] = sameVersionExists ?
            ['', "Current contract version has already been saved", ''] :
            ['Save current contract version?', '', 'Save'];
        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText,
                bodyText,
                btnText,
                confirmType: 'SaveVersion'
            }
        });
    };

    const handleCreateDialogClick = () => {
        service.getDialogVariants(contractId, userId)
            .then(dialogVariants => {
                dispatch({
                    type: FETCH_DIALOG_VARIANTS_SUCCESS,
                    payload: dialogVariants
                })
            })
            .catch(handleError)
    };

    const handleUpdateStatusClick = () => {
        const { actionOnStatus } = state.contract;
        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText: 'Are you sure?',
                bodyText: '',
                btnText: actionOnStatus,
                confirmType: 'UpdateStatus'
            }
        });
    };

    const handleSaveClick = () => {
        const { text, newText } = state.contract;
        const textChanged = text !== newText;
        let [headerText, bodyText, btnText] = textChanged ?
            ['Are you sure?', 'After saving the contract its status will be reset to "creating"', 'Save'] :
            ['', "Current contract is the same as previous", ''];
        if (!newText) {
            [headerText, bodyText, btnText] = ['', "Contract text can't be empty", '']
        }
        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText,
                bodyText,
                btnText,
                confirmType: 'Save'
            }
        });
    };

    const getContract = () => {
        setLoading();
        service.getContract(contractId, userId)
            .then((contract) => {
                disableLoading();
                dispatch({
                    type: FETCH_CONTRACT_SUCCESS,
                    payload: contract
                })
            })
            .catch(handleError)
    };

    const getContractVersions = () => {
        service.getContractVersions(contractId, userId)
            .then(versions => {
                dispatch({
                    type: FETCH_VERSIONS_SUCCESS,
                    payload: versions
                })
            })
            .catch(handleError)
    };

    const getDialogs = () => {
        service.getDialogs(contractId, userId)
            .then(({ dialogs }) => {
                dispatch({
                    type: FETCH_DIALOGS_SUCCESS,
                    payload: dialogs
                })
            })
            .catch(handleError)
    };

    useEffect(() => {
        getContract();
        getContractVersions();
        getDialogs()
    }, []);

    if (error) {
        return <ErrorIndicator />
    }

    const { contract, dialogs, invitationVariants, dialogVariants, versions,
        selectedVersion: { text: versionText },
        confirmationModal: { headerText, bodyText, btnText, confirmType }}
        = state;
    const { actionOnStatus, companiesAcceptances, status, newText } = contract;

    const contractTableHeaders = [
        {label: 'ID', clickHandler: false},
        {label: 'Creation date', clickHandler: false},
        {label: 'Companies involved', clickHandler: false},
        {label: 'Status', clickHandler: false}
    ];
    const versionsTableHeaders = [
        {label: 'Creation date', clickHandler: false},
        {label: 'The then status', clickHandler: false},
        {label: 'Actions', clickHandler: false}
    ];
    return (
        <div>
            {
                !!versions.length &&
                        <div className="contract-versions mt-4">
                            <Accordion
                                collapseId="versionsCollapse"
                                headerText="Saved contract versions" >
                                <table className="table">
                                    <thead>
                                        <HeaderRow
                                            headers={versionsTableHeaders} />
                                    </thead>
                                    <tbody>
                                        {
                                            versions.map((version, ind) => {
                                                return (
                                                    <ContractVersionsRow
                                                        key={ind}
                                                        version={version}
                                                        handleActionsClick={handleVersionsActionsClick} />
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </Accordion>
                        </div>
            }
            {
                !!dialogs.length &&
                        <div className="mt-3">
                            <Accordion
                                collapseId="dialogsCollapse"
                                headerText="Contract dialogs">
                                <div className="list-group">
                                    {
                                        dialogs.map((latestMessage, ind) => {
                                            return (
                                                <DialogMessage
                                                    key={ind}
                                                    message={latestMessage}
                                                    followedFrom='contract' />
                                            )
                                        })
                                    }
                                </div>

                            </Accordion>
                        </div>
            }
            <h3 className="text-center mt-4">Current contract</h3>
            {
                (status !== 'archived') &&
                    <div className="buttons mt-4">
                        <div className="d-flex justify-content-lg-around">
                            <div className="btn-group" role="group">
                                {
                                    actionOnStatus &&
                                    <button className="btn btn-outline-success font-weight-bold" data-toggle="modal"
                                            data-target="#confirmationModal"
                                            onClick={handleUpdateStatusClick}>
                                        {actionOnStatus}
                                    </button>
                                }
                                <button className="btn btn-outline-success font-weight-bold" data-toggle="modal"
                                        data-target="#inviteModal" data-backdrop="static" data-keyboard="false"
                                        onClick={handleInviteClick}>
                                    Invite
                                </button>
                                <button className="btn btn-outline-success font-weight-bold" data-toggle="modal"
                                        data-target="#sendMessageModal" data-backdrop="static" data-keyboard="false"
                                        onClick={handleCreateDialogClick}>
                                    Create dialog
                                </button>
                                <button type="button" className="btn btn-outline-success font-weight-bold"
                                        data-toggle="modal" data-target="#confirmationModal"
                                        onClick={handleSaveVersionClick}>
                                    Save contract version
                                </button>
                            </div>
                        </div>
                    </div>
            }
            {
                loading
                    ? <Spinner/>
                    : <table className="table mt-4">
                          <thead>
                              <HeaderRow
                                  headers={contractTableHeaders} />
                          </thead>
                          <tbody>
                              <ContractRow
                                  contract={contract}
                                  companiesAcceptances={companiesAcceptances} />
                          </tbody>
                      </table>
            }
            {
                (status !== 'archived') &&
                    <div className="buttons mt-4">
                        <div className="d-flex justify-content-lg-around">
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-success font-weight-bold" data-toggle="modal"
                                        data-target="#confirmationModal"
                                        onClick={handleSaveClick}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
            }
            <div className="form-group mt-4 w-100">
                <p className="font-weight-bold">Contract text:</p>
                {
                    loading
                        ? <Spinner/>
                        : <CKEditor
                            editor={ClassicEditor}
                            onReady={ editor => {
                                if (editor) {
                                    editor.setData(newText);
                                }
                            } }
                            onChange={handleTextChange} />
                }
            </div>
            <ConfirmationModal
                id='confirmationModal'
                headerText={headerText}
                bodyText={bodyText}
                btnText={btnText}
                confirmType={confirmType}
                handleCancel={() => console.log('Canceled')}
                handleConfirm={handleModalConfirm} />
            <VersionsDetailsModal
                versionText={versionText} />
            <SendingInvitationModal
                invitationVariants={invitationVariants}
                handleModalConfirm={handleInvitationModalConfirm} />
            <SendingMessageModal
                dialogVariants={dialogVariants}
                handleModalConfirm={handleDialogModalConfirm} />
        </div>
    )
};


export default ContractDetailsPage;
