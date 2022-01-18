import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Accordion } from '../../hoc';
import { ContractVersionsRow, ContractRow, HeaderRow } from "../../table-rows";
import { ConfirmationModal, VersionsDetailsModal, SendingInvitationModal, SendingMessageModal } from "../../modals";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";
import DialogMessage from "../../dialog-message";
import { ContractReducer } from "../../../reducers";
import CmService from "../../../services";
import {
    defineCommentsLengths, removeSpacesFromColorSubstrings, replaceSpacesAtStringStart, reverseString
} from '../../../utils'
import {
    CHANGE_COMMENT_RESPONSE_TEXT, CHANGE_CONTRACT_TEXT, CHANGE_NEW_COMMENT_TEXT, CLEAR_NEW_COMMENT,
    CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION, FETCH_CONTRACT_SUCCESS, CLEAR_COMMENT_RESPONSE_TEXT, CLEAR_SELECTED_COMMENTS,
    FETCH_COMMENTS_SUCCESS, FETCH_DIALOG_VARIANTS_SUCCESS, FETCH_DIALOGS_SUCCESS, FETCH_INVITATION_VARIANTS_SUCCESS,
    FETCH_VERSIONS_SUCCESS, SET_COMMENT_TO_DELETE, SET_CONTRACT_TEXTS, SET_CONFIRMATION_MODAL,
    SET_NEW_COMMENT_CONTRACT_TEXT, SET_NEW_COMMENT_NUMBER, SET_NEW_COMMENT_IS_SELECTED, SET_SELECTED_COMMENT,
    SET_SELECTED_VERSION
} from "../../../reducers/types";
import { AuthContext, LoadingAndErrorContext } from '../../../context'

import './contract-details-page.css';



