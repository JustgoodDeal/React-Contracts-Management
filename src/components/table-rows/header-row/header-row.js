import React from 'react';

import './header-row.css';
import TableHeader from "../../table-header";


const HeaderRow = ({ labels }) => {
    return (
        <tr>
            {
                labels.map((label, ind) => {
                    return (
                        <TableHeader
                            key={ind}
                            label={label} />
                    );
                })
            }
        </tr>
    )
};


export default HeaderRow;
