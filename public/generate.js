let sudoku = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let sudoku2 = JSON.parse(JSON.stringify(sudoku));
let changesMade = false;
let fields = [];
let counter = 0;
let sudoku3;

function initializeEmptySudoku() {
  sudoku3 = JSON.parse(JSON.stringify(sudoku));
  print_sudoku(sudoku3, 'sudokuContainer');
  alert('Click on an empty cell to input a number (1-9).');
}

function isValidInput(input) {
  var parsedInput = parseInt(input);
  return !isNaN(parsedInput) && parsedInput >= 1 && parsedInput <= 9;
}

function handleCellClick(x, y) {
  return function () {
    var userInput = prompt('Enter a number (1-9):');
    if (isValidInput(userInput)) {
      var userNumber = parseInt(userInput);
      sudoku3[x][y] = userNumber;

      if (sudoku3[x][y] !== sudoku[x][y] || sudoku_invalid(sudoku3)) {
        alert('Incorrect move. Try again!');
        sudoku3[x][y] = 0; // Reset the cell if the move is incorrect
      } else {
        print_sudoku(sudoku3, 'sudokuContainer');
      }
    } else {
      alert('Invalid input. Please enter a number between 1 and 9.');
    }
  };
}

function duplicateNumberInRow(s, fieldY) {
  numbers = new Array();
  for (var i = 0; i < 9; i++) {
    if (s[i][fieldY] !== 0) {
      if (numbers.includes(s[i][fieldY])) {
        return true;
      } else {
        numbers.push(s[i][fieldY]);
      }
    }
  }
  return false;
}

function duplicateNumberInCol(s, fieldX) {
  numbers = new Array();
  for (var i = 0; i < 9; i++) {
    if (s[fieldX][i] !== 0) {
      if (numbers.includes(s[fieldX][i])) {
        return true;
      } else {
        numbers.push(s[fieldX][i]);
      }
    }
  }
  return false;
}

function duplicateNumberInBox(s, fieldX, fieldY) {
  boxX = Math.floor(fieldX / 3);
  boxY = Math.floor(fieldY / 3);
  numbers = new Array();
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      x = i + 3 * boxX;
      y = j + 3 * boxY;
      if (s[x][y] !== 0) {
        if (numbers.includes(s[x][y])) {
          return true;
        } else {
          numbers.push(s[x][y]);
        }
      }
    }
  }
  return false;
}

function fill_possible_fields() {
  for (var i = 0; i < 9; i++) {
    fields[i] = [];
  }
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      fields[i][j] = [];
    }
  }

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      for (var k = 0; k < 9; k++) {
        fields[i][j][k] = k + 1;
      }
    }
  }
}

function print_sudoku(s, position) {
  var container = document.getElementById(position);
  container.innerHTML = "";

  var tbl = document.createElement("table");
  var tbdy = document.createElement("tbody");
  tbl.appendChild(tbdy);
  for (var i = 0; i < 9; i++) {
    var tr = document.createElement("tr");
    tbdy.appendChild(tr);
    for (var j = 0; j < 9; j++) {
      var td = document.createElement("td");
      td.appendChild(document.createTextNode("" + s[i][j]));
      if (s[i][j] === 0) {
        td.style.backgroundColor = "#FFFFFF";
        td.addEventListener('click', handleCellClick(i, j));
      }
      tr.appendChild(td);
    }
  }
  container.appendChild(tbl);
}

function test_rows_and_cols() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (sudoku[i][j] !== 0) {
        var number = sudoku[i][j];
        for (var k = 0; k < 9; k++) {
          if (sudoku[i][k] === 0) {
            if (fields[i][k][number - 1] !== 0) {
              changesMade = true;
            }
            fields[i][k][number - 1] = 0;
          }
        }
        var number = sudoku[i][j];
        for (var k = 0; k < 9; k++) {
          if (sudoku[k][j] === 0) {
            if (fields[k][j][number - 1] !== 0) {
              changesMade = true;
            }
            fields[k][j][number - 1] = 0;
          }
        }
      }
    }
  }
}

