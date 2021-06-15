import League from '../../piece/League.js';

class Minimax {

    static DEPTH = 4;

    makeMove(board) {
        const currentPlayer = board.getCurrentPlayer();
        let highestSeenValue = Number.NEGATIVE_INFINITY, lowestSeenValue = Number.POSITIVE_INFINITY;

        let bestMove = null;

        for (const move of currentPlayer.getLegalMoves()) {
            const latestBoard = currentPlayer.makeMove(move);
            if (latestBoard.getCurrentPlayer().isInCheckmate() || latestBoard.getCurrentPlayer().isStalemate()) {
                return move;
            }
            const currentVal = League.isCross(currentPlayer.getLeague()) ?
                this.min(latestBoard, Minimax.DEPTH - 1, highestSeenValue, lowestSeenValue) :
                this.max(latestBoard, Minimax.DEPTH - 1, highestSeenValue, lowestSeenValue);

            if (League.isCross(currentPlayer.getLeague()) && currentVal > highestSeenValue) {
                highestSeenValue = currentVal;
                bestMove = move;
            }
            else if (!League.isCross(currentPlayer.getLeague()) && currentVal < lowestSeenValue) {
                lowestSeenValue = currentVal;
                bestMove = move;
            }
        }

        return bestMove;
    }

    min(board, depth, highestValue, lowestValue) {
        if (board.getCurrentPlayer().isInCheckmate()) {
            return 10 - depth;
        }
        if (board.getCurrentPlayer().isStalemate()) {
            return -depth;
        }
        let currentLowest = lowestValue;
        const currentPlayer = board.getCurrentPlayer();
        for (const move of currentPlayer.getLegalMoves()) {
            const latestBoard = currentPlayer.makeMove(move);
            currentLowest = Math.min(currentLowest, this.max(latestBoard, depth - 1, highestValue, currentLowest));
            if (currentLowest <= highestValue) {
                return highestValue;
            }
        }
        return currentLowest;
    }

    max(board, depth, highestValue, lowestValue) {
        if (board.getCurrentPlayer().isInCheckmate()) {
            return depth - 10;
        }
        if (board.getCurrentPlayer().isStalemate()) {
            return depth;
        }
        let currentHighest = highestValue;
        const currentPlayer = board.getCurrentPlayer();
        for (const move of currentPlayer.getLegalMoves()) {
            const latestBoard = currentPlayer.makeMove(move);
            currentHighest = Math.max(currentHighest, this.min(latestBoard, depth - 1, currentHighest, lowestValue));
            if (currentHighest >= lowestValue) {
                return lowestValue;
            }
        }
        return currentHighest;
    }
}

export default Minimax;