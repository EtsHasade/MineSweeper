'use strict'
console.log('mine sweeper');


var gBoard = [];  // The model
// A Matrix containing cell objects:

var gTimer;
// interval for second pass in game

var gLevel = [
    { SIZE: 4, MINES: 2, LIFE: 2, SAFE_CLICK: 3, HINTS: 3 },
    { SIZE: 8, MINES: 12, LIFE: 2, SAFE_CLICK: 3, HINTS: 3 },
    { SIZE: 12, MINES: 30, LIFE: 3, SAFE_CLICK: 3, HINTS: 3 }
];
// This is an object by which the
// board size is set (in this case:
// 4x4 board and how many mines
// to put)

var gBEGINNER = 0;
var gMEDIUM = 1;
var gEXPERT = 2;
var gCurrLevel = gBEGINNER;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    milSecsPassed: 0,
    beforFirstClick: true,
    lifeCount: gLevel[gCurrLevel].LIFE,
    minsExplodeds: 0,
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

var gBestScore = [
    { milSecsPassed: Infinity, endTimeStr: '00:00:00', minsExplodeds: Infinity, useHints: Infinity, useSafeCell: Infinity, name: '---', date: '00/00/00 00:00' },
    { milSecsPassed: Infinity, endTimeStr: '00:00:00', minsExplodeds: Infinity, useHints: Infinity, useSafeCell: Infinity, name: '---', date: '00/00/00 00:00' },
    { milSecsPassed: Infinity, endTimeStr: '00:00:00', minsExplodeds: Infinity, useHints: Infinity, useSafeCell: Infinity, name: '---', date: '00/00/00 00:00' }
]


var gRenderView = {
    strSimbolLife: simbolLifeFromHTML(),
    strSimbolDeah: '💥'
}


function initBeginner() {
    gGame.isOn = false;
    gCurrLevel = gBEGINNER;
    initGame();
}


function initMedium() {
    gGame.isOn = false;
    gCurrLevel = gMEDIUM;
    initGame();
}


function initExpert() {
    gGame.isOn = false;
    gCurrLevel = gEXPERT;
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
        milSecsPassed: 0,
        minsExplodeds: 0,
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
    recordBestScore()

}
//  This is called when page loads



function resetFeatures() {
    var elFeatures = document.querySelector('.features');
    elFeatures.innerHTML = '<button class="safeClick" onclick="safeClick(this, gBoard)"><p>1</p>Safe click</button>';

    for (var i = 0; i < gLevel[gCurrLevel].HINTS; i++) {
        // elFeatures.innerHTML +=  '<button class="hint" onclick="hint(this)">💡</button>';
        elFeatures.innerHTML += '<div class="hintBox"><button class="hint" onclick="hint(this)">🔍</button></div>';
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


var gCellsWithoutSafeCell;
function genMines(board, mineAmount, safeCEll) {
    gCellsWithoutSafeCell = [];
    console.log('gen mines -', mineAmount);

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];

            console.log('cell.location.i === safeCEll.location.i && cell.location.j === safeCEll.location.j', 'i:', cell.location.i, safeCEll.location.i, 'j', cell.location.j, safeCEll.location.j);
            if (cell.location.i === safeCEll.location.i && cell.location.j === safeCEll.location.j) continue;
            gCellsWithoutSafeCell.push(cell);
        }
    }
    console.log('gen mines arr:', gCellsWithoutSafeCell);
    for (var i = 0; i < mineAmount; i++) {
        var idx = getRandomInt(0, gCellsWithoutSafeCell.length);
        var cellMine = gCellsWithoutSafeCell[idx];
        gCellsWithoutSafeCell.splice(idx, 1);

        cellMine.isMine = true;
        console.log('gen mine in cell  -', cellMine);
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

    if (gGame.isHintActive) {
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

    if (!objCell.isMarked) {
        objCell.isMarked = true;
        gGame.markedCount++;
        checkIfGotMine(objCell);

    } else {
        objCell.isMarked = false;
        gGame.markedCount--;

    }

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
        console.log('min exp', gGame.minsExplodeds);
        gGame.minsExplodeds++;
        console.log('min exp', gGame.minsExplodeds);
        elLifeCount()
        face(BOOM);

    }
    checkGameOver();
}



function checkGameOver() {
    if (gGame.lifeCount <= 0) {
        gameOvar(GAME_OVER)
        console.log('gameOvar-Loser');
    } else if (gGame.shownCount + gGame.markedCount === gBoard.length ** 2 &&
        gGame.markedCount + gGame.minsExplodeds === gLevel[gCurrLevel].MINES) {
        gameOvar(WINNER);
        console.log('gameOvar-Winner');
        recordBestScore()
    }
}
//  Game ends when all mines are
//  marked, and all the other cells
//  are shown


function gameOvar(msg) {
    console.log('game over -', msg);
    face(msg);
    // alert('game over -' + msg);
    gGame.isOn = false;
    shownAllmines(gBoard);
    renderBoard(gBoard);
    clearInterval(gTimer);

}