function test_blocks() {
  for (var k = 0; k < 3; k++) {
    for (var l = 0; l < 3; l++) {
      for (var i = 0 + k * 3; i < 3 + k * 3; i++) {
        for (var j = 0 + l * 3; j < 3 + l * 3; j++) {
          if (sudoku[i][j] !== 0) {
            var number = sudoku[i][j];
            for (var a = 0 + k * 3; a < 3 + k * 3; a++) {
              for (var b = 0 + l * 3; b < 3 + l * 3; b++) {
                if (sudoku[a][b] === 0) {
                  if (fields[a][b][number - 1] !== 0) {
                    changesMade = true;
                  }
                  fields[a][b][number - 1] = 0;
                }
              }
            }
          }
        }
      }
    }
  }
}

function test_possible_fields() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        var numbers = 0;
        var number = 0;
        for (var k = 0; k < 9; k++) {
          if (fields[i][j][k] !== 0) {
            number = k + 1;
            numbers++;
          }
        }
        if (numbers === 1) {
          sudoku[i][j] = number;
          changesMade = true;
        }
      }
    }
  }
}

function duplicateNumberExists(s, fieldX, fieldY) {
  if (duplicateNumberInRow(s, fieldY)) {
    return true;
  }
  if (duplicateNumberInCol(s, fieldX)) {
    return true;
  }
  if (duplicateNumberInBox(s, fieldX, fieldY)) {
    return true;
  }
  return false;
}

function generateRandomSudoku(numbers) {
  while (!sudoku_complete() || sudoku_invalid(sudoku)) {
    sudoku3 = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    sudoku = JSON.parse(JSON.stringify(sudoku3));

    let numbersDone = 0;

    while (numbersDone < numbers) {
      let fieldX = Math.floor(Math.random() * 9);
      let fieldY = Math.floor(Math.random() * 9);
      let number = Math.floor(Math.random() * 9) + 1;

      if (sudoku3[fieldX][fieldY] === 0) {
        sudoku3[fieldX][fieldY] = number;
        if (duplicateNumberExists(sudoku3, fieldX, fieldY)) {
          sudoku3[fieldX][fieldY] = 0;
          continue;
        } else {
          numbersDone++;
        }
      }
    }
    sudoku = JSON.parse(JSON.stringify(sudoku3));
    solveSudoku();
  }
}

function solveSudoku() {
  fill_possible_fields();

  changesMade = false;
  counter = 0;

  while (!sudoku_complete()) {
    counter++;
    test_rows_and_cols();
    test_blocks();
    test_possible_fields();
    if (!changesMade) {
      break;
    } else {
      changesMade = false;
    }
    if (counter === 100) {
      break;
    }
  }

  print_sudoku(sudoku, 'sudokuContainer');
}

function sudoku_complete() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}

function sudoku_invalid(s) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (duplicateNumberExists(s, i, j)) {
        return true;
      }
    }
  }
  return false;
}

window.onload = function () {
  initializeEmptySudoku();
};
function duplicateNumberInRowAndCol(s, fieldX, fieldY) {
  if (duplicateNumberInRow(s, fieldY) || duplicateNumberInCol(s, fieldX)) {
    return true;
  }
  return false;
}

function isValidMove(s, fieldX, fieldY, number) {
  if (s[fieldX][fieldY] !== 0) {
    return false; // Cell is not empty
  }
  if (duplicateNumberInRowAndCol(s, fieldX, fieldY) || duplicateNumberInBox(s, fieldX, fieldY)) {
    return false; // Duplicate number in row, column, or box
  }
  return true;
}

function isSudokuValid(s) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (!isValidMove(s, i, j, s[i][j])) {
        return false;
      }
    }
  }
  return true;
}

function checkSudoku() {
  if (isSudokuValid(sudoku3)) {
    alert('Congratulations! You solved the Sudoku puzzle.');
  } else {
    alert('Incorrect solution. Please review your moves.');
  }
}

function resetSudoku() {
  sudoku3 = JSON.parse(JSON.stringify(sudoku2));
  print_sudoku(sudoku3, 'sudokuContainer');
  alert('Sudoku reset. Start again!');
}



function generatePuzzle(difficulty) {
  let numberOfClues;
  if (difficulty === 'easy') {
    numberOfClues = 35;
  } else if (difficulty === 'medium') {
    numberOfClues = 30;
  } else if (difficulty === 'hard') {
    numberOfClues = 25;
  }

  generateRandomSudoku(numberOfClues);
  print_sudoku(sudoku3, 'sudokuContainer');
}
