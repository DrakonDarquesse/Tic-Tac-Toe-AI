import {Board} from './TicTacToe/board/Board.js';
import Minimax from './TicTacToe/player/ai/Minimax.js';
import League from './TicTacToe/piece/League.js';

const uiBoardWrapper = document.getElementById('tic-tac-toe-wrapper');
const msg = document.getElementById('message-to-player');
const restartBtn = document.getElementById('restart');
const OAI = document.getElementById('OCheck');
const XAI = document.getElementById('XCheck');

let board = Board.createStandardBoard();
let gameOver = false;

createUIBoard();
const tdArr = document.getElementsByTagName('td');
restartGame();
checkBoxAddListener();

function createUIBoard() {
    for (let i = 0; i < Board.GRID; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < Board.GRID; j++) {
            const td = document.createElement('td');
            td.addEventListener('click', () => {
                if (gameOver) { return; }
                const index = Board.GRID * i + j;
                const move = board.getCurrentPlayer().getLegalMoves().find(move => move.getIndex() === index);
                if (move === undefined || move === null) { return; }
                td.innerHTML = League.ToString(board.getCurrentPlayer().getLeague());
                td.className = 'occupied';
                board = board.getCurrentPlayer().makeMove(move);
                msg.innerHTML = 'Game running...';
                currentPlayerIsAI() ? aiMakeMove() : checkEndGame();
            })
            tr.append(td);
        }
        uiBoardWrapper.appendChild(tr);
    }
}

function aiMakeMove() {
    checkEndGame();
    if (gameOver) { return; }
    msg.innerHTML = 'AI thinking...';
    const move = new Minimax().makeMove(board);
    tdArr[move.getIndex()].innerHTML = League.ToString(board.getCurrentPlayer().getLeague());
    tdArr[move.getIndex()].className = 'occupied';
    board = move.execute(board);
    msg.innerHTML = 'Game running...';
    currentPlayerIsAI() ? aiMakeMove() : checkEndGame();
}

function checkEndGame() {
    if (gameOver) { return; }
    if (board.getCurrentPlayer().isInCheckmate()) {
        gameOver = true;
        msg.innerHTML = `${League.ToString(board.getCurrentPlayer().getOpponent().getLeague())} has won!`;
    } else if (board.getCurrentPlayer().isStalemate()) {
        gameOver = true;
        msg.innerHTML = 'Game Drawn!';
    }
}

function restartGame() {
    restartBtn.addEventListener('click', () => {
        if (confirm('Confirmation to restart game')) {
            gameOver = false;
            board = Board.createStandardBoard();
            for (let i = 0; i < tdArr.length; i++) {
                tdArr[i].innerHTML = '';
                tdArr[i].className = '';
            }
            msg.innerHTML = 'Game started...';
        }
    })
}

function currentPlayerIsAI() {
    if (League.isCross(board.getCurrentPlayer().getLeague()) && XAI.checked) {
        return true;
    } else if (!League.isCross(board.getCurrentPlayer().getLeague()) && OAI.checked) {
        return true;
    }
}

function checkBoxAddListener() {
    const listener = () => {
        if (currentPlayerIsAI()) {
            aiMakeMove()
        }
    };
    OAI.addEventListener('click', listener);
    XAI.addEventListener('click', listener);
}

const toggleSun = document.getElementById('toggle-sun');
const toggleMoon = document.getElementById('toggle-moon');
const classList = document.body.classList;
const THEME_KEY = 'THEME_KEY';

toggle(toggleSun, toggleMoon, true);
toggle(toggleMoon, toggleSun, false);
chooseThemeBasedOnStorage();

function chooseThemeBasedOnStorage() {
    if (JSON.parse(localStorage.getItem(THEME_KEY)) === true) {
        classList.toggle('light-theme');
        toggleSun.style.color = 'transparent';
        toggleMoon.style.color = 'var(--secondary-color)';
    } else {
        toggleMoon.style.color = 'transparent';
        toggleSun.style.color = 'var(--secondary-color)';
    }
}

function toggle (toggleNow, toggleLater, isLight) {
    toggleNow.addEventListener('click', () => {
        const dark = !JSON.parse(localStorage.getItem(THEME_KEY)) === true && !isLight;
        const light = JSON.parse(localStorage.getItem(THEME_KEY)) === true && isLight
        if (light || dark) { return; }
        toggleNow.style.color = 'transparent';
        toggleLater.style.color = 'var(--secondary-color)';
        classList.toggle('light-theme');
        localStorage.setItem(THEME_KEY, isLight);
    });
}