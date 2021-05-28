import React, { Fragment, useContext } from 'react';
import {BrowserRouter, Route, Switch as BaseSwitch } from 'react-router-dom';
import flattenChildren from "react-flatten-children";

import ErrorBoundry from "../error-boundry";
import { AuthContext, LoadingAndErrorProvider, NavbarProvider, PaginationAndSortingProvider } from '../../context';
import Navbar from '../navbar';
import { ContractCreationPage, ContractDetailsPage, ContractsPage, DialogPage, DialogsPage, HomePage, InvitationsPage,
    LoginPage, NotFoundPage, NotificationsPage } from '../pages';

import './app.css';


const Switch = ({ children }) => (
    <BaseSwitch>{flattenChildren(children)}</BaseSwitch>
);

const App = () => {

    const { userName } = useContext(AuthContext);

    return (
        <ErrorBoundry>
            <LoadingAndErrorProvider>
                <NavbarProvider>
                    <PaginationAndSortingProvider>
                        <BrowserRouter>
                            <Navbar/>
                            <Switch>
                                <Route path="/" exact component={HomePage}/>
                                <Route path="/login" component={LoginPage}/>
                                {
                                    (userName)
                                        ? (
                                            <Fragment>
                                                <Route path="/contract/create" component={ContractCreationPage}/>
                                                <Route path="/contracts" component={ContractsPage}/>
                                                <Route path="/contract/:id" component={ContractDetailsPage}/>
                                                <Route path={["/invitations/contract/:id", "/invitations"]}
                                                       component={InvitationsPage} />
                                                <Route path="/dialogs" component={DialogsPage}/>
                                                <Route path="/dialog/:id" component={DialogPage}/>
                                                <Route path={["/notifications/contract/:id", "/notifications"]}
                                                       component={NotificationsPage} />
                                            </Fragment>
                                        )
                                        : null
                                }
                                <Route component={NotFoundPage}/>
                            </Switch>
                        </BrowserRouter>
                    </PaginationAndSortingProvider>
                </NavbarProvider>
            </LoadingAndErrorProvider>
        </ErrorBoundry>
    );
};


export default App;
