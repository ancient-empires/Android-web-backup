(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP, util */

	win.APP = win.APP || {};

	APP.CreateMapView = APP.BaseView.extend({
		templates: ['create-map'],
		events: {

			'click .js-set-active-paint': 'setActivePaint',
			'dblclick .js-set-active-paint': 'fillByActivePaint',
			'click .js-create-map-from-html': 'createMap',
			'click .js-eraser': 'eraserOn'

		},
		size: {
			width: 14,
			height: 15
		},
		init: function () {

			this.$el = $(this.tmpl['create-map'](this));
			this.$wrapper = $('.js-wrapper');
			this.$wrapper.html('');
			this.$wrapper.append(this.$el);

			this.allCSSClasses = APP.map.terrainTypes.concat(APP.map.buildingsTypes, APP.units.info.unitList);

			var view = this;


			// draw
			this.$el.find('.square-line .square').on('click', function(){
				var $this = $(this);

				view.allCSSClasses.forEach(function(cssClass){
					$this.removeClass(view.layerType + '-' + cssClass);
					$this.data('type', '');
				});

				if (view.isEraser) {
					return;
				}

				$this.addClass(view.layerType + '-' + view.activePaint);

				$this.data('type', view.activePaint);

			});

		},
		setEraser: function(onOff) {
			this.isEraser = onOff;
		},
		eraserOn: function() {
			this.setEraser(true);
		},
		setActivePaint: function(e) {

			this.setEraser(false);

			var $node = $(e.currentTarget),
				layerName = $node.data('layer'),
				$layers = this.$el.find('.js-layers-wrapper>div'),
				$layer = this.$el.find('.js-' + layerName + '-layer');

			this.activePaint = $node.data('type');
			this.layerType = $node.data('layer-type');

			$layers.css('z-index', 0);
			$layer.css('z-index', 1);

			this.activeLayer = $layer;

		},
		fillByActivePaint: function(e) {

			this.activeLayer.find('.square').on('click');

		},
		createMap: function() {

			var map = {
				size: this.size,
				name: 'test map' + Math.random(),
				jsName: 'testMap' + Math.random(),
				units: [],
				buildings: [],
				terrain: {}
			},
				$units = this.$el.find('.js-unit-handler-square'),
				$buildings = this.$el.find('.js-building-handler-square'),
				$terrain = this.$el.find('.js-map-handler-square');

			// get units
			$units.forEach(function(node){
				var $this = $(node),
					x = $this.data('x'),
					y = $this.data('y'),
					type = $this.data('type');

				if (!type) {
					return;
				}

				map.units.push({
					type: util.capitalise(type),
					x: x,
					y: y
				});

			});

			// get buildings
			$buildings.forEach(function(node){
				var $this = $(node),
					x = $this.data('x'),
					y = $this.data('y'),
					type = $this.data('type');

				if (!type) {
					return;
				}

				map.buildings.push({
					type: type,
					x: x,
					y: y
				});

			});

			// get units
			$terrain.forEach(function(node){
				var $this = $(node),
					x = $this.data('x'),
					y = $this.data('y'),
					type = $this.data('type');

				if (!type) {
					return;
				}

				map.terrain['x' + x + 'y' + y] = type;

			});

			console.log(JSON.stringify(map).replace(/\"(\d+)\"/gi, '$1'));

			return map;

		}



	});

}(window));