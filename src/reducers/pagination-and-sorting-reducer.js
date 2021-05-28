import { CLEAR_PAGINATION_AND_SORTING, SET_CURRENT_PAGE, SET_CURRENT_PAGE_AND_PAGES_COUNT,
    SET_CURRENT_PAGE_AND_PER_PAGE, SET_SORTING } from './types'

const handlers = {
    [CLEAR_PAGINATION_AND_SORTING]: () => {
        return {
            pagination: {currentPage: 1, pagesCount: 1, perPage: 10},
            sorting: {fieldName: '', reverse: true}
        }
    },
    [SET_CURRENT_PAGE]: (state, { payload }) => {
        return {
            pagination: {...state.pagination, currentPage: payload},
            sorting: {...state.sorting}
        }
    },
    [SET_CURRENT_PAGE_AND_PAGES_COUNT]: (state, { payload }) => {
        const { currentPage, pagesCount } = payload;
        return {
            pagination: {...state.pagination, currentPage, pagesCount},
            sorting: {...state.sorting}
        }
    },
    [SET_CURRENT_PAGE_AND_PER_PAGE]: (state, { payload }) => {
        return {
            pagination: {...state.pagination, currentPage: 1, perPage: payload},
            sorting: {...state.sorting}
        }
    },
    [SET_SORTING]: (state, {payload}) => {
        const reverse = state.sorting.fieldName === payload ? !state.sorting.reverse : false;
        return {
            pagination: {...state.pagination},
            sorting: {fieldName: payload, reverse}
        }
    },
    DEFAULT: state => state
};

export const PaginationAndSortingReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action)
};
