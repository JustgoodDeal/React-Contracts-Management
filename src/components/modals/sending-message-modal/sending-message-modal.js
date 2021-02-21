import React from 'react';

import { Select } from "../../ui";

import './sending-message-modal.css';


const SendingMessageModal = ({ recipientsOptions }) => {
    return (
        <div className="modal fade" id="sendMessageModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sending message to participants</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <label>Recipients:</label>
                            <Select
                                options={recipientsOptions} />
                        </div>
                        <textarea className="form-control mt-3" placeholder="Message text" style={{height: '200px'}}></textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Send message</button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default SendingMessageModal;
