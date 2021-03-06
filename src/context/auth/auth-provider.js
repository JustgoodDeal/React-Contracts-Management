import React, { useReducer } from 'react';

import { AuthContext } from './auth-context'
import { AuthReducer } from "../../reducers";
import { SET_USER, CLEAR_USER } from '../../reducers/types'


const AuthProvider = ({ children }) => {
    const initialState = {
        userName: '',
        userId: '',
    };
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const logIn = (userInfo) => dispatch({type: SET_USER, payload: userInfo});
    const logOut = () => dispatch({type: CLEAR_USER});

    const { userName, userId } = state;

    return (
        <AuthContext.Provider value={{
            userName, userId, logIn, logOut
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider
