import { Camera } from './models/Camera.js';
import { Mouse } from './models/Mouse.js';
import { Modal } from './models/components/Modal.js';
import { Tile } from './models/Tile.js';
import { Item } from './models/components/Item.js';
import { helpers } from './helpers.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
const cam = new Camera();
const socket = io();
let selfPlayer;
let tiles = [];
let worldItems = [];
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
	tiles.handleTouch(data, Item.grabbed);
	if (worldItems.length !== data.worldItems.length) {
		worldItems = data.worldItems;

		worldItems = worldItems.sort(function (a, b) {
			return a.touchedTile.row - b.touchedTile.row;
		});

		console.info(worldItems);
	}
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

	worldItems.forEach((item) => {
		ctx.drawImage(
			helpers.getImage(item.name),
			0,
			0,
			item.w,
			item.h,
			(item.touchedTile.col + 1) * cam.pixelSize - cam.x,
			(item.touchedTile.row + 1) * cam.pixelSize -
				cam.y -
				(item.h - 10) * cam.pixelSize,
			(item.w - 2) * cam.pixelSize + cam.pixelSize * 2,
			(item.h - 1) * cam.pixelSize + cam.pixelSize
		);
	});

	itemsModal.paint();

	if (Item.grabbed) {
		Item.grabbed.paint(cam);
	}
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
				item.createGrabItem(mouse, cam);
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
	Item.completeGrab(socket);
	mouse.stop();
};

document.oncontextmenu = function (e) {
	e.preventDefault();
};

function mouseMove(e) {
	mouse.setPosition(e, cam);
	let itemGrabbed = Item.grabbed;
	if (itemGrabbed) {
		itemGrabbed.move(mouse, cam);
	}
}

function mouseDrag(e) {
	mouse.setDrag(e, cam);
	document.body.style.cursor = 'grabbing';
}

setInterval(act, 1000 / 60);
