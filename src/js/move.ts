// import { Box } from "./board";

export default class Move{
    boxIndex: number;
    score:number = null;

    constructor(index:number) {
        this.boxIndex = index;
    }

    setScore(val):void {
        this.score = val; 
    }
}