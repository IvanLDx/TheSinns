let $worldsContainer;
let $prototypeWorldSheet;

export function paintWorlds(worlds) {
	worlds.forEach((world) => {
		const $worldSheet = $prototypeWorldSheet.cloneNode(true);
		$worldSheet.classList.remove('prototype__world-sheet');
		$worldSheet.classList.add('world-sheet');

		const $worldName = $worldSheet.querySelector('.world-name');
		$worldName.textContent = world.name;
		$worldsContainer.appendChild($worldSheet);
	});
}

function init() {
	if (!$worldsContainer) {
		$worldsContainer = document.querySelector('.worlds-container');
		$prototypeWorldSheet = $worldsContainer.querySelector('.prototype__world-sheet');
	}
	return $prototypeWorldSheet;
}

init();
