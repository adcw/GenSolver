import { newAllel, newGene } from "../../AppContextProvider";

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

export const modifyAllel = (state, id, modifiedAllelIndex, newAllel) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.map((gene) => {
                  return gene.id === id
                    ? {
                        ...gene,
                        allels: [
                          ...gene.allels.map((e, i) =>
                            i === modifiedAllelIndex ? newAllel : e
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
};

export const addAllel = (state, id) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.map((gene) => {
                  return gene.id === id
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
};

export const removeAllel = (state, id, modifiedAllelIndex) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.map((gene) => {
                  return gene.id === id
                    ? {
                        ...gene,
                        allels: [
                          ...gene.allels.filter(
                            (e, i) => i !== modifiedAllelIndex
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
};

export const setGeneAllels = (state, id, allels) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              default_genes: [
                ...proj.default_genes.map((gene) => {
                  return gene.id === id ? allels : gene;
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};

export const removeTemplate = (state, templateId) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              templates: [
                ...proj.templates.filter((v) => {
                  return v.id !== templateId;
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};

export const addTemplate = (state) => {
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
};

export const removeGeneFromTemplate = (state, templateId, geneId) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              templates: [
                ...proj.templates.map((template) => {
                  return template.id === templateId
                    ? {
                        ...template,
                        gene_ids: template.gene_ids.filter(
                          (id) => id !== geneId
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
};

export const addGeneToTemplate = (state, templateId, geneId) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              templates: [
                ...proj.templates.map((template) => {
                  return template.id === templateId &&
                    !template.gene_ids.includes(geneId)
                    ? {
                        ...template,
                        gene_ids: [...template.gene_ids, geneId],
                      }
                    : template;
                }),
              ],

              cross_data: {
                template_id: templateId,
                genotypes: {
                  A: proj.templates[templateId].gene_ids.map(() => {
                    return [0, 0];
                  }),
                  B: proj.templates[templateId].gene_ids.map(() => {
                    return [0, 0];
                  }),
                },
              },
            }
          : proj;
      }),
    ],
  };
};

export const saveTemplateName = (state, templateId, name) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              templates: [
                ...proj.templates.map((template) => {
                  return template.id === templateId
                    ? {
                        ...template,
                        name: name,
                      }
                    : template;
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};

export const setTempateGenes = (state, templateId, gene_ids) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              templates: [
                ...proj.templates.map((template) => {
                  return template.id === templateId
                    ? {
                        ...template,
                        gene_ids: [...gene_ids],
                      }
                    : template;
                }),
              ],
            }
          : proj;
      }),
    ],
  };
};

export const initializeSelection = (state, newId) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              cross_data: {
                template_id: proj.templates[newId].id,
                genotypes: {
                  A: proj.templates[newId].gene_ids.map(() => {
                    return [0, 0];
                  }),
                  B: proj.templates[newId].gene_ids.map(() => {
                    return [0, 0];
                  }),
                },
                square: null,
              },
              templates: proj.templates,
            }
          : proj;
      }),
    ],
  };
};

export const setGenotypes = (state, genotypes) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              cross_data: {
                ...proj.cross_data,
                genotypes: genotypes,
              },
            }
          : proj;
      }),
    ],
  };
};

export const setSquare = (state, square) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              cross_data: {
                ...proj.cross_data,
                square: square,
              },
            }
          : proj;
      }),
    ],
  };
};

export const setCountList = (state, list) => {
  return {
    ...state,
    projects: [
      ...state.projects.map((proj, indx) => {
        return indx === state.curr
          ? {
              ...proj,
              cross_data: {
                ...proj.cross_data,
                count_list: list,
              },
            }
          : proj;
      }),
    ],
  };
};

export const changeProject = (state, projId) => {
  return {
    ...state,
    curr: projId,
  };
};

export const setProject = (state, project) => {
  return {
    ...state,
    projects: state.projects.map((proj, indx) => {
      return indx === state.curr ? project : proj;
    }),
  };
};

export const addProject = (state, project) => {
  return {
    ...state,
    projects: [...state.projects, project],
  };
};

export const removeProject = (state, id) => {
  return {
    ...state,
    projects: state.projects.filter((_p, i) => i !== id),
    curr: 0,
  };
};

function newTemplate(state) {
  return {
    id: newTemplateId(state),
    name: "Nowy szablon",
    gene_ids: [],
  };
}

const newTemplateId = (state) =>
  1 + state.templates.reduce((acc, val) => Math.max(acc, val.id), 0);
