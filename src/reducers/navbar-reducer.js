import { CHANGE_ACTIVE_LINK, UPDATE_NEW_ITEMS } from './types'

const handlers = {
    [CHANGE_ACTIVE_LINK]: (state, { payload }) => {
        let links = state.map(link => ({...link}));
        return links.map(link => {
            link.className = link.label === payload ? 'nav-link active' : 'nav-link';
            return link
        });
    },
    [UPDATE_NEW_ITEMS]: (state, { payload }) => {
        let links = state.map(link => ({...link}));
        return links.map(link => {
            if (link.label in payload) {
                link.newItem = payload[link.label]
            }
            return link
        });
    },
    DEFAULT: state => state
};

export const NavbarReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
