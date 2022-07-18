import { board } from "./board";
import Move from "./move";

var table : {buckets:Move[], hashFunc, putValue} = {
    
    buckets: new Array(337),

    hashFunc: () => {
        var boardValue = 0;
    
        for (var i = 0; i < 9; i++) {
            var char =  board.spaces[i].getVal();
            if (char == null)
                boardValue += Math.pow(3,i) * 0;
            else if (char == true)
                boardValue += Math.pow(3,i) * 1;
            else if (char == false)
                boardValue += Math.pow(3,i) * 2;
        }
        
        return boardValue;
    },

    putValue: (position)  => {
        var value = table.hashFunc();
        var key = value % table.buckets.length;
        table.buckets[key] = position;
        return position;
    },
}

export default table;