import { FETCH_DIALOGS_SUCCESS } from './types'

const handlers = {
    [FETCH_DIALOGS_SUCCESS]: (state, { payload }) => ({dialogs: payload}),
    DEFAULT: state => state
};

export const DialogsReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
