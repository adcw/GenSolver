const is2dArray = (array) =>
  array.constructor === Array && array.every((item) => Array.isArray(item));

export const getCombinations = (input) => {
  if (!is2dArray(input)) {
    console.log("Not valid");
    return;
  }

  const result = [];

  const hzCount = input.reduce(
    (count, current) => count + (current[0] === current[1] ? 0 : 1),
    0
  );

  for (let combination = 0; combination < Math.pow(2, hzCount); combination++) {
    const gametes = [];
    let currCombination = combination;

    input.forEach((v) => {
      if (v[0] === v[1]) {
        gametes.push(v[0]);
      } else {
        gametes.push(v[currCombination & 1]);
        currCombination = currCombination >> 1;
      }
    });

    result.push(gametes);
  }

  return result;
};

export const cross = (genA, genB, template_id, state) => {
  const template = state.templates.find((t) => t.id === template_id);
  if (!template) return null;
  let gene = null;

  return genA.map((gametA) => {
    return genB.map((gametB) => {
      let res = [];

      for (let i = 0; i < gametA.length; i++) {
        // if (!gene)
        gene = state.default_genes.find((g) => g.id === template.gene_ids[i]);
        const first =
          gene.allels[gametA[i]].prior > gene.allels[gametB[i]].prior
            ? gametA[i]
            : gametB[i];
        const second = first === gametA[i] ? gametB[i] : gametA[i];
        res.push([first, second]);
      }
      return res;
    });
  });
};

export const sortAllelSet = (allelSet, indx, template, state) => {
  const gene = state.default_genes.find(
    (g) => g.id === template.gene_ids[indx]
  );

  return allelSet.sort((a, b) => {
    return gene.allels[b].prior - gene.allels[a].prior;
  });
};

export const gen2fen = (genotype, template_id, state) => {
  const template = state.templates.find((t) => t.id === template_id);

  return genotype.map((allelSet, k_aS) => {
    const gene = state.default_genes.find(
      (g) => g.id === template.gene_ids[k_aS]
    );

    return Number(gene.allels[allelSet[0]].prior) ===
      Number(gene.allels[allelSet[1]].prior) && allelSet[0] !== allelSet[1]
      ? [gene.id, [allelSet[0], allelSet[1]]]
      : [gene.id, [allelSet[0]]];
  });
};
