import League from '../piece/League.js';
import Tile from './Tile.js';
import {NoughtsPlayer, CrossPlayer} from '../player/Player.js';

class Board {
    static GRID = 3;
    static NUMBER_OF_TILES = 9;

    //Player
    noughtsPlayer;
    crossPlayer;
    currentPlayer;

    //TileList
    tileList;

    constructor(boardBuilder) {
        this.tileList = boardBuilder.getImmutableTileList();

        this.noughtsPlayer = new NoughtsPlayer(this);
        this.crossPlayer = new CrossPlayer(this);

        this.currentPlayer = boardBuilder.chooseCurrentPlayer(this.noughtsPlayer, this.crossPlayer);
    }

    getTileList() {
        return Object.freeze(this.tileList);
    }

    getTileAt(index) {
        return this.tileList[index];
    }

    getCrossPlayer() {
        return this.crossPlayer;
    }

    getNoughtsPlayer() {
        return this.noughtsPlayer;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    static createStandardBoard() {
        const builder = new BoardBuilder(League.league.CROSS);
        for (let i = 0; i < Board.NUMBER_OF_TILES; i++) { builder.appendTile(Tile.createTile(null, i)); }
        return builder.build();
    }

    toString() {
        let boardInString = ''
        for (let i = 0; i < Board.NUMBER_OF_TILES; i++) {
            if (i % Board.GRID === 0) { boardInString += '\n'; }
            boardInString += this.tileList[i].toString() + '(' + String(this.tileList[i].getIndex()) + ')\t';
        }
        return boardInString;
    }
}

class BoardBuilder {
    tileList;
    league;

    constructor(league) {
        this.tileList = [];
        this.league = league;
    }

    appendTile(tile) {
        this.tileList.push(tile);
        return this;
    }

    setPiece(piece) {
        this.tileList[piece.getIndex()] = Tile.createTile(piece, piece.getIndex());
        return this;
    }

    build() { return new Board(this); }

    getImmutableTileList() {return Object.freeze(this.tileList);}

    chooseCurrentPlayer(redPlayer, blackPlayer) {return League.isCross(this.league) ? blackPlayer : redPlayer;}
}

export {BoardBuilder, Board};