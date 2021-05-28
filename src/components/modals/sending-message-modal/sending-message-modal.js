import React, { Fragment, useEffect, useReducer } from 'react';

import { Select } from "../../ui";
import { DialogModalReducer } from "../../../reducers";
import { CHANGE_MESSAGE_TEXT, CLEAR_DIALOG_MODAL, SET_DIALOG_MODAL_RECIPIENTS,
    SET_MESSAGE_RECIPIENT } from '../../../reducers/types'

import './sending-message-modal.css';


const SendingMessageModal = ({ dialogVariants, handleModalConfirm }) => {
    const initialState = {
        recipientsChoices: [],
        messageText: '',
        selectedRecipient: '',
    };
    const [state, dispatch] = useReducer(DialogModalReducer, initialState);

    const handleCancel = () => {
        dispatch({
            type: CLEAR_DIALOG_MODAL,
        })
    };

    const handleSendingMessage = () => {
        dispatch({
            type: CLEAR_DIALOG_MODAL,
        });
        const { messageText, selectedRecipient } = state;
        if (messageText) {
            handleModalConfirm(messageText, selectedRecipient)
        }
    };

    const handleMessageChange = event => {
        dispatch({
            type: CHANGE_MESSAGE_TEXT,
            payload: event.target.value
        })
    };

    const handleRecipientChange = recipient => {
        dispatch({
            type: SET_MESSAGE_RECIPIENT,
            payload: recipient
        })
    };

    useEffect(() => {
        const recipientsChoices = dialogVariants.map(recipient => {
            const {id: recipient_id, name, companyName} = recipient;
            const text = companyName ? `${name} (${companyName})` : name;
            return {value: recipient_id, text: text}
        });
        const selectedRecipient = dialogVariants.length ? dialogVariants[0].id : '';
        dispatch({
            type: SET_DIALOG_MODAL_RECIPIENTS,
            payload: {recipientsChoices, selectedRecipient}
        })
    }, [dialogVariants]);

    const { messageText, recipientsChoices } = state;
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
                        {
                            dialogVariants.length
                                ?
                                    <Fragment>
                                        <div>
                                            <label>Recipients:</label>
                                            <Select
                                                options={recipientsChoices}
                                                handleChange={handleRecipientChange}/>
                                        </div>
                                        <textarea className="form-control mt-3" placeholder="Message text"
                                                  style={{height: '200px'}} value={messageText}
                                                  onChange={handleMessageChange}>
                                        </textarea>
                                    </Fragment>
                                :
                                    <p className='mt-4 mb-4 text-center'>All possible dialogs have already been created</p>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                onClick={() => handleCancel()}>
                            Cancel
                        </button>
                        {
                            dialogVariants.length
                                ?
                                    <button type="button" className="btn btn-primary" data-dismiss="modal"
                                            onClick={handleSendingMessage}>
                                        Send message
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


export default SendingMessageModal;
