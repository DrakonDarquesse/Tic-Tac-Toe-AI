/* jshint esversion: 6 */

function MapOutPath() {
    var paths = [];
	for (let r = 0; r < 3; r++) {
		for (var c = 0; c < 3; c++) {
			if ($(arr[r][c]).html() == '') {
				var movement = new Move(arr[r][c]);
				paths.push(movement);
			}
		}
	}
	return paths;
}

// me is the AI
function BestChoiceForMe(depth, alpha, beta) {
	var paths = MapOutPath();
	var count = 0;
    
	for (var i = 0; i < paths.length; i++) {
		game.SwitchPlayer();
		$(paths[i].coordinates).html('O');
		game.moves++;
		var r = game.CheckStatus(false);

        //recursive callback
		paths[i].score = 
			( r < 0 && depth <= 5) ? BestChoiceForOpponent(depth+1, alpha, beta).score : 
			(r == 0)? 0 : 10 - depth;

		$(paths[i].coordinates).html('');
		game.moves--;
		game.SwitchPlayer();
		alpha = Math.max(alpha, paths[i].score);

		if (beta < alpha)
			break;

		if (paths.length >= 6) {			
			if (paths[i].score >= 0)
				count++;
			if (count > 1 && paths[i].score >= -5)
				count++;
		}

		if (count >= 3)
			break;
	}

	if (count >= 3) {
		var finalpaths = paths.filter(item => (item.score !== '' )); // get the feasible paths
		paths = finalpaths;
	}

	paths.sort((a, b) => {return b.score - a.score;}); // sort the feasible paths based on score
	
	var lowScoreIndex;

	for (var x of paths) {
		if (x.score != paths[0].score) {
			lowScoreIndex = paths.indexOf(x);
			break;
		}
	}

	paths = paths.slice(0, lowScoreIndex); // keep the moves with highest score

	return (depth == 1)? paths : paths[0];
}

function BestChoiceForOpponent(depth, alpha, beta) {
	var paths = MapOutPath();

	for (var i = 0; i < paths.length; i++) {
		game.SwitchPlayer();
		$(paths[i].coordinates).html('X');
		game.moves++;
		var r = game.CheckStatus(false);

		if (r < 0) 			
			paths[i].score = BestChoiceForMe(depth+1, alpha, beta).score;
		else 			
			paths[i].score = (r == 0)? 0 : -10 + depth;

		$(paths[i].coordinates).html('');
		game.moves--;
		game.SwitchPlayer();
		beta = Math.min(beta, paths[i].score);

		if (beta < alpha)
			break;
		if (paths[i].score < 0)
			break;
	}

	return paths.reduce((current,next) => (current.score < next.score) ? current : next);
}

function Person(symbol, c) {

	this.symbol = symbol;
	this.MakeMove = function(elm){
		elm.innerHTML = this.symbol;
		$(elm).addClass(c);
		$(elm).removeAttr('onclick');
	};
}

function Move(point) {
	this.coordinates = point;
	this.score = '';
}

var p1 = new Person("X", "c1");
var p2 = new Person("O", "c2");
var postMenu = document.getElementById("postMenu");
// var leftcol = document.getElementById("leftcol");
var rightcol = document.getElementById("rightcol");
var pause = document.getElementById("pause");
var arr = new Array(3);

$.each(arr, function(index) {
	arr[index] = new Array(3);
});

var k = 0;

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {		
		arr[i][j] = document.getElementsByTagName("td")[k++] ;		
	}	
}

var table = new Array(337);

var game = {
	user : p1,
	user2 : p2,
	currentPlayer : p1,// input who play first
	mode : '',
	onGoing : true, // use this value, dummy
	moves : 0,

	CheckStatus : function(test) {
		var board = '0b';
		arr.forEach((row) => {
			row.forEach((col) => {
				board = (col.innerHTML == this.currentPlayer.symbol)? board += '1': board += '0';
			});
		});

		var winBoard = [
			0b111000000,
			0b000111000,
			0b000000111,
			0b100100100,
			0b010010010,
			0b001001001,
			0b100010001,
			0b001010100,
		];

		var result = -1;

		if (this.moves >= 3) {
			for (var combination of winBoard) {
				var matching = board & combination;
				if (matching == combination) {
					matching = matching.toString(2).padStart(9,'0');
					result = 1;
					if (test) {
						for (let i = 0; i < matching.length; i++) {
							if (matching[i] == '1')
								document.getElementsByTagName("td")[i].style.color = '#B6DC76'; 
						}
					}
				}
			}
			
			if (game.moves > 8 && result == -1)
				result = 0;
		}
		return result;
	},

	Play: function(id) {
		Process(id)
            .then(() => game.CheckStatus(true))
			.then((r) => {
				if (r < 0) {
					if (game.mode == 'twoplayer')
						game.SwitchPlayer();
					else if (game.mode == 'oneplayer') {
						game.Retaliate();
						if (game.CheckStatus(true) >= 0)
							displayResult(game.currentPlayer, game.CheckStatus(true));	
						else 
							game.SwitchPlayer();
					}
                }				
				else 
					displayResult(game.currentPlayer, r);		
			});
	},

	SwitchPlayer : function() {
		this.currentPlayer = (this.currentPlayer == this.user)? this.user2 : this.user;
	},

	Retaliate : function() {
		var respond;
		var key;
		var a;

		if (this.moves < 4 && this.moves > 0) {
			key = HashFunc()%table.length;
			console.log(key);
		}

		if (key > 0) {
			if (table[key]) {
				respond = table[key];
				a = respond[Math.floor(respond.length * Math.random())].coordinates;
				console.log(respond);
            }
			else {
				respond = BestChoiceForMe(1, -100, 100);
				PutValue(respond);	
				a = respond[Math.floor(respond.length * Math.random())].coordinates;
            }
		}
		else {
			respond = BestChoiceForMe(1, -100, 100);	
			a = respond[Math.floor(respond.length * Math.random())].coordinates;
		}

		this.SwitchPlayer();
		this.currentPlayer.MakeMove(a);
		this.moves++;

	}
};

