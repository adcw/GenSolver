import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { ACTION } from "../../App";
import { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import { downloadState } from "../../utils/ProjectManager";
import Confirm from "./Confirm";
import "./myNavbar.css";

const MyNavbar = () => {
  const { initialState, state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  const updateHistory = (newPath) => {
    if (location.pathname !== newPath) history.push(newPath);
  };

  const [sidemenuOpen, setSidemenuOpen] = useState(false);

  return (
    <>
      <Navbar className="bg-third" variant="dark" sticky="top">
        <Container>
          <Row>
            <Col md="3" className="pr-3">
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

            <Col md="9">
              {" "}
              <h2 className="my-0">{state?.project_name}</h2>
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

            {/* <div className="nav-link pointer"
            onClick={}
          >Przywróć domyślne dane</div> */}
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
            <h4
              className="pointer hover-white"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => downloadState(state)}
            >
              Pobierz projekt
            </h4>
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default MyNavbar;
