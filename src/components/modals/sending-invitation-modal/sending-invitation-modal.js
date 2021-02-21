import React from 'react';

import { HeaderRow } from "../../table-rows";
import { Select } from "../../ui";

import './sending-invitation-modal.css';


const SendingInvitationModal = ({ companiesOptions }) => {
    const invitationReasonsOptions = [
        {value: "editing", text: "Editing"},
        {value: "reconciliation", text: "Reconciliation"},
        {value: "signing", text: "Signing"}
    ];
    const thLabels = ['Invitation reason', 'Company to invite'];
    return (
        <div className="modal fade" id="inviteModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Invitation for another company</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <table className="table">
                            <thead>
                                <HeaderRow
                                    labels={thLabels} />
                            </thead>
                            <tbody>
                            <tr>
                                <td className="text-center">
                                    <Select
                                        options={invitationReasonsOptions} />
                                </td>
                                <td className="text-center">
                                    <Select
                                        options={companiesOptions} />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Send invitation</button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default SendingInvitationModal;
