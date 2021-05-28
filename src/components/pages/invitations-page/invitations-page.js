import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { Link, useHistory, useParams} from 'react-router-dom';

import { Paginator } from '../../hoc';
import { HeaderRow, InvitationsRow } from '../../table-rows'
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";
import CmService from "../../../services";
import { AuthContext, LoadingAndErrorContext, NavbarContext, PaginationAndSortingContext } from '../../../context'
import { InvitationsReducer } from "../../../reducers";
import { FETCH_INVITATIONS_SUCCESS } from "../../../reducers/types";

import './invitations-page.css';

const InvitationsPage = () => {
    const initialState = {
        invitations: [],
    };
    const [state, dispatch] = useReducer(InvitationsReducer, initialState);

    const { userId } = useContext(AuthContext);
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { updateNewItems } = useContext(NavbarContext);
    const { currentPage, pagesCount, perPage, fieldName, reverse, setCurrentPageAndPagesCount,
        handleFieldClick } = useContext(PaginationAndSortingContext);
    const { id: contractId } = useParams();
    let { location: { search } } = useHistory();
    const { followed_from: followedFrom } = require('query-string').parse(search);

    const service = new CmService();

    const getInvitations = () => {
        setLoading();
        service.getInvitations(contractId, userId, currentPage, perPage, fieldName, reverse)
            .then(({ currentPage: page, pagesCount: pages, invitations }) => {
                disableLoading();
                setCurrentPageAndPagesCount(page, pages);
                dispatch({
                    type: FETCH_INVITATIONS_SUCCESS,
                    payload: invitations
                })
            })
            .catch(handleError)
    };

    const changeInvitationStatus = (id, newStatus) => {
        service.changeInvitationStatus(id, newStatus)
            .then((result) => {
                if (result === 'Changed') {
                    setTimeout(() => {
                        updateNewItems();
                        getInvitations()
                    }, 500);
                }
            })
            .catch(handleError)
    };

    useEffect(() => {
        getInvitations()
    }, [currentPage, pagesCount, perPage, fieldName, reverse, followedFrom]);

    if (error) {
        return <ErrorIndicator />
    }
    if (loading) {
        return <Spinner />
    }

    const { invitations } = state;
    let tableHeaders = [
        {label: 'Related contract', name: 'contract_id', clickHandler: true},
        {label: 'Creation date', name: 'creation_date', clickHandler: true},
        {label: 'Creator', name: 'creator', clickHandler: true},
        {label: 'Recipient', name: 'recipient', clickHandler: true},
        {label: 'Purpose', name: 'type', clickHandler: true},
        {label: 'Status', name: 'status', clickHandler: true},
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
                                Invitations
                            </li>
                        </ol>
                    </nav>
            }
            <Paginator
                recordName="Invitations" >

                <table className="table mt-4">
                    <thead>
                        <HeaderRow
                            headers={tableHeaders}
                            handleFieldClick={handleFieldClick} />
                    </thead>
                    <tbody>
                    {
                        invitations.map((invitation, ind) => {
                            return (
                                <InvitationsRow
                                    key={ind}
                                    invitation={invitation}
                                    handleActionChoice={changeInvitationStatus}
                                    followedFrom={followedFrom} />
                            )
                        })
                    }
                    </tbody>
                </table>
            </Paginator>
        </Fragment>
    )
};


export default InvitationsPage;
