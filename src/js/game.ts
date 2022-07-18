import { board } from "./board";

class Game {
	playerBool = true; // true is AI when ai is true
	ai = false;
	moves = 0;

	checkStatus = (bool: boolean, moves: number = this.moves): boolean => {
		if (moves >= 3) {
			if (board.checkThreeInRow(bool)) return true
			if (moves > 8) return false;
		}
		return null;
	}

	switchPlayer = () => this.playerBool = !this.playerBool

	reset = () => {
		this.moves = 0;
		board.createSpaces()
	}

	mode = (isSingle: boolean, isHumanFirst: boolean = true) => {
		this.ai = isSingle
		this.playerBool = isHumanFirst
	}
}

let game: Game = new Game();

export { Game, game }
