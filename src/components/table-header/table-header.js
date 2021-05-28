import React from 'react';

import './table-header.css';


const TableHeader = ({ header, handleFieldClick }) => {
    const { label, name, clickHandler } = header;
    return (
        <th className="text-center" scope="col">
            {
                clickHandler
                    ? <span className="label-link" onClick={() => handleFieldClick(name)}>{label}</span>
                    : <span>{header.label}</span>
            }
        </th>
    );
};


export default TableHeader;
