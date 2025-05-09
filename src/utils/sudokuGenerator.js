export function generateSudoku() {
    const board = Array(9).fill(0).map(() =>
      Array(9).fill(0).map(() => ({ value: 0, readonly: false }))
    );
  
    fillDiagonal(board);
    solveSudoku(board);
    removeCells(board, 46); // ~35 clues left
    return board;
  }
  
  function fillDiagonal(board) {
    for (let i = 0; i < 9; i += 3) {
      fillBox(board, i, i);
    }
  }
  
  function fillBox(board, row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!isSafeBox(board, row, col, num));
        board[row + i][col + j] = { value: num, readonly: true };
      }
    }
  }
  
  function isSafeBox(board, rowStart, colStart, num) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[rowStart + i][colStart + j].value === num) return false;
    return true;
  }
  
  function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x].value === num || board[x][col].value === num) return false;
    }
  
    const boxRow = row - (row % 3), boxCol = col - (col % 3);
    return isSafeBox(board, boxRow, boxCol, num);
  }
  
  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = { value: num, readonly: false };
              if (solveSudoku(board)) return true;
              board[row][col] = { value: 0, readonly: false };
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  function removeCells(board, count) {
    let removed = 0;
    while (removed < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col].value !== 0) {
        board[row][col] = { value: 0, readonly: false };
        removed++;
      }
    }
  }
  