import React, {useContext, useReducer} from 'react';
import { useHistory } from "react-router-dom";

import CmService from "../../../services";
import { AuthContext, LoadingAndErrorContext, NavbarContext } from "../../../context";
import { CHANGE_USERNAME, SET_USER_NOT_EXIST } from "../../../reducers/types";
import { LoginReducer } from "../../../reducers";
import ErrorIndicator from "../../error-indicator";

import './login-page.css';


const LoginPage = () => {

    const initialState = {
        userExist: true,
        userName: '',
    };
    const [state, dispatch] = useReducer(LoginReducer, initialState);
    const { userExist, userName } = state;

    const { logIn } = useContext(AuthContext);
    const { error, handleError } = useContext(LoadingAndErrorContext);
    const { changeActiveLink } = useContext(NavbarContext);

    const service = new CmService();

    let history = useHistory();

    const handleFormSubmit = event => {
        event.preventDefault();
        service.getUser(userName)
            .then((user_id) => {
                if (user_id) {
                    logIn({userName, user_id});
                    changeActiveLink('Home');
                    history.push('/');
                } else {
                    dispatch({
                        type: SET_USER_NOT_EXIST,
                    });
                }
            })
            .catch(handleError)
    };

    const handleUserNameChange = event => {
        dispatch({
            type: CHANGE_USERNAME,
            payload: event.target.value
        });
    };

    if (error) {
        return <ErrorIndicator />
    }

    return (
        <form className="authorization-form d-flex flex-column align-items-center" onSubmit={handleFormSubmit}>
            {
                (!userExist)
                    ? <p className="text-danger"> User doesn't exist </p>
                    : null
            }
            <div className="d-flex align-items-center">
                <label htmlFor="usernameLogin" className="fw-bold mr-3">Username</label>
                <input type="text" id="usernameLogin" className="form-control" placeholder="Enter your username" name="login"
                       onChange={handleUserNameChange} />
            </div>
            <button type="submit" className="btn btn-success mt-4">Log in</button>
        </form>
    )
};


export default LoginPage;
