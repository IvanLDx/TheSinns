import { $ } from '../dom.js';
let $worldsContainer;
let $prototypeWorldSheet;

export function paintWorlds(worlds) {
	worlds.forEach((world) => {
		const $worldSheet = $($prototypeWorldSheet.cloneNode(true));
		$worldSheet.removeClass('prototype__world-sheet').addClass('world-sheet');
		$worldSheet.attr({
			'data-id': world.id,
			'data-size': world.size
		});

		const $worldName = $worldSheet.find('.world-name');
		$worldName.textContent = world.name;
		$worldsContainer.appendChild($worldSheet);
	});
}

export function onClickWorldSheet(callback) {
	$worldsContainer.click('.world-sheet', (e, $worldSheet) => {
		callback(e, $worldSheet);
	});
}

function init() {
	if (!$worldsContainer) {
		$worldsContainer = $('.worlds-container');
		$prototypeWorldSheet = $worldsContainer.find('.prototype__world-sheet');
	}
	return $prototypeWorldSheet;
}

init();
