import Piece from '../piece/Piece.js';
import {BoardBuilder} from '../board/Board.js';

class Move {
    piece;
    constructor(league, index) {
        this.piece = Piece.createPiece(league, index);
    }

    execute(board) {
        const builder = new BoardBuilder(board.getCurrentPlayer().getOpponent(board).getLeague());
        board.getTileList().forEach(tile => builder.appendTile(tile));
        builder.setPiece(this.piece);
        return builder.build();
    }

    getPiece() {
        return this.piece;
    }

    getIndex() {
        return this.piece.getIndex();
    }

    equals(move) {
        if (move.constructor === Move) {
            return move.piece.getIndex() === this.piece.getIndex() && move.piece.getLeague() === this.piece.getLeague();
        }
        throw new Error('Parameter should be type move');
    }
}

export default Move;