import { TileGame } from './TileGame.js';

/* Main  */
let difficulty = 'Easy';
const DEFAULT_SIZE = 3;
const MIN_SIZE_LIMIT = 3;
let size = DEFAULT_SIZE; // default size is 3X3
let sizeLimit = 10;
let limitReachedMessage = 'Calm down! Genius.';
let miniLimitReachedMessage = 'Seriously! You wanna play 2 X 2. Come on! It will be too easy for you. :-)';
let game;


let newGame = () => {
	game = new TileGame(size);
	game.start();
};

// render size updates
let updateSizeAndRender = (val) => {
	size = val;
	document.querySelector("#size").innerHTML = size + " X " + size;
}
updateSizeAndRender(DEFAULT_SIZE);
/* 	Toggling buttons(for custom N x N)
 *	Method will be called with values "hide" or "show"
 *	Show buttons only when custom button is clicked 
 */
let toggleSizeButtons = (value) => {
	document.querySelectorAll("#add, #sub").forEach(item => {
		if (value === "hide") {
			item.style.display = "none";
		} else {
			item.style.display = "inline-block";
		}

	});
};

document.addEventListener('click', (e) => {
	e.stopPropagation();
	e.preventDefault();
	if(game) {
		game.focusTile();
	}
});

/* User click X to quit the game, show confirmation box */
document.querySelector(".quit-game").addEventListener('click', () => {
	$("#quit-game-confirmation").modal("show");
});

/* Quit game confirmed button */
document.querySelector("#quit-game-confirmed").addEventListener('click', () => {
	game = null;
	document.querySelector(".flash").classList.remove('off');
	document.querySelector(".game-screen").classList.toggle('on');
});

/* Difficulty level */
document.querySelectorAll(".dropdown-menu>a.dropdown-item").forEach(item => {
	item.addEventListener('click', (e) => {
		difficulty = e.target.innerHTML;
		document.querySelector(".difficulty-lvl").innerHTML = difficulty;
		toggleSizeButtons("hide");
		if (difficulty === 'Easy') {
			updateSizeAndRender(3);
		} else if (difficulty === 'Medium') {
			updateSizeAndRender(5);
		} else if (difficulty === 'Hard') {
			updateSizeAndRender(7);
		} else {
			toggleSizeButtons("show");
		}
	});
})

/* Undo */
document.querySelector("#undo-btn").addEventListener('click', (e) => {
	e.stopPropagation();
	game.undo();
});

/* Start new game */
document.querySelector("#start-game").addEventListener('click', () => {
	document.querySelector(".game-screen").classList.toggle('on');
	document.querySelector(".flash").classList.toggle('off');
	newGame();
});

/* User has completed the game and want to play again, take the user to the difficuly selection screen */
document.querySelector("#play-again").addEventListener("click", () => {
	document.querySelector(".game-screen").classList.toggle('on');
	document.querySelector(".flash").classList.toggle('off');
});

/* Add/Sub buttons for board size */
document.querySelector('#add').addEventListener('click', () => {
	if (size === sizeLimit) {
		document.querySelector('#info .modal-body').innerHTML = limitReachedMessage;
		$("#info").modal('show');
	} else {
		updateSizeAndRender(++size);
	}
});

document.querySelector("#sub").addEventListener('click', () => {
	if (size === MIN_SIZE_LIMIT) {
		document.querySelector('#info .modal-body').innerHTML = miniLimitReachedMessage;
		$("#info").modal('show');
	} else {
		updateSizeAndRender(--size);
	}
});
