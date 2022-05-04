import React, { useContext, useRef } from "react";
import { AppContext } from "../../../AppContextProvider";
import SubSup from "../../genepalette/SubSup";

const GametView = ({ gamete, template_id }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const currState = useRef(state.projects[state.curr]);

  //gameta
  //[0, 2]

  //template
  //[1, 2]

  const template = currState.current.templates.find(
    (t) => t.id === template_id
  );

  return (
    <>
      {
        // JSON.stringify(gamete)
        template &&
          template.gene_ids.map((gid, k_gid) => {
            const gene = currState.current.default_genes.find(
              (g) => g.id == gid
            );
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
