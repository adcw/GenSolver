import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContextProvider";
import SubSup from "../genepalette/SubSup";
import { TempllateIItem } from "../genotypetemplate/TempllateIItem";
import { AllelSelect } from "./AllelSelect";
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import { ACTION } from "../../App";

const GenotypeAssembly = () => {

  const { initialState, state, dispatch } = useContext(AppContext);

  // const [state.cross_data, setstate.cross_data] = useState(
  //   {...state.cross_data}
  // )

  // useEffect(() => {
  //   const sub1 = EventEmitter.addListener(E.onRestoreDefault, () => {
  //     setCurrentTemplate(getCurrentTemplate());
  //   });

  //   const sub2 = EventEmitter.addListener(E.board_onTemplateChanged, () => {
  //     setCurrentTemplate(getCurrentTemplate());
  //   });

  //   return () => {
  //     sub1.remove();
  //     sub2.remove();
  //   }
  // })

  const _extract = (allel, indx) => {
    const gene = state.default_genes.find(
      (g) => g.id === state.templates.find(
        (elem) => elem.id === state.cross_data.template_id)?.gene_ids[indx]);

    return gene ? <span key={indx} className="pr-1">
      <SubSup allel={gene.allels[allel[0]]}></SubSup>
      <SubSup allel={gene.allels[allel[1]]}></SubSup>
    </span> : <span key={indx}></span>
  }

  const [_updatedGenotypes, set_updatedGenotypes] = useState({ ...state.cross_data.genotypes });
  const updateGenotype = (AorB, _0or1, indx, val) => {

    console.log(`${AorB}, ${_0or1}, ${indx}, ${val}`);
    if (AorB === "A") {
      set_updatedGenotypes({
        ...state.cross_data.genotypes,
        A: state.cross_data.genotypes.A.map((v, k) => {
          return k === indx ?
            state.cross_data.genotypes.A[indx].map((v1, k1) => {
              return k1 == _0or1 ?
                val : v1
            }) : v
        })
      })
    }

    if (AorB === "B") {
      set_updatedGenotypes({
        ...state.cross_data.genotypes,
        B: state.cross_data.genotypes.B.map((v, k) => {
          return k === indx ?
            state.cross_data.genotypes.B[indx].map((v1, k1) => {
              return k1 == _0or1 ?
                val : v1
            }) : v
        })
      })
    }
  }

  useEffect(() => {
    dispatch({ type: ACTION.SET_GENOTYPES, payload: { genotypes: _updatedGenotypes } });
  }, [_updatedGenotypes])

  return (
    <>
      <Row className="text-center">
        <Col>
          <h6 className="text-md">Osobnik A:</h6>
          {
            state.templates.find((elem) => elem.id === state.cross_data.template_id)?.gene_ids.map((_geneID_template, _gid_t_i) => {
                var _gene = state.default_genes.find((v) => v.id === _geneID_template).allels;

                return <div key={_gid_t_i} className="d-flex my-2">
                  {/* allel 1 */}
                  <AllelSelect set={_gene} defaultSelIndex={state.cross_data.genotypes.A[_gid_t_i][0]}
                    onValueChanged={(val) => updateGenotype("A", 0, _gid_t_i, val)}
                  ></AllelSelect>
                  {/* allel 2 */}
                  <AllelSelect set={_gene} defaultSelIndex={state.cross_data.genotypes.A[_gid_t_i][1]}
                    onValueChanged={(val) => updateGenotype("A", 1, _gid_t_i, val)}
                  ></AllelSelect>
                </div>
              })
          }
        </Col>

        <Col>
          <h6 className="text-md">Osobnik B:</h6>
          {
            state.templates.find((elem) => elem.id === state.cross_data.template_id)?.gene_ids.map((_geneID_template, _gid_t_i) => {
              var _gene = state.default_genes.find((v) => v.id === _geneID_template).allels;

              return <div key={_gid_t_i} className="d-flex my-2">
                {/* allel 1 */}
                <AllelSelect set={_gene} defaultSelIndex={state.cross_data.genotypes.B[_gid_t_i][0]}
                  onValueChanged={(val) => updateGenotype("B", 0, _gid_t_i, val)}
                ></AllelSelect>
                {/* allel 2 */}
                <AllelSelect set={_gene} defaultSelIndex={state.cross_data.genotypes.B[_gid_t_i][1]}
                  onValueChanged={(val) => updateGenotype("B", 1, _gid_t_i, val)}
                ></AllelSelect>
              </div>
            })
          }
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          {
            state.cross_data.genotypes.A.map((_allel_i, _k) => {
              return _extract(_allel_i, _k)
            })
          }
          <span className="pr-2 text-success">x</span>
          {
            state.cross_data.genotypes.B.map((_allel_i, _k) => {
              return _extract(_allel_i, _k)
            })
          }
        </Col>
      </Row>
    </>

  )
}

export default GenotypeAssembly