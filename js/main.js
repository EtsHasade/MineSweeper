'use strict'
console.log('mine sweeper');


var gBoard = [];  // The model
// A Matrix containing cell objects:

var gTimer;
// interval for second pass in game

var gLevel = [
    { SIZE: 4,  MINES: 2,  LIFE: 1, SAFE_CLICK: 3, HINTS: 3},
    { SIZE: 8,  MINES: 12, LIFE: 2, SAFE_CLICK: 3, HINTS: 3},
    { SIZE: 12, MINES: 30, LIFE: 3, SAFE_CLICK: 3, HINTS: 3}
];
// This is an object by which the
// board size is set (in this case:
// 4x4 board and how many mines
// to put)

var gBEGINNER = 0;
var gMEDIUM = 1;
var gEXPERT = 0;
var gCurrLevel = gBEGINNER;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    beforFirstClick: true,
    lifeCount: gLevel[gCurrLevel].LIFE,
    isHintActive: null
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


var gRenderView = {
    strSimbolLife: simbolLifeFromHTML(),
    strSimbolDeah: '💥'
}


function initBeginner() {
    gGame.isOn = false;
    gCurrLevel = 0;
    initGame();
}


function initMedium() {
    gGame.isOn = false;
    gCurrLevel = 1;
    initGame();
}


function initExpert() {
    gGame.isOn = false;
    gCurrLevel = 2;
    initGame();
}




function initGame() {
    console.log('init');
    clearInterval(gTimer);

    gBoard = [];
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lifeCount: gLevel[gCurrLevel].LIFE,
        beforFirstClick: true,
        lifeCount: gLevel[gCurrLevel].LIFE
    }

    // create start game:
    gGame.isOn = true;
    gGame.beforFirstClick = true;
    resetFeatures();
    reActiveSafeCell();
    face(NORMAL);
    
    gBoard = buildBoard(gLevel[gCurrLevel].SIZE)
    renderBoard(gBoard);

    //render view
    elLifeCount()
    elMarkedCount()
    console.table('end init gBoard', gBoard)


}
//  This is called when page loads



function resetFeatures() {
    var elFeatures = document.querySelector('.features');
    elFeatures.innerHTML = '<button class="safeClick" onclick="safeClick(this, gBoard)"><p>1</p>Safe click</button>';

    for (var i = 0; i < gLevel[gCurrLevel].HINTS; i++) {
        elFeatures.innerHTML +=  '<button class="hint" onclick="hint(this)">💡</button>';
    }

    console.log(elFeatures);
}




function buildBoard(size) {
    console.log('build board');
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];

        for (var j = 0; j < size; j++) {
            var cellContant = createCell(i, j);
            board[i][j] = cellContant;

        }
    }
    console.table('finish biuld board', board)
    return board;
}
//  Builds the board
//  Set mines at random locations
//  Call setMinesNegsCount()
//  Return the created board


function genMines(board, mineAmount, safeCEll) {
    // board[3][2].isMine = true;   // shown cell - mine
    // board[3][1].isMine = true;   // shown cell - mine

    while (mineAmount > 0) {
        console.log('tray agian gen mines', mineAmount);

        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                var cell = board[i][j];

                if (cell.isMine || cell.location.i === safeCEll.location.i && cell.location.j === safeCEll.location.j) continue;

                // if (getRandomInt(0, (board.length * board[0].length) - 1) === 1) {
                console.log('mineAmount', mineAmount);
                if (getRandomInt(0, (board.length * board[0].length) - 1) === 1) {
                    board[i][j].isMine = true;
                    console.log('gen mine in cell:', board[i][j]);
                    mineAmount--;
                    if (mineAmount <= 0) return;
                } else {
                    console.log('not Gen mine in cell:', board[i][j]);
                }
            }
        }

    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createCell(i, j) {
    var cell = {
        location: { i: i, j: j },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}


function setMinesNegsCount(board) {
    console.log('count ngs');

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // console.log(board[i][j]);
            var cell = board[i][j];
            cell.minesAroundCount = getNgsCount(board, cell.location);
        }
    }

}
//  Count mines around each cell
//  and set the cell's
//  minesAroundCount.


