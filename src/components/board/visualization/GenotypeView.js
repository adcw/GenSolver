import React, { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../../AppContextProvider";
import SubSup from "../../genepalette/SubSup";
import SubSup2 from "../../genepalette/SubSup2";

export const GenotypeView = ({ genotype, template_id, big }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);
  const _extract = useCallback(
    (allel, indx) => {
      const template = currState.templates.find((t) => t.id === template_id);
      if (template == null) return;
      const _gene_id = template.gene_ids[indx];

      const gene = currState.default_genes.find((g) => g.id === _gene_id);

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
    },
    [big, currState.default_genes, currState.templates, template_id]
  );
  const processGenotype = useCallback(() => {
    return genotype.map((gene, g_k) => {
      return _extract(gene, g_k);
    });
  }, [genotype, _extract]);

  return <>{processGenotype()}</>;
};

GenotypeView.defaultProps = {
  big: false,
};
