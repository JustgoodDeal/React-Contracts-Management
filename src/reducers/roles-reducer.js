import { FETCH_EMPLOYEE_ROLES_SUCCESS, SET_EMPLOYEE_ROLE, SET_ERROR, SET_SUCCESS } from './types'

const handlers = {
    [FETCH_EMPLOYEE_ROLES_SUCCESS]: (state, { payload }) => {
        for (let employeeInfo of payload) {
            employeeInfo['selectedRole'] = employeeInfo['savedRole']
        }
        return {employeesInfo: payload, success: '', validationError: ''}
    },
    [SET_EMPLOYEE_ROLE]: (state, { payload }) => {
        const { employeesInfo } = state
        const { employeeId, role } = payload
        for (let employeeInfo of employeesInfo) {
            if (employeeInfo['employeeId'] === employeeId) {
                employeeInfo['selectedRole'] = role
            }
        }
        return {employeesInfo, success: '', validationError: ''}
    },
    [SET_ERROR]: (state, { payload }) => ({...state, validationError: payload}),
    [SET_SUCCESS]: (state, { payload }) => ({...state, success: payload}),
    DEFAULT: state => state
};

export const RolesReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};