function getNgsCount(board, locationObj) {
    var mineCount = 0;

    for (var i = locationObj.i - 1; i <= locationObj.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = locationObj.j - 1; j <= locationObj.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === locationObj.i && j === locationObj.j) continue;

            // console.log('cell ', locationObj, 'ngs', i, '-', j, '-', board[i][j]);
            var cell = board[i][j];
            if (cell.isMine) mineCount++;
        }
    }
    return mineCount;
}
// Neighbors loop to count and return neighbors mine 





function renderBoard(board) {
    console.log('render board', board);

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        // console.log(strHTML);
        for (let j = 0; j < board[0].length; j++) {

            strHTML += '<td>';
            strHTML += creatCellHTML(board[i][j]);

            strHTML += '</td>';
            // console.log(strHTML);
        }
        strHTML += '</tr>';
    }

    var elTable = document.querySelector('.board');
    elTable.innerHTML = ''
    // console.log('board HTML el', elTable);

    elTable.innerHTML = strHTML;
    // console.log('board HTML el', elTable);
}
//   Render the board as a <table> to the page


function creatCellHTML(cellObj) {
    var shownCell = (cellObj.isShown) ? 'shown' : 'notShown';

    var mineCell = (cellObj.isMine) ? 'mine' : 'notMine';
    var mineImg = (cellObj.isMine) ? '<img src="img/mine2.png">' : '';

    var markCell = (cellObj.isMarked) ? 'marked' : 'notMarked';

    var strHTML = `<div class="cell ${shownCell} ${mineCell} ${markCell} color${cellObj.minesAroundCount}" data-loc ='${cellObj.location.i}-${cellObj.location.j}' onclick="cellClicked(this)" oncontextmenu="cellMarked(this, event)">${cellObj.minesAroundCount}${mineImg}</div>`
    // console.log(strHTML);
    return strHTML;
}
// create str HTML from a object cell (in gBoard) data



function cellClicked(elCell) {
    if (!gGame.isOn) return;
    var objCell = getObjCellFromElCell(elCell);
    console.log('objCell', objCell);

    if (gGame.beforFirstClick) {
        gGame.beforFirstClick = false;
        setShownTrue(objCell, elCell);
        genMines(gBoard, gLevel[gCurrLevel].MINES, objCell);
        setMinesNegsCount(gBoard)
        renderBoard(gBoard);
        timerView()
    }

    if (objCell.isMarked) return;

    if(gGame.isHintActive) {
        showHint(gBoard, elCell);
        console.log('hint activet!');
        return;
    }

    face(CLICK);
    setShownTrue(objCell, elCell);
    expandShown(gBoard, objCell);
    checkIfGotMine(objCell);
}
//  Called when a cell (td) is  clicked


function getObjCellFromElCell(elCell) {
    var location = elCell.dataset.loc.split('-');
    var objCell = gBoard[location[0]][location[1]]
    return objCell;
}
//get ObjCell from gBoard From ElCel from DOM using datd-loc='i-j'


function setShownTrue(objCell, elCell) {
    if (objCell.isShown) return;

    console.log('gGame.shownCount', gGame.shownCount);

    objCell.isShown = true;
    elCell.classList.add("shown");
    elCell.classList.remove("notShown");
    gGame.shownCount++;
    // console.log('gGame.shownCount', gGame.shownCount);
}
// update data model and render that the cell is shown.


function cellMarked(elCell, event) {
    event.preventDefault()
    console.log('right click');

    if (!gGame.isOn) return;
    if (gGame.beforFirstClick) return;

    var objCell = getObjCellFromElCell(elCell);
    console.log('obj-cell', objCell);
    if (objCell.isShown) return;


    objCell.isMarked = (objCell.isMarked) ? false : true;
    if (objCell.isMarked) gGame.markedCount++;
    else gGame.markedCount--;
    if (objCell.isMarked) checkIfGotMine(objCell);

    elCell.classList.toggle('marked');

    console.log('gGame.markedCount', gGame.markedCount);
    elMarkedCount()
}
//  Called on right click to mark or toggle mark a
//  cell (suspected to be a mine)



