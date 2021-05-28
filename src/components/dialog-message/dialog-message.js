import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import { AuthContext, NavbarContext } from '../../context'

import './dialog-message.css';


const DialogMessage = ({ message, followedFrom }) => {
    let history = useHistory();
    const { userId } = useContext(AuthContext);
    const { changeActiveLink } = useContext(NavbarContext);

    const { dialogId, creationDate, sender, text, isRead } = message;
    const senderName = sender.id === userId ? 'I' : sender.name;

    let leftHeaderText, lastMessageAuthor;
    if ('participants' in message) {
        let participantsNames = ['I'];
        for (let participant of message.participants) {
            if (participant.id !== userId) {
                participantsNames.push(participant.name)
            }
        }
        leftHeaderText = `Participants: ${participantsNames.join(', ')}`;
        lastMessageAuthor = `${senderName}: `
    } else {
        leftHeaderText = senderName;
        lastMessageAuthor = null;
    }

    let messageClass = 'text-left';
    if (isRead) {
        messageClass += ' text-dark'
    } else {
        messageClass += ' text-white bg-secondary'
    }

    const handleMessageClick = () => {
        if (followedFrom) {
            changeActiveLink(followedFrom === 'dialogs' ? 'Dialogs' : 'Contracts');
            history.push(`/dialog/${dialogId}?followed_from=${followedFrom}`);
        }
    };

    return (
        <div className="list-group-item dialog pb-0"
             onClick={handleMessageClick}>
            <div className="d-flex justify-content-between">
                <p className="text-primary font-weight-bold">{leftHeaderText}</p>
                <p className="text-secondary">{creationDate}</p>
            </div>
            <p className={messageClass}>
                <span className="font-weight-bold">{lastMessageAuthor}</span>
                {text}
            </p>
        </div>
    );
};


export default DialogMessage;
