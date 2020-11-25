(function (win, doc, docElem) {

	"use strict";
	/*global console, alert, window, document, setTimeout */
	/*global */

	function blockFixOnResize() {

		var defaultProperties = ['float', 'width', 'height'],
			selector = '.js-block-fix-wrapper',
			width = docElem.clientWidth,
		//restWidth = width,
			height = docElem.clientHeight,
			restHeight = height,
			screenPosition = width > height ? 'Land' : 'Port',
			nodes = doc.querySelectorAll(selector);

		nodes = Array.prototype.slice.call(nodes);

		nodes = nodes.sort(function (a, b) {
			return parseInt(a.dataset.sizeOrder, 10) - parseInt(b.dataset.sizeOrder, 10);
		});

		nodes.forEach(function (node) {
			this.forEach(function (prop) {
				this[prop] = '';
			}, node.style);
		}, defaultProperties);


		nodes.forEach(function (node) {
			if (node.dataset['size' + screenPosition] === 'min') {
				restHeight -= node.offsetHeight;
			}
		});

		nodes.forEach(function (node) {

			var size = node.dataset['size' + screenPosition];

			if (size === 'min') {
				return;
			}

			size = size.replace(/\s+/g, '').split(';');

			size.forEach(function (pair) {

				pair = pair.split(':');

				var key = pair[0],
					value = pair[1];

				switch (key) {

					case 'float':
						this.style.float = value;
						break;

					case 'width':
						this.style.width = value;
						break;

					case 'height':

						if (value === 'max') {
							this.style.height = restHeight + 'px';
						} else {
							this.style.height = value;
						}

						break;

				}

			}, node);

		});

	}

	function blockFix() {

		blockFixOnResize();
		setTimeout(blockFixOnResize, 0);
		setTimeout(blockFixOnResize, 100);
		setTimeout(blockFixOnResize, 200);
		setTimeout(blockFixOnResize, 300);
		setTimeout(blockFixOnResize, 400);

	}

	win.addEventListener('resize', blockFix, false);

	win.blockFix = blockFix;


	function onTouchStart() {

		var wrapperHeight = this.clientHeight,
			container = this.querySelector('div'), // :scope > div
			containerHeight = container.clientHeight,
		//wrapperWidth = this.clientWidth,
			scrollTop = this.scrollTop;
		//scrollLeft = this.scrollLeft,

		if (containerHeight <= wrapperHeight) {
			return;
		}

		if (scrollTop <= 0) {
			this.scrollTop = 1;
			return;
		}

		if (wrapperHeight + scrollTop >= containerHeight) {
			this.scrollTop -= 1;
		}

	}

	function blockFixWithScroll() {

		if (win.info.isAndroid) { // do not add listeners for android
			return;
		}

		var nodes = doc.querySelectorAll('.js-fix-edge-scroll');
		nodes = Array.prototype.slice.call(nodes);
		nodes.forEach(function (node) {
			node.removeEventListener('touchstart', onTouchStart, false);
			node.addEventListener('touchstart', onTouchStart, false);
		});

	}

	win.blockFixWithScroll = blockFixWithScroll;

}(window, document, document.documentElement));