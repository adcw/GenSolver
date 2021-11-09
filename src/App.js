import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/FontAwesomeIcons.js';
import RowDivider from './utils/RowDivider';
import Card from './components/general/Card';
import { Tab, Tabs, Table } from 'react-bootstrap';
import GenItem from './components/genepalette/GenItem';
import { useReducer, useEffect } from 'react';
import AddNewGeneBtn from './components/general/AddNewGeneBtn';

export const ACTION = {
  TOGGLE_ACTIVE: "TOGGLE_ACTIVE",
  DELETE_GENE: "DELETE_GENE",
  SAVE_NAME: "SAVE_SETTINGS",
  ADD_DEFAULT_GENE: "ADD_DEFAULT_GENE",

  MODIFY_ALLEL: "MODIFY_ALLEL",
  ADD_ALLEL: "ADD_ALLEL",
  REMOVE_ALLEL: "ADD_ALLEL"
};

export const GENE_LIST = {
  NORMAL: "NORMAL",
  GENDER: "GENDER",
  GENDER_LINKED: "GENDER_LINKED"
}

export function newGeneId() {
  // if (sessionStorage.getItem('id') == null) {
  //   var indx = 0;
  //   JSON.parse(sessionStorage.getItem('state')).forEach(element => {
  //     if (element.id > indx) indx = element.id;
  //   });
  //   sessionStorage.setItem('id', indx);
  // }
  // else{
  //   const indx = sessionStorage.getItem('id');
  //   sessionStorage.setItem('id', indx + 1);
  //   return indx;
  // }
}

function newGene() {
  return {
    "id": newGeneId(),
    "name": "nowy gen",
    "allels": [],
    "isActive": true,
    "triggerEdit": false
  }
}

function newAllel() {
  return {
    "sup": "B",
    "main": "A",
    "sub": "C"
  }
}

function reducer(state, action) {

  switch (action.type) {
    case ACTION.TOGGLE_ACTIVE:

      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return (gene.id === action.payload.id) ? {...gene, isActive: !gene.isActive} : gene
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
          newGene()
        ]
      }

    case ACTION.SAVE_NAME:

      return {
        default_genes: [
          ...state.default_genes.map((gene) => {
            return (gene.id === action.payload.id) ? {...gene, name: action.payload.name} : gene
          })
        ]
      }

    case ACTION.MODIFY_ALLEL:

      console.log(action.payload);
      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return gene.id === action.payload.geneId ? 
            {
              ...gene,
              allels: [
                gene.allels.map((allel, indx) => {
                  return indx === action.payload.modifiedAllelIndex ? 
                    action.payload.newAllel : allel
                })
              ]
            }
            : gene
          })
        ]
      }

    case ACTION.ADD_ALLEL:
      console.log("Payload: " + action.payload);
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
      console.log("Payload: " + JSON.stringify());
      break;

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
                    <Table className="genItem">
		              	  <tbody>
                      { 
                        state.default_genes === undefined || state.default_genes.length === 0 ?
                        <p className="feedback">Brak genów</p>
                        :
                        state.default_genes.map((v, k) => {
                          return <GenItem gene={ v } key={ k } keyId={ k + 1 } dispatch={ dispatch }/>
                        })
                      }
                      </tbody>
                    </Table>

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
