const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = function solveSudoku(matrix) {

  for (let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(matrix[i][j] === 0) {  
        let result = getCandidats(matrix, i, j)
        
        if(result.length === 1) {
          matrix[i][j] = result[0];

          remove(matrix[i], result[0]);
          remove(getVertical(matrix, j), result[0]);
          remove(getQuadrat(matrix, i, j), result[0]);

          changed = true;
        } else {
          matrix[i][j] = result;
        }
      }
    }  
  }

  if(matrix.some(x => x.some(y => !!y.length))) {
    let positions = [];
    
    for (let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        if(!!matrix[i][j].length) {
          positions.push({row: i, col: j, val: matrix[i][j]});
        }
      }
    }
    //console.log(positions)
    solveByPrediction(matrix, positions);
  }
  
  return matrix;
}

function solveByPrediction(matrix, positions) {
  for (let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(!!matrix[i][j].length || matrix[i][j] === 0) {
        let candidates = positions.find(x => x.row === i && x.col === j).val;
        //console.log(candidates)

        for(let k = 0; k < candidates.length; k++) {
          let prediction = candidates[k]; 
          if(!matrix[i].includes(prediction) && !getVertical(matrix, j).includes(prediction) && !getQuadrat(matrix, i, j).includes(prediction)) {
            matrix[i][j] = prediction;
            if(solveByPrediction(matrix, positions)) {
              return true;
            } else {  
              matrix[i][j] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  //console.log(matrix)
  return true;
}

function remove(items, number) {
  items.forEach((item, i) => {
    if(!!item.length) {
      let index = item.indexOf(number);
      if(index > -1) {
        item.splice(index, 1);

        if(item.length === 1) {
          items[i] = item[0];
          remove(items, item[0]);
        }  
      }
    }
  });
}

function getCandidats(matrix, i, j) {
  let horizontal = list.filter(l => !matrix[i].includes(l));

  let vert = getVertical(matrix, j);
  let vertical = list.filter(l => !vert.includes(l));
        
  let quadro = getQuadrat(matrix, i, j);
  let quadrat = list.filter(l => !quadro.includes(l));
        
  return horizontal.filter(x => vertical.includes(x) && quadrat.includes(x));
}

function getVertical(matrix, j) {
  return list.map(l => matrix[l - 1][j]).filter(x => x !== 0)
}

function getQuadrat(matrix, i, j) {
  let row = getStart(i);
  let column = getStart(j);
  let numbers = [];

  for (let x = row; x < row + 3; x++) {
    for(let y = column; y < column + 3; y++) {
      if(matrix[x][y] !== 0 && !matrix[x][y].length) {
        numbers.push(matrix[x][y]);
      }
    }
  }

  return numbers;
}

function getStart(i) {
  return i < 3 ? 0 : i < 6 ? 3 : 6;
}
