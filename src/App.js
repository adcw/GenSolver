import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/FontAwesomeIcons.js';

import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';

import RowDivider from './utils/RowDivider';
import Card from './components/general/Card';
import { Tab, Tabs, Table, Button } from 'react-bootstrap';
import GenItem from './components/genepalette/GenItem';
import { useReducer, useEffect, useContext, useState } from 'react';
import AddNewGeneBtn from './components/general/AddNewGeneBtn';
import { TempllateIItem } from './components/genotypetemplate/TempllateIItem';
import AppContextProvider, { AppContext } from './AppContextProvider';
// import EventEmitter, { E } from './utils/events/EventEmitter';

export const ACTION = {
  TOGGLE_ACTIVE: "TOGGLE_ACTIVE",
  REMOVE_GENE: "REMOVE_GENE",
  SAVE_GENE_NAME: "SAVE_GENE_NAME",
  ADD_DEFAULT_GENE: "ADD_DEFAULT_GENE",

  MODIFY_ALLEL: "MODIFY_ALLEL",
  ADD_ALLEL: "ADD_ALLEL",
  REMOVE_ALLEL: "REMOVE_ALLEL",

  REMOVE_TEMPLATE: "REMOVE_TEMPLATE",
  ADD_TEMPLATE: "ADD_TEMPLATE",
  REMOVE_GENE_FROM_TEMPLATE: "REMOVE_GENE_FROM_TEMPLATE",
  ADD_GENE_TO_TEMPLATE: "ADD_GENE_TO_TEMPLATE",
  SAVE_TEMPLATE_NAME: "SAVE_TEMPLATE_NAME",

  SET_DEFAULT: "SET_DEFAULT"
};

export const GENE_LIST = {
  NORMAL: "NORMAL",
  GENDER: "GENDER",
  GENDER_LINKED: "GENDER_LINKED"
}

function AppWrapper() {
  return (
    <AppContextProvider>
      <Router>
        <App></App>
      </Router>
    </AppContextProvider>
  )
}

function App() {

  const history = useHistory();

  const gotoBoard = () => {
    history.push("/board");
  }

  const { initialState, state, dispatch } = useContext(AppContext);

  // useEffect(() => {

  //   const handle = (data) => console.log(`DEL: ${data}`);
  //   const listener = EventEmitter.addListener(E.onGeneDeleted, handle)
  //   return () => {
  //     listener.remove();
  //   }
  // }, [])

  return (

    <Switch>
      <Route path="/" exact>

        <div className="container">

          <div className="row">
            <div className="col bg-second shadowed d-inline">
              <h1 className="heading">GenSolver</h1>

              <button
                className="btn btn-warning"
                onClick={() =>
                  dispatch({ type: ACTION.SET_DEFAULT })
                }
              >Przywróć domyślne dane</button>

              <button
                className="btn btn-success f-right"
                onClick={gotoBoard}
              >
                Stwórz krzyżówkę
              </button>

            </div>
          </div>

          <RowDivider />

          <div className="row">
            <div className="col-md-6">
              <Card>
                <h4 className="mb-3">Paleta genów</h4>

                <Tabs variant="pills" defaultActiveKey="normal" id="uncontrolled-tab-example" className="mb-3">

                  <Tab eventKey="normal" title="Zwykłe">
                    <AddNewGeneBtn targetGeneList={GENE_LIST.NORMAL} dispatch={dispatch} />

                    <div className="pt-2 overflown">
                      <Table className="genItem">
                        <tbody>
                          {
                            state.default_genes === undefined || state.default_genes.length === 0 ?
                              <tr><td><p className="feedback">Brak genów</p></td></tr>
                              :
                              state.default_genes.map((v, k) => {
                                return <GenItem gene={v} key={k} keyId={k + 1} dispatch={dispatch} />
                              })
                          }
                        </tbody>
                      </Table>

                    </div>

                  </Tab>

                  <Tab eventKey="gender" title="Geny płci">
                    <AddNewGeneBtn targetGeneList={GENE_LIST.GENDER} dispatch={dispatch} />
                  </Tab>

                  <Tab eventKey="gender-linked" title="Geny sprzężone z płcią">
                    <AddNewGeneBtn targetGeneList={GENE_LIST.GENDER_LINKED} dispatch={dispatch} />
                  </Tab>

                </Tabs>

              </Card>
            </div>

            <div className="col-md-6">
              <Card>
                <h4 className="mb-3">Kreator szablonów genotypów</h4>
                <Button
                  onClick={() => dispatch({ type: ACTION.ADD_TEMPLATE })}
                  className="my-btn-dark w-100 btn-sm"
                  style={{ marginTop: "52px" }}>Dodaj nowy szablon</Button>
                {
                  // state.default_genes.map((v, k) => {
                  //   return <p>{JSON.stringify(v, null, 2)}</p>
                  // })
                }

                <div className="overflown" style={{ marginTop: "12px" }}>
                  <Table className="genItem" style={{ borderBottomWidth: "0px !important" }}>
                    <tbody>
                      {
                        // state.templates ?
                        // state.templates.map((v, k) => {
                        //   return <p key={k}>{JSON.stringify(v, null, 2)}</p>
                        // })
                        // :
                        // <p>No templates.</p>

                        state.default_genes === undefined ?
                          <tr><td><p className="feedback">Brak genów</p></td></tr>
                          :
                          state.templates.map((v, k) => {
                            if (v == null) return;
                            return <TempllateIItem key={k} template={v} dispatch={dispatch} keyId={k} state={state}></TempllateIItem>
                          })

                      }
                    </tbody>
                  </Table>

                </div>
              </Card>
            </div>
          </div>

        </div>
      </Route>

      <Route path="/board">
        <p>Board</p>
      </Route>
    </Switch>
  );
}



export default AppWrapper;
