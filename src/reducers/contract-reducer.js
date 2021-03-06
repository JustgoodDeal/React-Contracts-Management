import { FETCH_CONTRACT_SUCCESS, SET_CONFIRMATION_MODAL } from './types'

const handlers = {
    [FETCH_CONTRACT_SUCCESS]: (state, { payload }) => {
        const { contract, companiesAcceptances, actionOnStatus } = payload;
        return {...state, contract, companiesAcceptances, actionOnStatus}
        },
    [SET_CONFIRMATION_MODAL]: (state, { payload }) => {
        const { bodyText, btnText, confirmType } = payload;
        return {...state, confirmationModal: {bodyText, btnText, confirmType}}
    },
    DEFAULT: state => state
};

export const ContractReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
