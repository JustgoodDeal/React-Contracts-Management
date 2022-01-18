import React, { Fragment, useContext, useEffect, useReducer } from 'react';

import { Paginator } from '../../hoc';
import { AuthContext, LoadingAndErrorContext, PaginationAndSortingContext } from '../../../context'
import CmService from '../../../services'
import { CLEAR_CONTRACT_TO_DELETE, FETCH_CONTRACTS_SUCCESS, SET_CONTRACT_TO_DELETE } from '../../../reducers/types'
import { ContractsRow, HeaderRow } from '../../table-rows'
import { ConfirmationModal } from '../../modals'
import { ContractsReducer } from "../../../reducers";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";


import './contracts-page.css';


const ContractsPage = () => {
    const initialState = {
        contracts: [],
        contractToDelete: '',
    };
    const [state, dispatch] = useReducer(ContractsReducer, initialState);

    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { userId } = useContext(AuthContext);
    const { currentPage, pagesCount, perPage, fieldName, reverse, setCurrentPageAndPagesCount,
        handleFieldClick } = useContext(PaginationAndSortingContext);

    const service = new CmService();

    const getContracts = () => {
        setLoading();
        service.getContracts(userId, currentPage, perPage, fieldName, reverse)
            .then(({ currentPage: page, pagesCount: pages, contracts }) => {
                disableLoading();
                setCurrentPageAndPagesCount(page, pages);
                dispatch({
                    type: FETCH_CONTRACTS_SUCCESS,
                    payload: contracts
                })
            })
            .catch(handleError)
    };

    const handleDeleteClick = id => {
        dispatch({
            type: SET_CONTRACT_TO_DELETE,
            payload: id
        });
    };

    const confirmDelete = () => {
        service.deleteContract(state.contractToDelete)
            .then(response => {
                if (response === 'Deleted') {
                    setTimeout(() => {
                        dispatch({
                            type: CLEAR_CONTRACT_TO_DELETE
                        });
                        getContracts()
                    }, 500);
                }
            })
            .catch(handleError)
    };

    const cancelDelete = () => {
        dispatch({
            type: CLEAR_CONTRACT_TO_DELETE
        });
    };

    useEffect(() => {
        getContracts()
    }, [currentPage, pagesCount, perPage, fieldName, reverse]);

    if (error) {
        return <ErrorIndicator />
    }
    if (loading) {
        return <Spinner />
    }

    const { contracts } = state;
    const tableHeaders = [
        {label: 'ID', name: '_id', clickHandler: true},
        {label: 'Creation date', name: 'creation_date', clickHandler: true},
        {label: 'Companies involved', clickHandler: false},
        {label: 'Status', name: 'status', clickHandler: true},
        {label: 'Actions', clickHandler: false}
    ];
    return (
        <Fragment>
            <Paginator
                recordName="Contracts" >
                <table className="table mt-4">
                    <thead>
                        <HeaderRow
                            headers={tableHeaders}
                            handleFieldClick={handleFieldClick} />
                    </thead>
                    <tbody>
                    {
                        contracts.map(contract => {
                            return (
                                <ContractsRow
                                    key={contract.id}
                                    contract={contract}
                                    handleDeleteClick={handleDeleteClick} />
                            )
                        })
                    }
                    </tbody>
                </table>
                <ConfirmationModal
                    id='confirmationModal'
                    headerText='Are you sure?'
                    bodyText='Selected contract will be permanently removed'
                    btnText='Remove'
                    handleCancel={cancelDelete}
                    handleConfirm={confirmDelete} />
            </Paginator>
        </Fragment>
    )
};


export default ContractsPage;
