import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { ACTION } from "../../App";
import AppContextProvider, { AppContext } from "../../AppContextProvider";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Confirm from "./Confirm";

const MyNavbar = () => {

  const { initialState, state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  const updateHistory = (newPath) => {
    if (location.pathname !== newPath) history.push(newPath);
  }

  return (
    <Navbar className="bg-third" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="#home">GenSolver</Navbar.Brand>
        <Nav className="me-auto d-flex">
          <div className="nav-link pointer"
            onClick={() => updateHistory("/")}
          >Kreator genotypów</div>
          <div className="nav-link pointer"
            onClick={() => updateHistory("/board")}
          >Kreator krzyżówek</div>

          <Confirm
            onConfirm={() => {
              dispatch({ type: ACTION.SET_DEFAULT });
              EventEmitter.emit(E.onRestoreDefault);
            }}

            content={
              <p>Czy na pewno chcesz przywrócić domyślne dane?</p>
            }
          >
            <div className="nav-link pointer text-warning">Przywróć domyślne dane</div>
          </Confirm>

          {/* <div className="nav-link pointer"
            onClick={}
          >Przywróć domyślne dane</div> */}

        </Nav>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
