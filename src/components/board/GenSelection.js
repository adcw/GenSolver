import React, { useContext } from 'react'
import { GenotypeView } from './visualization/GenotypeView'
import './genSelection.css'
import { AppContext } from '../../AppContextProvider'

const GenSelection = ({ genotype, template_id }) => {

  const { initialState, state, dispatch } = useContext(AppContext);

  const getDesc = () => {
    if (!genotype) return;
    const template = state.templates.find(t => t.id === template_id)


    return <p>{JSON.stringify(
      genotype.map((allelSet, k_aS) => {
        const geneAllel = allelSet[0]
        const gene = state.default_genes.find(g => g.id === template.gene_ids[k_aS])
        return gene.allels[geneAllel].desc
      })
    )}</p>
  }

  return (
    <>
      <p className=''>Aktualne zaznaczenie:</p>
      <div className="selected-gen text-info">
        {genotype && <GenotypeView genotype={genotype} template_id={template_id} big={true}></GenotypeView>}
      </div>
      {
        getDesc()
      }
    </>
  )
}

export default GenSelection
