import { Camera } from './models/Camera.js';
import { Mouse } from './models/Mouse.js';

const cv = document.querySelector('.canvas');
const cam = new Camera();
cam.resize(cv);
const ctx = cv.getContext('2d');
const socket = io();
let selfPlayer;
let tiles = [];
let floorImg = new Image();
floorImg.src = './client/img/floor.png';
let floorImg2 = new Image();
floorImg2.src = './client/img/floor2.png';
let mouse = new Mouse();
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
});

function act() {
	if (selfPlayer) {
		cam.focus(cv, selfPlayer);
		paint();
	}
	socket.emit('sendToServer', {
		mouse: mouse
	});
}

function paint() {
	ctx.clearRect(0, 0, cv.width, cv.height);
	ctx.imageSmoothingEnabled = false;

	tiles.forEach((tile) => {
		ctx.drawImage(
			tile.touch ? floorImg2 : floorImg,
			0,
			0,
			tile.img.w + 2,
			tile.img.h + 1,
			tile.col * cam.pixelSize - cam.x,
			tile.row * cam.pixelSize - cam.y,
			tile.w * cam.pixelSize + cam.pixelSize * 2,
			tile.h * cam.pixelSize + cam.pixelSize
		);
	});
}

document.onwheel = function (e) {
	cam.zoom(e);
};

document.querySelector('body').onresize = function () {
	cam.resize(cv);
};

document.onmousemove = mouseMove;

document.onmousedown = function () {
	mouse.setPressedPosition();
	document.body.style.cursor = 'grab';
	document.onmousemove = mouseDrag;
};

document.onmouseup = function () {
	document.body.style.cursor = 'initial';
	document.onmousemove = mouseMove;
	mouse.stop();
};

function mouseMove(e) {
	mouse.setPosition(e, cam);
}

function mouseDrag(e) {
	mouseMove(e);
	document.body.style.cursor = 'grabbing';
	mouse.setMovedPosition();
	mouse.setPressedPosition();
}

setInterval(act, 1000 / 60);
