import React from 'react';

import './notification-modal.css';


const NotificationModal = ({ notification, handleClose }) => {
    const { contractId, text } = notification;
    return (
        <div className="modal fade" id="notificationModal" tabIndex="-1" role="dialog"
             aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h6 className="modal-title">Contract {contractId}</h6>
                    </div>
                    <div className="modal-body">
                        <p className='mt-4 mb-4 text-center'>{text}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal"
                                onClick={() => handleClose()} >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default NotificationModal;
