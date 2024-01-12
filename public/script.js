var currentRow = 0;
var currentCol = 0;
var solutionSteps = [];

document.addEventListener('DOMContentLoaded', function () {
  var table = document.getElementById('myTable');

  for (var i = 0; i < 9; i++) {
    var row = table.insertRow();

    for (var j = 0; j < 9; j++) {
      var cell = row.insertCell();
      cell.textContent = '';

      var input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.addEventListener('input', function () {
        this.value = this.value.replace(/[^1-9]/g, '');

        var contradictionLocation = getContradictionLocation(table);
        if (contradictionLocation) {
          alert('Contradiction found in ' + contradictionLocation);
          this.value = '';
        }
      });
      cell.appendChild(input);
    }
  }

  var solveWithPythonButton = document.getElementById('solveAllButton');
  solveWithPythonButton.addEventListener('click', function (event) {
      event.preventDefault();
      solveSudokuCSP(table);});

      var visualizeButton = document.getElementById('visualizeButton');
      visualizeButton.addEventListener('click', function () {
        // Redirect to the arc_consistency.html page when the button is clicked
        window.location.href = 'arc_consistency.html';
      });

});


function getSudokuGrid(table) {
  var grid = [];

  for (var i = 0; i < 9; i++) {
      var rowValues = [];

      for (var j = 0; j < 9; j++) {
          var input = table.rows[i].cells[j].querySelector('input');
          rowValues.push(parseInt(input.value) || 0);
      }

      grid.push(rowValues);
  }

  return grid;
}



function hasContradiction(table) {
  return (
    hasContradictionInRow(table) ||
    hasContradictionInColumn(table) ||
    hasContradictionInGroup(table)
  );
}

function hasContradictionInRow(table) {
  for (var i = 0; i < 9; i++) {
    var rowValues = new Set();
    var input;

    for (var j = 0; j < 9; j++) {
      input = table.rows[i].cells[j].querySelector('input');
      var value = input.value;

      if (value !== '') {
        if (rowValues.has(value)) {
         console.log('Contradiction found in row at ' + i);
          return true;
        }
        rowValues.add(value);
      }
    }
  }
  return false;
}

function hasContradictionInColumn(table) {
  for (var j = 0; j < 9; j++) {
    var colValues = new Set();
    var input;

    for (var i = 0; i < 9; i++) {
      input = table.rows[i].cells[j].querySelector('input');
      var value = input.value;

      if (value !== '') {
        if (colValues.has(value)) {
          console.log('Contradiction found in column at ' + j);
          return true;
        }
        colValues.add(value);
      }
    }
  }
  return false;
}

function hasContradictionInGroup(table) {
  for (var group = 0; group < 9; group++) {
    var groupValues = new Set();
    var input;

    for (var i = Math.floor(group / 3) * 3; i < Math.floor(group / 3) * 3 + 3; i++) {
      for (var j = (group % 3) * 3; j < (group % 3) * 3 + 3; j++) {
        input = table.rows[i].cells[j].querySelector('input');
        var value = input.value;

        if (value !== '') {
          if (groupValues.has(value)) {
           console.log('Contradiction found in group at ' + i + '-' + j);
            return true;
          }
          groupValues.add(value);
        }
      }
    }
  }
  return false;
}

function getContradictionLocation(table) {
  if (hasContradictionInRow(table)) {
    return 'row';
  } else if (hasContradictionInColumn(table)) {
    return 'column';
  } else if (hasContradictionInGroup(table)) {
    return 'group';
  } else {
    return null;
  }
}

function solveSudokuCSP(table) {
  var startTime = new Date().getTime();
  var variables = getAllVariables(table);
  var domains = initializeDomains(table);
  var arcs = getAllArcs(table);

  domains = applyInitialDomainReduction(table, domains);

  var step = 0;
  while (enforceArcConsistency(domains, arcs)) {
    step++;
    console.log(`Step ${step}: Applied Arc Consistency`);
    console.log('Domains after Arc Consistency:', domains);
    printGrid(table);
  }

  updateSudokuGrid(table, domains);

  var endTime = new Date().getTime();

  if (!solveSudokuBacktrackingMRV(table, domains)) {
    alert('No solution found!');
  }
  else {
    // Puzzle solved, navigate to arc_consistency.html and pass the domains
    localStorage.setItem('arcConsistencyDomains', JSON.stringify(domains));
    var solvingTime = endTime - startTime;
    console.log(`Solving time: ${solvingTime} milliseconds`);
  }
}

function printGrid(table) {
  var grid = [];

  for (var i = 0; i < 9; i++) {
    var rowValues = [];

    for (var j = 0; j < 9; j++) {
      var input = table.rows[i].cells[j].querySelector('input');
      rowValues.push(parseInt(input.value) || 0);
    }

    grid.push(rowValues);
  }

  console.log(grid);
}

function getAllVariables(table) {
  var variables = [];

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      variables.push({ row: i, col: j });
    }
  }

  return variables;
}

function initializeDomains(table) {
  var domains = {};

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var input = table.rows[i].cells[j].querySelector('input');
      var value = input.value;

      if (value !== '') {
        domains[`${i}-${j}`] = [parseInt(value)];
      } else {
        domains[`${i}-${j}`] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
    }
  }

  return domains;
}

