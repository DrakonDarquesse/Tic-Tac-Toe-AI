class Tile {

    index;

    constructor(index) {
        this.index = index;
        if (this.constructor === Tile) {
            throw new TypeError('Abstract class "Tile" cannot be instantiated directly.');
        }
    }
    /**
     * Implementation
     */
    isTileOccupied() {
        throw new Error('You have to implement the method isTileOccupied!');
    }
    getPiece() {
        throw new Error('You have to implement the method getPiece!');
    }

    /**
     * Concrete
     */
    getIndex() {return this.index;}

    static createTile(piece, index) {
        return piece === null ? new EmptyTile(index) : new OccupiedTile(piece, index);
    }
}

class EmptyTile extends Tile {

    constructor(index) {
        super(index);
    }

    isTileOccupied() { return false; }
    getPiece() { return null; }
    toString() { return '-'; }
}

class OccupiedTile extends Tile {

    piece;

    constructor(piece, index) {
        super(index);
        if (piece === null) {
            throw new Error('Piece cannot be null for occupied tile!');
        }
        this.piece = piece;
    }

    isTileOccupied() { return true; }
    getPiece() { return this.piece; }
    toString() { return this.piece.toString(); }
}

export default Tile;