import {Tile} from './Tile.js';
import {Timer} from './Timer.js';

/* TileGame class 
 * It does all the operations related to board
 * handles keyboardEvent of Up/Down/Left/Right
 * Tracks moves and count them as well
 */
export class TileGame {
	constructor(size) {
		this.size = size; // default size 3x3
		this.noOfMoves = 0;
		this.gameStarted = false;
		this.currentTilePosition = [1,1];
		this.trackMoves = []; // for tracking moves
		this.init();
	}

	init() {
		// initializing the board with tiles
		let tile_value = 1;
		this.board = new Array(this.size+1);
		for (var i = 0; i < this.board.length; i++) { 
			this.board[i] = []; 
		}
		for (var i = 1; i <= this.size; i++) { 
			for (var j = 1; j <= this.size; j++, ++tile_value) {
				this.board[i][j] = new Tile(tile_value);
			} 
		}
		this.board[this.size][this.size] = null;

		this.shuffle(); // shuffling the values
		this.render(); // render the board
		
		document.querySelector("#size").innerHTML = this.size + " X " + this.size;
	}

	start() {
		// add keyboard event listener on table
		let table = document.querySelector("#board");
		table.onkeydown = this.keyboardEventHandler.bind(this);
		this.focusTile();

		// start the time
		this.timer = new Timer();

		/* Setting gameStarted flag to true after shuffle.
		* This flag is being used to count the moves in swap() method
		* after the shuffle is done because shuffling uses the swap() method too
		* and it would count the moves
		*/
		this.gameStarted = true;
	}

	/* Renders Puzzle Board and the Moves */
	render() {
		this.renderBoard();
		document.querySelector("#moves_count").innerHTML = this.noOfMoves;
		if(this.trackMoves.length === 0) {
			document.querySelector("#undo-btn").setAttribute('disabled', "disabled");
		} else {
			document.querySelector("#undo-btn").removeAttribute('disabled');
		}
	}

	keyboardEventHandler(e) {
		if(e.key === 'ArrowRight') {
			this.moveRight();
		} else if(e.key === 'ArrowLeft') {
			this.moveLeft();
		} else if(e.key === 'ArrowUp') {
			this.moveUp();
		} else if(e.key === 'ArrowDown') {
			this.moveDown();
		}
	}

	renderBoard() {
		let render_puzzle = "";
		let k=0;
		for(let i = 1; i <= this.size; ++i){
			render_puzzle += "<tr>";
			for(let j = 1; j <= this.size; ++j, ++k){
				if(this.board[i][j]) {
					render_puzzle += `<td tabindex=0 id='i_${i}j_${j}'>${this.board[i][j].getValue()}</td>`;
				}else {
					render_puzzle += "<td tabindex=0></td>";
				}
			}
			render_puzzle += "</tr>";
		}
		document.querySelector("#board").innerHTML = render_puzzle;
	}

	moveRight() {
		let old_pos = [...this.currentTilePosition];
		if(this.currentTilePosition[1] < this.size) {
			this.currentTilePosition[1]++;
		}
		let new_pos = this.currentTilePosition;
		if(this.board[new_pos[0]][new_pos[1]] == null){
			this.swap(old_pos, new_pos);
			this.render();
		}
		this.focusTile();
		this.checkForWin();
	}

	moveLeft() {
		let old_pos = [...this.currentTilePosition];
		if(this.currentTilePosition[1] > 1) {
			this.currentTilePosition[1]--;
		}
		let new_pos = this.currentTilePosition;
		if(this.board[new_pos[0]][new_pos[1]] == null){
			this.swap(old_pos, new_pos);
			this.render();
		}
		this.focusTile();
		this.checkForWin();
	}

	moveUp() {
		let old_pos = [...this.currentTilePosition];
		if(this.currentTilePosition[0] > 1) {
			this.currentTilePosition[0]--;
		}
		let new_pos = this.currentTilePosition;
		if(this.board[new_pos[0]][new_pos[1]] == null){
			this.swap(old_pos, new_pos);
			this.render();
		}
		this.focusTile();
		this.checkForWin();
	}

