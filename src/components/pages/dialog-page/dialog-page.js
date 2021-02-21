import React from 'react';
import DialogMessage from "../../dialog-message";

import './dialog-page.css';


const DialogPage = (props) => {
    const messageEntitiesList = [
        {
            datetime: '01.01.2021',
            author: 'Dmitriy Gulash',
            text: 'Hello',
            isRead: true,
            currentPage: 'dialog'

        },
        {
            datetime: '02.01.2021',
            author: 'I',
            text: 'Hi, Gulash!',
            isRead: false,
            currentPage: 'dialog'
        },
    ];
    const dialogId = props.match.params.id;
    return (
        <div className="mt-4">
            <p>Dialog id: {dialogId}</p>
            <div className="d-flex justify-content-start">
                <p className="me-2">Contract:</p>
                <a href="#">Link</a>
            </div>
            <div className="list-group mt-1">
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
            <div>
                <form>
                    <div className="mt-4 w-75">
                        <div className="form-group w-75">
                            <label htmlFor="messageText">Message text</label>
                            <textarea className="form-control" id="messageText" placeholder="Start typing here" style={{height: '200px'}}></textarea>
                        </div>
                        <button className="btn btn-success mt-2">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
};


export default DialogPage;
