import { Camera } from './models/Camera.js';
const cv = document.querySelector('.canvas');
const cam = new Camera();
cam.resize(cv);
const ctx = cv.getContext('2d');
const socket = io();
let pixelSize = 4;
let selfPlayer;
let world;
let tiles = [];
let floorImg = new Image();
floorImg.src = './client/img/floor.png';
let floorImg2 = new Image();
floorImg2.src = './client/img/floor2.png';
let mouse = { x: 0, y: 0 };

const img = new Image();
img.src = './client/img/pj.png';

function updateSelfPlayer(players, id) {
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
	world = data.world;

	for (let row = 0; row < world.h; row += 1) {
		for (let col = 0; col < world.w; col += 1) {
			let tile = {
				i: tiles.length,
				id: col + '-' + row,
				img: {
					file: floorImg,
					w: world.tile.w,
					h: world.tile.h
				}
			};
			tile.w = tile.img.w;
			tile.h = tile.img.h;
			tile.col = (row / 2) * tile.w + (col * tile.w) / 2;
			tile.row = (row * tile.h) / 2 - (col * tile.h) / 2;

			tile.center = {
				x: ~~(tile.col * pixelSize + (tile.w * pixelSize) / 2),
				y: ~~(tile.row * pixelSize + (tile.h * pixelSize) / 2)
			};

			tile.intersects = function () {
				tile.mousePosition = {
					x: Math.abs(mouse.x - tile.center.x),
					y: Math.abs(mouse.y - tile.center.y)
				};

				tile.mouseTotalPos = tile.calculateTotalXYPosition();
				tile.touch = tile.mouseIsInside();

				return tile.isInCenter;
			};

			tile.calculateTotalXYPosition = function () {
				return tile.mousePosition.x + tile.mousePosition.y * 2;
			};

			tile.mouseIsInside = function () {
				return (
					tile.mouseTotalPos < tile.center.x - tile.col * pixelSize
				);
			};

			tiles.push(tile);
		}
	}
});

socket.on('newPosition', function (data) {
	updateSelfPlayer(data.player, selfPlayer.id);
	cam.focus(cv, selfPlayer, pixelSize);
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

		for (var i in data.player) {
			ctx.drawImage(
				img,
				0,
				0,
				10,
				10,
				pixelSize * data.player[i].x - cam.x,
				pixelSize * data.player[i].y - cam.y,
				pixelSize * 10,
				pixelSize * 10
			);
		}
	}

	socket.emit('sendToServer', {
		mouse: mouse
	});
});

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
	mouse.x = e.clientX + cam.x;
	mouse.y = e.clientY + cam.y;

	tiles.forEach((tile, i) => {
		tile.intersects();
	});
}

function mouseDrag(e) {
	document.body.style.cursor = 'grabbing';
}
