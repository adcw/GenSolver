import React, { useContext } from 'react';
import { AppContext } from '../../../AppContextProvider';
import SubSup from '../../genepalette/SubSup';

const GametView = ({ gamete, template_id }) => {
  const { initialState, state, dispatch } = useContext(AppContext);

  //gameta
  //[0, 2]

  //template
  //[1, 2]

  const template = state.templates.find((t) => t.id === template_id);

  return (
    <>
      {
        // JSON.stringify(gamete)
        template.gene_ids.map((gid, k_gid) => {
          const gene = state.default_genes.find((g) => g.id == gid)
          return <span key={k_gid} className="mr-2">
            <SubSup allel={gene.allels[gamete[k_gid]]}></SubSup>
          </span>
        })
      }
    </>
  )
}

export default GametView
