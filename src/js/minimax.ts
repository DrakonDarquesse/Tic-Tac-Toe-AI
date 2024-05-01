import { board } from "./board";
import Move from "./move";
import table from "./hash";
import { game } from "./game";

async function GetGoodMove() {
	var key: number;
	var goodMove:Move;

	if (game.moves <= 4 && game.moves > 0) 
		key = table.hashFunc()%table.buckets.length;

	if (key > 0) {
		if (table.buckets[key]) 
			goodMove = table.buckets[key];
		else {
			goodMove = MiniMax(1, -100, 100, true, game.moves+1);
			table.putValue(goodMove);	
		}
	}
	else 
		goodMove = MiniMax(1, -100, 100, true, game.moves+1);

	return goodMove
}


function GetEmptyBoxes() {
    var emptyBoxes: Move[] = [];
	for (let b = 0; b < 9; b++) {
        if (board.spaces[b].isEmpty()) {
            var movement = new Move(b);
            emptyBoxes.push(movement);
        }
	}
	return emptyBoxes;
}

function MiniMax(depth, alpha, beta, bool, moves) {
	var paths = GetEmptyBoxes()
	// var count = 0;

	for (var i = 0; i < paths.length; i++) {
		board.spaces[paths[i].boxIndex].setVal(bool);
		var r = game.checkStatus(bool, moves);

        //recursive callback
		if (r == null) 			
			paths[i].score = MiniMax(depth+1, alpha, beta, !bool, moves+1).score;
		else if (!r)			
			paths[i].score = 0
		else
			paths[i].score = bool? 10 - depth : -10 + depth

		board.spaces[paths[i].boxIndex].setVal(null);


		if (bool) 
			alpha = Math.max(alpha, paths[i].score);
		else
			beta = Math.min(beta, paths[i].score);

		if (alphaBeta(alpha, beta, paths[i], bool)) break;
	}

	paths.sort((a, b) => {return b.score - a.score;}); // sort the feasible paths based on score


	return paths[bool?0 :paths.length-1]
}

function alphaBeta(alpha, beta, move, bool):boolean {

	if (beta < alpha) return true;

	if (!bool && move.score < 0) return true

	return false;
}

export { GetGoodMove }