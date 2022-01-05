const is2dArray = array => array.constructor === Array && array.every(item => Array.isArray(item));

export const getCombinations = (arr) => {
  if (!is2dArray(arr)) {
    console.log("Not valid");
    return;
  }
  var comb = [];

  for (var j = 0; j < Math.pow(arr.length, 2) + 1; j++) {
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

  console.log(JSON.stringify(template))

  return allelSet.sort((a, b) => {
    return gene.allels[b].prior - gene.allels[a].prior
  })
}