export class OptionItem {
	constructor(list) {
		this.list = list;
	}
	paint() {
		this.list.forEach((item) => {
			item.paint();
		});
	}

	repositioning() {
		this.list.forEach((item, i) => {
			item.repositioning(i);
		});
	}
}
