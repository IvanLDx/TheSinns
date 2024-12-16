import { $ } from '../dom.js';
let $worldsContainer;
let $prototypeWorldSheet;
let $newWorldSheet;
let $errorMsg;

export function paintWorlds(worlds) {
	worlds.forEach((world) => {
		paintNewWorld(world);
	});
}

export function paintNewWorld(world) {
	const $worldSheet = $($prototypeWorldSheet.cloneNode(true));
	$worldSheet.removeClass('prototype__world-sheet').addClass('world-sheet');
	$worldSheet.attr({
		'data-id': world.id,
		'data-size': world.size
	});

	const $worldName = $worldSheet.find('.world-name');
	$worldName.textContent = world.name;
	$newWorldSheet.insertAdjacentElement('beforebegin', $worldSheet);
}

export function onClickWorldSheet(callback) {
	$worldsContainer.click('.world-sheet', (e, $worldSheet) => {
		$errorMsg.removeClass('show');
		if (!$worldSheet.hasClass('edit') && !e.target.closest('.world-cta')) {
			callback(e, $worldSheet);
		}
	});
}

export function closeWorldEditForm(e) {
	if (e) {
		e.preventDefault();
	}
	$newWorldSheet.removeClass('edit');
}

function init() {
	if (!$worldsContainer) {
		$worldsContainer = $('.worlds-container');
		$prototypeWorldSheet = $worldsContainer.find('.prototype__world-sheet');
		$newWorldSheet = $worldsContainer.find('.world-sheet--new');
		$errorMsg = $newWorldSheet.find('.error-msg');
	}
	return $prototypeWorldSheet;
}

init();
