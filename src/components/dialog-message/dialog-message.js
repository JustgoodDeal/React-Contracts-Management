import React from 'react';

import './dialog-message.css';


const DialogMessage = ({ messageEntities }) => {
    const { participantsList, datetime, author, text, isRead, currentPage } = messageEntities;
    let leftHeaderText, lastMessageAuthor;
    if (currentPage === 'dialogs') {
        leftHeaderText = `Participants: ${participantsList.join(', ')}`;
        lastMessageAuthor = `${author}: `
    } else {
        leftHeaderText = author;
        lastMessageAuthor = null;
    }

    let messageClass = 'text-left';
    if (isRead) {
        messageClass += ' text-dark'
    } else {
        messageClass += ' text-white bg-secondary'
    }
    return (
        <div className="list-group-item dialog">
            <div className="d-flex justify-content-between">
                <p className="text-primary font-weight-bold">{leftHeaderText}</p>
                <p className="text-secondary">{datetime}</p>
            </div>
            <p className={messageClass}>
                <span className="font-weight-bold">{lastMessageAuthor}</span>
                {text}
            </p>
        </div>
    );
};


export default DialogMessage;