function checkIfGotMine(objCell) {
    console.log('chek go');
    if (objCell.isMine && objCell.isShown) {
        gGame.lifeCount--;
        elLifeCount()
        face(BOOM);

    }
    if (gGame.lifeCount <= 0) gameOvar('Loser');
    if (gGame.shownCount + gGame.markedCount === gBoard.length ** 2 && gGame.markedCount === gLevel[gCurrLevel].MINES) gameOvar('Winner')
}
//  Game ends when all mines are
//  marked, and all the other cells
//  are shown


function gameOvar(msg) {
    console.log('game over -', msg);
    var emotion = (msg === 'Loser') ? GAME_OVER : WINNER;
    face(emotion);
    // alert('game over -' + msg);
    gGame.isOn = false;
    shownAllmines(gBoard);
    renderBoard(gBoard);
    clearInterval(gTimer);

}

function shownAllmines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (cell.isMine) cell.isShown = true;

        }
    }
}

var expends = [];
function expandShown(board, objCell) {
    console.log(objCell);

    if (objCell.minesAroundCount === 0 && !objCell.isMine) {

        for (var i = objCell.location.i - 1; i <= objCell.location.i + 1; i++) {
            if (i < 0 || i > board.length - 1) continue;

            for (var j = objCell.location.j - 1; j <= objCell.location.j + 1; j++) {
                // if (board[i][j].isShown) continue; // for full expend

                if (j < 0 || j > board[0].length - 1) continue;
                if (i === objCell.location.i && j === objCell.location.j) continue;

                var elNg = document.querySelector(`[data-loc='${i}-${j}']`);
                setShownTrue(board[i][j], elNg);
                
                // expends.push(board[i][j]);   // for full expend
                // console.log('push to exp',expends);   // for full expend


                //// full expend:
                // cellClicked(elNg);
            }
        }
    }


}

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



function simbolLifeFromHTML() {
    var elLife = document.querySelector('.lifeView span');
    return elLife.innerText;
}


function elLifeCount() {
    var elLife = document.querySelector('.lifeView span');
    console.log('elLife', elLife);
    elLife.innerText = '';
    console.log('elLife.innerText', elLife.innerText);

    setTimeout(function () {
        elLife.style.marginLeft = '50px';
        for (let i = 1; i <= gLevel[gCurrLevel].LIFE; i++) {
            if (i <= gGame.lifeCount) {
                elLife.innerText += gRenderView.strSimbolLife;
            } else {
                elLife.innerText += gRenderView.strSimbolDeah;
            }
            // console.log('elLife.innerText', elLife.innerText);
        }
    }, 200)





    setTimeout(function () {
        elLife.style.marginLeft = 'auto';
    }, 150)
}


function elMarkedCount() {
    var elLife = document.querySelector('.markedView span');
    // console.log('elLife', elLife);
    elLife.innerText = gGame.markedCount + '/' + gLevel[gCurrLevel].MINES;
}



function timerView() {
    var elTimer = document.querySelector('.timerView span');
    var startTimeSec = Date.now(); // Get Starting time in MS
    var startTimeMin = Date.now(); // Get Starting time in MS
    var endTime = 0;
    var timeDiffSec = 0;
    var timeDiffMin = 0;

    gTimer = setInterval(function () {
        endTime = Date.now(); // Get current Time
        // console.log('end time',endTime);
        if (Math.floor((endTime - startTimeSec) * 0.001) > 60) {
            startTimeSec = Date.now();
        }

        timeDiffSec = Math.floor((endTime - startTimeSec) * 0.001); // current time - startTime = Time Elapsed
        timeDiffMin = Math.floor((endTime - startTimeMin) / 60 * 0.001); // current time - startTime = Time Elapsed
        elTimer.innerText = '' + timeDiffMin + ':' + timeDiffSec;
        // console.log(timeDiffMin + ':' + timeDiffSec);

    }, 1000);

    // console.log(gGame.secsPassed);

}



