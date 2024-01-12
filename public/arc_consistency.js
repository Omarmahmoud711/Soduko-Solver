// arc_consistency.js

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the domains from local storage
    var domains = JSON.parse(localStorage.getItem('arcConsistencyDomains'));
  
    // Render arc consistency visualization
    renderArcConsistency(domains);
  });
  
  function renderArcConsistency(domains) {
    var table = document.getElementById('visualizationTable');
  
    // Iterate through each cell in the Sudoku grid
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var variable1 = { row: i, col: j };
        var domain1 = domains[`${i}-${j}`];
  
        // Iterate through connected cells (same row, same column, same subgrid)
        for (var k = 0; k < 9; k++) {
          // Skip the current cell
          if (k !== j) {
            var variable2 = { row: i, col: k };
            var domain2 = domains[`${i}-${k}`];
            displayArcConsistency(table, variable1, domain1, variable2, domain2);
          }
  
          if (k !== i) {
            var variable3 = { row: k, col: j };
            var domain3 = domains[`${k}-${j}`];
            displayArcConsistency(table, variable1, domain1, variable3, domain3);
          }
  
          var subgridRow = Math.floor(i / 3) * 3;
          var subgridCol = Math.floor(j / 3) * 3;
          var variable4 = { row: subgridRow + Math.floor(k / 3), col: subgridCol + (k % 3) };
          var domain4 = domains[`${variable4.row}-${variable4.col}`];
          displayArcConsistency(table, variable1, domain1, variable4, domain4);
        }
      }
    }
  }
  
  function displayArcConsistency(table, variable1, domain1, variable2, domain2) {
    // Create a row for each arc consistency pair
    var rowElement = table.insertRow();
  
    // Display cell coordinates and domains in columns
    var cell1 = rowElement.insertCell();
    cell1.textContent = `${variable1.row}-${variable1.col}`;
  
    var cell2 = rowElement.insertCell();
    cell2.textContent = `[${domain1.join(', ')}]`;
  
    var cell3 = rowElement.insertCell();
    cell3.textContent = `${variable2.row}-${variable2.col}`;
  
    var cell4 = rowElement.insertCell();
    cell4.textContent = `[${domain2.join(', ')}]`;
  
    // Add styling or other content based on your preferences
  }
  