import { CHANGE_MESSAGE_TEXT, CLEAR_DIALOG_MODAL, SET_DIALOG_MODAL_RECIPIENTS, SET_MESSAGE_RECIPIENT } from './types'

const handlers = {
    [CHANGE_MESSAGE_TEXT]: (state, { payload }) => ({...state, messageText: payload}),
    [CLEAR_DIALOG_MODAL]: () => ({recipientsChoices: [], messageText: '', selectedRecipient: ''}),
    [SET_DIALOG_MODAL_RECIPIENTS]: (state, { payload }) => {
        const { recipientsChoices, selectedRecipient } = payload;
        return {...state, recipientsChoices, selectedRecipient}
        },
    [SET_MESSAGE_RECIPIENT]: (state, { payload }) => ({...state, selectedRecipient: payload}),
};

export const DialogModalReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
