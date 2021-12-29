import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Table } from 'react-bootstrap';
import { ACTION } from "../../App";
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";

import BoardTemplateChoice from "./BoardTemplateChoice";
import GenotypeAssembly from "./GenotypeAssembly";

const BoardPage = () => {

  const { initialState, state, dispatch } = useContext(AppContext);
  // const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);

  const setCurrentSelection = (selectedIndex) => {
    console.log("now selection is: " + selectedIndex);

    dispatch({ type: ACTION.INITIALIZE_SELECTION, payload: { newId: selectedIndex }});

    // setCurrentSelectedIndex(selectedIndex);
  }

  // useEffect(() => {
  //   EventEmitter.emit(E.board_onTemplateChanged);
  // }, [currentSelectedIndex])

  return (
    <Container fluid>
      <Row>
        <Col lg="3" md="4" sm="4" xs="12">
          <div className="w-100 mt-3 bg-second shadowed-2 p-2">
            {
              state.templates.map((v, k) => {
                if (v == null) return;
                return <BoardTemplateChoice template={v} key={k} keyId={k}
                  _onChange={(e, _k) => e.target.checked && setCurrentSelection(_k)}
                ></BoardTemplateChoice>
              })
            }
          </div>

          <div className="w-100 mt-3 bg-second shadowed-2 p-2">
            <GenotypeAssembly></GenotypeAssembly>
          </div>

        </Col>

        <Col lg="9" md="8" sm="8" xs="12">
          <div className="w-100 mt-3 bg-second shadowed-2 p-2">

          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default BoardPage
