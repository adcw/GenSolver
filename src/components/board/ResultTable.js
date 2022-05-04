// import 'resultTable.css';

import React, { useEffect, useState, useContext, useRef } from "react";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import { AppContext } from "../../AppContextProvider";
import { Table } from "react-bootstrap";
import "./resultTable.css";
import { GenotypeView } from "./visualization/GenotypeView";
import GametView from "./visualization/GametView";
import {
  cross,
  gen2fen,
  getCombinations,
  sortAllelSet,
} from "../../utils/CrossFunctions";
import { ACTION } from "../../App";
import { GradientMaker } from "../../utils/Colors";

const ResultTable = ({ crossData, setCrossData, crossResult }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const currState = useRef(state.projects[state.curr]);

  const [selectionPos, setSelectionPos] = useState([]);
  const [secondarySelections, setSecondarySelections] = useState([]);
  const [colormap, setColormap] = useState([]);

  const combinationsA = useRef(
    getCombinations(currState.current.cross_data.genotypes.A)
  );
  const combinationsB = useRef(
    getCombinations(currState.current.cross_data.genotypes.B)
  );

  const crossResultClick = (data, pos) => {
    EventEmitter.emit(E.onCrossResultClick, { genotype: data });
    setSelectionPos(pos);
  };

  useEffect(() => {
    console.log("LOAD");
    const el = document.getElementsByClassName("cell")[0];

    if (
      el &&
      !el.hasAttribute("style") &&
      currState.current.cross_data.count_list
    ) {
      const gradientMaker = new GradientMaker(
        Object.keys(currState.current.cross_data.count_list).length
      );
      setColormap(
        Object.keys(currState.current.cross_data.count_list).map((v) => {
          return {
            fen: v,
            color: gradientMaker.nextColor(),
          };
        })
      );
    }

    const onPageSwitchToPunnetSquare = EventEmitter.addListener(
      E.onPageSwitchToPunnetSquare,
      () => {
        console.log("Page sqitch");
        if (currState.current.cross_data.count_list) {
          console.log(JSON.stringify(currState.current.cross_data.count_list));
        }
      }
    );

    // if (crossResult.current) {
    //   const list = {}
    //   crossResult.current.forEach((row, k_row) => {
    //     row.forEach((gt, k_gt) => {
    //       const key = JSON.stringify(gen2fen(gt, state.cross_data.template_id, state))
    //       if (key in list) list[key]++;
    //       else list[key] = 1
    //     });
    //   });

    //   const gradientMaker = new GradientMaker(Object.keys(list).length);
    //   setColormap(
    //     Object.keys(list).map(v => {
    //       return {
    //         fen: v,
    //         color: gradientMaker.nextColor()
    //       }
    //     })
    //   )
    // }

    const onRestoreDefault = EventEmitter.addListener(
      E.onRestoreDefault,
      () => {
        combinationsA.current = null;
        combinationsB.current = null;
        crossResult.current = null;
      }
    );

    const onCreatePunnetSquare = EventEmitter.addListener(
      E.onCreatePunnetSquare,
      () => {
        setCrossData(currState.current.cross_data);
        combinationsA.current = getCombinations(
          currState.current.cross_data.genotypes.A
        );
        combinationsB.current = getCombinations(
          currState.current.cross_data.genotypes.B
        );
        crossResult.current = cross(
          combinationsA.current,
          combinationsB.current,
          crossData.template_id,
          currState.current
        );
        dispatch({
          type: ACTION.SET_SQUARE,
          payload: { square: crossResult.current },
        });

        const list = {};
        crossResult.current.forEach((row, k_row) => {
          row.forEach((gt, k_gt) => {
            const key = JSON.stringify(
              gen2fen(
                gt,
                currState.current.cross_data.template_id,
                currState.current
              )
            );
            if (key in list) list[key]++;
            else list[key] = 1;
          });
        });

        const gradientMaker = new GradientMaker(Object.keys(list).length);
        setColormap(
          Object.keys(list).map((v) => {
            return {
              fen: v,
              color: gradientMaker.nextColor(),
            };
          })
        );

        dispatch({ type: ACTION.SET_COUNT_LIST, payload: { list } });

        // crossResult.current.map((row, k_row) => {
        //   row.map((gt, k_gt) => {
        //     console.log(JSON.stringify(gen2fen(gt, crossData.template_id, currState.current)))
        //   })
        // })
      }
    );

    const sub_onStatClick = EventEmitter.addListener(E.onStatClick, (data) => {
      console.log(JSON.parse(data.fen).toString());

      setSecondarySelections(
        crossResult.current
          .map((row, r_indx) => {
            return row.map((genotype, g_indx) => {
              const fen = gen2fen(
                genotype,
                crossData.template_id,
                currState.current
              );
              return fen.toString() == JSON.parse(data.fen).toString()
                ? [r_indx, g_indx]
                : [100, 100];
            });
          })
          .flat(1)
      );

      setSelectionPos([]);
    });

    const sub_onCrossResultClick = EventEmitter.addListener(
      E.onCrossResultClick,
      () => {
        setSecondarySelections([]);
      }
    );

    return () => {
      onCreatePunnetSquare.remove();
      sub_onStatClick.remove();
      sub_onCrossResultClick.remove();
      onRestoreDefault.remove();
      onPageSwitchToPunnetSquare.remove();
    };
  });

  return (
    <div>
      {crossResult.current &&
      currState.current.templates.find(
        (t) => t.id === crossData.template_id
      ) ? (
        <Table className="punnett-square shadowed">
          <thead>
            <tr>
              <td>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "relative", top: "6px" }}>A</span>
                  <span style={{ float: "right" }}>
                    <span style={{ position: "relative", top: "-6px" }}>B</span>
                  </span>
                </div>
              </td>
              {combinationsB.current &&
                combinationsB.current.map((v, k) => {
                  return (
                    <td key={k}>
                      <GametView
                        gamete={v}
                        template_id={crossData.template_id}
                      ></GametView>
                    </td>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {combinationsA.current &&
              combinationsB.current &&
              crossResult.current &&
              crossResult.current.map((v, k) => {
                // const template = currState.current.templates.find((t) => t.id === crossData.template_id);
                return (
                  <tr key={k}>
                    {combinationsA.current && (
                      <td>
                        <GametView
                          gamete={combinationsA.current[k]}
                          template_id={crossData.template_id}
                        ></GametView>
                      </td>
                    )}
                    {v.map((v1, k1) => {
                      const color = colormap.find(
                        (c) =>
                          JSON.stringify(
                            gen2fen(
                              v1,
                              crossData.template_id,
                              currState.current
                            )
                          ) == c.fen
                      )?.color;

                      return (
                        <td
                          style={{ backgroundColor: `${color ?? ""}` }}
                          className={`cell pointer slow-trans ${
                            k === selectionPos[0] && k1 === selectionPos[1]
                              ? "glow"
                              : ""
                          } ${
                            secondarySelections
                              .map((sel) => JSON.stringify(sel))
                              .includes(JSON.stringify([k, k1]))
                              ? "glow2"
                              : ""
                          }`}
                          key={k1}
                          onClick={() => crossResultClick(v1, [k, k1])}
                        >
                          <div className="d-inline">
                            <GenotypeView
                              genotype={v1}
                              template_id={crossData.template_id}
                            ></GenotypeView>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      ) : (
        <h4>
          Brak wyników. Aby stworzyć krzyżówkę, wprowadź dane w panelu danych
          wejściowych.
        </h4>
      )}
    </div>
  );
};

export default ResultTable;