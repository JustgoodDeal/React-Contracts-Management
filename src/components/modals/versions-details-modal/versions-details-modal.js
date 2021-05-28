import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React from 'react';

import './versions-details-modal.css';


const VersionsDetailsModal = ({ versionText }) => {
    return (
        <div className="modal fade" id="versionsDetailsModal" tabIndex="-1" role="dialog"
             aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h5 className="modal-title">Selected contract version text</h5>
                    </div>
                    <div className="modal-body">
                        <div>
                            <CKEditor
                                editor={ClassicEditor}
                                data={versionText}
                                disabled={true} />
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


export default VersionsDetailsModal;
