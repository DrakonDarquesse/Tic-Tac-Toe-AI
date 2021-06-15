import League from '../piece/League.js';

class Piece {
    league;
    index;
    constructor(league, index) {
        this.league = league;
        this.index = index;
        if (this.constructor === Piece) {
            throw new TypeError('Abstract class "Piece" cannot be instantiated directly.');
        }
    }

    getIndex() {
        return this.index;
    }

    getLeague() {
        return this.league;
    }

    toString() {
        return League.ToString(this.league);
    }

    static createPiece(league, index) {
        return League.isCross(league) ? new CrossPiece(index) : new NoughtsPiece(index);
    }
}

class NoughtsPiece extends Piece {
    constructor(index) {
        super(League.league.NOUGHTS, index);
    }
}

class CrossPiece extends Piece {
    constructor(index) {
        super(League.league.CROSS, index);
    }
}

export default Piece;