import React, { useContext, useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Button, Tabs, Tab } from 'react-bootstrap';
import { ACTION } from "../../App";
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import Confirm from "../general/Confirm";

import BoardTemplateChoice from "./BoardTemplateChoice";
import GenotypeAssembly from "./GenotypeAssembly";
import GenSelection from "./GenSelection";
import ResultTable from "./ResultTable";
import { GenotypeView } from "./visualization/GenotypeView";

const BoardPage = () => {

  const { initialState, state, dispatch } = useContext(AppContext);

  const setCurrentSelection = (selectedIndex) => {
    dispatch({ type: ACTION.INITIALIZE_SELECTION, payload: { newId: selectedIndex } })
  }

  const [currentSelectedResult, setCurrentSelectedResult] = useState(null)
  const [currEventKey, setCurrEventKey] = useState("input")
  const [crossData, setCrossData] = useState(state.cross_data)
  const crossResult = useRef(null)

  useEffect(() => {
    const crossClickSub = EventEmitter.addListener(E.onCrossResultClick, (data) => {
      setCurrentSelectedResult(data.genotype)

      data.genotype.map((alletSet) => {
        const dominatingAllel = alletSet[0]
      })

      setCurrEventKey("selection")
    })

    const createPunnetSquareSub = EventEmitter.addListener(E.onCreatePunnetSquare, () => {
      setCurrentSelectedResult(null)
    })

    return () => {
      crossClickSub.remove()
      createPunnetSquareSub.remove()
    }
  })

  return (
    <Container fluid>
      <Row>

        <Col lg="3" md="4" sm="4" xs="12">

          <Tabs activeKey={currEventKey} id="action-tabs" className="my-tabs" onSelect={(k) => setCurrEventKey(k)}>
            <Tab eventKey="input" title="Dane wejściowe">
              <div className="w-100 bg-second shadowed-2 p-2">
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

                <Confirm content={
                  <p>Czy na pewno chcesz stworzyć krzyżówkę? Poprzednie dane zostaną utracone</p>
                }
                  onConfirm={() => EventEmitter.emit(E.onCreatePunnetSquare)}
                >
                  <Button className="text-center w-100 btn-xs mt-3 bg-first btn-outline-dark txt-bright">Stwórz krzyżówkę</Button>
                </Confirm>


              </div>
            </Tab>

            <Tab eventKey="stats" title="Statystyki">
              <div className="w-100 bg-second shadowed-2 p-2">
                Statystyki
              </div>
            </Tab>

            <Tab eventKey="selection" title="Właściwości">
              <div className="w-100 bg-second shadowed-2 p-2">
                <GenSelection genotype={currentSelectedResult} template_id={crossData.template_id}></GenSelection>
              </div>
            </Tab>
          </Tabs>

          {/* <div>

          </div> */}

        </Col>

        <Col lg="9" md="8" sm="8" xs="12">
          <div className="w-100 mt-3 bg-second shadowed-2 p-2 overflown-xy">
            <ResultTable crossData={crossData} setCrossData={setCrossData} crossResult={crossResult}></ResultTable>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default BoardPage
