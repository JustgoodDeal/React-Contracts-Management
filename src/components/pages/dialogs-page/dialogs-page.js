import React, { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { Paginator } from '../../hoc';
import { DialogsRow } from '../../table-rows'
import { HeaderRow } from '../../table-rows'
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";
import CmService from "../../../services";
import { AuthContext, LoadingAndErrorContext, PaginationAndSortingContext } from '../../../context'
import { DialogsReducer } from "../../../reducers";
import { FETCH_DIALOGS_SUCCESS } from "../../../reducers/types";

import './dialogs-page.css';


const DialogsPage = () => {
    const initialState = {
        dialogs: [],
    };
    const [state, dispatch] = useReducer(DialogsReducer, initialState);

    const { userId } = useContext(AuthContext);
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { currentPage, pagesCount, perPage, fieldName, reverse, setCurrentPageAndPagesCount,
        handleFieldClick } = useContext(PaginationAndSortingContext);
    const { id: contractId } = useParams();

    const service = new CmService();

    const getDialogs = () => {
        setLoading();
        service.getDialogs(contractId, userId, currentPage, perPage, fieldName, reverse)
            .then(({ currentPage: page, pagesCount: pages, dialogs }) => {
                disableLoading();
                setCurrentPageAndPagesCount(page, pages);
                dispatch({
                    type: FETCH_DIALOGS_SUCCESS,
                    payload: dialogs
                })
            })
            .catch(handleError)

    };

    useEffect(() => {
        getDialogs()
    }, [currentPage, pagesCount, perPage, fieldName, reverse]);

    if (error) {
        return <ErrorIndicator />
    }

    if (loading) {
        return <Spinner />
    }

    const { dialogs } = state;
    const tableHeaders = [
        {label: 'Related contract', name: 'contract_id', clickHandler: true},
        {label: 'Latest message', clickHandler: false},
    ];
    return (
        <Paginator
            recordName="Dialogs" >
            <table className="table mt-4">
                <thead>
                    <HeaderRow
                        headers={tableHeaders}
                        handleFieldClick={handleFieldClick} />
                </thead>
                <tbody>
                {
                    dialogs.map((latestMessage, ind) => {
                        return (
                            <DialogsRow
                                key={ind}
                                message={latestMessage} />
                        )
                    })
                }
                </tbody>
            </table>
        </Paginator>
    )
};


export default DialogsPage;
