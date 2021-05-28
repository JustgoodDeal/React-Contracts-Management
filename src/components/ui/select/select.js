import React from 'react';

import './select.css';


const Select = ({ options, value, handleChange }) => {
    return (
        <select className="custom-select" aria-label="Default select example"
                value={value ? value : undefined}
                onChange={event => handleChange(event.target.value)} >
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
