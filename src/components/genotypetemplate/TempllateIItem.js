import AllelSymbol from "../genepalette/AllelSymbol";
import SubSup from "../genepalette/SubSup";
import "../genotypetemplate/templateItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useContext, useRef } from "react";
import {
  Collapse,
  FormControl,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import AppContextProvider, {
  AppContext,
  ACTION,
} from "../../AppContextProvider";
import Confirm from "../general/Confirm";
import { GTContent } from "./elements/GTContent";
import { ButtonDelete } from "../general/ButtonDelete";

export const TempllateIItem = ({ template, keyId }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { initialState, state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  // Submit functions
  const D_deleteTemplate = () => {
    dispatch({
      type: ACTION.REMOVE_TEMPLATE,
      payload: { templateId: template.id },
    });
  };

  const D_changeName = (_name) => {
    dispatch({
      type: ACTION.SAVE_TEMPLATE_NAME,
      payload: { templateId: template.id, name: _name },
    });
  };
  const D_deleteGene = (_geneId) =>
    dispatch({
      type: ACTION.REMOVE_GENE_FROM_TEMPLATE,
      payload: { templateId: template.id, geneId: _geneId },
    });
  const D_addGene = (_geneId) =>
    dispatch({
      type: ACTION.ADD_GENE_TO_TEMPLATE,
      payload: { templateId: template.id, geneId: _geneId },
    });
  const D_setGenes = (_genes) =>
    dispatch({
      type: ACTION.SET_TEMPLATE_GENES,
      payload: { templateId: template.id, gene_ids: _genes },
    });
  const D_initializeSelection = (_template_id) => {
    dispatch({
      type: ACTION.INITIALIZE_SELECTION,
      payload: { newId: _template_id },
    });
  };
  // --

  // Values to be submitted
  const nameInputRef = useRef(null);
  const [tempGeneArray, setTempGeneArray] = useState([...template.gene_ids]);

  const deleteGene = (_geneId) =>
    setTempGeneArray([...tempGeneArray].filter((val) => val !== _geneId));

  const addGene = (_geneId) =>
    setTempGeneArray(
      tempGeneArray.includes(_geneId)
        ? [...tempGeneArray]
        : [...tempGeneArray, _geneId]
    );

  //
  // const

  const [saveButtonActive, setSaveButtonActive] = useState(false);

  const discardChanges = () => {
    if (nameChanged()) nameInputRef.current.value = template.name;
    if (geneChanged()) setTempGeneArray([...template.gene_ids]);
    anyChange();
  };

  const saveChanges = () => {
    if (nameChanged()) D_changeName(nameInputRef.current.value);
    if (geneChanged()) {
      D_setGenes(tempGeneArray);
      if (template.id === currState.cross_data.template_id) {
        currState.templates.forEach((t, k_t) => {
          if (t.id === template.id) D_initializeSelection(k_t);
        });
      }
    }
  };

  const nameChanged = () => nameInputRef.current.value !== template.name;
  const geneChanged = () =>
    JSON.stringify(tempGeneArray) !== JSON.stringify(template.gene_ids);
  const anyChange = () => setSaveButtonActive(nameChanged() || geneChanged());

  useEffect(() => {
    anyChange();
  });

  const popover = (
    <Popover
      id="popover-basic"
      className="bg-second"
      style={{ minWidth: "300px" }}
    >
      <Popover.Header as="h3" className="bg-dark">
        Wybierz geny
      </Popover.Header>
      <Popover.Body>
        {currState.default_genes.filter((g) => g.isActive).length !== 0 ? (
          currState.default_genes.map((_g, _k) => {
            if (_g.isActive) {
              return _g.allels.length === 0 ? (
                <span
                  key={_k}
                  className="tmp-gene-list-item d-flex px-2 pb-1 text-warning"
                >
                  {_g.name}
                  <span className="f-rigth">&nbsp;(Brak alleli)</span>
                </span>
              ) : (
                <span
                  key={_k}
                  className="tmp-gene-list-item d-flex px-2 pb-1 pointer hoverable text-white"
                  onClick={() => addGene(_g.id)}
                >
                  {_g.name}
                </span>
              );

              // <span key={_k} className={`tmp-gene-list-item d-flex px-2 pb-1 pointer hoverable ${_g.allels.length === 0 && "text-danger"}`}
              //   onClick={() => addGene(_g.id)}
              // >{_g.name}
              //   {
              //     _g.allels.length === 0 && <span className="f-rigth">&nbsp;(Brak alleli)</span>
              //   }
              // </span>
            }
          })
        ) : (
          <p className="feedback">
            Brak genów. Dodaj geny lub włącz ich widoczność
          </p>
        )}
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
              {tempGeneArray.length !== 0 ? (
                tempGeneArray.map((v, k) => {
                  const gene = currState.default_genes.find((g) => g.id === v);

                  if (!gene) {
                    console.log("gene is null");
                  } else {
                    return (
                      <div key={k} className="d-inline feedback">
                        <SubSup allel={gene.allels[0]}></SubSup>
                        {k < tempGeneArray.length - 1 && <>,&nbsp;</>}
                      </div>
                    );
                  }
                })
              ) : (
                <p className="text-sm">Brak genów</p>
              )}
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
            <FontAwesomeIcon icon="pencil-alt"></FontAwesomeIcon>
          </button>

          <Confirm
            content={
              <center className="mb-3">
                Czy na pewno chcesz usunąć bezpowrotnie te szablon?
              </center>
            }
            onConfirm={() => D_deleteTemplate()}
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
                <input
                  ref={nameInputRef}
                  type="text"
                  className="btn-xs w-100"
                  defaultValue={template.name}
                  onChange={(e) => {
                    anyChange();
                  }}
                ></input>

                <button
                  className="btn-xs btn my-btn-warning mx-1"
                  disabled={!saveButtonActive}
                  onClick={() => discardChanges()}
                >
                  Anuluj
                </button>

                <button
                  className="btn-xs btn my-btn-success"
                  disabled={!saveButtonActive}
                  onClick={() => {
                    saveChanges();
                  }}
                >
                  Zapisz
                </button>
              </GTContent>

              <GTContent title="Geny:">
                <div className="genelist">
                  {tempGeneArray !== 0 ? (
                    tempGeneArray.map((v, k) => {
                      const gene = currState.default_genes.find(
                        (g) => g.id === v
                      );

                      if (!gene) {
                        console.log("Gene was removed");
                      } else {
                        return (
                          <span key={k} className="tmp-gene-list-item d-flex">
                            <p className="mb-0 mt-0">{`${k + 1}. ${
                              gene.name
                            }`}</p>

                            <span
                              className="f-rigth"
                              style={{ marginLeft: "auto", order: "2" }}
                            >
                              <ButtonDelete
                                onClick={() => deleteGene(v)}
                              ></ButtonDelete>
                            </span>
                          </span>
                        );
                      }
                    })
                  ) : (
                    <p>Brak genów</p>
                  )}

                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={popover}
                    rootClose
                  >
                    <button className="btn-xs w-100 btn-success">Dodaj</button>
                  </OverlayTrigger>
                </div>
              </GTContent>
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
