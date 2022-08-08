import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Container,
  Nav,
  Navbar,
  Row,
  Col,
  Button,
  Stack,
} from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { object } from "yup";
import { AppContext, ACTION } from "../../AppContextProvider";
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
  const [importedProject, setImportedProject] = useState(null);
  const [error, setError] = useState(null);

  const [sidemenuOpen, setSidemenuOpen] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const validateProject = useCallback(() => {
    importedProject && setError(validateProject__(importedProject, state));
  }, [importedProject, state.projects]);

  useEffect(() => validateProject(), [importedProject]);

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
              {" "}
              <h2 className="my-0">
                {state.projects[state.curr]?.project_name}
              </h2>
            </Col>

            <Col xs="1">
              <EditProject />
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
              >
                Stwórz nowy projekt
              </h6>
            </div>

            <div
              className="hstack gap-3 pointer hover"
              onClick={() => downloadProject(state.projects[state.curr])}
            >
              <FontAwesomeIcon icon="upload" className="mb-1"></FontAwesomeIcon>

              <h6
                className="pointer hover-white"
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

            <div className="hstack pointer text-light">
              <p style={{ whiteSpace: "nowrap" }}>
                {state.projects[state.curr] &&
                  state.projects[state.curr].project_name}
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
                    <p
                      className="text-gray  mb-1"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {proj.project_name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default MyNavbar;
