import React, { useContext, useRef } from "react";
import { AppContext } from "../../../AppContextProvider";
import SubSup from "../../genepalette/SubSup";
import SubSup2 from "../../genepalette/SubSup2";

export const GenotypeView = ({ genotype, template_id, big }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const currState = useRef(state.projects[state.curr]);

  const _extract = (allel, indx) => {
    const template = currState.current.templates.find(
      (t) => t.id === template_id
    );
    if (template == null) return;
    const _gene_id = template.gene_ids[indx];

    const gene = currState.current.default_genes.find((g) => g.id === _gene_id);

    return (
      <span key={indx} className="pr-1">
        {gene && (
          <>
            {big ? (
              <>
                <SubSup2 allel={gene.allels[allel[0]]}></SubSup2>
                <SubSup2 allel={gene.allels[allel[1]]}></SubSup2>
                <span className="mr-2"></span>
              </>
            ) : (
              <>
                <SubSup allel={gene.allels[allel[0]]}></SubSup>
                <SubSup allel={gene.allels[allel[1]]}></SubSup>
              </>
            )}
          </>
        )}
      </span>
    );
  };

  return (
    <>
      {genotype.map((gene, g_k) => {
        return _extract(gene, g_k);
      })}
    </>
  );
};

GenotypeView.defaultProps = {
  big: false,
};
