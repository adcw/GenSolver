import React, { useState, useReducer, useEffect } from "react";
import { ACTION } from "./App";

export const AppContext = React.createContext();

const initialState = {
  "default_genes": [
    {
      "id": 1,
      "name": "Kolor czarny, czekoladowy i cynamonowy",
      "allels": [
        { "sup": "", "main": "B", "sub": "", "desc": "barwa czarna", "prior": 2 },
        { "sup": "", "main": "b", "sub": "", "desc": "barwa czekoladowa", "prior": 1 },
        { "sup": "", "main": "b1", "sub": "", "desc": "barwa cynamonowa", "prior": 0 }
      ],
      "isActive": true, "triggerEdit": false
    },

    {
      "id": 2,
      "name": "Rozjaśnienie",
      "allels": [
        { "sup": "", "main": "D", "sub": "", "desc": "brak rozjaśnienia", "prior": 1 },
        { "sup": "", "main": "d", "sub": "", "desc": "obecność rozjaśnienia", "prior": 0 }
      ],
      "isActive": true,
      "triggerEdit": false
    },

    {
      "id": 3,
      "name": "Rudy",
      "allels": [
        { "sup": "", "main": "O", "sub": "", "desc": "rudość", "prior": 1 },
        { "sup": "", "main": "o", "sub": "", "desc": "brak rudości", "prior": 0 }
      ],
      "isActive": true,
      "triggerEdit": false
    },

    // {
    //   "id": 4,
    //   "name": "Daltonizm",
    //   "allels": [
    //     { "sup": "D", "main": "X", "sub": "" },
    //     { "sup": "d", "main": "X", "sub": "" },
    //     { "sup": "", "main": "Y", "sub": "" }
    //   ],
    //   "isActive": true, "triggerEdit": false
    // }
  ],

  "templates": [
    {
      "id": 1,
      "name": "Dziedziczenie koloru u kota",
      "gene_ids": [1, 2, 3]
    },

    {
      "id": 2,
      "name": "Dziedziczenie 2",
      "gene_ids": [1, 2]
    },

    // {
    //   "id": 3,
    //   "name": "Czowiek",
    //   "gene_ids": [4]
    // }
  ],

  "cross_data": {
    "template_id": 1,
    "genotypes": {
      "A": [[0, 1], [1, 0], [1, 1]],
      "B": [[1, 1], [0, 0], [0, 1]]
    }
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

    case ACTION.REMOVE_GENE:

      return {
        ...state,
        default_genes: [
          ...state.default_genes.filter((gene) => gene.id !== action.payload.id)
        ],
        templates: [
          ...state.templates.map((template) => {
            return {
              ...template,
              gene_ids: template.gene_ids.filter((id) => id !== action.payload.id)
            }
          })
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

    case ACTION.SAVE_GENE_NAME:

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

    case ACTION.SET_GENE_ALLELS:
      return {
        ...state,
        default_genes: [
          ...state.default_genes.map((gene) => {
            return gene.id === action.payload.id ?
              action.payload.allels
              : gene
          })
        ]
      }

    case ACTION.REMOVE_TEMPLATE:

      return {
        ...state,
        templates: [
          ...state.templates.filter((v) => {
            return v.id !== action.payload.templateId;
          })
        ]
      }

    case ACTION.ADD_TEMPLATE:
      return {
        ...state,
        templates: [
          ...state.templates,
          newTemplate(state)
        ]
      }

    case ACTION.REMOVE_GENE_FROM_TEMPLATE:
      console.log(JSON.stringify(action));
      return {
        ...state,
        templates: [
          ...state.templates.map((template) => {
            return template.id === action.payload.templateId ?
              {
                ...template,
                gene_ids: template.gene_ids.filter((id) => id !== action.payload.geneId)
              }
              : template
          })
        ]
      }

    case ACTION.ADD_GENE_TO_TEMPLATE:
      console.log(JSON.stringify(action));
      return {
        ...state,
        templates: [
          ...state.templates.map((template) => {
            return template.id === action.payload.templateId &&
              !template.gene_ids.includes(action.payload.geneId) ?
              {
                ...template,
                gene_ids: [
                  ...template.gene_ids,
                  action.payload.geneId
                ]
              }
              : template
          })
        ],

        cross_data: {
          template_id: action.payload.templateId,
          genotypes: {
            A: state.templates[action.payload.templateId].gene_ids.map(() => {
              return [0, 0]
            })
            ,
            B: state.templates[action.payload.templateId].gene_ids.map(() => {
              return [0, 0]
            })
          }
        }

      }

    case ACTION.SAVE_TEMPLATE_NAME:
      return {
        ...state,
        templates: [
          ...state.templates.map((template) => {
            return template.id === action.payload.templateId ?
              {
                ...template,
                name: action.payload.name
              }
              : template
          })
        ]
      }

    case ACTION.SET_TEMPLATE_GENES:
      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        templates: [
          ...state.templates.map((template) => {
            return template.id === action.payload.templateId ?
              {
                ...template,
                gene_ids: [...action.payload.gene_ids]
              }
              : template
          })
        ]
      }

    case ACTION.INITIALIZE_SELECTION:
      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        cross_data: {
          template_id: state.templates[action.payload.newId].id,
          genotypes: {
            A: state.templates[action.payload.newId].gene_ids.map(() => {
              return [0, 0]
            })
            ,
            B: state.templates[action.payload.newId].gene_ids.map(() => {
              return [0, 0]
            })
          }
        }
      }

    case ACTION.SET_GENOTYPES:
      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        cross_data: {
          ...state.cross_data,
          genotypes: action.payload.genotypes
        }
      }

    case ACTION.SET_DEFAULT:
      return initialState;

    default:
      return state;
  }
}

function newGeneId(state) {
  var id = 0;
  state.default_genes.forEach(element => {
    if (element.id > id) id = element.id;
  });
  return id + 1;
}

const newTemplateId = (state) =>
  1 + state.templates.reduce((acc, val) => Math.max(acc, val.id), 0);

function newGene(state) {
  return {
    "id": newGeneId(state),
    "name": "nowy gen",
    "allels": [],
    "isActive": true,
    "triggerEdit": false
  }
}

export function newAllel() {
  return {
    "sup": "",
    "main": "A",
    "sub": ""
  }
}

function newTemplate(state) {
  return {
    "id": newTemplateId(state),
    "name": "Nowy szablon",
    "gene_ids": []
  }
}

const AppContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState
    , () => {
      const data = localStorage.getItem('state');
      return data ? JSON.parse(data) : initialState;
    }
  );

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    setContextItems(
      {
        initialState: initialState,
        state: state,
        dispatch: dispatch
      }
    )
  }, [state]);

  const [contextItems, setContextItems] = useState(
    {
      initialState: initialState,
      state: state,
      dispatch: dispatch
    }
  );



  return (
    <AppContext.Provider value={contextItems}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;