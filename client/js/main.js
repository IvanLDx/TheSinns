import { Camera } from './models/Camera.js';
const cv = document.querySelector('.canvas');
const cam = new Camera();
cam.resize(cv);
const ctx = cv.getContext('2d');
const socket = io();
let pixelSize = 4;
let selfPlayer;
let tiles = [];
let floorImg = new Image();
floorImg.src = './client/img/floor.png';
let floorImg2 = new Image();
floorImg2.src = './client/img/floor2.png';
let mouse = { x: 0, y: 0 };

const img = new Image();
img.src = './client/img/pj.png';
const Entity = {};

function updateSelfPlayer(players, id) {
	Entity.players = players;
	players
		.filter((player) => {
			return player.id === id;
		})
		.forEach((player) => {
			selfPlayer = player;
		});
}

socket.on('init', function (data) {
	updateSelfPlayer(data.playerList, data.id);
	tiles = data.world;
});

socket.on('newPosition', function (data) {
	updateSelfPlayer(data.player, selfPlayer.id);
	tiles.forEach((tile) => {
		tile.touch = false;
		if (data.touchedTile && tile.id === data.touchedTile.id) {
			tile.touch = true;
		}
	});
	cam.focus(cv, selfPlayer, pixelSize);
});

function act() {
	paint();
	socket.emit('sendToServer', {
		mouse: mouse
	});
}

function paint() {
	if (selfPlayer) {
		ctx.clearRect(0, 0, cv.width, cv.height);
		ctx.imageSmoothingEnabled = false;

		tiles.forEach((tile) => {
			ctx.drawImage(
				tile.touch ? floorImg2 : floorImg,
				0,
				0,
				tile.img.w + 2,
				tile.img.h + 1,
				tile.col * pixelSize - cam.x,
				tile.row * pixelSize - cam.y,
				tile.w * pixelSize + pixelSize * 2,
				tile.h * pixelSize + pixelSize
			);
		});

		for (var i in Entity.players) {
			ctx.drawImage(
				img,
				0,
				0,
				10,
				10,
				pixelSize * Entity.players[i].x - cam.x,
				pixelSize * Entity.players[i].y - cam.y,
				pixelSize * 10,
				pixelSize * 10
			);
		}
	}
}

const keys = {
	KeyD: 'right',
	KeyS: 'down',
	KeyA: 'left',
	KeyW: 'up'
};

document.onkeydown = function (e) {
	socket.emit('keyPress', {
		inputId: keys[e.code],
		state: true
	});
};

document.onkeyup = function (e) {
	socket.emit('keyPress', {
		inputId: keys[e.code],
		state: false
	});
};

document.onwheel = function (e) {
	if (e.deltaY < 0 && pixelSize < 80) {
		pixelSize++;
	} else if (e.deltaY > 0 && pixelSize > 1) {
		pixelSize--;
	}
};

document.querySelector('body').onresize = function () {
	cam.resize(cv);
};

document.onmousemove = mouseMove;

document.onmousedown = function (e) {
	document.body.style.cursor = 'grab';
	document.onmousemove = mouseDrag;
};

document.onmouseup = function () {
	document.body.style.cursor = 'initial';
	document.onmousemove = mouseMove;
};

function mouseMove(e) {
	mouse.x = ~~((e.clientX + cam.x) / pixelSize);
	mouse.y = ~~((e.clientY + cam.y) / pixelSize);
}

function mouseDrag(e) {
	document.body.style.cursor = 'grabbing';
}

setInterval(act, 1000 / 60);
