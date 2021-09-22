import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Rule from './Rule';

const RuleGroup = ({ ruleName, rules }) => {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <div
                className="w-100 mt-2 myheader"
                onClick={() => setOpen(!open)}
                aria-controls="option"
                aria-expanded={open}
            >
                {ruleName}
                <FontAwesomeIcon className="f-right m-1" icon="chevron-down" />
            </div>
            <Collapse
                in={open}
            >
                <div className="myframe">
                    {rules.isEmpty && <p>Brak reguł</p>}
                    {rules.map((rule) => (
                        <Rule key={rule.id} rule={rule} />
                    ))}
                    <button className="btn w-100 btn-success btn-sm mt-2">Dodaj nową regułę</button>
                </div>
            </Collapse>
        </div>
    )
}

export default RuleGroup
