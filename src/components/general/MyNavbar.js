import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Nav,
  Navbar,
  Row,
  Stack,
} from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { ACTION, AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import { downloadProject } from "../../utils/ProjectManager";
import Confirm from "./Confirm";
import EditProject from "./EditProject";
import { FileInput } from "./FileInput";
import { AppModal } from "./Modal";
import "./myNavbar.css";
import { ProjPreview } from "./ProjPreview";

export const validateProject__ = (project, state, isEdited) => {
  if (
    project &&
    state.projects
      .filter((p, i) => !isEdited || i !== state.curr)
      .map((p) => p.project_name)
      .includes(project.project_name)
  ) {
    return `Projekt o nazwie ${project.project_name} już istnieje!`;
  } else {
    return null;
  }
};

const MyNavbar = () => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const [currentProj, setCurrentProj] = useState(state.projects[state.curr]);
  const [importedProject, setImportedProject] = useState(null);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [sidemenuOpen, setSidemenuOpen] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const validateProject = useCallback(() => {
    importedProject && setError(validateProject__(importedProject, state));
  }, [importedProject, state.projects]);

  useEffect(() => validateProject(), [importedProject]);

  useEffect(() => {
    setCurrentProj(state.projects[state.curr]);
  }, [state.curr, state.projects]);

  const updateHistory = (newPath) => {
    if (location.pathname !== newPath) history.push(newPath);
  };

  const handleProjectSubmit = (obj) => {
    if (!obj) return;
    setImportedProject(obj);
  };

  const handleProjectImport = () => {
    dispatch({
      type: ACTION.ADD_PROJECT,
      payload: { project: importedProject },
    });
    setImportedProject(null);
  };

  const handleNameChange = (newName) => {
    setImportedProject({
      ...importedProject,
      project_name: newName,
    });
  };

  const handleProjectChange = (newName) => {
    state.projects.forEach((proj, indx) => {
      if (proj.project_name === newName) {
        dispatch({ type: ACTION.CHANGE_PROJECT, payload: { projId: indx } });
        history.push("/");
      }
    });
  };

  return (
    <>
      <Navbar className="bg-third" variant="dark" sticky="top">
        <Container>
          <Row className="text-center" style={{ width: "100%" }}>
            <Col sm="1" className="pr-3">
              {" "}
              <div
                className="nav-link pointer"
                onClick={() => {
                  setSidemenuOpen(true);
                }}
              >
                <FontAwesomeIcon
                  size="2x"
                  icon="bars"
                  className="text-light"
                ></FontAwesomeIcon>
              </div>
            </Col>

            <Col xs="9">
              <h2 className="my-0">{currentProj?.project_name}</h2>
            </Col>

            <Col xs="1">
              {currentProj && (
                <>
                  <EditProject
                    isOpen={isEditOpen}
                    setIsOpen={setIsEditOpen}
                    isEditing={isEditing}
                  />
                  <FontAwesomeIcon
                    size="1x"
                    icon="pencil-alt"
                    className="text-light pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setIsEditOpen(true);
                    }}
                  ></FontAwesomeIcon>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Navbar className="bg-third" variant="dark" sticky="top">
        <Container>
          <Navbar.Brand href="/">GenSolver</Navbar.Brand>
          <Nav className="me-auto d-flex">
            <div
              className="nav-link pointer"
              onClick={() => updateHistory("/")}
            >
              Kreator genotypów
            </div>

            <div
              className="nav-link pointer"
              onClick={() => {
                updateHistory("/board");
                EventEmitter.emit(E.onPageSwitchToPunnetSquare);
              }}
            >
              Kreator krzyżówek
            </div>

            <Confirm
              onConfirm={() => {
                dispatch({ type: ACTION.SET_DEFAULT });
                EventEmitter.emit(E.onRestoreDefault);
              }}
              content={<p>Czy na pewno chcesz przywrócić domyślne dane?</p>}
            >
              <div className="nav-link pointer text-warning">
                Przywróć domyślne dane
              </div>
            </Confirm>
          </Nav>
        </Container>

        <div className="sidenav" style={{ width: sidemenuOpen ? 300 : 0 }}>
          <div
            className="closebtn pointer"
            onClick={() => setSidemenuOpen(false)}
          >
            &times;
          </div>
          <div className="mx-3 my-3">
            <div className="hstack gap-3 pointer hover">
              <FontAwesomeIcon icon="plus" className="mb-1"></FontAwesomeIcon>

              <h6
                className="pointer hover-white"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  setIsEditing(false);
                  setIsEditOpen(true);
                }}
              >
                Stwórz nowy projekt
              </h6>
            </div>

            <div
              className={`hstack gap-3 ${
                currentProj ? "pointer hover" : "text-gray"
              }`}
              onClick={() => currentProj && downloadProject(currentProj)}
            >
              <FontAwesomeIcon icon="upload" className="mb-1"></FontAwesomeIcon>

              <h6
                className={currentProj ? "pointer hover-white" : "text-gray"}
                style={{ whiteSpace: "nowrap" }}
              >
                Eksportuj projekt
              </h6>
            </div>

            <FileInput onSubmit={handleProjectSubmit}>
              <FontAwesomeIcon
                icon="download"
                className="mb-1"
              ></FontAwesomeIcon>

              <h6
                className="pointer hover-white"
                style={{ whiteSpace: "nowrap" }}
              >
                Importuj projekt
              </h6>
            </FileInput>

            <AppModal
              isOpen={!!importedProject}
              title="Podgląd projektu"
              footer={
                <Stack
                  className="my-1"
                  direction="horizontal"
                  style={{ gap: "6px" }}
                >
                  <Button
                    className="ms-auto btn-xs btn-light"
                    onClick={() => setImportedProject(null)}
                  >
                    Anuluj
                  </Button>
                  <Button
                    className="btn-xs btn-info"
                    disabled={error}
                    onClick={handleProjectImport}
                  >
                    Importuj
                  </Button>
                </Stack>
              }
            >
              <ProjPreview
                project={importedProject}
                error={error}
                onChange={handleNameChange}
              />
            </AppModal>

            {!state.projects || state.projects.length === 0 ? (
              <p
                className="text-gray"
                style={{ whiteSpace: "nowrap", fontStyle: "italic" }}
              >
                Brak projektów
              </p>
            ) : (
              <>
                <div className="hstack pointer text-light">
                  <p style={{ whiteSpace: "nowrap" }}>
                    {currentProj && currentProj.project_name}
                  </p>
                </div>
                {state.projects
                  .filter((_, index) => index !== state.curr)
                  .map((proj, i) => {
                    return (
                      <div
                        className="hstack pointer"
                        key={i}
                        onClick={() => handleProjectChange(proj.project_name)}
                      >
                        <p className=" mb-1" style={{ whiteSpace: "nowrap" }}>
                          {proj.project_name}
                        </p>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default MyNavbar;
