import { Camera } from './models/Camera.js';
import { Mouse } from './models/Mouse.js';
import { Modal } from './models/components/Modal.js';
import { Tile } from './models/Tile.js';
import { Item } from './models/components/Item.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
const cam = new Camera();
const socket = io();
let selfPlayer;
let tiles = [];
let mouse = new Mouse();
const Entity = {};
const itemsModal = new Modal();
cam.onResize(() => {
	itemsModal.resize();
});

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
	Tile.createList(data.world);
	tiles = Tile;
	Item.createList(data.itemData);
	itemsModal.appendItems(Item.list);
});

socket.on('newPosition', function (data) {
	updateSelfPlayer(data.player, selfPlayer.id);
	tiles.handleTouch(data);
});

function act() {
	if (selfPlayer) {
		cam.focus(selfPlayer);
		paint();
	}
	if (mouse.pressing) {
		mouse.setPress();
	}
	socket.emit('sendToServer', {
		mouse: mouse
	});
}

function paint() {
	ctx.fillStyle = '#64e29d';
	ctx.fillRect(0, 0, cv.width, cv.height);
	ctx.imageSmoothingEnabled = false;

	tiles.paint(cam);
	itemsModal.paint();
}

document.onwheel = function (e) {
	cam.zoom(e);
};

document.querySelector('body').onresize = function () {
	cam.onResize(() => {
		itemsModal.resize();
	});
};

document.onmousemove = mouseMove;
document.onmousedown = function (e) {
	mouse.onLeftClick(e, (e) => {
		mouse.setPress(e);

		Item.each((item) => {
			if (item.intersects(mouse)) {
				item.createGrabItem(mouse);
				console.info(item);
			}
		});
	});

	mouse.onRightClick(e, () => {
		document.body.style.cursor = 'grab';
		document.onmousemove = mouseDrag;
	});
};

document.onmouseup = function () {
	document.body.style.cursor = 'initial';
	document.onmousemove = mouseMove;
	mouse.stop();
};

document.oncontextmenu = function (e) {
	e.preventDefault();
};

function mouseMove(e) {
	mouse.setPosition(e, cam);
	let itemGrabbed = Item.grabbed;
	if (itemGrabbed) {
		itemGrabbed.move();
	}
}

function mouseDrag(e) {
	mouse.setDrag(e, cam);
	document.body.style.cursor = 'grabbing';
}

setInterval(act, 1000 / 60);
