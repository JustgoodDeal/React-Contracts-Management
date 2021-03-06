import React from 'react';

import './confirmation-modal.css';


const ConfirmationModal = ({ id, bodyText, btnText, cancelType, confirmType, handleCancel, handleConfirm }) => {
    return (
        <div className="modal fade" id={id} tabIndex="-1" role="dialog"
             aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-danger">Are you sure?</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{bodyText}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                onClick={() => handleCancel(cancelType)} >
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal"
                                onClick={() => handleConfirm(confirmType)} >
                            {btnText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default ConfirmationModal;
