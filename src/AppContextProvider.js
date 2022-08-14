import React, { useState, useReducer, useEffect } from "react";
import {
  addDefaultGene,
  removeGene,
  toggleActive,
} from "./components/api/actions";

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

  INITIALIZE_SELECTION: "INITIALIZE_SELECTION", // inicjalizacja obecnie wybranego szablonu
  SET_GENOTYPES: "SET_GENOTYPES", // zapisanie genotypów rodzicielskich
  SET_SQUARE: "SET_SQUARE", // zapisanie krzyżówki
  SET_COUNT_LIST: "SET_COUNT_LIST", // zapisanie listy zliczeń fenotypów

  CHANGE_PROJECT: "CHANGE_PROJECT", // Zmiana projektu
  SET_PROJECT: "SET_PROJECT", // Aktualizacja projektu
  ADD_PROJECT: "ADD_PROJECT", // Dodanie nowego projektu
  REMOVE_PROJECT: "DELETE_PROJECT", // Usunięcie projektu

  SET_DEFAULT: "SET_DEFAULT", // przywrócenie domyslnych danych
  SET_STATE: "SET_STATE",
};

export const AppContext = React.createContext();

const pr1 = {
  default_genes: [
    {
      id: 1,
      name: "Kolor czarny, czekoladowy i cynamonowy",
      allels: [
        { sup: "", main: "B", sub: "", desc: "barwa czarna", prior: 2 },
        {
          sup: "",
          main: "b",
          sub: "",
          desc: "barwa czekoladowa",
          prior: 1,
        },
        {
          sup: "",
          main: "b1",
          sub: "",
          desc: "barwa cynamonowa",
          prior: 0,
        },
      ],
      isActive: true,
      triggerEdit: false,
    },

    {
      id: 2,
      name: "Rozjaśnienie",
      allels: [
        {
          sup: "",
          main: "D",
          sub: "",
          desc: "brak rozjaśnienia",
          prior: 1,
        },
        {
          sup: "",
          main: "d",
          sub: "",
          desc: "obecność rozjaśnienia",
          prior: 0,
        },
      ],
      isActive: true,
      triggerEdit: false,
    },

    {
      id: 3,
      name: "Rudy",
      allels: [
        { sup: "", main: "O", sub: "", desc: "rudość", prior: 1 },
        { sup: "", main: "o", sub: "", desc: "brak rudości", prior: 0 },
      ],
      isActive: true,
      triggerEdit: false,
    },
  ],

  templates: [
    {
      id: 1,
      name: "Dziedziczenie koloru u kota",
      gene_ids: [1, 2, 3],
    },

    {
      id: 2,
      name: "Dziedziczenie 2",
      gene_ids: [1, 2],
    },
  ],

  cross_data: {
    template_id: 1,
    genotypes: {
      A: [
        [0, 1],
        [1, 0],
        [1, 1],
      ],
      B: [
        [1, 1],
        [0, 0],
        [0, 1],
      ],
    },
  },

  project_name: "Demo Project",
};

const pr2 = {
  default_genes: [
    {
      id: 1,
      name: "Kolor czarny, czekoladowy i cynamonowy",
      allels: [
        { sup: "", main: "B", sub: "", desc: "barwa czarna", prior: 2 },
        {
          sup: "",
          main: "b",
          sub: "",
          desc: "barwa czekoladowa",
          prior: 1,
        },
        {
          sup: "",
          main: "b1",
          sub: "",
          desc: "barwa cynamonowa",
          prior: 0,
        },
      ],
      isActive: true,
      triggerEdit: false,
    },
  ],

  templates: [
    {
      id: 1,
      name: "Dziedziczenie koloru u kota",
      gene_ids: [1],
    },
  ],

  cross_data: {
    template_id: 1,
    genotypes: {
      A: [[0, 1]],
      B: [[1, 1]],
    },
  },

  project_name: "Test proj",
};

const initialState = {
  curr: 1,
  projects: [pr1, pr2],
};

