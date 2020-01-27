import {TileGame} from './TileGame.js';

/* Main  */
let	size = 3; // default size is 3X3
let sizeLimit = 15;
let game = new TileGame(size);

let newGame = () => {
	game = new TileGame(size);
	game.start();
};

// render size updates
let updateSize = (val) => {
	size = val;
	document.querySelector("#size").innerHTML = size + " X " + size;
}

/* 	Toggling buttons(for custom N x N)
 *	Method will be called with values "hide" or "show"
 *	Show buttons only when custom button is clicked 
 */
let toggleSizeButtons = (value) => {
	document.querySelectorAll("#add, #sub").forEach(item => {
		if(value === "hide"){
			item.style.display="none";
		} else {
			item.style.display="inline-block";
		}
		
	});
};

document.querySelectorAll(".level-btns .btn").forEach(item => {
	item.addEventListener('click', (event) => {
		item.classList.add('selected');
		document.querySelectorAll(".level-btns .btn").forEach(el => {
			if(event.target !== el) el.classList.remove('selected');
		});
		toggleSizeButtons("hide");
	})
});

document.querySelector("#undo-btn").addEventListener('click', () => {
	game.undo();
});
document.querySelector("#new-game-btn").addEventListener('click', () => {
	newGame();
});
document.querySelector("#play-again").addEventListener("click", () => {
	newGame();
});


/* click listeners for difficulty level buttons*/
// easy button
document.querySelector("#easy-btn").addEventListener('click', () => {
	updateSize(3);
});
// medium button
document.querySelector("#medium-btn").addEventListener('click', () => {
	updateSize(5);
});
// Hard button
document.querySelector("#hard-btn").addEventListener('click', () => {
	updateSize(10);
});
// custom button
document.querySelector("#custom-btn").addEventListener('click', () => {
	toggleSizeButtons("show");
});


/* Add/Sub buttons for board size */
document.querySelector("#add").addEventListener('click', () => {
	if(size === sizeLimit) {
		alert("Maximum limit for N is 15.");
	} else {
		updateSize(++size);
	}
});

document.querySelector("#sub").addEventListener('click', () => {
	if(size === 3) {
		alert("Seriously! You wanna play 2 X 2. Come on! It will be too easy for you. :-)");
	} else {
		updateSize(--size);
	}
});