function recordBestScore() {
    console.log('check score');
    console.log(gBestScore[gCurrLevel]);

    if (gGame.milSecsPassed > 0 && gGame.milSecsPassed < gBestScore[gCurrLevel].milSecsPassed) {
        console.log('new best score');
        gBestScore[gCurrLevel].milSecsPassed = gGame.milSecsPassed

        var endTimeStr = new Date(gGame.milSecsPassed).toGMTString();
        gBestScore[gCurrLevel].endTimeStr = endTimeStr.substr(endTimeStr.length - 12, 8);

        gBestScore[gCurrLevel].name = prompt('Hi winnwer!, please enter your name:', 'my name');
        gBestScore[gCurrLevel].minsExplodeds = gGame.minsExplodeds;
        gBestScore[gCurrLevel].useHints = gLevel[gCurrLevel].HINTS - document.querySelectorAll('.hint').length
        gBestScore[gCurrLevel].useSafeCell = gLevel[gCurrLevel].SAFE_CLICK - gSafeClickCount;
        gBestScore[gCurrLevel].date = new Date().toLocaleString();
    }

    if (gBestScore[gCurrLevel].milSecsPassed === Infinity) {
        document.querySelector('.floor').innerHTML = 'there is no best player in this level';
        return;
    }

    document.querySelector('.floor').innerHTML =
        `<table>
     <tr><td>Best player    :  </td><td>${gBestScore[gCurrLevel].name}</td></tr>
     <tr><td>Date           :  </td><td>${gBestScore[gCurrLevel].date}</td></tr>
     <tr><td>End in time    :  </td><td>${gBestScore[gCurrLevel].endTimeStr}</td></tr>
     <tr><td>Hint used      :  </td><td>${gBestScore[gCurrLevel].useHints}</td></tr>
     <tr><td>Safe click used:  </td><td>${gBestScore[gCurrLevel].useSafeCell}</td></tr>
    </table>`;

    console.log(gBestScore[gCurrLevel]);
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
    var startGame = Date.now()
   
    gTimer = setInterval(function() {
        var timePass = Date.now()
        gGame.milSecsPassed = timePass - startGame;
        var dateStr = new Date(gGame.milSecsPassed).toGMTString()
        elTimer.innerText = dateStr.substr(dateStr.length - 12, 8)
        
    },1000);
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



var gSafeClickCount = gLevel[gCurrLevel].SAFE_CLICK;
function reActiveSafeCell() {
    gSafeClickCount = gLevel[gCurrLevel].SAFE_CLICK;
    var elSafe = document.querySelector('.safeClick');
    elSafe.style.backgroundColor = '';

    elSafe.querySelector('p').innerText = gSafeClickCount;
}



function safeClick(elSafe, board) {
    if (!gGame.isOn) return;
    if (gSafeClickCount <= 0) return;
    if (gSafeClickCount === 1) elSafe.style.background = 'rgb(85, 89, 107)';


    var flatBoardCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (cell.isMine || cell.isShown) continue;

            var elCell = document.querySelector(`[data-loc='${i}-${j}']`)
            flatBoardCells.push(elCell);
        }
    }

    var elFlicker = flatBoardCells[getRandomInt(0, flatBoardCells.length)];
    elFlicker.classList.toggle('flicker');
    setTimeout(function () {
        elFlicker.classList.toggle('flicker');
    }, 1000);

    gSafeClickCount--;
    elSafe.querySelector('p').innerText = gSafeClickCount;
}


function hint(elBtnHint) {
    console.log(elBtnHint.classList);
    if (gGame.isHintActive === elBtnHint) {
        gGame.isHintActive = null;

        var hints = document.querySelectorAll('.hintActive');
        for (var hint = 0; hint < hints.length; hint++) {
            hints[hint].classList.remove('hintActive')
        }
        // elBtnHint.classList.remove('hintActive')

        document.querySelector('.game').style.cursor = 'default';
        console.log(gGame.isHintActive);


    } else {
        gGame.isHintActive = elBtnHint;

        var hints = document.querySelectorAll('.hintActive');
        for (var hint = 0; hint < hints.length; hint++) {
            hints[hint].classList.remove('hintActive')
        }
        elBtnHint.classList.add('hintActive')
        document.querySelector('.game').style.cursor = 'zoom-in';
        console.log(gGame.isHintActive);
    }
    // elBtnHint.style.display = 'none';    
}

var gHintShowens = [];
function showHint(board, elCell) {
    gGame.isHintActive.style.display = 'none';
    document.querySelector('.game').style.cursor = 'default';
    gGame.isHintActive = null;
    console.log('hint?', gGame.isHintActive);

    var objCell = getObjCellFromElCell(elCell);

    for (var i = objCell.location.i - 1; i <= objCell.location.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;

        for (var j = objCell.location.j - 1; j <= objCell.location.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (board[i][j].isShown) return;

            var elNg = document.querySelector(`[data-loc='${i}-${j}']`);
            setShownTrue(board[i][j], elNg);
            gHintShowens.push({ objCell: board[i][j], elCell: elNg })
            setTimeout(function () {
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
            }, 1000);

        }
    }

}



