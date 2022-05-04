import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import "./App.css";
import AppContextProvider, { AppContext } from "./AppContextProvider";
import BoardPage from "./components/board/BoardPage";
import GenItem from "./components/genepalette/GenItem";
import AddNewGeneBtn from "./components/general/AddNewGeneBtn";
import Card from "./components/general/Card";
import MyNavbar from "./components/general/MyNavbar";
import { TempllateIItem } from "./components/genotypetemplate/TempllateIItem";
import "./utils/FontAwesomeIcons.js";
import RowDivider from "./utils/RowDivider";

export const ACTION = {
  TOGGLE_ACTIVE: "TOGGLE_ACTIVE", // modyfikacja widoczności genu w edytorze
  REMOVE_GENE: "REMOVE_GENE", // usuwanie genu
  SAVE_GENE_NAME: "SAVE_GENE_NAME", // zapisanie nazwy genu
  ADD_DEFAULT_GENE: "ADD_DEFAULT_GENE", // dodanie nowrgo genu

  MODIFY_ALLEL: "MODIFY_ALLEL", // nadpisanie allelu
  ADD_ALLEL: "ADD_ALLEL", // dodanie allelu
  REMOVE_ALLEL: "REMOVE_ALLEL", // usunięcioe allelu
  SET_GENE_ALLELS: "SET_GENE_ALLELS", // ustawienie alleli danemu genowi

  REMOVE_TEMPLATE: "REMOVE_TEMPLATE", // usunięcie szablonu
  ADD_TEMPLATE: "ADD_TEMPLATE", // dodanie szablonu
  REMOVE_GENE_FROM_TEMPLATE: "REMOVE_GENE_FROM_TEMPLATE", // usunięcie genu z szablonu
  ADD_GENE_TO_TEMPLATE: "ADD_GENE_TO_TEMPLATE", // dodanie genu do szablonu
  SAVE_TEMPLATE_NAME: "SAVE_TEMPLATE_NAME", // zapisanie nazwy szablonu
  SET_TEMPLATE_GENES: "SET_TEMPLATE_GENES", // ustawienie genów szablonu

  INITIALIZE_SELECTION: "INITIALIZE_SELECTION", // iniclalizacja obecnie wybranego szablonu
  SET_GENOTYPES: "SET_GENOTYPES", // zapisanie genotypów rodzicielskich
  SET_SQUARE: "SET_SQUARE", // zapisanie krzyżówki
  SET_COUNT_LIST: "SET_COUNT_LIST", // zapisanie listy zliczeń fenotypów

  SET_DEFAULT: "SET_DEFAULT", // przywrócenie domyslnych danych
  SET_STATE: "SET_STATE",
};

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
        <MyNavbar></MyNavbar>

        <div className="container-fluid">
          <RowDivider />

          <div className="row">
            <div className="col-md-6">
              <Card>
                <h4 className="mb-3">Paleta genów</h4>

                <Tabs
                  variant="pills"
                  defaultActiveKey="normal"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="normal" title="Zwykłe">
                    <AddNewGeneBtn
                      targetGeneList={GENE_LIST.NORMAL}
                      dispatch={dispatch}
                    />

                    <div className="pt-2 overflown">
                      <Table className="genItem">
                        <tbody>
                          {state.default_genes === undefined ||
                          state.default_genes.length === 0 ? (
                            <tr>
                              <td>
                                <p className="feedback">Brak genów</p>
                              </td>
                            </tr>
                          ) : (
                            state.default_genes.map((v, k) => {
                              return (
                                <GenItem
                                  gene={v}
                                  key={k}
                                  keyId={k + 1}
                                  dispatch={dispatch}
                                />
                              );
                            })
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

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
                </Tabs>
              </Card>
            </div>

            <div className="col-md-6">
              <Card>
                <h4 className="mb-3">Kreator szablonów genotypów</h4>
                <Button
                  onClick={() => dispatch({ type: ACTION.ADD_TEMPLATE })}
                  className="my-btn-dark w-100 btn-sm"
                  style={{ marginTop: "52px" }}
                >
                  Dodaj nowy szablon
                </Button>
                {
                  // state.default_genes.map((v, k) => {
                  //   return <p>{JSON.stringify(v, null, 2)}</p>
                  // })
                }

                <div className="overflown" style={{ marginTop: "12px" }}>
                  <Table
                    className="genItem"
                    style={{ borderBottomWidth: "0px !important" }}
                  >
                    <tbody>
                      {state.default_genes === undefined ? (
                        <tr>
                          <td>
                            <p className="feedback">Brak genów</p>
                          </td>
                        </tr>
                      ) : (
                        state.templates.map((v, k) => {
                          if (v == null) return;
                          return (
                            <TempllateIItem
                              key={k}
                              template={v}
                              keyId={k}
                            ></TempllateIItem>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Route>

      <Route path="/board">
        <MyNavbar></MyNavbar>

        <BoardPage></BoardPage>
      </Route>
    </Switch>
  );
}

export default AppWrapper;
