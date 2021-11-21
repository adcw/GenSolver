import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/FontAwesomeIcons.js';
import RowDivider from './utils/RowDivider';
import Card from './components/general/Card';
import { Tab, Tabs, Table, Button } from 'react-bootstrap';
import GenItem from './components/genepalette/GenItem';
import { useReducer, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AddNewGeneBtn from './components/general/AddNewGeneBtn';
import { TempllateIItem } from './components/genotypetemplate/TempllateIItem';

export const ACTION = {
  TOGGLE_ACTIVE: "TOGGLE_ACTIVE",
  DELETE_GENE: "DELETE_GENE",
  SAVE_NAME: "SAVE_SETTINGS",
  ADD_DEFAULT_GENE: "ADD_DEFAULT_GENE",

  MODIFY_ALLEL: "MODIFY_ALLEL",
  ADD_ALLEL: "ADD_ALLEL",
  REMOVE_ALLEL: "REMOVE_ALLEL",

  SET_DEFAULT: "SET_DEFAULT"
};

export const GENE_LIST = {
  NORMAL: "NORMAL",
  GENDER: "GENDER",
  GENDER_LINKED: "GENDER_LINKED"
}

export function newGeneId(state) {
  var id = 0;
  state.default_genes.forEach(element => {
    if (element.id > id) id = element.id;
  });
  return id + 1;
}

function newGene(state) {
  return {
    "id": newGeneId(state),
    "name": "nowy gen",
    "allels": [],
    "isActive": true,
    "triggerEdit": false
  }
}

function newAllel() {
  return {
    "sup": "",
    "main": "A",
    "sub": ""
  }
}

function reducer(state, action) {

  switch (action.type) {
    case ACTION.TOGGLE_ACTIVE:

      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return (gene.id === action.payload.id) ? { ...gene, isActive: !gene.isActive } : gene
          })
        ]
      }

    case ACTION.DELETE_GENE:

      return {
        ...state,
        default_genes: [
          ...state.default_genes.filter((gene) => gene.id !== action.payload.id)
        ]
      }

    case ACTION.ADD_DEFAULT_GENE:

      return {
        ...state,
        default_genes: [
          ...state.default_genes,
          newGene(state)
        ]
      }

    case ACTION.SAVE_NAME:

      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return (gene.id === action.payload.id) ? { ...gene, name: action.payload.name } : gene
          })
        ]
      }

    case ACTION.MODIFY_ALLEL:

      console.log(action.payload);
      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return gene.id === action.payload.id ?
              {
                ...gene,
                allels: [
                  ...gene.allels.map((e, i) => i === action.payload.modifiedAllelIndex ? action.payload.newAllel : e)
                ]
              }
              : gene
          })
        ]
      }

    case ACTION.ADD_ALLEL:
      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return gene.id === action.payload.id ?
              {
                ...gene,
                allels: [
                  ...gene.allels,
                  newAllel()
                ]
              }
              : gene
          })
        ]
      }

    case ACTION.REMOVE_ALLEL:
      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return gene.id === action.payload.id ?
              {
                ...gene,
                allels: [
                  ...gene.allels.filter((e, i) => i !== action.payload.modifiedAllelIndex)
                ]
              }
              : gene
          })
        ]
      }

    case ACTION.SET_DEFAULT:
      return initialState;

    default:
      return state;
  }

}

const initialState = {
  "default_genes":
    [
      {
        "id": 0,
        "name": "Gen koloru czerwonego",
        "allels":
          [
            {
              "main": "A",
              "sup": "",
              "sub": ""
            },

            {
              "main": "a",
              "sup": "",
              "sub": ""
            }
          ],
        "isActive": true
      },

      {
        "id": 1,
        "name": "Grupy krwi",
        "allels":
          [
            {
              "main": "I",
              "sup": "A",
              "sub": ""
            },

            {
              "main": "I",
              "sup": "B",
              "sub": "C"
            },

            {
              "main": "i",
              "sup": "",
              "sub": ""
            }
          ],
        "isActive": true
      }
    ],

  "templates":
    [
      {
        "id": "0",
        "name": "Template 1",
        "gene_ids": [
          "0", "1"
        ]
      },

      {
        "id": "2",
        "name": "Template 2",
        "gene_ids": [
          "0"
        ]
      },

    ]
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const data = localStorage.getItem('state');
    console.log();
    return data ? JSON.parse(data) : state;
  });

  useEffect(() => {
    // console.log(JSON.stringify(state));
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  return (

    <Router>
      <Switch>
        <Route path="/" exact component={
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
                                <tr><p className="feedback">Brak genów</p></tr>
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
                  <Button className="my-btn-dark w-100 btn-sm" style={{ marginTop: "52px" }}>Dodaj nowy szablon</Button>
                  {
                    // state.default_genes.map((v, k) => {
                    //   return <p>{JSON.stringify(v, null, 2)}</p>
                    // })
                  }

                  <div className="overflown" style={{ marginTop: "12px" }}>
                    <Table className="genItem">
                      <tbody>
                        {
                          // state.templates ?
                          // state.templates.map((v, k) => {
                          //   return <p key={k}>{JSON.stringify(v, null, 2)}</p>
                          // })
                          // :
                          // <p>No templates.</p>

                          state.default_genes === undefined || state.default_genes.length === 0 ?
                            <tr><p className="feedback">Brak genów</p></tr>
                            :
                            state.templates.map((v, k) => {
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
          }>
        </Route>
        <Route path="/test" component={<h3>Test</h3>}></Route>
      </Switch>
    </Router>

  );
}



export default App;
