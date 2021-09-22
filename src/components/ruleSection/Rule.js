import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Col, ToggleButton } from 'react-bootstrap'

const Rule = ({ rule }) => {

    return (
        <div>
            {/* <p>Allele:</p> */}
            <Form className="d-flex pt-2">
                
                <p className="mr-3">Allele: </p>
                <Form.Control type="text" className="short-input" defaultValue={rule.allels[0].value}/>
                <ToggleButton name={"rule-"+rule.id} className="mr-3" variant="outline-success">
                    <FontAwesomeIcon icon="star"></FontAwesomeIcon>
                </ToggleButton>

                <Form.Control type="text" className="short-input" defaultValue={rule.allels[1].value}/>
                <ToggleButton name={"rule-"+rule.id} variant="success">
                    <FontAwesomeIcon icon="star"></FontAwesomeIcon>
                </ToggleButton>

            </Form>
        </div>
    )
}

export default Rule
