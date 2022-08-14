import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useEffect, useState } from "react";
import {
  Popover,
  OverlayTrigger,
  Form,
  FormLabel,
  Collapse,
} from "react-bootstrap";
import AllelSymbol from "./AllelSymbol";
import "./GenItem.css";
import "../../App.css";
import Confirm from "../general/Confirm";
import AllelEditor from "./AllelEditor";
import SubSup from "./SubSup";
import { GTContent } from "../genotypetemplate/elements/GTContent";
import { newAllel, ACTION } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter.js";

const GenItem = ({ gene, keyId, dispatch }) => {
  const [firstTime, setFirstTime] = useState(true);
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

  const popover = (
    <Popover id="popover-basic" className="shadowed genItem-popover bg-first">
      <Popover.Header as="h6" className="bg-second">
        <p className="mb-0 text-sm d-inline">Edytuj allel</p>
        <FontAwesomeIcon
          icon="times"
          className="f-right dismiss-btn mt-1 text-sm"
          onClick={() => document.body.click()}
        ></FontAwesomeIcon>
      </Popover.Header>

      <Popover.Body className="bg-first txt-bright popover-body">
        <AllelEditor
          chosenAllel={tempGeneContent.allels[chosenAllelIndex]}
          chosenAllelIndex={chosenAllelIndex}
          removeAllel={D_removeAllel}
          geneId={keyId}
          saveModifiedAllel={saveModifiedAllel}
        />

        {/* </Form> */}
      </Popover.Body>
    </Popover>
  );

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
            {/* <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover} > */}
            <button
              className="btn btn-sm btn-edit btn-edit-bright"
              onClick={() => setCollapseOpen(!collapseOpen)}
            >
              <FontAwesomeIcon icon="pencil-alt"></FontAwesomeIcon>
            </button>
            {/* </OverlayTrigger> */}

            {/* Wyłączanie i włączanie genu */}
            <input
              type="checkbox"
              className="form-check-input check-input"
              defaultChecked={gene.isActive}
              onChange={toggleActive}
            />

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
                  disabled={!isSaveButtonActive}
                  onClick={() => discardChanges()}
                >
                  Anuluj
                </button>

                <button
                  className="btn-xs btn my-btn-success"
                  disabled={!isSaveButtonActive}
                  onClick={saveChanges}
                >
                  Zapisz
                </button>
              </GTContent>

              <hr className="m-2"></hr>

              <GTContent title="Allele:">
                <div className="genelist">
                  <button onClick={() => addAllel()}>Dodaj</button>
                  {tempGeneContent.allels.map((allel, k) => {
                    return (
                      <span key={k} className="tmp-gene-list-item d-flex">
                        <OverlayTrigger
                          rootClose
                          trigger="click"
                          placement="right"
                          overlay={popover}
                        >
                          <div
                            className="genSymbol"
                            onClick={() => setChosenAllelIndex(k)}
                          >
                            <p>
                              <SubSup allel={allel} small={true} />
                            </p>
                          </div>
                        </OverlayTrigger>

                        <input
                          className="btn-xs w-100"
                          value={tempGeneContent.allels[k].desc}
                          onChange={(e) => editDesc(k, e.target.value)}
                        ></input>

                        <p className="text-sm m-0 pl-3 pr-2">Priorytet:</p>

                        <input
                          className="priority-input"
                          type="number"
                          min="0"
                          defaultValue={tempGeneContent.allels[k].prior}
                          onChange={(e) => editPriority(k, e.target.value)}
                        ></input>

                        <FontAwesomeIcon
                          icon="times"
                          className="f-right dismiss-btn mt-2 text-sm mx-2 pointer"
                          onClick={() => deleteAllel(k)}
                        ></FontAwesomeIcon>
                      </span>
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
