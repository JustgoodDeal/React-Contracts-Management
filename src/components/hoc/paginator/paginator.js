import React, {Fragment, useContext} from 'react';

import { Select } from "../../ui";
import Pagination from "../../pagination";
import { PaginationAndSortingContext } from "../../../context";

import './paginator.css';

const Paginator = ({ recordName, children }) => {
    const { currentPage, pagesCount, perPage, handlePageClick,
        handlePerPageChange } = useContext(PaginationAndSortingContext);
    const perPageChoices = ['10', '15', '20', '25'].map(count => ({value: count, text: count}));

    return (
        <Fragment>
            <div className="per-page d-flex align-items-center justify-content-center mt-2">
                <p className="mr-2">{recordName} per page: </p>
                <Select
                    options={perPageChoices}
                    value={perPage}
                    handleChange={handlePerPageChange}/>
            </div>
                    {children}
            <Pagination pagesCount={pagesCount}
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}/>
        </Fragment>
    )
};


export default Paginator;
