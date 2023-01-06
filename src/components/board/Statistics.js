import React, { useContext, useEffect, useMemo, useState } from "react";
import { Stack } from "react-bootstrap";
import { AppContext } from "../../context/AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
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
  const { state } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  function handleStatClick(stat) {
    return () => EventEmitter.emit(E.onStatClick, { fen: stat });
  }

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

  const statiscticsEntries = useMemo(() => {
    const desc = new Map();

    if (!currState.cross_data.count_list) return null;

    return Object.entries(currState.cross_data.count_list)
      .sort((a, b) => b[1] - a[1])
      .map(([countlistEntry]) => {
        return (
          <Stack
            direction="horizontal"
            key={countlistEntry}
            className="p-1 mb-1 bg-first pointer hoverable"
            onClick={handleStatClick(countlistEntry)}
          >
            <div>
              {JSON.parse(countlistEntry).map((entry, k_g_a) => {
                const gene = currState.default_genes.find(
                  (g) => g.id === entry[0]
                );

                console.log(entry);

                entry[1].forEach((allelIndx) => {
                  if (desc.has(gene.id)) {
                    const prev = desc.get(gene.id);
                    desc.set(
                      gene.id,
                      prev + `, ${gene?.allels[allelIndx].desc}`
                    );
                  } else {
                    desc.set(
                      gene.id.toString(),
                      `${gene.name}: ${gene?.allels[allelIndx].desc}`
                    );
                  }
                });

                return (
                  <p key={entry} className="my-0" style={{ fontSize: "12px" }}>
                    {Array.from(desc.values())[k_g_a] ?? "-"}
                  </p>
                );
              })}
            </div>
            <div className="ms-auto">
              <div className="v-stack">
                <p style={{ fontSize: "12px" }} className="mb-0">
                  {makeFraction(
                    currState.cross_data.count_list[countlistEntry],
                    Object.values(currState.cross_data.count_list).reduce(
                      (acc, v1) => acc + v1,
                      0
                    )
                  )}
                </p>
                <strong
                  className={getStyle(chance(countlistEntry))}
                  style={{ fontSize: "12px" }}
                >
                  {chance(countlistEntry)}%
                </strong>
              </div>
            </div>
          </Stack>
        );
      });
  }, [currState.cross_data.count_list]);

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

            {statiscticsEntries}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
