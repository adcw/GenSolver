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
  const currentProject = state.projects[state.curr];
  const usedTemplate = currentProject.templates.find(
    (t) => t.id === currentProject.cross_data.template_id
  );

  console.log(usedTemplate);

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
              cross_data:
                usedTemplate && usedTemplate.gene_ids.includes(targetId)
                  ? {
                      template_id: 0,
                      genotypes: {
                        A: proj.templates[0].gene_ids.map(() => {
                          return [0, 0];
                        }),
                        B: proj.templates[0].gene_ids.map(() => {
                          return [0, 0];
                        }),
                      },
                      square: null,
                    }
                  : proj.cross_data,
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
