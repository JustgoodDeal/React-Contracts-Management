import { CLEAR_CONTRACT_TO_DELETE, FETCH_CONTRACTS_SUCCESS, SET_CONTRACT_TO_DELETE } from './types'

const handlers = {
    [CLEAR_CONTRACT_TO_DELETE]: state => ({...state, contractToDelete: ''}),
    [FETCH_CONTRACTS_SUCCESS]: (state, { payload }) => ({...state, contracts: payload}),
    [SET_CONTRACT_TO_DELETE]: (state, { payload }) => ({...state, contractToDelete: payload}),
    DEFAULT: state => state
};

export const ContractsReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
