import { game } from "./game"
import { bindInterface, aiPlay } from "./play";

const animationKeyFrame = [{ opacity: 1}, { opacity: 0 }, { padding: 0, maxHeight: 0, opacity: 0 }]

class Button {
    button: HTMLButtonElement = document.createElement('button');
    constructor(id: string, text: string, event: () => void) {
        this.button.id = id
        this.button.innerText = text
        this.button.addEventListener('click', async () => {
            await this.remove()
            event()
        })
    }

    async remove() {
        const div = document.getElementById('buttonContainer')
        const animation = ([...(div.children)] as HTMLElement[]).map(async element => {
            return await element.animate(animationKeyFrame, 300).finished
                .then(() => element.remove())
        })
        await Promise.all(animation)
    }

    append() {        
        document.getElementById('buttonContainer').append(this.button)
        this.button.animate([...animationKeyFrame].reverse(), 300)
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
    return new Button('twoPlayerBtn', '2 Player', () => {
        game.mode(false)
        startBtn().append()
    })
}

const aiFirstBtn = () => {
    return new Button('aiFirstBtn', '1 Player ( AI first )', () => {
        game.mode(true)
        startBtn().append()
    })
}

const humanFirstBtn = () => {
    return new Button('humanFirstBtn', '1 Player ( Human first )', () => {
        game.mode(true, false)
        startBtn().append()
    })
}

const restartBtn = () => {
    return new Button('restartBtn', 'Play Again', () => {
        game.reset()
        aiFirstBtn().append()
        humanFirstBtn().append()
        twoPlayerBtn().append()
    })
}

export { aiFirstBtn, humanFirstBtn, twoPlayerBtn, restartBtn }