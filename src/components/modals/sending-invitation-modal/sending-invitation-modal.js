import React, { useEffect, useReducer } from 'react';

import { HeaderRow } from "../../table-rows";
import { Select } from "../../ui";
import { InvitationModalReducer } from "../../../reducers";
import { CHANGE_INVITATION_COMPANIES_CHOICES, CLEAR_INVITATION_MODAL, SET_INVITATION_COMPANY, SET_INVITATION_MODAL,
    SET_INVITATION_REASON } from "../../../reducers/types";

import './sending-invitation-modal.css';


const SendingInvitationModal = ({ invitationVariants, handleModalConfirm }) => {
    const initialState = {
        reasonsChoices: [],
        companiesChoices: [],
        selectedReason: '',
        selectedCompany: '',
    };
    const [state, dispatch] = useReducer(InvitationModalReducer, initialState);

    const handleCancel = () => {
        dispatch({
            type: CLEAR_INVITATION_MODAL,
        })
    };

    const handleSendingInvitation = () => {
        dispatch({
            type: CLEAR_INVITATION_MODAL,
        });
        const { selectedReason, selectedCompany } = state;
        handleModalConfirm(selectedReason, selectedCompany)
    };

    const handleCompanyChange = company => {
        dispatch({
            type: SET_INVITATION_COMPANY,
            payload: company
        })
    };

    const handleReasonChange = reason => {
        dispatch({
            type: CHANGE_INVITATION_COMPANIES_CHOICES,
            payload: invitationVariants[reason]
        });
        dispatch({
            type: SET_INVITATION_REASON,
            payload: reason
        })
    };

    useEffect(() => {
        const reasonsChoices = Object.keys(invitationVariants);
        const companiesChoices = reasonsChoices.length ? invitationVariants[reasonsChoices[0]] : [];
        const selectedReason = reasonsChoices.length ? reasonsChoices[0] : '';
        const selectedCompany = reasonsChoices.length ? companiesChoices[0]['id'] : '';
        dispatch({
            type: SET_INVITATION_MODAL,
            payload: {reasonsChoices, companiesChoices, selectedReason, selectedCompany}
        })
    }, [invitationVariants]);

    let { companiesChoices, reasonsChoices } = state;

    if (companiesChoices) {
        reasonsChoices = reasonsChoices.map(reason => ({value: reason, text: reason}));
        companiesChoices = companiesChoices.map(company => {
            return {value: company.id, text: company.name}
        });
    }

    const tableHeaders = [
        {label: 'Invitation reason', clickHandler: false},
        {label: 'Company to invite', clickHandler: false}
    ];
    return (
        <div className="modal fade" id="inviteModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Invitation for another company</h5>
                    </div>
                    <div className="modal-body p-0">
                        {
                            reasonsChoices.length
                                ?
                                    <table className="table">
                                        <thead>
                                        <HeaderRow
                                            headers={tableHeaders}/>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <Select
                                                    options={reasonsChoices}
                                                    handleChange={handleReasonChange}/>
                                            </td>
                                            <td className="text-center">
                                                <Select
                                                    options={companiesChoices}
                                                    handleChange={handleCompanyChange}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                :
                                    <p className='mt-4 mb-4 text-center'>All invitations have already been sent</p>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                onClick={() => handleCancel()} >
                            Cancel
                        </button>
                        {
                            reasonsChoices.length
                                ?
                                    <button type="button" className="btn btn-primary" data-dismiss="modal"
                                            onClick={handleSendingInvitation} >
                                        Send invitation
                                    </button>
                                :
                                    null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};


export default SendingInvitationModal;