var NORMAL = 'normal';
var BOOM = 'boom';
var GAME_OVER = 'game over';
var WINNER = 'winner';
var CLICK = 'click';
var timeFace;

function face(status = 'normal') {
    var elFace = document.querySelector('.face');

    switch (status) {
        case 'normal':
            clearTimeout(timeFace);
            elFace.innerText = '😺';
            elFace.style.textShadow = 'none';
            break;

        case 'boom':
            clearTimeout(timeFace);
            elFace.innerText = '😾';
            elFace.style.textShadow = '0px 0px 15px red';
            timeFace = setTimeout(function () {
                face(NORMAL);
            }, 2000);
            break;

        case 'click':
            clearTimeout(timeFace);
            elFace.innerText = '🐱';
            timeFace = setTimeout(function () {
                face(NORMAL);
            }, 250);
            break;

        case 'game over':
            clearTimeout(timeFace);
            elFace.innerText = '🙀';
            elFace.style.textShadow = '0px 0px 15px red';
            break;

        case 'winner':
            clearTimeout(timeFace);
            elFace.innerText = '🐱‍👤';
            elFace.style.textShadow = '0px 0px 15px rgb(255, 242, 206)';
            break;

        default:
            elFace.innerText = '😺';
            break;
    }

}



var safeClickCount = gLevel[gCurrLevel].SAFE_CLICK;
function reActiveSafeCell() {
    safeClickCount = gLevel[gCurrLevel].SAFE_CLICK;
    var elSafe = document.querySelector('.safeClick');
    elSafe.style.backgroundColor = '';

    elSafe.querySelector('p').innerText = safeClickCount;
}



function safeClick(elSafe, board) {
    if (!gGame.isOn) return;
    if (safeClickCount <= 0) return;
    if (safeClickCount === 1) elSafe.style.background = 'rgb(85, 89, 107)';

    
    var flatBoardCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (cell.isMine || cell.isShown) continue;

            var elCell = document.querySelector(`[data-loc='${i}-${j}']`)
            flatBoardCells.push(elCell);
        }
    }

    var elFlicker = flatBoardCells[getRandomInt(0, board.length*board[0].length)];
    elFlicker.classList.toggle('flicker');
    setTimeout(function () {
        elFlicker.classList.toggle('flicker');
    }, 1000);

   safeClickCount--;
   elSafe.querySelector('p').innerText = safeClickCount;
}


function hint(elBtnHint) {
    console.log(elBtnHint.classList);
    if (gGame.isHintActive) {
            gGame.isHintActive = null;
            elBtnHint.classList.remove('hintActive')
            // document.querySelector('.game').style.cursor = 'regular';
            console.log(gGame.isHintActive);
            
            
        } else {
            gGame.isHintActive = elBtnHint;
            elBtnHint.classList.add('hintActive')
            // document.querySelector('.game').style.cursor = 'zoom-in';
            console.log(gGame.isHintActive);
        }
    // elBtnHint.style.display = 'none';    
}

var gHintShowens = [];
function showHint(board, elCell) {
    gGame.isHintActive.style.display = 'none';
    document.querySelector('.game').style.cursor = 'default';
    gGame.isHintActive = null;
    console.log('hint?',gGame.isHintActive);
    
    var objCell = getObjCellFromElCell(elCell);

    for (var i = objCell.location.i - 1; i <= objCell.location.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;

        for (var j = objCell.location.j - 1; j <= objCell.location.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (board[i][j].isShown) return;

            var elNg = document.querySelector(`[data-loc='${i}-${j}']`);
            setShownTrue(board[i][j], elNg);
            gHintShowens.push({objCell:board[i][j], elCell: elNg})
            setTimeout(function() {
                for (var i = 0; i < gHintShowens.length; i++) {
                    var cells = gHintShowens.pop();
                    var objCell = cells.objCell;
                    var elCell = cells.elCell;
                  
                    objCell.isShown = false;
                    elCell.classList.add("notShown");
                    elCell.classList.remove("shown");
                    gGame.shownCount--;
                    console.log('gGame.shownCount', gGame.shownCount);
                }
            },1000);

        }
    }

}