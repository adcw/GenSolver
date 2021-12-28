import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContextProvider";
import SubSup from "../genepalette/SubSup";
import { TempllateIItem } from "../genotypetemplate/TempllateIItem";
import { AllelSelect } from "./AllelSelect";
import { Container, Row, Col, Table } from 'react-bootstrap';

const GenotypeAssembly = ({ currentSelectedIndex,
  genotypeA, setGenotypeA, genotypeB, setGenotypeB, getDefaultGenotype
}) => {
  const { initialState, state, dispatch } = useContext(AppContext);

  const updateGenotype = (AorB, geneId, a1or2, allelId) => {

    const ch1 = (v, k) => {
      return v.geneId === geneId ?
        {
          geneId: v.geneId,
          allel_1: allelId,
          allel_2: v.allel_2
        } : v
    }

    const ch2 = (v, k) => {
      return v.geneId === geneId ?
        {
          geneId: v.geneId,
          allel_1: v.allel_1,
          allel_2: allelId
        } : v
    }

    if (AorB == "A" && a1or2 === 1) setGenotypeA(genotypeA.map(ch1))
    if (AorB == "A" && a1or2 === 2) setGenotypeA(genotypeA.map(ch2))
    if (AorB == "B" && a1or2 === 1) setGenotypeB(genotypeB.map(ch1))
    if (AorB == "B" && a1or2 === 2) setGenotypeB(genotypeB.map(ch2))
  }

  return (
    <>
      <Row className="text-center">
        <Col>
          <h6 className="text-md">Osobnik A:</h6>
          {
            state.templates[currentSelectedIndex].gene_ids.map((v, k) => {
              var sel = state.default_genes.find((v1, k1) => v1.id === v).allels;

              return <div key={k} className="d-flex my-2">
                <AllelSelect set={sel}
                  onValueChanged={(indx) => updateGenotype("A", v, 1, indx)}
                ></AllelSelect>
                <AllelSelect set={sel}
                  onValueChanged={(indx) => updateGenotype("A", v, 2, indx)}
                ></AllelSelect>
              </div>
            })
          }
        </Col>

        <Col>
          <h6 className="text-md">Osobnik B:</h6>
          {
            state.templates[currentSelectedIndex].gene_ids.map((v, k) => {
              var sel = state.default_genes.find((v1, k1) => v1.id === v).allels;

              return <div className="d-flex my-2" key={k}>
                <AllelSelect set={sel}
                  onValueChanged={(indx) => updateGenotype("B", v, 1, indx)}
                ></AllelSelect>
                <AllelSelect set={sel}
                  onValueChanged={(indx) => updateGenotype("B", v, 2, indx)}
                ></AllelSelect>
              </div>
            })
          }
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          {
            genotypeA.map((v, k) => {
              const gene = state.default_genes.find((elem) => elem.id === v.geneId);
              return <span key={k} className="pr-2">
                <SubSup  allel={gene.allels[v.allel_1]}></SubSup>
                <SubSup allel={gene.allels[v.allel_2]}></SubSup>
              </span>
            })
          }
          <span className="pr-2 text-success">x</span>
          {
            genotypeB.map((v, k) => {
              const gene = state.default_genes.find((elem) => elem.id === v.geneId);
              return <span key={k} className="pr-2">
                <SubSup allel={gene.allels[v.allel_1]}></SubSup>
                <SubSup allel={gene.allels[v.allel_2]}></SubSup>
              </span>
            })
          }
        </Col>
      </Row>
    </>

  )
}

export default GenotypeAssembly