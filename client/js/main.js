import { Camera } from './models/Camera.js';
import { MouseModel } from './models/Mouse.js';
import { Modal } from './models/components/Modal.js';
import { Tile } from './models/Tile.js';
import { Item } from './models/components/Item.js';
import { helpers } from './helpers.js';
import { WorldItem } from './models/WorldItem.js';

window.cv = document.querySelector('.canvas');
window.ctx = cv.getContext('2d');
window.cam = new Camera();
window.mouse = new MouseModel();
const socket = io();
let selfPlayer;
let tiles = [];
let worldItems = [];
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
	if (worldItems && worldItems.length !== data.worldItems.length) {
		worldItems = WorldItem.create(data.worldItems);

		worldItems = worldItems.sort(function (a, b) {
			return a.touchedTile.row - b.touchedTile.row;
		});
	}
});

function act() {
	if (selfPlayer) {
		cam.focus(selfPlayer);
		paint();
		mouse.setPress();

		socket.emit('sendToServer', {
			mouse: mouse
		});
	}
}

function paint() {
	helpers.paintSettings();
	tiles.paint();
	WorldItem.paint();
	itemsModal.paint();
	Item.paintGrabbedItem();
}

document.onwheel = function (e) {
	cam.zoom(e);
};

document.querySelector('body').onresize = function () {
	cam.onResize(() => {
		itemsModal.resize();
	});
};

document.onmousemove = function (e) {
	mouse.move(e, Item.grabbed);
};

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
		document.onmousemove = function (e) {
			mouse.setDrag(e);
			document.body.style.cursor = 'grabbing';
		};
	});
};

document.onmouseup = function (e) {
	document.body.style.cursor = 'initial';
	document.onmousemove = function (e) {
		mouse.move(e, Item.grabbed);
	};
	Item.completeGrab(socket);
	mouse.stop();
};

document.oncontextmenu = function (e) {
	e.preventDefault();
};

setInterval(act, 1000 / 60);
