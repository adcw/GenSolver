import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Tabs,
  Tab,
  Stack,
} from "react-bootstrap";
import { ACTION } from "../../App";
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import Confirm from "../general/Confirm";
import { getStyle } from "./GenSelection";

function gcd_two_numbers(x, y) {
  if (typeof x !== "number" || typeof y !== "number") return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x;
}

const makeFraction = (num, den) => {
  const gcd = gcd_two_numbers(num, den);

  return num / gcd + "/" + den / gcd;
};

const Statistics = () => {
  const { initialState, dispatch, state } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  const numberFormat = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  });

  const chance = (fen) => {
    return numberFormat.format(
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
      {currState.cross_data.count_list && (
        <>
          <p>Statystyki:</p>

          <div
            className="container-fluid overflown p-0"
            style={{ height: "100vh" }}
          >
            <div className="row p-2">
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
                return (
                  <Stack
                    direction="horizontal"
                    key={k}
                    className="p-1 mb-1 bg-first pointer hoverable"
                    onClick={() => EventEmitter.emit(E.onStatClick, { fen: k })}
                  >
                    <div>
                      {JSON.parse(k).map((g_a, k_g_a) => {
                        const gene = currState.default_genes.find(
                          (g) => g.id === g_a[0]
                        );
                        return (
                          <p
                            key={k_g_a}
                            className="my-0"
                            style={{ fontSize: "12px" }}
                          >
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
                    <div className="ms-auto">
                      <div className="v-stack">
                        <p style={{ fontSize: "12px" }} className="mb-0">
                          {makeFraction(
                            currState.cross_data.count_list[k],
                            Object.values(
                              currState.cross_data.count_list
                            ).reduce((acc, v1) => acc + v1, 0)
                          )}
                        </p>
                        <strong
                          className={getStyle(chance(k))}
                          style={{ fontSize: "12px" }}
                        >
                          {chance(k)}%
                        </strong>
                      </div>
                    </div>
                  </Stack>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