function HashFunc() {
	var boardValue = 0;

	for (var i = 0; i < 9; i++) {
		var char =  document.getElementsByTagName('td')[i].innerHTML;
		if (char == '')
			boardValue += Math.pow(3,i) * 0;
		else if (char == 'X')
			boardValue += Math.pow(3,i) * 1;
		else if (char == 'O')
			boardValue += Math.pow(3,i) * 2;
	}
    
	return boardValue;
}

function PutValue(position) {
	var value = HashFunc();
	var key = value % table.length;
	table[key] = position;
	return position;
}

function Process(id){
	return new Promise(function(resolve){

		game.currentPlayer.MakeMove(document.getElementById(id));
		game.moves++;

		if (game.moves) {
			setTimeout(() => {
                resolve();
            },10);
		}			
	});
}


function Initiate(){
	return new Promise(function(resolve){
        
		$(rightcol.firstElementChild).fadeOut();
        $(rightcol.lastElementChild).fadeOut();
		setTimeout(() => {
			resolve();
		},500);
	});
}

function displayResult(lastMovePlayer, gameResult) {
    disableAll();
    $(pause).fadeOut();
    
	$(document).ready(function(){
		$(postMenu).delay(1000).fadeIn();
		document.getElementById("resultMenu").style.opacity = "1";
	});
    
	var result = document.getElementById('result');
	result.innerHTML = gameResult == 0 ? "DRAW" : lastMovePlayer.symbol + " WINS";
	$('#again').html("RESTART");
}

function enableAll() {
    arr.forEach((row) => {
        row.forEach((col) => {
                $(col).html('');
                $(col).attr('onclick', 'game.Play(this.id)');
                col.style.color = null;
                col.classList.remove('c1');
                col.classList.remove('c2');
        });
    });    
}

function disableAll() {
    arr.forEach((row) => {
		row.forEach((col) => {
			if ($(col).html() == '')
			{
				$(col).removeAttr('onclick');
			}
		});
	});
}

function pcFirst(option) {
    if (option == 'pc') {
        game.SwitchPlayer();
        var firstMove = document.getElementsByTagName("td")[Math.floor(Math.random()*8)];
		game.currentPlayer.MakeMove(firstMove);
        game.moves++;
        game.SwitchPlayer();
    }  
}

// eslint-disable-next-line no-unused-vars
function ShowContent2(){
    $(rightcol.children[1]).hide();
    $(rightcol.children[2]).fadeIn();
}

// eslint-disable-next-line no-unused-vars
function Start(mode, option) {
	game.mode = mode;
	Initiate()
        .then(() => {
            rightcol.children[2].style.display = "none";
            rightcol.children[1].style.display = "none";
            $(pause).fadeIn();
            enableAll();
            document.getElementById("resultMenu").style.opacity = "0";
            setTimeout(()=>{
                pcFirst(option);
            }, 1000);
        });
}


function Newgame() {
    $(document).ready(function(){
		$(postMenu).hide(1);
        $(rightcol.children[1]).fadeIn(500);
	});

    document.getElementById("result").innerHTML = "";

	game.user = p1;
	game.user2 = p2;
	game.currentPlayer = p1;
	game.moves = 0;
	game.onGoing = true;
}

// eslint-disable-next-line no-unused-vars
function stopGame() {
    $(pause).fadeOut();
    disableAll();
    $(rightcol.children[1]).delay(500).fadeIn(500);
    document.getElementById("resultMenu").style.opacity = "1";
    game.user = p1;
	game.user2 = p2;
	game.currentPlayer = p1;
	game.moves = 0;
}

window.onload = () => {
	setTimeout(() => {
		Newgame();
	}, 500);
};




