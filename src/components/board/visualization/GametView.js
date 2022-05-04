import React, { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../../../AppContextProvider";
import SubSup from "../../genepalette/SubSup";

const GametView = ({ gamete, template_id }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);
  //gameta
  //[0, 2]

  //template
  //[1, 2]

  const template = currState.templates.find((t) => t.id === template_id);

  return (
    <>
      {
        // JSON.stringify(gamete)
        template &&
          template.gene_ids.map((gid, k_gid) => {
            const gene = currState.default_genes.find((g) => g.id === gid);
            return (
              <span key={k_gid} className="mr-2">
                <SubSup allel={gene.allels[gamete[k_gid]]}></SubSup>
              </span>
            );
          })
      }
    </>
  );
};

export default GametView;
