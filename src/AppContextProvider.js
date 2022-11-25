import React, { useState, useReducer, useEffect } from "react";
import {
  addAllel,
  addDefaultGene,
  addGeneToTemplate,
  addProject,
  addTemplate,
  changeProject,
  initializeSelection,
  modifyAllel,
  removeAllel,
  removeGene,
  removeGeneFromTemplate,
  removeProject,
  removeTemplate,
  saveGeneName,
  saveTemplateName,
  setCountList,
  setGeneAllels,
  setGenotypes,
  setProject,
  setSquare,
  setTempateGenes,
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
      name: "Kolor",
      allels: [
        { sup: "", main: "B", sub: "", desc: "czarny", prior: 2 },
        {
          sup: "",
          main: "b",
          sub: "",
          desc: "czkoladowy",
          prior: 1,
        },
        {
          sup: "",
          main: "b1",
          sub: "",
          desc: "cynamonowy",
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
          desc: "brak",
          prior: 1,
        },
        {
          sup: "",
          main: "d",
          sub: "",
          desc: "obecność",
          prior: 0,
        },
      ],
      isActive: true,
      triggerEdit: false,
    },

    {
      id: 3,
      name: "Rudość",
      allels: [
        { sup: "", main: "O", sub: "", desc: "obecna", prior: 1 },
        { sup: "", main: "o", sub: "", desc: "brak", prior: 0 },
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

export const initialProject = {
  default_genes: [
    {
      id: 1,
      name: "Kolor",
      allels: [
        {
          sup: "",
          main: "A",
          sub: "",
          desc: "czerwony",
          prior: "1",
        },
        {
          sup: "",
          main: "a",
          sub: "",
          desc: "biały",
          prior: "0",
        },
      ],
      isActive: true,
      triggerEdit: false,
    },
  ],
  templates: [
    {
      id: 1,
      name: "Przykładowy szablon",
      gene_ids: [1],
    },
  ],
  cross_data: {
    template_id: 1,
    genotypes: {
      A: [[0, 1]],
      B: [[0, 1]],
    },
    square: [
      [[[0, 0]], [[0, 1]]],
      [[[0, 1]], [[1, 1]]],
    ],
    count_list: {
      "[[1,[0]]]": 3,
      "[[1,[1]]]": 1,
    },
  },
  project_name: "Test proj",
};

const initialState = {
  curr: 0,
  projects: [pr1],
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
      return saveGeneName(state, action.payload.name, action.payload.id);

    case ACTION.MODIFY_ALLEL:
      return modifyAllel(
        state,
        action.payload.id,
        action.payload.modifiedAllelIndex,
        action.payload.newAllel
      );

    case ACTION.ADD_ALLEL:
      return addAllel(state, action.payload.id);

    case ACTION.REMOVE_ALLEL:
      return removeAllel(
        state,
        action.payload.id,
        action.payload.modifiedAllelIndex
      );

    case ACTION.SET_GENE_ALLELS:
      return setGeneAllels(state, action.payload.id, action.payload.allels);

    case ACTION.REMOVE_TEMPLATE:
      return removeTemplate(state, action.payload.templateId);

    case ACTION.ADD_TEMPLATE:
      return addTemplate(state);

    case ACTION.REMOVE_GENE_FROM_TEMPLATE:
      return removeGeneFromTemplate(
        state,
        action.payload.templateId,
        action.payload.geneId
      );

    case ACTION.ADD_GENE_TO_TEMPLATE:
      return addGeneToTemplate(
        state,
        action.payload.templateId,
        action.payload.geneId
      );

    case ACTION.SAVE_TEMPLATE_NAME:
      return saveTemplateName(
        state,
        action.payload.templateId,
        action.payload.name
      );

    case ACTION.SET_TEMPLATE_GENES:
      return setTempateGenes(
        state,
        action.payload.templateId,
        action.payload.gene_ids
      );

    case ACTION.INITIALIZE_SELECTION:
      return initializeSelection(state, action.payload.newId);

    case ACTION.SET_GENOTYPES:
      return setGenotypes(state, action.payload.genotypes);

    case ACTION.SET_SQUARE:
      return setSquare(state, action.payload.square);

    case ACTION.SET_COUNT_LIST:
      return setCountList(state, action.payload.list);

    case ACTION.CHANGE_PROJECT:
      return changeProject(state, action.payload.projId);

    case ACTION.SET_PROJECT:
      return setProject(state, action.payload.project);

    case ACTION.ADD_PROJECT:
      return addProject(state, action.payload.project);

    case ACTION.REMOVE_PROJECT:
      return removeProject(state, action.payload.id);

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
