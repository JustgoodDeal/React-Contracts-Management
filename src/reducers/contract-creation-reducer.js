import { ADD_CONTRACT_COMPANIES, CHANGE_CONTRACT_TEXT, FETCH_COMPANIES_SUCCESS } from './types'

const handlers = {
    [ADD_CONTRACT_COMPANIES]: (state, { payload }) => {
        return {...state, contract: {...state.contract, companies: payload}}
        },
    [CHANGE_CONTRACT_TEXT]: (state, { payload }) => ({...state, contract: {...state.contract, text: payload}}),
    [FETCH_COMPANIES_SUCCESS]: (state, { payload }) => {
        const { defaultCompanies, companiesToChoose } = payload;
        return {...state, defaultCompanies, companiesToChoose}
        },
    DEFAULT: state => state
};

export const ContractCreationReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
