import { ModalItem } from '../../Item/ModalItem.js';
import { utils } from '../../../utils.js';
const MODAL_PIXEL_SIZE = utils.getModalPixelSize();

export class Pagination {
	constructor(modal) {
		this.modal = modal;
		this.currentPage = 1;
		this.totalPages = 0;
		this.itemsByPage = 1;
		this.modalItemWidth = 0;
		this.modalItemGap = 2;
	}

	set() {
		this.modalItemWidth = this.setItemWidth();
	}

	getItemsByPage() {
		return this.itemsByPage;
	}

	/**
	 * Get how many items can be placed in modal according its width
	 */
	setItemsByPage(modalItemSpace) {
		this.itemsByPage = ~~(this.modal.w / modalItemSpace - 0.3);
	}

	setPagination() {
		const modalItemSpace = (this.modalItemWidth + this.modalItemGap) * MODAL_PIXEL_SIZE;
		this.setItemsByPage(modalItemSpace);
	}

	setItemWidth() {
		return ModalItem.itemWidth;
	}

	resetPagination() {
		this.totalPages = 0;
	}
}
