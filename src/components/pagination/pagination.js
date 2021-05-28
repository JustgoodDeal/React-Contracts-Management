import React from 'react';

import './pagination.css';


const Pagination = ({ pagesCount, currentPage, handlePageClick }) => {
    let prevClassName = currentPage > 1 ? "page-item" : "page-item disabled";
    const previous = <li key={0} className={prevClassName}>
        <button className="page-link"
                onClick={currentPage > 1 ? () => handlePageClick(currentPage - 1) : undefined} >
            Previous
        </button>
    </li>;

    let pagesElements = [previous];

    for (let num = 1; num <= pagesCount; num += 1) {
        let itemClassName = num === currentPage ? "page-item active" : "page-item";
        let item = <li key={num} className={itemClassName}>
            <button className="page-link"
                    onClick={num !== currentPage ? () => handlePageClick(num) : undefined} >
                {num}
            </button>
        </li>;
        pagesElements.push(item)
    }

    let nextClassName = currentPage !== pagesCount ? "page-item" : "page-item disabled";
    const next = <li key={pagesCount + 1} className={nextClassName}>
        <button className="page-link"
                onClick={currentPage !== pagesCount ? () => handlePageClick(currentPage + 1) : undefined}>
            Next
        </button>
    </li>;

    pagesElements.push(next);

    return (
        <nav className="d-flex justify-content-center" aria-label="...">
            <ul className="pagination">
                {pagesElements}
            </ul>
        </nav>
    )

};

export default Pagination;
