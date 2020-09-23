'use strict'
console.log('mine sweeper');

var gBoard = [];  // The model
// A Matrix containing cell objects:

var gLevel = {
     SIZE: 4,
     MINES: 2
};
// This is an object by which the
// board size is set (in this case:
// 4x4 board and how many mines
// to put)


var gGame = {
 isOn: false,
 shownCount: 0,
 markedCount: 0,
 secsPassed: 0
}
// This is an object in which you
// can keep and update the
// current game state:
// isOn: Boolean, when true we
// let the user play
// shownCount: How many cells
// are shown
// markedCount: How many cells
// are marked (with a flag)
// secsPassed: How many seconds
// passed




function initGame()  {
    console.log('init');

    // create start game:
    gBoard =  buildBoard(gLevel.SIZE)
    renderBoard(gBoard);
}
//  This is called when page loads


function buildBoard(size) {
    console.log('build board');
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];

        for (let j = 0; j < size; j++) {
            var cellContant =  createCell();
            board[i][j] = cellContant;        
        }
    }

    
    /// Place 2 mines manually when each cell’s isShown set to true. 
    board[1][1].isShown = true;  // shown cell - not mine

    board[2][3].isShown = true; 
    board[2][3].isMine = true;   // shown cell - mine
    
    board[0][2].isMine = true;   // not shown cell - mine
    
    
    board[3][3].isMarked = true;  
    board[3][3].isMine = true;   // not shown marked cell - mine
    
    board[0][3].isMarked = true; // not shown marked cell - not mine 
   
    /////////////////////////////////

    console.table(board)
    return board;
}
//  Builds the board
//  Set mines at random locations
//  Call setMinesNegsCount()
//  Return the created board


function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
        }
    return cell;
}


// setMinesNegsCount(board) 
//  Count mines around each cell
//  and set the cell's
//  minesAroundCount.


function renderBoard(board)  {
    console.log('render board', board);
    
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        console.log(strHTML);
            for (let j = 0; j < board[0].length; j++) {

                strHTML += '<td>';
                    strHTML += getCellHTML(board[i][j]);
                strHTML += '</td>';
                console.log(strHTML);
            }

        strHTML += '</tr>';
    }

    var elTable = document.querySelector('.board');
    elTable.innerHTML = ''
    console.log('board HTML el', elTable);
    
    elTable.innerHTML = strHTML;
    console.log('board HTML el', elTable);
}
//   Render the board as a <table> to the page


function getCellHTML(cellObj) {
    var shownCell =  (cellObj.isShown)? 'shown' : 'notShown';
    var mineCell = (cellObj.isMine)? 'mine' : 'notMine';
    var markCell = (cellObj.isMarked)? 'marked' : 'notMarked';
    
    var strHTML = `<div class="cell ${shownCell} ${mineCell} ${markCell} color${cellObj.minesAroundCount}">${cellObj.minesAroundCount}</div>`
    console.log(strHTML);
    return strHTML;
}

// cellClicked(elCell, i, j) 
//  Called when a cell (td) is  clicked


// cellMarked(elCell) 
//  Called on right click to mark a
//  cell (suspected to be a mine)
//  Search the web (and
//  implement) how to hide the
//  context menu on right click


// checkGameOver() 
//  Game ends when all mines are
//  marked, and all the other cells
//  are shown


// expandShown(board, elCell, i, j)
//  When user clicks a cell with no
//  mines around, we need to open
//  not only that cell, but also its
//  neighbors.
//  NOTE: start with a basic
//  implementation that only opens
//  the non-mine 1
//  st degree
//  neighbors
//  BONUS: if you have the time
//  later, try to work more like the
//  real algorithm (see description
//  at the Bonuses section below)