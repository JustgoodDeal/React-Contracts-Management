import React, { useReducer } from 'react';

import { LoadingAndErrorContext } from './loading-and-error-context'
import { LoadingAndErrorReducer } from "../../reducers";
import { DISABLE_LOADING, SET_ERROR, SET_LOADING } from '../../reducers/types'


const LoadingAndErrorProvider = ({ children }) => {
    const initialState = {
        loading: false,
        error: false,
    };
    const [state, dispatch] = useReducer(LoadingAndErrorReducer, initialState);

    const disableLoading = () => dispatch({type: DISABLE_LOADING});
    const setLoading = () => dispatch({type: SET_LOADING});
    const handleError = err => {
        console.log(err);
        dispatch({
            type: SET_ERROR,
        });
    };

    const { error, loading } = state;

    return (
        <LoadingAndErrorContext.Provider value={{
            error, loading, setLoading, disableLoading, handleError
        }}>
            {children}
        </LoadingAndErrorContext.Provider>
    )
};

export default LoadingAndErrorProvider
