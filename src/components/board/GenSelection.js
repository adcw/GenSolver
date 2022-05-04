import React, { useContext, useRef, useState, useEffect } from "react";
import { GenotypeView } from "./visualization/GenotypeView";
import "./genSelection.css";
import { AppContext } from "../../AppContextProvider";
import { gen2fen } from "../../utils/CrossFunctions";

export const VALUES = {
  HIGH: 50,
  MEDIUM: 20,
  LOW: 10,
};

export const getStyle = (percentage) => {
  if (percentage < VALUES.LOW) return "text-danger";
  if (percentage < VALUES.MEDIUM) return "text-orange";
  if (percentage < VALUES.HIGH) return "text-warning";
  return "text-success";
};

const GenSelection = ({ genotype, template_id }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  const getDesc = () => {
    if (!genotype) return;
    const template = currState.templates.find((t) => t.id === template_id);

    return (
      <>
        {genotype.map((allelSet, k_aS) => {
          const geneAllel = allelSet[0];
          const gene = currState.default_genes.find(
            (g) => g.id === template.gene_ids[k_aS]
          );

          const txt =
            Number(gene.allels[allelSet[0]].prior) ===
              Number(gene.allels[allelSet[1]].prior) &&
            allelSet[0] !== allelSet[1]
              ? `${gene.allels[allelSet[0]].desc}, ${
                  gene.allels[allelSet[1]].desc
                }`
              : gene.allels[geneAllel].desc;

          return <p className="text-sm" key={k_aS}>{`${k_aS + 1}. ${txt}`}</p>;
        })}
      </>
    );
  };

  const chance = () => {
    const fen = gen2fen(genotype, template_id, currState);
    return (
      (currState.cross_data.count_list[JSON.stringify(fen)] /
        Object.values(currState.cross_data.count_list).reduce(
          (acc, v) => acc + v,
          0
        )) *
      100
    );
  };

  const curr_chance = useRef(null);
  return (
    <>
      <p className="">Aktualne zaznaczenie:</p>
      {genotype && currState.cross_data.count_list && (
        <>
          <div className="selected-gen text-info">
            {genotype && (
              <GenotypeView
                genotype={genotype}
                template_id={template_id}
                big={true}
              ></GenotypeView>
            )}
          </div>
          <h6>Opis fenotypu:</h6>
          <div className="gs-description">{getDesc()}</div>
          <h6 className="mt-2">
            Szansa wystąpienia:{" "}
            <span
              className={`${getStyle((curr_chance.current = chance()))}`}
            >{`${curr_chance.current}%`}</span>
          </h6>
        </>
      )}
    </>
  );
};

export default GenSelection;
