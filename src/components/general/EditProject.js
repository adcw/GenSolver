import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext, useEffect, useRef } from "react";
import { Popover, Button } from "react-bootstrap";
import "../../App.css";
import "../genepalette/GenItem.css";
import { AppModal } from "./Modal";

import {
  ACTION,
  AppContext,
  initialProject,
} from "../../context/AppContextProvider";
import { validateProject__ } from "./MyNavbar";
import Confirm from "./Confirm";
import EventEmitter, { E } from "../../utils/events/EventEmitter";

const EditProject = ({ isOpen, setIsOpen, isEditing }) => {
  const { initialState, state, dispatch } = useContext(AppContext);

  const [currentProject, setcurrentProject] = useState(
    state.projects[state.curr]
  );

  const [projectName, setProjectName] = useState(
    isEditing ? currentProject?.project_name : "Nowy projekt"
  );

  const [error, setError] = useState();

  useEffect(() => {
    setProjectName(isEditing ? currentProject?.project_name : "Nowy projekt");
  }, [isOpen, isEditing]);

  useEffect(() => {
    setError(validateProject__(currentProject, state, isEditing));
  }, [currentProject, isEditing]);

  useEffect(() => {
    console.log({
      isEditing: isEditing,
      projectName: projectName,
    });
    setcurrentProject({ ...currentProject, project_name: projectName });
  }, [projectName]);

  const handleHide = () => {
    setIsOpen(false);
  };

  useEffect(
    () => setcurrentProject(state.projects[state.curr]),
    [state.curr, state.projects]
  );

  useEffect(() => {
    const sub = EventEmitter.addListener(E.onRestoreDefault, () => {
      setProjectName("Nowy projekt");
    });
    return () => {
      sub.remove();
    };
  }, []);

  useEffect(() => {
    console.log("is editing = ", isEditing);
    setError(null);
  }, [isEditing]);

  const handleSubmit = () => {
    if (isEditing) {
      dispatch({
        type: ACTION.SET_PROJECT,
        payload: {
          project: currentProject,
        },
      });
    } else {
      const newProj = initialProject;
      newProj.project_name = projectName;

      dispatch({
        type: ACTION.ADD_PROJECT,
        payload: {
          project: newProj,
        },
      });
    }
    handleHide();
  };

  const handleDelete = () => {
    dispatch({
      type: ACTION.REMOVE_PROJECT,
      payload: {
        id: state.curr,
      },
    });
    handleHide();
  };

  return (
    <AppModal
      title={isEditing ? "Edycja projektu" : "Dodawanie nowego projektu"}
      isOpen={isOpen}
    >
      {true && console.log(isEditing)}
      <div className="vstack">
        <p className="mb-1 text-sm">
          {isEditing ? "Zmiana nazwy projektu:" : "Nazwa projektu:"}
        </p>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <p className="text-danger">{error}</p>

        {isEditing && (
          <>
            <hr className="text-light" />

            <Confirm
              onConfirm={handleDelete}
              title={"Potwierdź akcję"}
              content={
                <p>Czy na pewno chcesz bezpowrotnie usunąć wybrany projekt?</p>
              }
            >
              <p className="text-sm p-0 m-0 hover pointer text-danger text-underline-hover">
                Usuń projekt
              </p>
            </Confirm>

            <p className="text-sm p-0 m-0 hover pointer text-warning text-underline-hover">
              Wyczyść projekt
            </p>
            <hr className="text-light" />
          </>
        )}

        <div className="hstack gap-2">
          <Button className="btn-xs btn-light ms-auto" onClick={handleHide}>
            Anuluj
          </Button>
          <Button
            className="btn-xs btn-info"
            disabled={error}
            onClick={() => handleSubmit()}
          >
            {isEditing ? "Zapisz" : "Dodaj"}
          </Button>
        </div>
      </div>
    </AppModal>
  );
};

export default EditProject;
