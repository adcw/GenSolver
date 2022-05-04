import React, { useContext, useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Button, Tabs, Tab } from "react-bootstrap";
import { ACTION } from "../../App";
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import Confirm from "../general/Confirm";

import BoardTemplateChoice from "./BoardTemplateChoice";
import GenotypeAssembly from "./GenotypeAssembly";
import GenSelection from "./GenSelection";
import ResultTable from "./ResultTable";
import Statistics from "./Statistics";
import { GenotypeView } from "./visualization/GenotypeView";

const BoardPage = () => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const currState = useRef(state.projects[state.curr]);

  const setCurrentSelection = (selectedIndex) => {
    dispatch({
      type: ACTION.INITIALIZE_SELECTION,
      payload: { newId: selectedIndex },
    });
  };

  const [currentSelectedResult, setCurrentSelectedResult] = useState(null);
  const [currEventKey, setCurrEventKey] = useState("input");
  const [crossData, setCrossData] = useState(currState.current.cross_data);
  const crossResult = useRef(currState.current.cross_data.square); //

  useEffect(() => {
    const crossClickSub = EventEmitter.addListener(
      E.onCrossResultClick,
      (data) => {
        setCurrentSelectedResult(data.genotype);

        data.genotype.map((alletSet) => {
          const dominatingAllel = alletSet[0];
        });

        setCurrEventKey("selection");
      }
    );

    const createPunnetSquareSub = EventEmitter.addListener(
      E.onCreatePunnetSquare,
      () => {
        setCurrentSelectedResult(null);
      }
    );

    return () => {
      crossClickSub.remove();
      createPunnetSquareSub.remove();
    };
  });

  return (
    <Container fluid>
      <Row>
        <Col lg="3" md="4" sm="4" xs="12">
          <Tabs
            activeKey={currEventKey}
            id="action-tabs"
            className="my-tabs"
            onSelect={(k) => setCurrEventKey(k)}
          >
            <Tab eventKey="input" title="Dane wejściowe">
              <div className="w-100 bg-second shadowed-2 p-2">
                {currState.current.templates.length !== 0 ? (
                  currState.current.templates.map((v, k) => {
                    if (v == null) return;
                    return (
                      <BoardTemplateChoice
                        template={v}
                        key={k}
                        keyId={k}
                        _onChange={(e, _k) =>
                          e.target.checked && setCurrentSelection(_k)
                        }
                      ></BoardTemplateChoice>
                    );
                  })
                ) : (
                  <p>
                    Brak szablonów. Utwórz nowy szablon w zakładce "kreator
                    genotypów".
                  </p>
                )}
              </div>
              <div className="w-100 mt-3 bg-second shadowed-2 p-2">
                {currState.current.templates.length != 0 && (
                  <>
                    {currState.current.templates.find(
                      (t) => t.id === currState.current.cross_data.template_id
                    ) &&
                    currState.current.templates.find(
                      (t) => t.id === currState.current.cross_data.template_id
                    ).gene_ids.length != 0 ? (
                      <>
                        <GenotypeAssembly></GenotypeAssembly>
                        <Confirm
                          content={
                            <p>
                              Czy na pewno chcesz stworzyć krzyżówkę? Poprzednie
                              dane zostaną utracone
                            </p>
                          }
                          onConfirm={() =>
                            EventEmitter.emit(E.onCreatePunnetSquare)
                          }
                        >
                          <Button className="text-center w-100 btn-xs mt-3 bg-first btn-outline-dark txt-bright">
                            Stwórz krzyżówkę
                          </Button>
                        </Confirm>
                      </>
                    ) : (
                      <p>Wybrany szablon nie posiada przypisanych genów.</p>
                    )}
                  </>
                )}
              </div>
            </Tab>

            <Tab eventKey="stats" title="Statystyki">
              <div className="w-100 bg-second shadowed-2 p-2">
                <Statistics></Statistics>
              </div>
            </Tab>

            <Tab eventKey="selection" title="Właściwości">
              <div className="w-100 bg-second shadowed-2 p-2">
                <GenSelection
                  genotype={currentSelectedResult}
                  template_id={crossData.template_id}
                ></GenSelection>
              </div>
            </Tab>
          </Tabs>

          {/* <div>

          </div> */}
        </Col>

        <Col lg="9" md="8" sm="8" xs="12">
          <div
            className="w-100 mt-3 bg-second shadowed-2 p-2 overflown-xy flex-center"
            style={{ minHeight: "80vh", justifyContent: "center" }}
          >
            <ResultTable
              crossData={crossData}
              setCrossData={setCrossData}
              crossResult={crossResult}
            ></ResultTable>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BoardPage;
