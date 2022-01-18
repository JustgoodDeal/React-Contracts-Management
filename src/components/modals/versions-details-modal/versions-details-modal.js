import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useRef } from 'react';

import './versions-details-modal.css';


const VersionsDetailsModal = ({ versionText }) => {
    const toolbar = useRef(null);

    return (
        <div className="modal fade" id="versionsDetailsModal" tabIndex="-1" role="dialog"
             aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h5 className="modal-title">Selected contract version text</h5>
                    </div>
                    <div className="modal-body">
                        <div ref={toolbar}>
                        </div>
                        <div>
                            <CKEditor
                                editor={DecoupledEditor}
                                onReady={editor => {
                                    if (editor) {
                                        toolbar.current.appendChild(editor.ui.view.toolbar.element)
                                    }
                                }}
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
