const cv = document.querySelector('.canvas');
const ctx = cv.getContext('2d');
const socket = io();

socket.on('newPosition', function (data) {
	ctx.clearRect(0, 0, 500, 500);
	for (var i = 0; i < data.player.length; i++) {
		ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y);
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
