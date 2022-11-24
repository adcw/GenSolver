import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import useDimensions from "use-element-dimensions";
import { ACTION, AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import Confirm from "../general/Confirm";

import BoardTemplateChoice from "./BoardTemplateChoice";
import GenotypeAssembly from "./GenotypeAssembly";
import GenSelection from "./GenSelection";
import ResultTable from "./ResultTable";
import Statistics from "./Statistics";

const BoardPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  const setCurrentSelection = (selectedIndex) => {
    dispatch({
      type: ACTION.INITIALIZE_SELECTION,
      payload: { newId: selectedIndex },
    });
  };

  const [currentSelectedResult, setCurrentSelectedResult] = useState(null);
  const [currEventKey, setCurrEventKey] = useState("input");
  const [crossData, setCrossData] = useState(currState.cross_data);
  const crossResult = useRef(currState.cross_data?.square); //

  const [centered, setCentered] = useState(true);
  const [{ width, height }, ref] = useDimensions();

  useEffect(() => {
    const crossClickSub = EventEmitter.addListener(
      E.onCrossResultClick,
      (data) => {
        setCurrentSelectedResult(data.genotype);

        // data.genotype.map((alletSet) => {
        //   const dominatingAllel = alletSet[0];
        // });

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
                {currState.templates.length !== 0 ? (
                  currState.templates
                    .map((v, k) => {
                      if (v === null) return null;
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
                    .filter((val) => val)
                ) : (
                  <p>
                    Brak szablonów. Utwórz nowy szablon w zakładce "kreator
                    genotypów".
                  </p>
                )}
              </div>
              <div className="w-100 mt-3 bg-second shadowed-2 p-2">
                {currState.cross_data && currState.templates.length !== 0 && (
                  <>
                    {currState.templates.find(
                      (t) => t.id === currState.cross_data.template_id
                    ) &&
                    currState.templates.find(
                      (t) => t.id === currState.cross_data.template_id
                    ).gene_ids.length !== 0 ? (
                      <>
                        <GenotypeAssembly />
                        {currState.cross_data.square ? (
                          <Confirm
                            content={
                              <p>
                                Czy na pewno chcesz stworzyć krzyżówkę?
                                Poprzednie dane zostaną utracone
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
                        ) : (
                          <Button
                            onClick={() =>
                              EventEmitter.emit(E.onCreatePunnetSquare)
                            }
                            className="text-center w-100 btn-xs mt-3 bg-first btn-outline-dark txt-bright"
                          >
                            Stwórz krzyżówkę
                          </Button>
                        )}
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
                {crossData && (
                  <GenSelection
                    genotype={currentSelectedResult}
                    template_id={crossData.template_id}
                  ></GenSelection>
                )}
              </div>
            </Tab>
          </Tabs>

          {/* <div>

          </div> */}
        </Col>

        <Col lg="9" md="8" sm="8" xs="12">
          <div
            ref={ref}
            className="w-100 mt-3 bg-second shadowed-2 p-2 overflown-xy flex-center"
            style={{
              minHeight: "80vh",
              justifyContent: centered ? "center" : undefined,
              whiteSpace: "nowrap",
            }}
          >
            {crossResult && (
              <ResultTable
                crossData={crossData}
                setCrossData={setCrossData}
                crossResult={crossResult}
                onWidthChange={(dims) => {
                  setCentered(dims.width < width);
                }}
              ></ResultTable>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BoardPage;
