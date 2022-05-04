import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AppContext } from "../../AppContextProvider";

const BoardTemplateChoice = ({ keyId, template, _onChange }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  return (
    <>
      <div className="comtainer-fluid">
        <Row className="py-0">
          <Col className="py-0">
            <span className="d-flex">
              <input
                id={`ch${keyId}`}
                type="checkbox"
                className="form-check-input check-input"
                checked={template.id === currState.cross_data.template_id}
                onChange={(e) => _onChange(e, keyId)}
              ></input>
              <label htmlFor={`ch${keyId}`}>{template.name}</label>
            </span>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BoardTemplateChoice;
