import React from "react"
import { Container, Row, Col } from "react-bootstrap"


const BoardTemplateChoice = ({ keyId, template, selected, _onChange }) => {

  return (
    <>
        <div className="comtainer-fluid">
          <Row className="py-0">
            <Col className="py-0">

              <span className="d-flex">
                <input id={`ch${keyId}`} type="checkbox" className="form-check-input check-input" defaultChecked={selected}
                  onChange={(e) => _onChange(e, keyId)}
                ></input>
                <label htmlFor={`ch${keyId}`}>{ template.name }</label>
              </span>

            </Col>
          </Row>
        </div>
        {/* {
          JSON.stringify(template)
        } */}
    </>
  )
}

export default BoardTemplateChoice
