import { game } from "./game"
import { bindInterface, aiPlay } from "./play";

class Button {
    button: HTMLButtonElement = document.createElement('button');
    constructor(id: string, text: string, event: () => void) {
        this.button.id = id
        this.button.innerText = text
        this.button.addEventListener('click', () => {
            this.remove()
            event()
        })
    }

    remove() {
        const div = document.getElementById('buttonContainer')
        while (div.hasChildNodes()) {
            div.removeChild(div.firstChild);
        }
    }

    append() {
        document.getElementById('buttonContainer').append(this.button)
    }
}

const startBtn = () => {
    return new Button('playBtn', 'Start', () => {
        bindInterface()
        game.moves++;    
        if (game.ai && game.playerBool) aiPlay()
    })
}

const twoPlayerBtn = () => {
    return new Button('twoPlayerBtn', 'Two Player', () => {
        game.mode(false)
        startBtn().append()
    })
}

const aiFirstBtn = () => {
    return new Button('aiFirstBtn', 'Single Player (AI first)', () => {
        game.mode(true)
        startBtn().append()
    })
}

const humanFirstBtn = () => {
    return new Button('humanFirstBtn', 'Single Player (Human first)', () => {
        game.mode(true, false)
        startBtn().append()
    })
}

const restartBtn = () => {
    return new Button('restartBtn', 'Play Again', () => {
        document.getElementById('resultContainer').firstChild.remove()
        game.reset()
        aiFirstBtn().append()
        humanFirstBtn().append()
        twoPlayerBtn().append()
    })
}

export { aiFirstBtn, humanFirstBtn, twoPlayerBtn, restartBtn }