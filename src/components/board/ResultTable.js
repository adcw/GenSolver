// import 'resultTable.css';

import React, { useEffect, useState, useContext, useRef } from 'react';
import EventEmitter, { E } from '../../utils/events/EventEmitter';
import { AppContext } from '../../AppContextProvider';
import { Table } from 'react-bootstrap';
import './resultTable.css';
import { GenotypeView } from './visualization/GenotypeView';
import GametView from './visualization/GametView';
import { cross, getCombinations, sortAllelSet } from '../../utils/CrossFunctions';

const ResultTable = ({ crossData, setCrossData, crossResult }) => {

  const { initialState, state, dispatch } = useContext(AppContext)
  const [selectionPos, setSelectionPos] = useState([0, 0])

  const combinationsA = useRef(null)
  const combinationsB = useRef(null)

  const crossResultClick = (data, pos) => {

    EventEmitter.emit(E.onCrossResultClick, { genotype: data })
    setSelectionPos(pos)
  }

  useEffect(() => {
    const onCreatePunnetSquare = EventEmitter.addListener(E.onCreatePunnetSquare, () => {
      setCrossData(state.cross_data);
      combinationsA.current = getCombinations(state.cross_data.genotypes.A);
      combinationsB.current = getCombinations(state.cross_data.genotypes.B);
      crossResult.current = cross(combinationsA.current, combinationsB.current, crossData.template_id, state);
      console.log(JSON.stringify(crossResult.current));
    });
    return () => {
      onCreatePunnetSquare.remove();
    }
  });

  return (
    <div>

      <Table className="punnett-square">
        <thead>
          <tr>
            <td></td>
            {
              combinationsB.current &&
              combinationsB.current.map((v, k) => {
                return <td key={k}><GametView gamete={v} template_id={crossData.template_id}></GametView></td>
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            combinationsA.current && combinationsB.current && crossResult.current &&
            crossResult.current.map((v, k) => {
              // const template = state.templates.find((t) => t.id === crossData.template_id);
              return <tr key={k}>
                {
                  combinationsA.current &&
                  <td><GametView gamete={combinationsA.current[k]} template_id={crossData.template_id}></GametView></td>
                }
                {
                  v.map((v1, k1) => {
                    return <td className={`pointer ${k === selectionPos[0] && k1 === selectionPos[1] && "sel"}`} key={k1} onClick={() => crossResultClick(v1, [k, k1]) }>
                      <div className="d-inline"><GenotypeView genotype={v1} template_id={crossData.template_id}></GenotypeView></div>
                    </td>
                  })
                }
              </tr>
            })
          }
        </tbody>
      </Table>

    </div>
  )
}

export default ResultTable
