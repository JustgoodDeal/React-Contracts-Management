import React from 'react';

import './history-details-modal.css';


const HistoryDetailsModal = () => {
    return (
        <div className="modal fade" id="historyDetailsModal" tabIndex="-1" role="dialog"
             aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <textarea className="form-control" style={{height: '300px'}}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default HistoryDetailsModal;
