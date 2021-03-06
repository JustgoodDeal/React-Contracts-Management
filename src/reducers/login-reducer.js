import { CHANGE_USERNAME, SET_USER_NOT_EXIST } from './types'

const handlers = {
    [CHANGE_USERNAME]: (state, { payload }) => ({...state, userName: payload}),
    [SET_USER_NOT_EXIST]: (state) => ({...state, userExist: false}),
    DEFAULT: state => state
};

export const LoginReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
