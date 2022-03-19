(function (win, doc, docElem) {

	"use strict";
	/*global console, alert, window, document */
	/*global $, util */

	var instances = [];

	win.addEventListener('resize', function() {
		instances.forEach(function(instance){
			instance.onResize();
		});
	}, false);

	function MoveArea (data) {

		this.node = {
			wrapper:{
				el: data.wrapper,
				width: undefined,
				height: undefined
			},
			container: {
				el: data.container,
				width: undefined,
				height: undefined
			}
		};

		this.vendor = {
			js: 'Webkit',
			css: '-webkit-'
		};

		this.jsTransform = this.vendor.js + 'Transform';
		this.cssTransform = this.vendor.css + 'transform';

		this.centeringContainer();

		this.bindEventListeners();

		instances.push(this);

	}

	MoveArea.prototype = {

		remove: function(data) {

			data = data || {};

			if (data.all) {
				instances = [];
				return;
			}

			instances.splice(instances.indexOf(this), 1);

			var key;

			for (key in this) {
				if (this.hasOwnProperty(key)) {
					delete this[key];
				}
			}

		},

		onResize: function() {

			this.centeringContainer();

		},

		centeringContainer: function() {

			this.setSizes();

			var node = this.node,
				wrapper = node.wrapper,
				container = node.container,
				offset = {
					x: Math.round((wrapper.width - container.width) / 2),
					y: Math.round((wrapper.height - container.height) / 2)
				},
				cssX = 0,
				cssY = 0;

			if (offset.x > 0) {
				cssX = offset.x;
			} else {
				wrapper.el.scrollLeft = -offset.x;
			}

			if (offset.y > 0) {
				cssY = offset.y;
			} else {
				wrapper.el.scrollTop = -offset.y;
			}

			container.el.style[this.jsTransform] = 'translate3d(' + cssX + 'px, ' + cssY + 'px, 0)';

		},

		setSizes: function() {

			var node = this.node,
				wrapper = node.wrapper,
				wrapperEl = wrapper.el,
				container = node.container,
				containerEl = container.el;

			wrapper.width = wrapperEl.clientWidth;
			wrapper.height = wrapperEl.clientHeight;
			container.width = containerEl.clientWidth;
			container.height = containerEl.clientHeight;

		},

		onTouchStart: function () {

			var wrapperHeight = this.clientHeight,
				container = this.querySelector('div'),
				containerHeight = container.clientHeight,
				//wrapperWidth = this.clientWidth,
				scrollTop = this.scrollTop;
				//scrollLeft = this.scrollLeft,

			if (containerHeight <= wrapperHeight) {
				return;
			}

			if (scrollTop <= 0) {
				this.scrollTop = 1;
			}

			if (wrapperHeight + scrollTop >= containerHeight) {
				this.scrollTop -= 1;
			}

		},

		bindEventListeners: function() {

			if ( !win.info.isAndroid ) { // do not add listeners for android
				this.node.wrapper.el.addEventListener('touchstart', this.onTouchStart, false);
			}

		}



	};

	win.MoveArea = MoveArea;

}(window, document, document.documentElement));















