import { board } from "./board";
import { restartBtn } from "./button";
import { o, x } from "./constants";
import { game } from "./game"
import { GetGoodMove } from "./minimax";

const putText = (i: number) => {
    board.cells[i].value = game.playerBool ? o : x;
    play(i)
}

const play = async (index: number) => {
    board.spaces[index].setVal(game.playerBool);
    const status = game.checkStatus(game.playerBool)
    if (status != null) {
        resultGenerator(status)
        unbindInterface()
        return
    }
    game.moves++;
    game.switchPlayer()

    if (game.ai && game.playerBool && game.moves <= 9) {
        await aiPlay()
        return
    }
}

const aiPlay = async () => {
    const index: number = (await GetGoodMove()).boxIndex
    board.spaces[index].setVal(game.playerBool);
    board.cells[index].click()
}

const resultGenerator = (result:boolean) => {
    const resultText = result? (game.playerBool ? o : x)  + ' WINS' : 'DRAW'
    const resultElement = document.createElement('h1') 
    resultElement.innerText = resultText
    document.getElementById('buttonContainer').append(resultElement);
    restartBtn().append()
}

function bindInterface() {
    for (let i = 0; i < 9; i++) {
        board.cells[i] = document.getElementsByTagName("input")[i];
        board.cells[i].value = '';
        board.cells[i].addEventListener('click', putText.bind(this, i), { once: true })
    }
}

function unbindInterface() {
    for (let i = 0; i < 9; i++) {
        const clone = board.cells[i].cloneNode()
        board.cells[i].replaceWith(clone)
    }
}

export  { bindInterface, aiPlay }