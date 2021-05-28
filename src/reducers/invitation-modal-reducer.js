import { CHANGE_INVITATION_COMPANIES_CHOICES, CLEAR_INVITATION_MODAL, SET_INVITATION_COMPANY,
    SET_INVITATION_MODAL, SET_INVITATION_REASON } from './types'

const handlers = {
    [CHANGE_INVITATION_COMPANIES_CHOICES]: (state, { payload }) => ({...state, companiesChoices: payload}),
    [CLEAR_INVITATION_MODAL]: () => {
        return {reasonsChoices: [], companiesChoices: [], selectedReason: '', selectedCompany: ''}
        },
    [SET_INVITATION_MODAL]: (state, { payload }) => {
        const { reasonsChoices, companiesChoices, selectedReason, selectedCompany } = payload;
        return {reasonsChoices, companiesChoices, selectedReason, selectedCompany}
    },
    [SET_INVITATION_COMPANY]: (state, { payload }) => ({...state, selectedCompany: payload}),
    [SET_INVITATION_REASON]: (state, { payload }) => ({...state, selectedReason: payload})
};

export const InvitationModalReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
