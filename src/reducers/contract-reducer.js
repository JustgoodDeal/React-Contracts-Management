import { CHANGE_CONTRACT_TEXT, FETCH_CONTRACT_SUCCESS, FETCH_DIALOG_VARIANTS_SUCCESS, FETCH_DIALOGS_SUCCESS,
    FETCH_INVITATION_VARIANTS_SUCCESS, FETCH_VERSIONS_SUCCESS, SET_CONFIRMATION_MODAL,
    SET_SELECTED_VERSION } from './types'

const handlers = {
    [CHANGE_CONTRACT_TEXT]: (state, { payload }) => ({...state, contract: {...state.contract, newText: payload}}),
    [FETCH_CONTRACT_SUCCESS]: (state, { payload }) => {
        return {...state, contract: {...payload, newText: payload.text}}
        },
    [FETCH_DIALOG_VARIANTS_SUCCESS]: (state, { payload }) => ({...state, dialogVariants: payload}),
    [FETCH_DIALOGS_SUCCESS]: (state, { payload }) => ({...state, dialogs: payload}),
    [FETCH_INVITATION_VARIANTS_SUCCESS]: (state, { payload }) => ({...state, invitationVariants: payload}),
    [FETCH_VERSIONS_SUCCESS]: (state, { payload }) => ({...state, versions: payload}),
    [SET_CONFIRMATION_MODAL]: (state, { payload }) => {
        const { headerText, bodyText, btnText, confirmType } = payload;
        return {...state, confirmationModal: {headerText, bodyText, btnText, confirmType}}
        },
    [SET_SELECTED_VERSION]: (state, { payload }) => ({...state, selectedVersion: payload}),
    DEFAULT: state => state
};

export const ContractReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
