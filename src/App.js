import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/FontAwesomeIcons.js';
import RowDivider from './utils/RowDivider';
import Card from './components/general/Card';
import { Tab, Tabs } from 'react-bootstrap';
import GenItem from './components/genepalette/GenItem';
import { useReducer } from 'react';
import AddNewGeneBtn from './components/general/AddNewGeneBtn';

export const ACTION = {
  TOGGLE_ACTIVE: "TOGGLE_ACTIVE",
  DELETE_GENE: "DELETE_GENE",
  SAVE_SETTINGS: "SAVE_SETTINGS",
  ADD_DEFAULT_GENE: "ADD_DEFAULT_GENE"
};

export const GENE_LIST = {
  NORMAL: "NORMAL",
  GENDER: "GENDER",
  GENDER_LINKED: "GENDER_LINKED"
}

var currentGeneId = 2;
export function newGeneId() {
  return currentGeneId++;
}

function newGene() {
  return {
    "id": newGeneId(),
    "name": "nowy gen",
    "allels": [],
    "isActive": true,
    "triggerEdit": true
  }
}

function reducer(state, action) {

  console.log(state);

  switch (action.type) {
    case ACTION.TOGGLE_ACTIVE:

      return {
        default_genes: [
          ...state.default_genes.map((gene) => {
            return (gene.id === action.payload.id) ? {...gene, isActive: !gene.isActive} : gene
          })
        ]
      }

    case ACTION.DELETE_GENE:

      return {
        default_genes: [
          ...state.default_genes.filter((gene) => gene.id !== action.payload.id)
        ]
      }

    case ACTION.ADD_DEFAULT_GENE:

      return {
        ...state,
        default_genes: [
          ...state.default_genes,
          newGene()
        ]
      }

    case ACTION.SAVE_SETTINGS:

      return {
        default_genes: [
          ...state.default_genes.map((gene) => {
            return (gene.id === action.payload.id) ? {...gene, name: action.payload.name} : gene
          })
        ]
      }

    default:
      return null;
  }

}

const initialState = {
  "default_genes": 
  [
    {
      "id": 0,
      "name": "Gen koloru czerwonego",
      "allels": ['A', 'a'],
      "isActive": true
    },

    {
      "id": 1,
      "name": "Gen koloru niebieskiego",
      "allels": ['B', 'b'],
      "isActive": true
    }
  ]
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (

    <div className="container-fluid">

        <div className="row">
          <div className="col bg-second shadowed">
            <h1 className="heading">GenSolver</h1>
          </div>
        </div>

        <RowDivider/> 

        <div className="row">
          <div className="col-md-6">
            <Card className="text-success">
              <h6>Paleta genów</h6>

              <Tabs variant="pills" defaultActiveKey="normal" id="uncontrolled-tab-example" className="mb-3">
                
                <Tab eventKey="normal" title="Zwykłe">
                  <AddNewGeneBtn targetGeneList={ GENE_LIST.NORMAL } dispatch={dispatch } />

                  <div className="pt-2">
                    { state.default_genes === undefined || state.default_genes.length === 0 ?
                      <p className="feedback">Brak genów</p>
                      :
                      state.default_genes.map((v, k) => {
                        return <GenItem gene={ v } key={ k } keyId={ k + 1 } dispatch={ dispatch }/>
                      })
                    }
                  </div>

                </Tab>
                
                <Tab eventKey="gender" title="Geny płci">
                  <AddNewGeneBtn targetGeneList={ GENE_LIST.GENDER } dispatch={ dispatch }/>
                </Tab>
                
                <Tab eventKey="gender-linked" title="Geny sprzężone z płcią">
                  <AddNewGeneBtn targetGeneList={GENE_LIST.GENDER_LINKED } dispatch={ dispatch }/>
                </Tab>

              </Tabs>

            </Card>
          </div>

          <div className="col-md-6">
          </div>
        </div>

    </div>
  );
}

export default App;