const ContractDetailsPage = () => {
    const initialState = {
        contract: {
            id: '',
            text: '',
            newText: '',
            companies: [],
            creationDate: '',
            status: '',
            companiesAcceptances: [],
            actionOnStatus: '',
        },
        dialogs: [],
        versions: [],
        selectedVersion: {
            id: '',
            text: '',
        },
        dialogVariants: [],
        invitationVariants: {},
        confirmationModal: {
            headerText: '',
            bodyText: '',
            btnText: '',
            cancelType: '',
            confirmType: ''
        },
        comments: [],
        newComment: {
            responseText: '',
            contractText: '',
            number: '',
            text: '',
            isSelected: false
        },
        commentToDelete: {
            id: '',
            number: ''
        }
    };
    const [state, dispatch] = useReducer(ContractReducer, initialState);

    const { userId, userName } = useContext(AuthContext);
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { id: contractId } = useParams();

    const service = new CmService();

    const toolbar = useRef(null);
    const editorWindow = useRef(null);

    const handleEditorMouseSelection = () => {
        const currentEditor = editorWindow.current.editor
        const selection = currentEditor.model.document.selection
        const selectionRange = selection.getFirstRange()

        if (newCommentIsSelected) {
            currentEditor.setData(state.contract.text)
            currentEditor.model.change(writer => {
                writer.setSelection(selectionRange, 'end');
            });
            dispatch({
                type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
            });
        }

        if (selection.anchor.stickiness !== "toNone") {
            let freeNumber = state.newComment.number
            let commentsNumbers = comments.map(comment => comment.number)
            if (!freeNumber) {
                let maxNumber = Math.max.apply(null, commentsNumbers.slice().concat(69))
                freeNumber = maxNumber + 1
                dispatch({
                    type: SET_NEW_COMMENT_NUMBER,
                    payload: freeNumber
                });
            }

            let spanStart = `<span style="background-color:hsl(40,${freeNumber}%,80%);">`
            let spanEnd = '</span>'
            let textWithComment = '';
            const tagNamesMap = {paragraph: '<p>', heading1: '<h2>', heading2: '<h3>', heading3: '<h4>'}
            for (const item of selectionRange.getItems()) {
                if (item.is('textProxy')) {
                    let space = '&nbsp;'
                    let data = replaceSpacesAtStringStart(item.data, space)
                    data = replaceSpacesAtStringStart(reverseString(data), reverseString(space))
                    data = reverseString(data)
                    textWithComment += `${spanStart}${data}${spanEnd}`
                } else if (Object.keys(tagNamesMap).includes(item.name)) {
                    textWithComment += tagNamesMap[item.name]
                }
            }

            let initCommentsLengths = defineCommentsLengths(state.contract.text, commentsNumbers)

            const viewFragment = currentEditor.data.processor.toView(textWithComment);
            const modelFragment = currentEditor.data.toModel(viewFragment);
            currentEditor.model.insertContent(modelFragment, selection, 'in');
            console.log(currentEditor.getData())

            let commentsLengthsAfterHighlighting = defineCommentsLengths(currentEditor.getData(), commentsNumbers)

            let newContractText;
            let possibilityToAddComment = false
            if (initCommentsLengths.join() === commentsLengthsAfterHighlighting.join()) {
                newContractText = currentEditor.getData()
                possibilityToAddComment = true
            }

            currentEditor.setData(state.contract.text);
            currentEditor.model.change(writer => {
                writer.setSelection(selectionRange, 'end');
            });


            if (possibilityToAddComment) {
                dispatch({
                    type: SET_NEW_COMMENT_CONTRACT_TEXT,
                    payload: newContractText
                });
            } else {
                dispatch({
                    type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
                });
            }

        } else {
            dispatch({
                type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
            });
        }
    }

    const handleEditorKeyUp = () => {
        dispatch({
            type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
        });
    }

    const handleNewCommentAddClick = () => {
        const commentSpanStart = `<span style="background-color:hsl(40,${state.newComment.number}%,80%);">`
        const selectedSpanStart = `<span style="background-color:hsl(40,70%,60%);">`
        const contractTextAfterSelection = newCommentContractText.split(commentSpanStart).join(selectedSpanStart)

        editorWindow.current.editor.setData(contractTextAfterSelection)

        dispatch({
            type: SET_NEW_COMMENT_IS_SELECTED
        });

    }

    const handleNewCommentSave = () => {
        const {newComment: {number}} = state
        service.createComment({
            contractId, contractText: newCommentContractText, userName, text: newCommentText, number
        })
            .then(response => {
                if (response === 'Created') {
                    getContract()
                    getComments()
                    dispatch({
                        type: CLEAR_NEW_COMMENT
                    });
                }
            })
    }

    const handleNewCommentCancel = () => {
        editorWindow.current.editor.setData(state.contract.text);
        dispatch({
            type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
        });
    }

    const handleNewCommentTextChange = event => {
        dispatch({
            type: CHANGE_NEW_COMMENT_TEXT,
            payload: event.target.value
        });
    }

    const handleCommentClick = (event, commentNumber) => {
        if (!event.deleteClick) {
            const commentSpanStart = `<span style="background-color:hsl(40,${commentNumber}%,80%);">`
            const selectedSpanStart = '<span style="background-color:hsl(40,70%,60%);">'
            const contractTextAfterSelection = state.contract.text.split(commentSpanStart).join(selectedSpanStart)

            editorWindow.current.editor.setData(contractTextAfterSelection)

            dispatch({
                type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
            });
            dispatch({
                type: CLEAR_COMMENT_RESPONSE_TEXT
            });
            dispatch({
                type: SET_SELECTED_COMMENT,
                payload: commentNumber
            });
        }
    }

    const handleSelectedCommentCancel = () => {
        editorWindow.current.editor.setData(state.contract.text)
        dispatch({
            type: CLEAR_COMMENT_RESPONSE_TEXT
        });
        dispatch({
            type: CLEAR_SELECTED_COMMENTS
        });
    }

    const handleCommentResponseTextChange = event => {
        dispatch({
            type: CHANGE_COMMENT_RESPONSE_TEXT,
            payload: event.target.value
        });
    }

    const handleCommentDeleteClick = event => {
        event.deleteClick = true

        const { id, number } = JSON.parse(event.target.id)
        let contractTextAfterRemoval = ''

        if (comments.find(comment => comment['number'] === number)['relatedComments'].length === 1) {
            let searchString = state.contract.text
            const spanStart = `<span style="background-color:hsl(40,${number}%,80%);">`
            const spanEnd = '</span>'
            const iterationsCount = searchString.split(spanStart).length
            for (let i = 0; i < iterationsCount; i += 1) {
                if (i !== iterationsCount - 1) {
                    let spanStartFirstInd = searchString.indexOf(spanStart)
                    let spanStartLastInd = spanStartFirstInd + spanStart.length - 1
                    let spanEndFirstInd = searchString.indexOf(spanEnd, spanStartLastInd + 1)
                    let spanEndLastInd = spanEndFirstInd + spanEnd.length - 1
                    contractTextAfterRemoval += searchString.slice(0, spanStartFirstInd) + searchString.slice(spanStartLastInd + 1, spanEndFirstInd)
                    searchString = searchString.slice(spanEndLastInd + 1)
                } else {
                    contractTextAfterRemoval += searchString
                }
            }
        }

        dispatch({
            type: SET_COMMENT_TO_DELETE,
            payload: {id, number, contractTextAfterRemoval}
        });

        let [headerText, bodyText, btnText] = ['Are you sure?', 'Selected comment will be removed', 'Delete']
        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText,
                bodyText,
                btnText,
                confirmType: 'DeleteComment'
            }
        });
    }

    const commentDeletionProcessedFollowUp = responseText => {
        const { commentToDelete: { number } } = state
        const selectedComment = comments.find(comment => comment['selected'] === true)
        if (selectedComment !== undefined && responseText === 'Deleted' && selectedComment.number === number) {
            dispatch({
                type: CLEAR_COMMENT_RESPONSE_TEXT
            });
        }

        let commentNumber = ((selectedComment !== undefined && responseText === 'Deleted' && selectedComment.number !== number) || (selectedComment !== undefined && responseText === 'Updated')) ? selectedComment.number : false

        if (responseText === 'Deleted') {
            dispatch({
                type: CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION
            });

            const { commentToDelete: { contractTextAfterRemoval } } = state
            let contractNewText;
            if (commentNumber) {
                const commentSpanStart = `<span style="background-color:hsl(40,${commentNumber}%,80%);">`;
                const selectedSpanStart = '<span style="background-color:hsl(40,70%,60%);">';
                contractNewText = contractTextAfterRemoval.split(commentSpanStart).join(selectedSpanStart);
                editorWindow.current.editor.setData(contractNewText);
            } else {
                contractNewText = contractTextAfterRemoval;
                editorWindow.current.editor.setData(contractTextAfterRemoval);
            }

            dispatch({
                type: SET_CONTRACT_TEXTS,
                payload: {text: contractTextAfterRemoval, newText: contractNewText}
            });
        }

        getComments(commentNumber)
    }

    const handleCommentResponse = commentNumber => {
        const { newComment: { responseText } } = state
        service.updateComment({userName, contractId, commentNumber, responseText})
            .then(response => {
                if (response === 'Updated') {
                    dispatch({
                        type: CLEAR_COMMENT_RESPONSE_TEXT
                    });
                    getComments(commentNumber)
                }
            })
    }

    const handleContractTextChange = (event, editor) => {
        dispatch({
            type: CHANGE_CONTRACT_TEXT,
            payload: removeSpacesFromColorSubstrings(editor.getData())
        });
    };

    const contractStatusUpdateProcessedFollowUp = () => {
        if (actionOnStatus === 'Harmonize') {
            dispatch({
                type: CLEAR_NEW_COMMENT
            });

            if (comments.length) {
                const commentsNumbers = comments.map(comment => comment.number)
                let contractTextAfterHarmonizing = ''
                let searchString = state.contract.text.slice(0)
                const spanEnd = '</span>'
                for (let number of commentsNumbers) {
                    const spanStart = `<span style="background-color:hsl(40,${number}%,80%);">`
                    const iterationsCount = searchString.split(spanStart).length - 1
                    for (let i = 0; i < iterationsCount; i += 1) {
                        const spanStartFirstInd = searchString.indexOf(spanStart)
                        const spanStartLastInd = spanStartFirstInd + spanStart.length - 1
                        const spanEndFirstInd = searchString.indexOf(spanEnd, spanStartLastInd + 1)
                        const spanEndLastInd = spanEndFirstInd + spanEnd.length - 1
                        contractTextAfterHarmonizing += searchString.slice(0, spanStartFirstInd) + searchString.slice(spanStartLastInd + 1, spanEndFirstInd)
                        searchString = searchString.slice(spanEndLastInd + 1)
                    }
                }
                contractTextAfterHarmonizing += searchString

                service.updateContract({id: contractId, text: contractTextAfterHarmonizing, onlyText: true})
                    .then(response => {
                        if (response === 'Updated') {
                            getContract()
                            getComments()
                        }
                    })
                    .catch(handleError)
            } else {
                getContract()
            }
        } else {
            getContract()
        }
    }

    const handleModalConfirm = confirmType => {
        const {
            contract: { newText, actionOnStatus: action },
            selectedVersion: { id: versionId, text: versionText },
            commentToDelete: { id: commentId, number, contractTextAfterRemoval }
        } = state;

        let initMethodName, followUpMethods, props, result;
        switch (confirmType) {
            case 'UpdateStatus':
                [initMethodName, followUpMethods, props, result] =
                    ['updateContractStatus', [contractStatusUpdateProcessedFollowUp], {contractId, userId, [action]: action}, ['Updated']];
                break;
            case 'Save':
                [initMethodName, followUpMethods, props, result] =
                    ['updateContract', [getContract, getComments], {data: {id: contractId, text: newText}}, ['Updated']];
                break;
            case 'SaveVersion':
                [initMethodName, followUpMethods, props, result] =
                    ['saveContractVersion', [getContractVersions], {contractId, userId}, ['Saved']];
                break;
            case 'Replace':
                [initMethodName, followUpMethods, props, result] =
                    ['updateContract', [getContract, getComments], {data: {id: contractId, text: versionText}}, ['Updated']];
                break;
            case 'DeleteVersion':
                [initMethodName, followUpMethods, props, result] =
                    ['deleteContractVersion', [getContractVersions], {versionId}, ['Deleted']];
                break;
            case 'DeleteComment':
                [initMethodName, followUpMethods, props, result] =
                    ['deleteComment', [commentDeletionProcessedFollowUp],
                        {data: {contractId, id: commentId, number, contractTextAfterRemoval}}, ['Deleted', 'Updated']
                    ];
        }

        service[initMethodName](...Object.values(props))
            .then(response => {
                if (result.includes(response)) {
                    for (let method of followUpMethods) {
                        method(response)
                    }
                }
            })
            .catch(handleError)
    };

    const handleInvitationModalConfirm = (selectedReason, selectedCompany) => {
        const invitationEntities = {contractId, senderId: userId, reason: selectedReason, company: selectedCompany};
        service.createInvitations(invitationEntities)
            .then(result => {
                if (result === 'Created') {
                    console.log('Invitations created');
                }
            })
            .catch(handleError)
    };

    const handleDialogModalConfirm = (messageText, recipient) => {
        service.createDialog({contractId, userId, userName, messageText, recipient})
            .then(result => {
                if (result === 'Created') {
                    getDialogs();
                }
            })
            .catch(handleError)
    };

    const handleVersionsActionsClick = ({ actionType, versionId, versionText }) => {
        dispatch({
            type: SET_SELECTED_VERSION,
            payload: {id: versionId, text: versionText}
        });
        switch (actionType) {
            case 'Replace':
                const { contract: { text: contractText } } = state;
                let modalBodyText = 'Major contract will be replaced by this one, its status will be reset to "creating"'
                if (comments.length) {
                    modalBodyText += ', all comments will be deleted'
                }
                const [headerText, bodyText, btnText] = versionText === contractText ?
                    ['', "Current contract is the same as selected version", ''] :
                    ['Are you sure?', modalBodyText, 'Apply'];
                dispatch({
                    type: SET_CONFIRMATION_MODAL,
                    payload: {
                        headerText,
                        bodyText,
                        btnText,
                        confirmType: 'Replace'
                    }
                });
                break;
            case 'DeleteVersion':
                dispatch({
                    type: SET_CONFIRMATION_MODAL,
                    payload: {
                        headerText: 'Are you sure?',
                        bodyText: 'Selected contract version will be removed',
                        btnText: 'Delete',
                        confirmType: 'DeleteVersion'
                    }
                });
        }
    };

    const handleInviteClick = () => {
        service.getInvitationVariants(contractId, userId)
            .then(invitationVariants => {
                dispatch({
                    type: FETCH_INVITATION_VARIANTS_SUCCESS,
                    payload: invitationVariants
                })
            })
            .catch(handleError)
    };

    const handleSaveVersionClick = () => {
        const { contract: { text: contractText }, versions } = state;
        const sameVersionExists = versions.length && versions[versions.length - 1].text === contractText;
        const [headerText, bodyText, btnText] = sameVersionExists ?
            ['', "Current contract version has already been saved", ''] :
            ['Save current contract version?', '', 'Save'];
        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText,
                bodyText,
                btnText,
                confirmType: 'SaveVersion'
            }
        });
    };

    const handleCreateDialogClick = () => {
        service.getDialogVariants(contractId, userId)
            .then(dialogVariants => {
                dispatch({
                    type: FETCH_DIALOG_VARIANTS_SUCCESS,
                    payload: dialogVariants
                })
            })
            .catch(handleError)
    };

    const handleUpdateStatusClick = () => {
        const { actionOnStatus } = state.contract;
        const bodyText = (actionOnStatus === 'Harmonize' && comments.length) ? 'All comments will be deleted' : ''

        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText: 'Are you sure?',
                bodyText,
                btnText: actionOnStatus,
                confirmType: 'UpdateStatus'
            }
        });
    };

    const handleSaveClick = () => {
        let { text, newText } = state.contract;
        const textChanged = text !== newText;

        let [headerText, bodyText, btnText] = textChanged ?
            ['Are you sure?', 'After saving the contract its status will be reset to "creating"', 'Save'] :
            ['', "Current contract is the same as previous", ''];
        if (!newText) {
            [headerText, bodyText, btnText] = ['', "Contract text can't be empty", '']
        }
        if (comments.length && btnText) {
            bodyText = 'After saving the contract all comments will be deleted'
        }

        dispatch({
            type: SET_CONFIRMATION_MODAL,
            payload: {
                headerText,
                bodyText,
                btnText,
                confirmType: 'Save'
            }
        });
    };

    const getComments = (commentNumber=false) => {
        service.getComments(contractId)
            .then(comments => {
                if (typeof commentNumber === 'number') {
                    for (let comment of comments) {
                        if (comment['number'] === commentNumber) {
                            comment['selected'] = true;
                        }
                    }
                }

                dispatch({
                    type: CLEAR_NEW_COMMENT
                });
                dispatch({
                    type: FETCH_COMMENTS_SUCCESS,
                    payload: comments
                })
            })
            .catch(handleError)
    };

    const getContract = () => {
        setLoading();
        service.getContract(contractId, userId)
            .then(contract => {
                disableLoading();
                dispatch({
                    type: FETCH_CONTRACT_SUCCESS,
                    payload: contract
                })
            })
            .catch(handleError)
    };

    const getContractVersions = () => {
        service.getContractVersions(contractId, userId)
            .then(versions => {
                dispatch({
                    type: FETCH_VERSIONS_SUCCESS,
                    payload: versions
                })
            })
            .catch(handleError)
    };

    const getDialogs = () => {
        service.getDialogs(contractId, userId)
            .then(({ dialogs }) => {
                dispatch({
                    type: FETCH_DIALOGS_SUCCESS,
                    payload: dialogs
                })
            })
            .catch(handleError)
    };

    useEffect(() => {
        getContract();
        getComments();
        getContractVersions();
        getDialogs();
    }, []);

    if (error) {
        return <ErrorIndicator />
    }

    const {
        contract, dialogs, invitationVariants, dialogVariants, versions, comments,
        selectedVersion: { text: versionText },
        confirmationModal: { headerText, bodyText, btnText, confirmType },
        newComment: { responseText, contractText: newCommentContractText, text: newCommentText,
            isSelected: newCommentIsSelected }
    } = state;

    const { actionOnStatus, companiesAcceptances, status, text, newText } = contract;

    const commentIsSelected = status === 'creating' && comments.some(comment => comment['selected'] === true)
    let newCommentAddBtnClass = "btn btn-outline-success btn-sm mb-3 "
    newCommentAddBtnClass += newCommentContractText && !newCommentIsSelected ? 'visible' : 'invisible'

    const contractTableHeaders = [
        {label: 'ID', clickHandler: false},
        {label: 'Creation date', clickHandler: false},
        {label: 'Companies involved', clickHandler: false},
        {label: 'Status', clickHandler: false}
    ];
    const versionsTableHeaders = [
        {label: 'Creation date', clickHandler: false},
        {label: 'The then status', clickHandler: false},
        {label: 'Actions', clickHandler: false}
    ];
    return (
        <div>
            {
                !!versions.length &&
                        <div className="contract-versions mt-4">
                            <Accordion
                                collapseId="versionsCollapse"
                                headerText="Saved contract versions" >
                                <table className="table">
                                    <thead>
                                        <HeaderRow
                                            headers={versionsTableHeaders} />
                                    </thead>
                                    <tbody>
                                        {
                                            versions.map((version, ind) => {
                                                return (
                                                    <ContractVersionsRow
                                                        key={ind}
                                                        version={version}
                                                        handleActionsClick={handleVersionsActionsClick} />
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </Accordion>
                        </div>
            }
            {
                !!dialogs.length &&
                        <div className="mt-3">
                            <Accordion
                                collapseId="dialogsCollapse"
                                headerText="Contract dialogs">
                                <div className="list-group">
                                    {
                                        dialogs.map((latestMessage, ind) => {
                                            return (
                                                <DialogMessage
                                                    key={ind}
                                                    message={latestMessage}
                                                    followedFrom='contract' />
                                            )
                                        })
                                    }
                                </div>

                            </Accordion>
                        </div>
            }
            <h3 className="text-center mt-4">Current contract</h3>
            {
                (status !== 'archived') &&
                    <div className="buttons mt-4">
                        <div className="d-flex justify-content-lg-around">
                            <div className="btn-group" role="group">
                                {
                                    actionOnStatus &&
                                    <button className="btn btn-outline-success font-weight-bold" data-toggle="modal"
                                            data-target="#confirmationModal"
                                            onClick={handleUpdateStatusClick}>
                                        {actionOnStatus}
                                    </button>
                                }
                                <button className="btn btn-outline-success font-weight-bold" data-toggle="modal"
                                        data-target="#inviteModal" data-backdrop="static" data-keyboard="false"
                                        onClick={handleInviteClick}>
                                    Invite
                                </button>
                                <button className="btn btn-outline-success font-weight-bold" data-toggle="modal"
                                        data-target="#sendMessageModal" data-backdrop="static" data-keyboard="false"
                                        onClick={handleCreateDialogClick}>
                                    Create dialog
                                </button>
                                {
                                    !comments.length &&
                                        <button type="button" className="btn btn-outline-success font-weight-bold"
                                                data-toggle="modal" data-target="#confirmationModal"
                                                onClick={handleSaveVersionClick}>
                                            Save contract version
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
            }
            {
                loading
                    ? <Spinner/>
                    : <table className="table mt-4">
                          <thead>
                              <HeaderRow
                                  headers={contractTableHeaders} />
                          </thead>
                          <tbody>
                              <ContractRow
                                  contract={contract}
                                  companiesAcceptances={companiesAcceptances} />
                          </tbody>
                      </table>
            }
            {
                (status !== 'archived') &&
                    <div className="buttons mt-4">
                        <div className="d-flex justify-content-lg-around">
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-success font-weight-bold" data-toggle="modal"
                                        data-target="#confirmationModal" disabled={commentIsSelected || newCommentIsSelected}
                                        onClick={handleSaveClick}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
            }
            <div className="d-flex mt-4">
                <div className='w-75'>
                    <p className="font-weight-bold">Contract text:</p>
                    <div ref={toolbar}>
                    </div>
                    <div onClick={(newCommentIsSelected || (status === 'creating' && text === newText)) ? handleEditorMouseSelection : null}
                         onKeyUp={(newCommentContractText && !newCommentIsSelected) ? handleEditorKeyUp : null}>
                    {
                        loading
                            ? <Spinner/>
                            : <CKEditor
                                editor={DecoupledEditor}
                                onReady={editor => {
                                    if (editor) {
                                        toolbar.current.innerHTML = ""
                                        toolbar.current.appendChild(editor.ui.view.toolbar.element)
                                        editor.setData(newText);
                                    }
                                } }
                                onChange={handleContractTextChange}
                                disabled={commentIsSelected}
                                ref={editorWindow} />
                    }
                    </div>
                </div>
                <div className='d-flex flex-column align-items-center w-25'>
                    <button className={newCommentAddBtnClass}
                            onClick={handleNewCommentAddClick}>
                        Add a comment
                    </button>
                    {
                        (newCommentIsSelected) &&
                                <div className="card w-75 mb-2">
                                    <div className="card-body">
                                        <h6 className="card-title">{userName}</h6>
                                        <textarea className="form-control mb-2"
                                                  onChange={handleNewCommentTextChange}
                                                  autoFocus>
                                        </textarea>
                                        {
                                            newCommentText &&
                                                <button className="btn btn-primary btn-sm  mr-2"
                                                        onClick={handleNewCommentSave}>
                                                    Save
                                                </button>
                                        }
                                        <button className="btn btn-secondary btn-sm"
                                                onClick={handleNewCommentCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                    }
                    {
                        comments.map(comment => {
                                const { relatedComments, number, selected  } = comment
                                return relatedComments.map((relatedComment, ind) => {
                                    const { id, author, text, creationDate } = relatedComment
                                    let latestComment = ind === relatedComments.length - 1
                                    return (
                                        <div className={latestComment ? "card w-75 mb-3 pointer" : 'card w-75 pointer'}
                                             onClick={selected ? null : (event) => handleCommentClick(event, number)} key={ind}>
                                            <div className="card-body p-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="card-title mb-3">{author}</h6>
                                                    <p className="text-muted comment-datetime">{creationDate}</p>
                                                    {
                                                        (userName === author) &&
                                                            <button className="close mb-4" data-toggle="modal"
                                                                    data-target="#confirmationModal"
                                                                    onClick={handleCommentDeleteClick}>
                                                                <span aria-hidden="true" id={JSON.stringify({id, number})}>&times;</span>
                                                            </button>
                                                    }
                                                </div>
                                                <p className={(selected && latestComment) ? "card-text border-bottom pb-1 mb-0" : 'card-text pb-1 mb-0'}>
                                                    {text}
                                                </p>
                                                <div className={(selected && latestComment) ? '' : 'd-none'}>
                                                    <textarea className="form-control mb-2"
                                                              onChange={handleCommentResponseTextChange}
                                                              value={responseText}>
                                                    </textarea>
                                                    {
                                                        responseText &&
                                                            <button className="btn btn-primary btn-sm mr-2"
                                                                    onClick={() => handleCommentResponse(number)}>
                                                                Respond
                                                            </button>
                                                    }
                                                    <button className="btn btn-secondary btn-sm"
                                                            onClick={handleSelectedCommentCancel}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            })
                    }
                </div>
            </div>
            <ConfirmationModal
                id='confirmationModal'
                headerText={headerText}
                bodyText={bodyText}
                btnText={btnText}
                confirmType={confirmType}
                handleCancel={() => console.log('Canceled')}
                handleConfirm={handleModalConfirm} />
            <VersionsDetailsModal
                versionText={versionText} />
            <SendingInvitationModal
                invitationVariants={invitationVariants}
                handleModalConfirm={handleInvitationModalConfirm} />
            <SendingMessageModal
                dialogVariants={dialogVariants}
                handleModalConfirm={handleDialogModalConfirm} />
        </div>
    )
};


export default ContractDetailsPage;
