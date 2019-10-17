const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = function solveSudoku(matrix) {

  let changed = false;

  do {
    for (let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        if(matrix[i][j] === 0 || !!matrix[i][j].length) {
          const horizontal = list.filter(l => !matrix[i].includes(l));
  
          let vert = getVertical(matrix, j);
          const vertical = list.filter(l => !vert.includes(l));
          
          let quadro = getQuadrat(matrix, i, j);
          const quadrat = list.filter(l => !quadro.includes(l));
          
          let result = horizontal.filter(x => vertical.includes(x) && quadrat.includes(x));
          
          if(result.length === 1 || matrix[i][j].length === 1) {
            let num = matrix[i][j].length === 1 ? matrix[i][j] : result[0];
            matrix[i][j] = num;

            remove(matrix[i], num);
            remove(vert, num);
            remove(quadro, num);

            changed = true;
          } else {
            matrix[i][j] = result;
          }
        }
      }  
    }

  } while(!changed);
  
  //console.log(matrix)
  return matrix;
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