function reducer(state, action) {
  console.log(action.type.toString() + "\n\n" + JSON.stringify(action.payload));

  switch (action.type) {
    case ACTION.TOGGLE_ACTIVE:
      return toggleActive(state, action.payload.id);

    case ACTION.REMOVE_GENE:
      return removeGene(state, action.payload.id);

    case ACTION.ADD_DEFAULT_GENE:
      return addDefaultGene(state);

    case ACTION.SAVE_GENE_NAME:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  default_genes: [
                    ...proj.default_genes.map((gene) => {
                      return gene.id === action.payload.id
                        ? { ...gene, name: action.payload.name }
                        : gene;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.MODIFY_ALLEL:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  default_genes: [
                    ...proj.default_genes.map((gene) => {
                      return gene.id === action.payload.id
                        ? {
                            ...gene,
                            allels: [
                              ...gene.allels.map((e, i) =>
                                i === action.payload.modifiedAllelIndex
                                  ? action.payload.newAllel
                                  : e
                              ),
                            ],
                          }
                        : gene;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.ADD_ALLEL:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  default_genes: [
                    ...proj.default_genes.map((gene) => {
                      return gene.id === action.payload.id
                        ? {
                            ...gene,
                            allels: [...gene.allels, newAllel()],
                          }
                        : gene;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.REMOVE_ALLEL:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  default_genes: [
                    ...proj.default_genes.map((gene) => {
                      return gene.id === action.payload.id
                        ? {
                            ...gene,
                            allels: [
                              ...gene.allels.filter(
                                (e, i) =>
                                  i !== action.payload.modifiedAllelIndex
                              ),
                            ],
                          }
                        : gene;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.SET_GENE_ALLELS:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  default_genes: [
                    ...proj.default_genes.map((gene) => {
                      return gene.id === action.payload.id
                        ? action.payload.allels
                        : gene;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.REMOVE_TEMPLATE:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  templates: [
                    ...proj.templates.filter((v) => {
                      return v.id !== action.payload.templateId;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.ADD_TEMPLATE:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  templates: [...proj.templates, newTemplate(proj)],
                }
              : proj;
          }),
        ],
      };

    case ACTION.REMOVE_GENE_FROM_TEMPLATE:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  templates: [
                    ...proj.templates.map((template) => {
                      return template.id === action.payload.templateId
                        ? {
                            ...template,
                            gene_ids: template.gene_ids.filter(
                              (id) => id !== action.payload.geneId
                            ),
                          }
                        : template;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.ADD_GENE_TO_TEMPLATE:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  templates: [
                    ...proj.templates.map((template) => {
                      return template.id === action.payload.templateId &&
                        !template.gene_ids.includes(action.payload.geneId)
                        ? {
                            ...template,
                            gene_ids: [
                              ...template.gene_ids,
                              action.payload.geneId,
                            ],
                          }
                        : template;
                    }),
                  ],

                  cross_data: {
                    template_id: action.payload.templateId,
                    genotypes: {
                      A: proj.templates[action.payload.templateId].gene_ids.map(
                        () => {
                          return [0, 0];
                        }
                      ),
                      B: proj.templates[action.payload.templateId].gene_ids.map(
                        () => {
                          return [0, 0];
                        }
                      ),
                    },
                  },
                }
              : proj;
          }),
        ],
      };

    case ACTION.SAVE_TEMPLATE_NAME:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  templates: [
                    ...proj.templates.map((template) => {
                      return template.id === action.payload.templateId
                        ? {
                            ...template,
                            name: action.payload.name,
                          }
                        : template;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.SET_TEMPLATE_GENES:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  templates: [
                    ...proj.templates.map((template) => {
                      return template.id === action.payload.templateId
                        ? {
                            ...template,
                            gene_ids: [...action.payload.gene_ids],
                          }
                        : template;
                    }),
                  ],
                }
              : proj;
          }),
        ],
      };

    case ACTION.INITIALIZE_SELECTION:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  cross_data: {
                    template_id: proj.templates[action.payload.newId].id,
                    genotypes: {
                      A: proj.templates[action.payload.newId].gene_ids.map(
                        () => {
                          return [0, 0];
                        }
                      ),
                      B: proj.templates[action.payload.newId].gene_ids.map(
                        () => {
                          return [0, 0];
                        }
                      ),
                    },
                    square: null,
                  },
                  templates: proj.templates,
                }
              : proj;
          }),
        ],
      };

    case ACTION.SET_GENOTYPES:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  cross_data: {
                    ...proj.cross_data,
                    genotypes: action.payload.genotypes,
                  },
                }
              : proj;
          }),
        ],
      };

    case ACTION.SET_SQUARE:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  cross_data: {
                    ...proj.cross_data,
                    square: action.payload.square,
                  },
                }
              : proj;
          }),
        ],
      };

    case ACTION.SET_COUNT_LIST:
      return {
        ...state,
        projects: [
          ...state.projects.map((proj, indx) => {
            return indx === state.curr
              ? {
                  ...proj,
                  cross_data: {
                    ...proj.cross_data,
                    count_list: action.payload.list,
                  },
                }
              : proj;
          }),
        ],
      };

    case ACTION.CHANGE_PROJECT:
      return {
        ...state,
        curr: action.payload.projId,
      };

    case ACTION.SET_PROJECT:
      return {
        ...state,
        projects: state.projects.map((proj, indx) => {
          return indx === state.curr ? action.payload.project : proj;
        }),
      };

    case ACTION.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload.project],
      };

    case ACTION.REMOVE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((_p, i) => i !== action.payload.id),
        curr: 0,
      };

    case ACTION.SET_DEFAULT:
      return initialState;

    case ACTION.SET_STATE:
      return action.payload.state;

    default:
      return state;
  }
}

function newGeneId(state) {
  let id = 0;
  state.default_genes.forEach((element) => {
    if (element.id > id) id = element.id;
  });
  return id + 1;
}

const newTemplateId = (state) =>
  1 + state.templates.reduce((acc, val) => Math.max(acc, val.id), 0);

export const newGene = (state) => {
  return {
    id: newGeneId(state),
    name: "nowy gen",
    allels: [],
    isActive: true,
    triggerEdit: false,
  };
};

export function newAllel() {
  return {
    sup: "",
    main: "A",
    sub: "",
    desc: "",
    prior: 0,
  };
}

function newTemplate(state) {
  return {
    id: newTemplateId(state),
    name: "Nowy szablon",
    gene_ids: [],
  };
}

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const data = localStorage.getItem("state");
    // const data = sessionStorage.getItem('state');
    return data ? JSON.parse(data) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
    // sessionStorage.setItem('state', JSON.stringify(state));
    setContextItems({
      initialState: initialState,
      state: state,
      dispatch: dispatch,
    });
  }, [state]);

  const [contextItems, setContextItems] = useState({
    initialState: initialState,
    state: state,
    dispatch: dispatch,
  });

  return (
    <AppContext.Provider value={contextItems}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
