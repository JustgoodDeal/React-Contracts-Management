import { FETCH_INVITATIONS_SUCCESS } from './types'

const handlers = {
    [FETCH_INVITATIONS_SUCCESS]: (state, { payload }) => ({invitations: payload}),
    DEFAULT: state => state
};

export const InvitationsReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
