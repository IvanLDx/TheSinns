import { CameraModel } from './models/Camera.js';
const cv = document.querySelector('.canvas');
const Camera = new CameraModel();
cv.width = Camera.getScreenSize(cv.clientWidth);
cv.height = Camera.getScreenSize(cv.clientHeight);
const ctx = cv.getContext('2d');
const socket = io();
let pixelSize = 4;
let selfPlayer;

const img = new Image();
img.src = './client/img/pj.png';

function updateSelfPlayer(players, id) {
	for (let i in players) {
		if (players[i].id === id) {
			selfPlayer = players[i];
		}
	}
}

socket.on('init', function (data) {
	updateSelfPlayer(data.playerList, data.id);
});

socket.on('newPosition', function (data) {
	updateSelfPlayer(data.player, selfPlayer.id);
	Camera.focus(cv, selfPlayer, pixelSize);
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
				pixelSize * data.player[i].x - Camera.x,
				pixelSize * data.player[i].y - Camera.y,
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
