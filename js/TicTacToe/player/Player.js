import {Board} from '../board/Board.js';
import Move from '../move/Move.js';
import League from '../piece/League.js';

class Player {
    board;
    legalMoves;

    constructor(board) {
        this.board = board;
        this.legalMoves = this.generateLegalMoves();
        if (this.constructor === Player) {
            throw new TypeError('Abstract class "Piece" cannot be instantiated directly.');
        }
    }

    /**
     * Implementation
     */
    getOpponent() {
        throw new Error('To be implemented by sub-class');
    }

    getLeague() {
        throw new Error('To be implemented by sub-class');
    }

    getLegalMoves() {
        return this.legalMoves;
    }

    toString() {
        return League.isCross(this.getLeague()) ? 'Cross' : 'Noughts';
    }

    /**
     * Concrete
     */

    generateLegalMoves() {
        const moves = [];

        this.board.getTileList().forEach(tile => {
            if (tile.isTileOccupied()) {return;}
            moves.push(new Move(this.getLeague(), tile.getIndex()));
        });

        return Object.freeze(moves);
    }

    getBoard() {
        return this.board;
    }

    makeMove(move) {
        if (move === null) {
            throw new Error('Move cannot be null');
        }
        const moveFound = this.legalMoves.find(legalMove => legalMove.equals(move));
        if (moveFound.constructor === Move) {
            return moveFound.execute(this.board);
        }
        throw new Error('Move passed here is invalid');
    }

    findHorizontalWin() {

        let numberOfTilesOccupied = 0;

        for (let i = 0; i < Board.NUMBER_OF_TILES; i++) {

            const tile = this.board.getTileAt(i);

            numberOfTilesOccupied = i % Board.GRID === 0 ? 0 : numberOfTilesOccupied;

            if (tile.isTileOccupied()) {
                numberOfTilesOccupied = tile.getPiece().getLeague() === this.getOpponent().getLeague() ? numberOfTilesOccupied + 1 : 0;

                if (numberOfTilesOccupied === Board.GRID) { return true; }
            }
        }

        return false;
    }

    findVerticalWin() {

        let limit = Board.NUMBER_OF_TILES - 1;

        let numberOfTilesOccupied = 0, begin = 0, max = Board.GRID * (Board.GRID - 1) + begin;

        for (let i = begin; i <= max; i += Board.GRID) {

            const tile = this.board.getTileAt(i);

            if (tile.isTileOccupied()) {
                numberOfTilesOccupied = tile.getPiece().getLeague() === this.getOpponent().getLeague() ? numberOfTilesOccupied + 1 : 0;

                if (numberOfTilesOccupied === Board.GRID) { return true; }
            }

            if (i === max && max < limit) {
                begin++;
                i = begin - Board.GRID;
                max = Board.GRID * (Board.GRID - 1) + begin;
                numberOfTilesOccupied = 0;
            }
        }

        return false;
    }

    findDiagonalWin(findPositiveSlope) {

        let numberOfTilesOccupied = 0;

        let begin = findPositiveSlope ? Board.GRID - 1 : 0;
        let max = findPositiveSlope ? Board.NUMBER_OF_TILES - 1 : Board.NUMBER_OF_TILES;
        let increment = findPositiveSlope ? Board.GRID - 1 : Board.GRID + 1;

        for (let i = begin; i < max; i += increment) {

            const tile = this.board.getTileAt(i);

            if (!tile.isTileOccupied()) { return false }

            numberOfTilesOccupied = tile.getPiece().getLeague() === this.getOpponent().getLeague() ? numberOfTilesOccupied + 1 : 0;
        }

        return numberOfTilesOccupied === Board.GRID;
    }

    isInCheckmate() {
        return this.findDiagonalWin(true) || this.findDiagonalWin(false) || this.findVerticalWin() || this.findHorizontalWin();
    }

    isStalemate() {
        return this.board.getTileList().every(tile => tile.isTileOccupied());
    }
}

class NoughtsPlayer extends Player {
    constructor(board) {
        super(board);
    }
    getOpponent() {
        return super.getBoard().getCrossPlayer();
    }
    getLeague() {
        return League.league.NOUGHTS;
    }
}

class CrossPlayer extends Player {
    constructor(board) {
        super(board);
    }
    getOpponent() {
        return super.getBoard().getNoughtsPlayer();
    }
    getLeague() {
        return League.league.CROSS;
    }
}

export {CrossPlayer, NoughtsPlayer}