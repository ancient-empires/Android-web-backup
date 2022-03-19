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

		this.$el = {
			wrapper:{
				$el: data.$wrapper,
				coordinates: {}
			},
			container: {
				$el: data.$container,
				coordinates: {}
			}
		};

		var bro = $();
		this.bro = bro;
		this.vendor = bro.getVendorPrefix();
		this.info = bro.info();
		this.evt = this.info.evt;

		this.cssTransform = this.vendor.js + 'Transform';

		this.centeringContainer();
		this.setEdgePosition();
		this.bindEventListeners();

		instances.push(this);

	}

	MoveArea.prototype = {

		remove: function() {

			instances = util.removeFromArray(instances, this);

			var key;

			for (key in this) {
				if (this.hasOwnProperty(key)) {
					delete this[key];
				}
			}

		},

		onResize: function() {

			this.centeringContainer();
			this.setEdgePosition();

		},

		centeringContainer: function() {

			this.setSizes();

			var $el = this.$el,
				wrapper = $el.wrapper,
				container = $el.container,
				$container = container.$el,
				offset = {
					x: Math.round((wrapper.width - container.width) / 2),
					y: Math.round((wrapper.height - container.height) / 2)
				};

			$container[0].style[this.cssTransform] = 'translate(' + offset.x + 'px, ' + offset.y + 'px)';

			this.setLastAvailable(offset);

		},

		setLastAvailable: function(xy) {

			this.lastAvailable = {
				x: xy.x !== undefined ? xy.x : this.lastAvailable.x,
				y: xy.y !== undefined ? xy.y : this.lastAvailable.y
			};

		},

		setSizes: function() {

			var $el = this.$el,
				wrapper = $el.wrapper,
				$wrapper = wrapper.$el,
				container = $el.container,
				$container = container.$el;

			wrapper.width = $wrapper.width();
			wrapper.height = $wrapper.height();
			container.width = $container.width();
			container.height = $container.height();

		},

		setEdgePosition: function() {

			var $el = this.$el,
				wrapper = $el.wrapper,
				$wrapper = wrapper.$el,
				container = $el.container,
				$container = container.$el;

			this.edge = {
				x: {
					max: 0,
					min: $wrapper.width() - $container.width()
				},
				y: {
					max: 0,
					min: $wrapper.height() - $container.height()
				}
			};

		},

		getCoordinates: function($node) {

			var style = $node[0].style[this.cssTransform],
				coordinates = style.match(/-?\d+/gi);

			coordinates = {
				x: parseInt(coordinates[0], 10),
				y: parseInt(coordinates[1], 10)
			};

			return coordinates;

		},
		bindEventListeners: function() {

			var wrapper = this.$el.wrapper.$el;

			wrapper.on('mousedown', this.detectStartPosition.bind(this));
			wrapper.on('mousemove', this.moveTo.bind(this));

		},
		detectStartPosition: function() {

			var container = this.$el.container,
				$container = container.$el,
				coordinates = this.getCoordinates($container);

			container.coordinates.start = coordinates;

			this.setLastAvailable(coordinates);

		},
		moveTo: function(e) {

			e.preventDefault();

			if (!this.evt.isActive) {
				return;
			}

			var evt = this.evt,
				start = evt.touchStart,
				move = evt.touchMove,
				delta = {
					x: start.x - move.x,
					y: start.y - move.y
				},
				container = this.$el.container,
				$container = container.$el,
				endCoordinates = {
					x: container.coordinates.start.x - delta.x,
					y: container.coordinates.start.y - delta.y
				},
				testResult = this.testForAvailableMove(endCoordinates);

			if ( Math.abs(delta.x) + Math.abs(delta.y) < 5 ) {
				return;
			}

			endCoordinates.x = Math.round(testResult.x ? endCoordinates.x : this.lastAvailable.x);
			endCoordinates.y = Math.round(testResult.y ? endCoordinates.y : this.lastAvailable.y);

			this.setLastAvailable(endCoordinates);

			$container[0].style[this.cssTransform] = 'translate(' + endCoordinates.x + 'px, ' + endCoordinates.y + 'px)';

		},
		testForAvailableMove: function(xy) {

			var result = {
					x: true,
					y: true
				},
				edge = this.edge;

			result.x = result.x && xy.x >= edge.x.min;
			result.x = result.x && xy.x <= edge.x.max;
			result.y = result.y && xy.y >= edge.y.min;
			result.y = result.y && xy.y <= edge.y.max;

			return result;

		}
	};

	win.MoveArea = MoveArea;

}(window, document, document.documentElement));















