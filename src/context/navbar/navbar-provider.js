import React, { useContext, useReducer } from 'react';

import CmService from '../../services'
import { AuthContext } from '../'
import { NavbarContext } from './navbar-context'
import { NavbarReducer } from "../../reducers";
import { CHANGE_ACTIVE_LINK, UPDATE_NEW_ITEMS } from '../../reducers/types'


const NavbarProvider = ({ children }) => {
    const initialState = [
        {label: 'Home', className: 'nav-link active'},
        {linkTo: '/contract/create', label: 'Create contract', className: 'nav-link', newItem: false},
        {linkTo: '/contracts', label: 'Contracts', className: 'nav-link', newItem: false},
        {linkTo: '/invitations', label: 'Invitations', className: 'nav-link', newItem: false},
        {linkTo: '/dialogs', label: 'Dialogs', className: 'nav-link', newItem: false},
        {linkTo: '/notifications', label: 'Notifications', className: 'nav-link', newItem: false},
        {label: 'Log in', className: 'nav-link'},
    ];
    const [state, dispatch] = useReducer(NavbarReducer, initialState);

    const { userId } = useContext(AuthContext);

    const changeActiveLink = activeLinkLabel => dispatch({type: CHANGE_ACTIVE_LINK, payload: activeLinkLabel});

    const updateNewItems = () => {
        const service = new CmService();
        service.checkNewItems(userId)
            .then(result => {
                dispatch({type: UPDATE_NEW_ITEMS, payload: result})
            })
            .catch(err => console.log(err))
    };

    return (
        <NavbarContext.Provider value={{
            links: state, changeActiveLink, updateNewItems
        }}>
            {children}
        </NavbarContext.Provider>
    )
};

export default NavbarProvider