	moveDown() {
		let old_pos = [...this.currentTilePosition];
		if(this.currentTilePosition[0] < this.size) {
			this.currentTilePosition[0]++;
		}
		let new_pos = this.currentTilePosition;
		if(this.board[new_pos[0]][new_pos[1]] == null){
			this.swap(old_pos, new_pos);
			this.render();
		}
		this.focusTile();
		this.checkForWin();
	}

	swap(old_position, new_position) {
		if(this.gameStarted) { // if game started (After shuffle)
			// count number of moves
			if(this.board[new_position[0]][new_position[1]] == null) {
				this.noOfMoves++;
			}
			// track moves
			let old_pos = Object.assign({}, old_position);
			let new_pos = Object.assign({}, new_position);
			let tileNo = this.board[old_position[0]][old_position[1]].getValue();
			this.trackMoves.push({old_pos, new_pos, tile:tileNo});
		}

		// swap
		let tmp = this.board[old_position[0]][old_position[1]];
		this.board[old_position[0]][old_position[1]] = null;
		this.board[new_position[0]][new_position[1]] = tmp;
	}

	undoSwap(old_position, new_position) {
		let tmp = this.board[old_position[0]][old_position[1]];
		this.board[old_position[0]][old_position[1]] = null;
		this.board[new_position[0]][new_position[1]] = tmp;
	}

	focusTile() {
		let currentTile = this.board[this.currentTilePosition[0]][this.currentTilePosition[1]];
		if(currentTile == null) {
			this.currentTilePosition[1]++;
		}
		document.querySelector("#i_"+this.currentTilePosition[0]+"j_"+this.currentTilePosition[1]).focus();
	}

	/* shuffles the tiles in a solvable way */
	shuffle() {
		let noOfShuffles = 2000;
		let len = Math.floor(Math.random()*noOfShuffles + 1);
		let directions = ["up", "down", "left", "right"];
		let rand;
		let position = [this.size, this.size]; // null tile
		let new_pos = [...position];
		for(let i=0; i<len; ++i) {
			rand = Math.floor((Math.random()*4));
			new_pos = [...position];
			if(directions[rand] === "right" && position[1]<this.size) {
				new_pos[1]++;
			} else if(directions[rand] === "left" && position[1]>1) {
				new_pos[1]--;
			} else if(directions[rand] === "up" && position[0]>1) {
				new_pos[0]--;
			} else if(directions[rand] === "down" && position[0]<this.size) {
				new_pos[0]++;
			}
			this.swap(new_pos, position);
			position = new_pos;
		}
	}

	/* Undo */
	undo() {
		if(this.trackMoves.length>0) {
			let move = this.trackMoves.pop();
			let old_pos = move.old_pos;
			let new_pos = move.new_pos;
			this.undoSwap(new_pos, old_pos);
			this.noOfMoves--;
			this.render();
			this.currentTilePosition = [old_pos[0], old_pos[1]];
			this.focusTile();
		}
	}

	// check for win
	checkForWin() {
		let win = true;
		let k = 1;
		for(let i = 1; i <= this.size; ++i){
			for(let j = 1; j <= this.size; ++j, ++k){
				if(this.board[i][j] !== null && this.board[i][j].getValue() !== k) {
					win = false;
					break;
				}
				if(this.board[i][j] == null && k === this.getTotalTiles()){
					win = true;
					break;
				}
			}
		}
		if(win) {
			this.timer.stop();
			let hh = document.querySelector("#hours").innerHTML;
			let mm = document.querySelector("#minutes").innerHTML;
			let ss = document.querySelector("#seconds").innerHTML;
			document.querySelector("#noOfMoves").innerHTML = this.noOfMoves;
			let timeTaken = ``;
			if(parseInt(hh) > 0) {
				timeTaken = `${hh} hour(s) `;
			}
			if(parseInt(mm) > 0) {
				timeTaken += `${mm} minute(s) `;
			}
			if(parseInt(ss) > 0) {
				timeTaken += `${ss} second(s)`;
			}
			document.querySelector("#time_taken").innerHTML = timeTaken;
			$("#play-again-modal").modal('show');
		}
	}

	getSize() {
		return this.size;
	}

	getTotalTiles() {
		return this.size * this.size;
	}
}