function getAllArcs(table) {
  var arcs = [];

  for (var i = 0; i < 9; i++) {
    arcs = arcs.concat(generateArcsInGroup(table, i, 'row'));
  }

  for (var j = 0; j < 9; j++) {
    arcs = arcs.concat(generateArcsInGroup(table, j, 'col'));
  }

  for (var group = 0; group < 9; group++) {
    arcs = arcs.concat(generateArcsInGroup(table, group, 'subgrid'));
  }

  return arcs;
}
/*
function generateArcsInGroup(table, index, type) {
  var arcs = [];

  for (var i = 0; i < 8; i++) {
    for (var j = i + 1; j < 9; j++) {
      var arc = {};

      if (type === 'row') {
        arc.variable1 = { row: index, col: i };
        arc.variable2 = { row: index, col: j };
      } else if (type === 'col') {
        arc.variable1 = { row: i, col: index };
        arc.variable2 = { row: j, col: index };
      } else if (type === 'subgrid') {
        var subgridRow = Math.floor(index / 3) * 3;
        var subgridCol = (index % 3) * 3;

        arc.variable1 = { row: subgridRow + Math.floor(i / 3), col: subgridCol + (i % 3) };
        arc.variable2 = { row: subgridRow + Math.floor(j / 3), col: subgridCol + (j % 3) };
      }

      arcs.push(arc);
    }
  }

  return arcs;
}
*/

function generateArcsInGroup(table, index, type) {
  var arcs = [];

  for (var i1 = Math.floor(index / 3) * 3; i1 < Math.floor(index / 3) * 3 + 3; i1++) {
    for (var j1 = (index % 3) * 3; j1 < (index % 3) * 3 + 3; j1++) {
      for (var i2 = Math.floor(index / 3) * 3; i2 < Math.floor(index / 3) * 3 + 3; i2++) {
        for (var j2 = (index % 3) * 3; j2 < (index % 3) * 3 + 3; j2++) {
          if (!(i1 === i2 && j1 === j2)) {
            var arc = {
              variable1: { row: i1, col: j1 },
              variable2: { row: i2, col: j2 }
            };
            arcs.push(arc);
          }
        }
      }
    }
  }

  return arcs;
}


function applyInitialDomainReduction(table, domains) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var input = table.rows[i].cells[j].querySelector('input');
      var value = input.value;

      if (value !== '') {
        var key = `${i}-${j}`;
        domains[key] = [parseInt(value)];
      }
    }
  }

  return domains;
}

function enforceArcConsistency(domains, arcs) {
  var changes = false;

  for (var arc of arcs) {
    if (revise(domains, arc.variable1, arc.variable2)) {
      changes = true;
      console.log(`Revised: ${arc.variable1.row}-${arc.variable1.col} and ${arc.variable2.row}-${arc.variable2.col}`);
    }
  }

  return changes;
}

function revise(domains, Xi, Xj) {
  var revised = false;
  var valuesToRemove = [];

  for (var valueXi of domains[`${Xi.row}-${Xi.col}`]) {
    var consistent = false;

    for (var valueXj of domains[`${Xj.row}-${Xj.col}`]) {
      if (valueXi !== valueXj) {
        consistent = true;
        break;
      }
    }

    if (!consistent) {
      valuesToRemove.push(valueXi);
      revised = true;
    }
  }

  for (var valueToRemove of valuesToRemove) {
    var index = domains[`${Xi.row}-${Xi.col}`].indexOf(valueToRemove);
    domains[`${Xi.row}-${Xi.col}`].splice(index, 1);
  }

  if (revised) {
   console.log(`Revised domain of cell (${Xi.row}, ${Xi.col}): Removed values ${valuesToRemove}`);
  }

  return revised;
}

function updateSudokuGrid(table, domains) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var input = table.rows[i].cells[j].querySelector('input');
      var key = `${i}-${j}`;

      if (domains[key].length === 1) {
        input.value = domains[key][0];
      }
    }
  }
}

function solveSudokuBacktrackingMRV(table, domains) {
  var variables = getAllVariables(table);
  var emptyCells = variables.filter((variable) => table.rows[variable.row].cells[variable.col].querySelector('input').value === '');

  if (emptyCells.length === 0) {
    return true;
  }

  emptyCells.sort((a, b) => domains[`${a.row}-${a.col}`].length - domains[`${b.row}-${b.col}`]);
  var currentVariable = emptyCells[0];

  for (var value of domains[`${currentVariable.row}-${currentVariable.col}`]) {
    table.rows[currentVariable.row].cells[currentVariable.col].querySelector('input').value = value;
   console.log(`Assigned value ${value} to cell (${currentVariable.row}, ${currentVariable.col})`);

    if (!hasContradiction(table)) {
      if (solveSudokuBacktrackingMRV(table, domains)) {
        return true;
      }
    }

    table.rows[currentVariable.row].cells[currentVariable.col].querySelector('input').value = '';
   console.log(`Backtracked from cell (${currentVariable.row}, ${currentVariable.col})`);
  }

  return false;
}

