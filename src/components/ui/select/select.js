import React from 'react';

import './select.css';


const Select = ({ options }) => {
    return (
        <select className="custom-select" aria-label="Default select example">
            {   options.map((option, ind) => {
                    return (
                        <option
                            value={option.value}
                            key={ind}
                        >
                            {option.text}
                        </option>
                    )
                })
            }
        </select>
    );
};


export default Select;
