import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Table } from 'react-bootstrap';
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";

import BoardTemplateChoice from "./BoardTemplateChoice";
import GenotypeAssembly from "./GenotypeAssembly";

const BoardPage = () => {

  const getDefaultGenotype = () => {
    return state.templates[currentSelectedIndex].gene_ids.map((geneId, k) => {
      return {
        geneId: geneId,
        allel_1: 0,
        allel_2: 0
      }
    })
  }

  const { initialState, state, dispatch } = useContext(AppContext);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);

  const [genotypeA, setGenotypeA] = useState(getDefaultGenotype);
  const [genotypeB, setGenotypeB] = useState(getDefaultGenotype);

  const setCurrentSelection = (selectedIndex) => {
    console.log("now selection is: " + selectedIndex);

    setCurrentSelectedIndex(selectedIndex);

    setGenotypeA(getDefaultGenotype());
    setGenotypeB(getDefaultGenotype());
  }

  useEffect(() => {
    setGenotypeA(getDefaultGenotype());
    setGenotypeB(getDefaultGenotype());
    EventEmitter.emit(E.board_onTemplateChanged);
  }, [currentSelectedIndex])

  return (
    <Container fluid>
      <Row>
        <Col lg="3" md="4" sm="4" xs="12">
          <div className="w-100 mt-3 bg-second shadowed-2 p-2">
            {
              state.templates.map((v, k) => {
                if (v == null) return;
                return <BoardTemplateChoice template={v} key={k} keyId={k} selected={k === currentSelectedIndex}
                  _onChange={(e, _k) => e.target.checked && setCurrentSelection(_k)}
                ></BoardTemplateChoice>
              })
            }
          </div>

          <div className="w-100 mt-3 bg-second shadowed-2 p-2">
            <GenotypeAssembly currentSelectedIndex={currentSelectedIndex}
              genotypeA={genotypeA}
              genotypeB={genotypeB}
              setGenotypeA={setGenotypeA}
              setGenotypeB={setGenotypeB}
              getDefalutGenotype={getDefaultGenotype}
            ></GenotypeAssembly>
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
