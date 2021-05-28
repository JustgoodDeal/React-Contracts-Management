import { FETCH_NOTIFICATIONS_SUCCESS, SET_SELECTED_NOTIFICATION } from './types'

const handlers = {
    [FETCH_NOTIFICATIONS_SUCCESS]: (state, { payload }) => ({...state, notifications: payload}),
    [SET_SELECTED_NOTIFICATION]: (state, { payload }) => ({...state, selectedNotification: payload}),
    DEFAULT: state => state
};

export const NotificationsReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
