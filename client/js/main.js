import { Camera } from './models/Camera.js';
const cv = document.querySelector('.canvas');
const cam = new Camera();
cam.resize(cv);
const ctx = cv.getContext('2d');
const socket = io();
let pixelSize = 4;
let selfPlayer;

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
});

socket.on('newPosition', function (data) {
	updateSelfPlayer(data.player, selfPlayer.id);
	cam.focus(cv, selfPlayer, pixelSize);
	if (selfPlayer) {
		ctx.clearRect(0, 0, cv.width, cv.height);
		ctx.imageSmoothingEnabled = false;
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
	Camera.resize(cv);
};
