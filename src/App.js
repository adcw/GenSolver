import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import "./App.css";
import AppContextProvider, { ACTION, AppContext } from "./AppContextProvider";
import BoardPage from "./components/board/BoardPage";
import GenItem from "./components/genepalette/GenItem";
import AddNewGeneBtn from "./components/general/AddNewGeneBtn";
import Card from "./components/general/Card";
import MyNavbar from "./components/general/MyNavbar";
import { TempllateIItem } from "./components/genotypetemplate/TempllateIItem";
import "./utils/FontAwesomeIcons.js";
import RowDivider from "./utils/RowDivider";

export const GENE_LIST = {
  NORMAL: "NORMAL",
  GENDER: "GENDER",
  GENDER_LINKED: "GENDER_LINKED",
};

function AppWrapper() {
  return (
    <AppContextProvider>
      <Router>
        <App></App>
      </Router>
    </AppContextProvider>
  );
}

function App() {
  const history = useHistory();

  const { initialState, state, dispatch } = useContext(AppContext);
  const [currState, setCurrState] = useState(state.projects[state.curr]);

  useEffect(() => {
    setCurrState(state.projects[state.curr]);
  }, [state]);

  const controlls = (
    <>
      <div className="col-md-6">
        <Card>
          <h4 className="mb-3">Paleta genów</h4>
          {/* <Tabs
                  variant="pills"
                  defaultActiveKey="normal"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="normal" title="Zwykłe">
                   */}

          <AddNewGeneBtn
            targetGeneList={GENE_LIST.NORMAL}
            dispatch={dispatch}
          />
          <div className="pt-2 overflown">
            <Table className="genItem">
              <tbody>
                {!currState && <p>Brak projeków. Utwórz nowy</p>}
                {currState &&
                  (currState.default_genes === undefined ||
                    (currState.default_genes.length === 0 && (
                      <tr>
                        <td>
                          <p className="feedback">Brak genów</p>
                        </td>
                      </tr>
                    )))}
                {currState &&
                  currState.default_genes &&
                  currState.default_genes.length > 0 &&
                  currState.default_genes.map((v, k) => {
                    return (
                      <GenItem
                        gene={v}
                        key={k}
                        keyId={k + 1}
                        dispatch={dispatch}
                      />
                    );
                  })}
                {/* {currState &&
                      (currState.default_genes === undefined ||
                        currState.default_genes.length === 0) ? (
                        <tr>
                          <td>
                            <p className="feedback">Brak genów</p>
                          </td>
                        </tr>
                      ) : (
                        currState.default_genes.map((v, k) => {
                          return (
                            <GenItem
                              gene={v}
                              key={k}
                              keyId={k + 1}
                              dispatch={dispatch}
                            />
                          );
                        })
                      )} */}
              </tbody>
            </Table>
          </div>
          {/* </Tab>

                  <Tab eventKey="gender" title="Geny płci">
                    <AddNewGeneBtn
                      targetGeneList={GENE_LIST.GENDER}
                      dispatch={dispatch}
                    />
                  </Tab>

                  <Tab eventKey="gender-linked" title="Geny sprzężone z płcią">
                    <AddNewGeneBtn
                      targetGeneList={GENE_LIST.GENDER_LINKED}
                      dispatch={dispatch}
                    />
                  </Tab>
                </Tabs> */}
        </Card>
      </div>

      <div className="col-md-6">
        <Card>
          <h4 className="mb-3">Kreator szablonów genotypów</h4>
          <Button
            onClick={() => dispatch({ type: ACTION.ADD_TEMPLATE })}
            className="my-btn-dark w-100 btn-sm"
          >
            Dodaj nowy szablon
          </Button>
          {
            // currState.default_genes.map((v, k) => {
            //   return <p>{JSON.stringify(v, null, 2)}</p>
            // })
          }

          <div className="overflown" style={{ marginTop: "12px" }}>
            <Table
              className="genItem"
              style={{ borderBottomWidth: "0px !important" }}
            >
              <tbody>
                {currState && !currState.default_genes && (
                  <tr>
                    <td>
                      <p className="feedback">Brak genów</p>
                    </td>
                  </tr>
                )}
                {currState &&
                  currState.default_genes &&
                  currState.templates
                    .filter((v) => v)
                    .map((v, k) => {
                      return (
                        <TempllateIItem
                          key={k}
                          template={v}
                          keyId={k}
                        ></TempllateIItem>
                      );
                    })}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );

  return (
    <Switch>
      <Route path="/" exact>
        <MyNavbar></MyNavbar>

        <div className="container-fluid">
          <RowDivider />

          <div className="row">
            {currState ? (
              controlls
            ) : (
              <div className="col-md-12 text-center">
                <h5>
                  Projekt jest pusty. Wybierz projekt z listy projektów lub
                  stwórz nowy.
                </h5>
              </div>
            )}
          </div>
        </div>
      </Route>

      <Route path="/board">
        <MyNavbar></MyNavbar>
        {currState ? (
          <BoardPage></BoardPage>
        ) : (
          <>
            <RowDivider />
            <div className="row">
              <div className="col-md-12 text-center">
                <h5>
                  Projekt jest pusty. Wybierz projekt z listy projektów lub
                  stwórz nowy.
                </h5>
              </div>
            </div>
          </>
        )}
      </Route>
    </Switch>
  );
}

export default AppWrapper;
