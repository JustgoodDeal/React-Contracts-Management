import { SET_USER, CLEAR_USER } from './types'

const handlers = {
    [SET_USER]: (state, { payload }) => ({userName: payload.userName, userId: payload.user_id}),
    [CLEAR_USER]: () => ({userName: '', userId: ''}),
    DEFAULT: state => state
};

export const AuthReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
