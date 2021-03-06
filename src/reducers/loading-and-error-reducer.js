import { DISABLE_LOADING, SET_ERROR, SET_LOADING} from './types'

const handlers = {
    [DISABLE_LOADING]: () => ({error: false, loading: false}),
    [SET_ERROR]: () => ({error: true, loading: false}),
    [SET_LOADING]: () => ({error: false, loading: true}),
    DEFAULT: state => state
};

export const LoadingAndErrorReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
