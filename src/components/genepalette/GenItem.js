import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useEffect, useState } from "react";
import {
  Popover,
  OverlayTrigger,
  Form,
  FormLabel,
  Collapse,
  Tooltip,
} from "react-bootstrap";
import AllelSymbol from "./AllelSymbol";
import "./GenItem.css";
import "../../App.css";
import Confirm from "../general/Confirm";
import AllelEditor from "./AllelEditor";
import SubSup from "./SubSup";
import { GTContent } from "../genotypetemplate/elements/GTContent";
import { newAllel, ACTION } from "../../context/AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter.js";
import { AllelItem } from "./AllelItem";

const GenItem = ({ gene, keyId, dispatch }) => {
  const [firstTime, setFirstTime] = useState(true);
  const [editorShown, setEditorShown] = useState(false);
  const allelCount = useRef(Object.keys(gene.allels).length);

  /*
	DISPATCH FUNCTIONS
	*/
  const D_togggleActive = () =>
    dispatch({ type: ACTION.TOGGLE_ACTIVE, payload: { id: gene.id } });
  const D_deleteGene = () => {
    dispatch({ type: ACTION.REMOVE_GENE, payload: { id: gene.id } });
  };

  const D_removeAllel = (allelIndex) => {
    dispatch({
      type: ACTION.REMOVE_ALLEL,
      payload: { id: gene.id, modifiedAllelIndex: 0 },
    });
  };
  const D_setGeneAllels = (allels) => {
    dispatch({
      type: ACTION.SET_GENE_ALLELS,
      payload: { id: gene.id, allels: allels },
    });
    // dispatch({ type: ACTION.SET_SQUARE, payload: { square: null } });

    console.log(allels);
    console.log(`old: ${allels.allels.length}, new: ${gene.allels.length}`);

    if (allels.allels.length < gene.allels.length) {
      dispatch({ type: ACTION.INITIALIZE_SELECTION, payload: { newId: 0 } });
    }
  };

  const [isSaveButtonActive, setIsSaveButtonActive] = useState(false);

  const nameInputRef = useRef(null);
  const [tempGeneContent, setTempGeneContent] = useState({ ...gene });

  useEffect(() => setTempGeneContent(gene), [gene]);

  const deleteAllel = (_allelId) => {
    setTempGeneContent({
      ...tempGeneContent,
      allels: tempGeneContent.allels.filter((v, k) => {
        return k !== _allelId;
      }),
    });
  };

  const addAllel = () => {
    setTempGeneContent({
      ...tempGeneContent,
      allels: [...tempGeneContent.allels, newAllel()],
    });
  };

  const saveModifiedAllel = (_modifiedAllelIndex, _newAllel) => {
    setTempGeneContent({
      ...tempGeneContent,
      allels: [
        ...tempGeneContent.allels.map((allel, k) => {
          return k === _modifiedAllelIndex ? _newAllel : allel;
        }),
      ],
    });
  };

  const toggleActive = () => {
    setTempGeneContent({
      ...tempGeneContent,
      isActive: !tempGeneContent.isActive,
    });
    D_togggleActive();
  };

  const discardChanges = () => {
    if (allelsChanged()) setTempGeneContent({ ...gene });
    onAnyChange();
  };

  const saveChanges = () => {
    D_setGeneAllels(tempGeneContent);
    onAnyChange();
  };

  const editDesc = (_allelIndx, _newDesc) => {
    setTempGeneContent({
      ...tempGeneContent,
      allels: tempGeneContent.allels.map((allel, k_allel) => {
        return k_allel === _allelIndx
          ? {
              ...allel,
              desc: _newDesc,
            }
          : allel;
      }),
    });
  };

  const editPriority = (_allelIndx, _priority) => {
    setTempGeneContent({
      ...tempGeneContent,
      allels: tempGeneContent.allels.map((allel, k_allel) => {
        return k_allel === _allelIndx
          ? {
              ...allel,
              prior: _priority,
            }
          : allel;
      }),
    });
  };

  const editName = (name) => {
    setTempGeneContent({
      ...tempGeneContent,
      name: name,
    });
    onAnyChange();
  };

  const allelsChanged = () =>
    JSON.stringify(tempGeneContent) !== JSON.stringify(gene);
  const onAnyChange = () => setIsSaveButtonActive(allelsChanged());

  useEffect(() => {
    onAnyChange();

    const restDefSubscription = EventEmitter.addListener(
      E.onRestoreDefault,
      () => {
        discardChanges();
      }
    );

    return () => {
      restDefSubscription.remove();
    };
  });

  const [chosenAllelIndex, setChosenAllelIndex] = useState(null);
  const [collapseOpen, setCollapseOpen] = useState(false);

  return (
    <>
      <tr className="template-header mt-1">
        <td className="m-0 p-1">
          <p className="m-0 text-sm">{keyId}</p>
        </td>

        <td colSpan={2} className="m-0 p-1">
          <p className="m-0 text-sm">{gene.name}</p>
        </td>

        <td className="m-0 p-1">
          <div className="f-right d-flex p-relative">
            {/* Allele */}
            <p className="m-0 txt-blue txt-right fill-empty">
              {gene.allels[0] === undefined && "-"}
              {gene.allels.map((allel, index) => {
                return (
                  <span key={index}>
                    <SubSup allel={allel} />
                    <span>, </span>
                  </span>
                );
              })}
            </p>

            {/* Edycja */}
            <OverlayTrigger
              overlay={<Tooltip id="edit-tooltop">Edytuj gen</Tooltip>}
            >
              <button
                className="btn btn-sm btn-edit btn-edit-bright"
                onClick={() => setCollapseOpen(!collapseOpen)}
              >
                <FontAwesomeIcon icon="pencil-alt"></FontAwesomeIcon>
              </button>
            </OverlayTrigger>

            {/* Wyłączanie i włączanie genu */}
            <OverlayTrigger
              overlay={
                <Tooltip id="toggle-visibility-tooltip">
                  Edytuj widoczność
                </Tooltip>
              }
            >
              <input
                type="checkbox"
                className="form-check-input check-input"
                defaultChecked={gene.isActive}
                onChange={toggleActive}
              />
            </OverlayTrigger>

            {/* Usuwanie genu */}
            <Confirm
              content={
                <center className="mb-3">
                  Czy na pewno chcesz usunąć bezpowrotnie wybrany gen?
                </center>
              }
              onConfirm={D_deleteGene}
            >
              <button
                id="btn-delete"
                className="btn btn-sm btn-delete btn-edit-bright"
              >
                <FontAwesomeIcon icon="times" />
              </button>
            </Confirm>
          </div>
        </td>
      </tr>

      <tr className="p-1">
        <td colSpan="12" className="w-100 py-0 template-content">
          <Collapse in={collapseOpen}>
            <div className="pb-3">
              <GTContent title="Nazwa:">
                <input
                  type="text"
                  className="w-100 btn-xs"
                  value={tempGeneContent.name}
                  onChange={(e) => editName(e.target.value)}
                ></input>

                <button
                  className="btn-xs btn my-btn-warning mx-1"
                  onClick={() => {
                    setCollapseOpen(false);
                    discardChanges();
                  }}
                >
                  Anuluj
                </button>

                <button
                  className="btn-xs btn my-btn-success"
                  disabled={!isSaveButtonActive}
                  onClick={() => {
                    setCollapseOpen(false);
                    saveChanges();
                  }}
                >
                  Zapisz
                </button>
              </GTContent>

              <hr className="m-2"></hr>

              <GTContent title="Allele:">
                <div className="genelist">
                  <button
                    disabled={tempGeneContent.allels.length >= 7}
                    onClick={() => {
                      if (tempGeneContent.allels.length <= 7) addAllel();
                    }}
                  >
                    Dodaj
                  </button>
                  {tempGeneContent.allels.map((allel, k) => {
                    return (
                      <AllelItem
                        key={k}
                        allel={allel}
                        k={k}
                        onClick={() => setChosenAllelIndex(k)}
                        tempGeneContent={tempGeneContent}
                        deleteAllel={deleteAllel}
                        editDesc={editDesc}
                        editPriority={editPriority}
                        setChosenAllelIndex={setChosenAllelIndex}
                        D_removeAllel={D_removeAllel}
                        chosenAllelIndex={chosenAllelIndex}
                        keyId={keyId}
                        saveModifiedAllel={saveModifiedAllel}
                      />
                    );
                  })}
                </div>
              </GTContent>
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};

GenItem.defaultProps = {
  isNew: false,
};

export default GenItem;
