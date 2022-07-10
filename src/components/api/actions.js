import { newGene } from "../../AppContextProvider";

export const toggleActive = (state, targetId) => {
  return {
    ...state,

    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.map((gene) => {
                  return gene.id === targetId
                    ? { ...gene, isActive: !gene.isActive }
                    : gene;
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};

export const removeGene = (state, targetId) => {
  return {
    ...state,

    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.filter((gene) => gene.id !== targetId),
              ],
              templates: [
                ...proj.templates.map((template) => {
                  return {
                    ...template,
                    gene_ids: template.gene_ids.filter((id) => id !== targetId),
                  };
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};

export const addDefaultGene = (state) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [...proj.default_genes, newGene(proj)],
            }
          : proj;
      }),
    ],
  };
};

export const saveGeneName = (state, targetId, newName) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.map((gene) => {
                  return gene.id === targetId
                    ? { ...gene, name: newName }
                    : gene;
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};
