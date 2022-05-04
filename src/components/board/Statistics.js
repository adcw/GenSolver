import React, { useContext, useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Button, Tabs, Tab } from "react-bootstrap";
import { ACTION } from "../../App";
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import Confirm from "../general/Confirm";
import { getStyle } from "./GenSelection";

const Statistics = () => {
  const { initialState, dispatch, state } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  const chance = (fen) => {
    return (
      (currState.cross_data.count_list[fen] /
        Object.values(currState.cross_data.count_list).reduce(
          (acc, v) => acc + v,
          0
        )) *
      100
    );
  };

  return (
    <div>
      {
        // JSON.stringify(currState.cross_data.count_list)
        // currState.cross_data.count_list &&
        // Object.keys(currState.cross_data.count_list).map((v, k) => {
        //   <p key={k}>{JSON.stringify(currState.cross_data.count_list[v])}</p>
        // })
        currState.cross_data.count_list && (
          <>
            <p>Statystyki:</p>

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-7 col-sm-7 col-xs-7">
                  <h6>Fenotyp</h6>
                </div>

                <div className="col-md-5 col-md-5 col-xs-5">
                  <h6 className="text-right">Częstość</h6>
                </div>
              </div>

              {Object.entries(currState.cross_data.count_list)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => {
                  // return <p key={k}>{`k = ${k} v = ${v}`}</p>
                  return (
                    <div
                      key={k}
                      className="row mb-1 bg-first pointer hoverable"
                      onClick={() =>
                        EventEmitter.emit(E.onStatClick, { fen: k })
                      }
                    >
                      <div className="col-md-9 col-sm-9 col-xs-9 text-sm">
                        {JSON.parse(k).map((g_a, k_g_a) => {
                          const gene = currState.default_genes.find(
                            (g) => g.id === g_a[0]
                          );
                          // return <p key={k_g_a} className="my-0">{gene?.allels[g_a[1][0]].desc}</p>
                          return (
                            <p key={k_g_a} className="my-0">
                              {g_a[1].map((allindx, k_al) => {
                                return (
                                  <span
                                    key={k_al}
                                  >{`${gene?.allels[allindx].desc}, `}</span>
                                );
                              })}
                            </p>
                          );
                        })}
                      </div>

                      <div className="col-md-3 col-md-3 col-xs-3 flex-center text-sm">
                        <p>
                          {currState.cross_data.count_list[k]}/
                          {Object.values(
                            currState.cross_data.count_list
                          ).reduce((acc, v1) => acc + v1, 0)}{" "}
                          (
                          <strong className={getStyle(chance(k))}>
                            {chance(k)}%
                          </strong>
                          )
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )
      }
    </div>
  );
};

export default Statistics;
