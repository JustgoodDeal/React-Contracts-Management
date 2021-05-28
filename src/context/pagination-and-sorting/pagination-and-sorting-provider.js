import React, { useReducer } from 'react';

import { PaginationAndSortingContext } from './pagination-and-sorting-context'
import { PaginationAndSortingReducer } from "../../reducers";
import {
    CLEAR_PAGINATION_AND_SORTING, SET_CURRENT_PAGE, SET_CURRENT_PAGE_AND_PAGES_COUNT,
    SET_CURRENT_PAGE_AND_PER_PAGE, SET_SORTING
} from '../../reducers/types'


const PaginationAndSortingProvider = ({ children }) => {
    const initialState = {
        pagination: {
            currentPage: 1,
            pagesCount: 1,
            perPage: 10
        },
        sorting: {
            fieldName: '',
            reverse: true
        }
    };
    const [state, dispatch] = useReducer(PaginationAndSortingReducer, initialState);

    const clearPaginationAndSorting = () => dispatch({type: CLEAR_PAGINATION_AND_SORTING});

    const handlePageClick = page => dispatch({type: SET_CURRENT_PAGE, payload: page});

    const handlePerPageChange = perPage => dispatch({type: SET_CURRENT_PAGE_AND_PER_PAGE, payload: Number(perPage)});

    const setCurrentPageAndPagesCount = (currentPage, pagesCount) => {
        dispatch({
            type: SET_CURRENT_PAGE_AND_PAGES_COUNT,
            payload: {currentPage, pagesCount}
        })
    };

    const handleFieldClick = fieldName => {
        dispatch({type: SET_CURRENT_PAGE, payload: 1});
        dispatch({type: SET_SORTING, payload: fieldName});
    };

    const { pagination: { currentPage, pagesCount, perPage }, sorting: {fieldName, reverse} } = state;

    return (
        <PaginationAndSortingContext.Provider value={{
            currentPage, pagesCount, perPage, fieldName, reverse, clearPaginationAndSorting, handlePageClick,
            handlePerPageChange, setCurrentPageAndPagesCount, handleFieldClick
        }}>
            {children}
        </PaginationAndSortingContext.Provider>
    )
};

export default PaginationAndSortingProvider
