import { CHANGE_MESSAGE_TEXT, CLEAR_MESSAGE_TEXT, FETCH_DIALOG_SUCCESS } from './types'

const handlers = {
    [CLEAR_MESSAGE_TEXT]: state => ({...state, messageText: ''}),
    [CHANGE_MESSAGE_TEXT]: (state, { payload }) => ({...state, messageText: payload}),
    [FETCH_DIALOG_SUCCESS]: (state, { payload }) => ({...state, ...payload}),
    DEFAULT: state => state
};

export const DialogReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
