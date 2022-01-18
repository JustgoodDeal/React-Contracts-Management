import {
    CHANGE_COMMENT_RESPONSE_TEXT, CHANGE_CONTRACT_TEXT, CHANGE_NEW_COMMENT_TEXT, CLEAR_COMMENT_RESPONSE_TEXT,
    CLEAR_NEW_COMMENT, CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION, CLEAR_SELECTED_COMMENTS, FETCH_COMMENTS_SUCCESS,
    FETCH_CONTRACT_SUCCESS, FETCH_DIALOG_VARIANTS_SUCCESS, FETCH_DIALOGS_SUCCESS, FETCH_INVITATION_VARIANTS_SUCCESS,
    FETCH_VERSIONS_SUCCESS, SET_COMMENT_TO_DELETE, SET_CONFIRMATION_MODAL, SET_CONTRACT_TEXTS,
    SET_NEW_COMMENT_CONTRACT_TEXT, SET_NEW_COMMENT_IS_SELECTED, SET_NEW_COMMENT_NUMBER, SET_SELECTED_COMMENT,
    SET_SELECTED_VERSION
} from './types'

const handlers = {
    [CHANGE_CONTRACT_TEXT]: (state, { payload }) => ({...state, contract: {...state.contract, newText: payload}}),
    [CHANGE_COMMENT_RESPONSE_TEXT]: (state, { payload }) => {
        return {...state, newComment: {...state.newComment, responseText: payload}}
    },
    [CHANGE_NEW_COMMENT_TEXT]: (state, { payload }) => {
        return {...state, newComment: {...state.newComment, text: payload}}
    },
    [CLEAR_COMMENT_RESPONSE_TEXT]: state => ({...state, newComment: {...state.newComment, responseText: ''}}),
    [CLEAR_NEW_COMMENT]: state => {
        return {...state, newComment: {responseText: '', contractText: '', number: '', text: '', isSelected: false}}
    },
    [CLEAR_NEW_COMMENT_TEXTS_AND_SELECTION]: state => {
        return {...state, newComment: {...state.newComment, contractText: '', text: '', isSelected: false}}
    },
    [CLEAR_SELECTED_COMMENTS]: state => {
        const { comments } = state
        for (let comment of comments) {
            comment['selected'] = false;
        }
        return {...state, comments}
    },
    [FETCH_COMMENTS_SUCCESS]: (state, { payload }) => ({...state, comments: payload}),
    [FETCH_CONTRACT_SUCCESS]: (state, { payload }) => {
        return {...state, contract: {...payload, newText: payload.text}}
    },
    [FETCH_DIALOG_VARIANTS_SUCCESS]: (state, { payload }) => ({...state, dialogVariants: payload}),
    [FETCH_DIALOGS_SUCCESS]: (state, { payload }) => ({...state, dialogs: payload}),
    [FETCH_INVITATION_VARIANTS_SUCCESS]: (state, { payload }) => ({...state, invitationVariants: payload}),
    [FETCH_VERSIONS_SUCCESS]: (state, { payload }) => ({...state, versions: payload}),
    [SET_COMMENT_TO_DELETE]: (state, { payload }) => {
        const { id, number, contractTextAfterRemoval } = payload
        return {...state, commentToDelete: {id, number, contractTextAfterRemoval}}
    },
    [SET_CONFIRMATION_MODAL]: (state, { payload }) => {
        const { headerText, bodyText, btnText, confirmType } = payload;
        return {...state, confirmationModal: {headerText, bodyText, btnText, confirmType}}
    },
    [SET_CONTRACT_TEXTS]: (state, { payload }) => {
        const { text, newText } = payload;
        return {...state, contract: {...state.contract, text, newText}}
    },
    [SET_NEW_COMMENT_CONTRACT_TEXT]: (state, { payload }) => {
        return {...state, newComment: {...state.newComment, contractText: payload}}
    },
    [SET_NEW_COMMENT_NUMBER]: (state, { payload }) => ({...state, newComment: {...state.newComment, number: payload}}),
    [SET_NEW_COMMENT_IS_SELECTED]: state => {
        return {...state, newComment: {...state.newComment, isSelected: true}}
    },
    [SET_SELECTED_COMMENT]: (state, { payload }) => {
        const { comments } = state
        for (let comment of comments) {
            comment['selected'] = comment['number'] === payload;
        }
        return {...state, comments}
    },
    [SET_SELECTED_VERSION]: (state, { payload }) => ({...state, selectedVersion: payload}),
    DEFAULT: state => state
};

export const ContractReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
