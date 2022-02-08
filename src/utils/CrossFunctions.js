const is2dArray = array => array.constructor === Array && array.every(item => Array.isArray(item));

export const getCombinations = (arr) => {
  if (!is2dArray(arr)) {
    console.log("Not valid");
    return;
  }
  var comb = [];

  for (var j = 0; j < Math.pow(arr.length, 2); j++) {
    var txt = [];
    var temp = j;

    arr.forEach((v, k) => {
      txt.push(arr[k][temp & 1]);
      temp = temp >> 1
    });

    if (!comb.find((elem) => JSON.stringify(elem) === JSON.stringify(txt)))
      comb.push(txt);
  }

  return comb;
}

export const cross = (genA, genB, template_id, state) => {
  const template = state.templates.find((t) => t.id === template_id);
  if (!template) return null;
  var gene = null;

  return genA.map((gametA) => {
    return genB.map((gametB) => {
      var res = [];

      for (var i = 0; i < gametA.length; i++) {
        if (!gene) gene = state.default_genes.find((g) => g.id === template.gene_ids[i])
        const first = gene.allels[gametA[i]].prior > gene.allels[gametB[i]].prior ? gametA[i] : gametB[i];
        const second = first === gametA[i] ? gametB[i] : gametA[i];
        res.push([first, second]);
      }
      return res;
    })
  });
}

export const sortAllelSet = (allelSet, indx, template, state) => {
  const gene = state.default_genes.find((g) => g.id === template.gene_ids[indx])

  return allelSet.sort((a, b) => {
    return gene.allels[b].prior - gene.allels[a].prior
  })
}

export const gen2fen = (genotype, template_id, state) => {
  const template = state.templates.find(t => t.id === template_id)

  return genotype.map((allelSet, k_aS) => {
    const gene = state.default_genes.find(g => g.id === template.gene_ids[k_aS])

    return (Number(gene.allels[allelSet[0]].prior) === Number(gene.allels[allelSet[1]].prior)
    && allelSet[0] !== allelSet[1]) ?
    [gene.id, [allelSet[0], allelSet[1]]] : [gene.id, [allelSet[0]]]
  })
}