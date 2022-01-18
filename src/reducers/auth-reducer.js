import { SET_USER, CLEAR_USER } from './types'

const handlers = {
    [SET_USER]: (state, { payload }) => {
        const { userName, userId, userRole } = payload
        return {userName, userId, userRole}
    },
    [CLEAR_USER]: () => ({userName: '', userId: '', userRole: ''}),
    DEFAULT: state => state
};

export const AuthReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
