import GenSymbol from "../genepalette/GenSymbol"
import SubSup from "../genepalette/SubSup"
import "../genotypetemplate/templateItem.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useContext, useRef } from "react";
import { Collapse, FormControl, OverlayTrigger, Popover } from "react-bootstrap";
import AppContextProvider, { AppContext } from "../../AppContextProvider";
import Confirm from "../general/Confirm";
import { ACTION } from "../../App";
import { GTContent } from "./elements/GTContent";
import { ButtonDelete } from "../general/ButtonDelete";

export const TempllateIItem = ({ template, keyId }) => {

  const [collapseOpen, setCollapseOpen] = useState(false);

  const { initialState, state, dispatch } = useContext(AppContext);

  const deleteTemplate = () => {
    dispatch({ type: ACTION.REMOVE_TEMPLATE, payload: { templateId: template.id } });
  }

  const deleteGene = (geneId) => dispatch({ type: ACTION.REMOVE_GENE_FROM_TEMPLATE, payload: { templateId: template.id, geneId: geneId } });
  const addGene = (geneId) => dispatch({ type: ACTION.ADD_GENE_TO_TEMPLATE, payload: { templateId: template.id, geneId: geneId } });

  const nameInputRef = useRef(null);
  const [nameBtnActive, setNameBtnActive] = useState(false);
  const nameInputSubmit = (name) => {
    dispatch({ type: ACTION.SAVE_TEMPLATE_NAME, payload: { templateId: template.id, name: nameInputRef.current.value } });
  }

  const event = new Event('input', { bubbles: true });
  useEffect(() => {
    nameInputRef.current.dispatchEvent(event);
  })

  const popover = (
    <Popover id="popover-basic" className="bg-second">
      <Popover.Header as="h3" className="bg-dark">Popover right</Popover.Header>
      <Popover.Body>
        {
          state.default_genes.map((_g, _k) => {
            return <span key={_k} className="tmp-gene-list-item d-flex text-white px-2 pb-1 pointer"
              onClick={() => addGene(_g.id)}
            >{_g.name}</span>
          })
        }
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <tr className="template-header">
        <td className="m-0 p-1">
          <p className="text-sm mb-0">{keyId + 1}</p>
        </td>

        <td className="m-0 p-1">
          <p className="text-sm mb-0">{template.name}</p>
        </td>

        <td className="m-0 p-1">
          <div>
            <div className="m-0 txt-right fill-empty d-flex">
              {
                template.gene_ids.length !== 0 ?
                  template.gene_ids.map((v, k) => {

                    const gene = state.default_genes.find(g => g.id === v);

                    if (gene == null) {
                      console.log("gene is null");
                    }
                    else {
                      return (
                        <div key={k} className="d-inline feedback">
                          <SubSup allel={gene.allels[0]}></SubSup>{k < template.gene_ids.length - 1 && <>,&nbsp;</>}
                        </div>
                      )
                    }
                  })
                  : <p className="text-sm">Brak genów</p>
              }
            </div>
          </div>
        </td>

        <td className="f-right p-1">
          <button
            className="btn btn-xs btn-edit-bright"
            onClick={() => setCollapseOpen(!collapseOpen)}
            aria-controls="collapse-menu"
            aria-expanded="false"
          >
            <FontAwesomeIcon
              icon="pencil-alt">
            </FontAwesomeIcon>
          </button>

          <Confirm
            content={<center className="mb-3">Czy na pewno chcesz usunąć bezpowrotnie te szablon?</center>}
            onConfirm={() => deleteTemplate()}
          >
            <button className="btn btn-xs btn-delete">
              <FontAwesomeIcon className="text-secondary" icon="times" />
            </button>
          </Confirm>
        </td>

      </tr>

      <tr className="p-1">
        <td colSpan="12" className="w-100 py-0 template-content">
          <Collapse in={collapseOpen}>
            <div id="collapse-menu" className="w-100">

              <GTContent title="Nazwa:">
                <input ref={nameInputRef} type="text" className="btn-xs w-100" defaultValue={template.name}
                  onChange={(e) => {
                    setNameBtnActive(e.target.value === template.name ? false : true);
                  }}
                ></input>
                <button className="btn-xs btn my-btn-dark text-secondary mx-1"
                  disabled={!nameBtnActive}
                  onClick={() => {
                    nameInputSubmit(nameInputRef.current.value);
                    nameInputRef.current.dispatchEvent(event);
                  }}
                >
                  Zapisz
                </button>
                <button className="btn-xs btn my-btn-warning">
                  Anuluj
                </button>
              </GTContent>

              <GTContent title="Geny:">
                <div className="genelist">
                  {
                    template.gene_ids.length !== 0 ?
                      template.gene_ids.map((v, k) => {
                        const gene = state.default_genes.find(g => g.id === v);

                        if (gene == null) {
                          console.log("Gene was removed");
                        }
                        else {
                          return (
                            <span key={k} className="tmp-gene-list-item d-flex">
                              <p className="mb-0 mt-0">{`${k + 1}. ${gene.name}`}</p>

                              <span className="f-rigth" style={{ marginLeft: "auto", order: "2" }}>
                                <ButtonDelete
                                  onClick={() => deleteGene(v)}
                                ></ButtonDelete>
                              </span>

                            </span>
                          )
                        }
                      })
                      : <p>Brak genów</p>
                  }

                  <OverlayTrigger trigger="click" placement="top" overlay={ popover } rootClose>
                    <button className="btn-xs w-100 btn-success">
                      Dodaj
                    </button>
                  </OverlayTrigger>

                </div>
              </GTContent>


            </div>
          </Collapse>
        </td>
      </tr>
    </>
  )
}
