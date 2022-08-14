import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext, useEffect, useRef } from "react";
import { Popover, Button } from "react-bootstrap";
import "../../App.css";
import "../genepalette/GenItem.css";
import { AppModal } from "./Modal";

import { ACTION, AppContext } from "../../AppContextProvider";
import { validateProject__ } from "./MyNavbar";

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
    setProjectName(state.projects[state.curr]?.project_name);
  }, [state.curr, state.projects]);

  useEffect(() => {
    setError(validateProject__(currentProject, state, isEditing));
  }, [currentProject]);

  useEffect(() => {
    setcurrentProject({ ...currentProject, project_name: projectName });
  }, [projectName]);

  const handleHide = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (isEditing) {
      dispatch({
        type: ACTION.SET_PROJECT,
        payload: {
          project: currentProject,
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
    <AppModal title="Edycja projektu" isOpen={isOpen}>
      <div className="vstack">
        <p className="mb-1 text-sm">Zmiana nazwy projektu:</p>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <p className="text-danger">{error}</p>

        {isEditing && (
          <>
            <hr className="text-light" />
            <p
              className="text-sm p-0 m-0 hover pointer text-danger"
              onClick={() => handleDelete()}
            >
              Usuń projekt
            </p>
            <p className="text-sm p-0 m-0 hover pointer text-warning">
              Wyczyść projekt
            </p>
            <hr className="text-light" />
          </>
        )}

        <div className="hstack gap-2">
          <Button className="btn-xs btn-light ms-auto" onClick={handleHide}>
            Anuluj
          </Button>
          <Button className="btn-xs btn-info" onClick={() => handleSubmit()}>
            Zapisz
          </Button>
        </div>
      </div>
    </AppModal>
  );
};

export default EditProject;
