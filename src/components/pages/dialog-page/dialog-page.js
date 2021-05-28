import React, {useContext, useEffect, useReducer} from 'react';
import { Link, useHistory, useParams } from "react-router-dom";

import DialogMessage from "../../dialog-message";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";
import CmService from "../../../services";
import { AuthContext, LoadingAndErrorContext, NavbarContext } from '../../../context'
import { DialogReducer } from "../../../reducers";
import { CHANGE_MESSAGE_TEXT, CLEAR_MESSAGE_TEXT, FETCH_DIALOG_SUCCESS } from "../../../reducers/types";

import './dialog-page.css';


const DialogPage = () => {
    const initialState = {
        messages: [],
        contractId: '',
        participants: '',
        messageText: ''
    };
    const [state, dispatch] = useReducer(DialogReducer, initialState);

    const { userId, userName } = useContext(AuthContext);
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { changeActiveLink, updateNewItems } = useContext(NavbarContext);
    const { id: dialogId } = useParams();
    let { location: { search } } = useHistory();
    const { followed_from: followedFrom } = require('query-string').parse(search);

    const service = new CmService();

    const handleTextChange = event => {
        dispatch({
            type: CHANGE_MESSAGE_TEXT,
            payload: event.target.value
        });
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        const { messageText } = state;
        if (messageText) {
            service.createMessage({messageText, dialogId, sender: {id: userId, name: userName}})
                .then(result => {
                    if (result === 'Created') {
                        getDialog();
                        dispatch({
                            type: CLEAR_MESSAGE_TEXT
                        });
                    }
                })
                .catch(handleError)
        }
    };

    const getDialog = () => {
        setLoading();
        service.getDialog(dialogId, userId)
            .then(dialog => {
                disableLoading();
                dispatch({
                    type: FETCH_DIALOG_SUCCESS,
                    payload: dialog
                })
            })
            .catch(handleError)
    };

    useEffect(() => {
        getDialog();
        updateNewItems()
    }, []);

    if (error) {
        return <ErrorIndicator />
    }

    if (loading) {
        return <Spinner />
    }

    const { contractId, participants, messages, messageText } = state;

    let participantsNames = ['I'];
    for (let participant of participants) {
        if (participant.id !== userId) {
            participantsNames.push(participant.name)
        }
    }

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-start">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb rounded-0">
                        {
                            followedFrom === 'dialogs' &&
                                <li className="breadcrumb-item">
                                    <Link to={'/dialogs'} >
                                        Dialogs
                                    </Link>
                                </li>
                        }
                        <li className="breadcrumb-item">
                            <Link to={`/contract/${contractId}`}
                                  onClick={() => changeActiveLink('Contracts')} >
                                Contract ID {contractId}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            Dialog
                        </li>
                    </ol>
                </nav>
            </div>
            <p className="text-primary font-weight-bold">Participants: {participantsNames.join(', ')}</p>
            <div className="list-group mt-1">
                {
                    messages.map((message, ind) => {
                        return (
                            <DialogMessage
                                key={ind}
                                message={message}
                                followedFrom='' />
                        )
                    })
                }
            </div>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <div className="mt-4 w-75">
                        <div className="form-group w-75">
                            <label htmlFor="messageText">Message text</label>
                            <textarea className="form-control" id="messageText" placeholder="Start typing here"
                                      style={{height: '200px'}} value={messageText}
                                      onChange={handleTextChange}>
                            </textarea>
                        </div>
                        <button type="submit" className="btn btn-success mt-2">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
};


export default DialogPage;
