import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Paginator } from '../../hoc';
import { HeaderRow, NotificationsRow } from '../../table-rows'
import { NotificationModal } from "../../modals";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";
import CmService from "../../../services";
import { AuthContext, LoadingAndErrorContext, NavbarContext, PaginationAndSortingContext } from '../../../context'
import { NotificationsReducer } from "../../../reducers";
import { FETCH_NOTIFICATIONS_SUCCESS, SET_SELECTED_NOTIFICATION } from "../../../reducers/types";

import './notifications-page.css';

const NotificationsPage = () => {
    const initialState = {
        notifications: [],
        selectedNotification: {
            notificationId: '',
            contractId: '',
            isRead: false,
            text: ''
        }
    };
    const [state, dispatch] = useReducer(NotificationsReducer, initialState);

    const { userId } = useContext(AuthContext);
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { updateNewItems } = useContext(NavbarContext);
    const { currentPage, pagesCount, perPage, fieldName, reverse, setCurrentPageAndPagesCount,
        handleFieldClick } = useContext(PaginationAndSortingContext);
    const { id: contractId } = useParams();
    let { location: { search } } = useHistory();
    const { followed_from: followedFrom } = require('query-string').parse(search);

    const service = new CmService();

    const getNotifications = () => {
        setLoading();
        service.getNotifications(contractId, userId, currentPage, perPage, fieldName, reverse)
            .then(({ currentPage: page, pagesCount: pages, notifications }) => {
                disableLoading();
                setCurrentPageAndPagesCount(page, pages);
                dispatch({
                    type: FETCH_NOTIFICATIONS_SUCCESS,
                    payload: notifications
                })
            })
            .catch(handleError)
    };

    const handleShowNotificationClick = (selectedNotification) => {
        dispatch({
            type: SET_SELECTED_NOTIFICATION,
            payload: selectedNotification
        })
    };

    const handleModalClose = () => {
        const { selectedNotification: { notificationId, isRead } } = state;
        if (!isRead) {
            service.makeNotificationRead(notificationId)
                .then((result) => {
                    if (result === 'Changed') {
                        updateNewItems();
                        getNotifications()
                    }
                })
                .catch(handleError)
        }
    };

    useEffect(() => {
        getNotifications()
    }, [currentPage, pagesCount, perPage, fieldName, reverse, followedFrom]);

    if (error) {
        return <ErrorIndicator />
    }
    if (loading) {
        return <Spinner />
    }

    const { notifications, selectedNotification } = state;
    let tableHeaders = [
        {label: 'Related contract', name: 'contract_id', clickHandler: true},
        {label: 'Creation date', name: 'creation_date', clickHandler: true},
        {label: 'Notification is read', name: 'is_read', clickHandler: true},
        {label: 'Actions', clickHandler: false}
    ];
    if (followedFrom === 'contracts') {
        tableHeaders.shift()
    }
    return (
        <Fragment>
            {
                followedFrom === 'contracts' &&
                <nav className="mt-4" aria-label="breadcrumb">
                    <ol className="breadcrumb rounded-0">
                        <li className="breadcrumb-item">
                            <Link to={'/contracts'} >
                                Contracts
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to={`/contract/${contractId}`} >
                                Contract ID {contractId}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            Notifications
                        </li>
                    </ol>
                </nav>
            }
            <Paginator
                recordName="Notifications" >
                <table className="table mt-3">
                    <thead>
                        <HeaderRow
                            headers={tableHeaders}
                            handleFieldClick={handleFieldClick} />
                    </thead>
                    <tbody>
                    {
                        notifications.map((notification, ind) => {
                            return (
                                <NotificationsRow
                                    key={ind}
                                    notification={notification}
                                    handleShowNotificationClick={handleShowNotificationClick}
                                    followedFrom={followedFrom} />
                            )
                        })
                    }
                    </tbody>
                </table>
                <NotificationModal
                    notification={selectedNotification}
                    handleClose={handleModalClose} />
            </Paginator>
        </Fragment>
    )
};


export default NotificationsPage;
