import React from 'react';

import './table-header.css';


const TableHeader = ({ label }) => {
    return (
        <th className="text-center" scope="col">{label}</th>
    );
};


export default TableHeader;
