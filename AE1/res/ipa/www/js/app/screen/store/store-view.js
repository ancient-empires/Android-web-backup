(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP, util */

	win.APP = win.APP || {};

	APP.StoreView = APP.BaseView.extend({
		templates: ['store'],
		events: {
			'click .js-buy-unit': 'buyUnit',
			'click .js-get-unit-info': 'showUnitInfo'
		},
		init: function (args) {

			var data = {},
				player = args.controller.activePlayer;

			this.player = player;
			this.controller = args.controller;

			data.unitInfo = APP.units.info;
			data.gold = player.gold;
			data.color = player.color;
			data.map = args.controller.map;

			this.$el = $(this.tmpl.store(data));

			this.bindScroll();

			this.$buyButtons = this.$el.find('.js-buy-unit');

			this.$wrapper = $('.js-wrapper');
			this.$wrapper.find('.js-store-wrapper').remove();
			this.$wrapper.append(this.$el);

		},
		setBuyButtonState: function() {

			var unitInfo = APP.units.info,
				gold = this.player.gold;

			this.$buyButtons.forEach(function(button){

				var unitName = button.dataset.name,
					cost = unitInfo[unitName].cost;

				if ( gold >= cost ) {
					button.classList.add('active');
				} else {
					button.classList.remove('active');
				}


			});

		},

		buyUnit: function(e) {

			var $button = $(e.currentTarget || e),
				unitName = $button.data('name'),
				unitInfo = APP.units.info,
				unitCost = unitInfo[unitName].cost,
				newUnit, unit,
				controller = this.controller,
				castle,
				player = this.player,
				$count, count,
				$unitCard = this.$el.find('.js-unit-card[data-name="' + unitName + '"]');

			$unitCard.removeClass('buying-animation');

			if ( unitCost > this.player.gold ) {
				//alert('not enough money');
				return;
			}

			player.gold -= unitCost;

			controller.view.showPlayerInfo();

			castle = controller.getPlayerCastle();

			unit = {
				type: util.capitalise(unitName),
				x: castle.x,
				y: castle.y,
				playerId: player.id,
				color: player.color
			};

			player.boughtList = player.boughtList || [];
			player.boughtList.push(unitName.toLowerCase());

			this.setNewUnitXY({
				unit: unit,
				controller: controller,
				x: this.x,
				y: this.y
			});

			newUnit = controller.appendUnit(unit); // to controller
			controller.view.appendUnit(newUnit);

			this.setBuyButtonState();

			$count = $unitCard.find('.js-count-buy-unit');
			count = $count.html().trim();

			if (count) {
				count = parseInt(count, 10) + 1;
			} else {
				count = 1;
			}

			$count.html(count);

			if (count === 1) {
				util.forceReDraw($count[0]);
			}

			win.setTimeout($unitCard.addClass.bind($unitCard, 'buying-animation'), 10);

			controller.wispAction();

		},
		buyUnitCpu: function(data) {

			var unitName = data.unitName,
				unitInfo = APP.units.info,
				unitCost = unitInfo[unitName].cost,
				newUnit, unit,
				controller = data.controller,
				player = data.player;

			if ( unitCost > player.gold ) {
				return false;
			}

			player.gold -= unitCost;

			controller.view.showPlayerInfo();

			unit = {
				type: util.capitalise(unitName),
				x: data.x,
				y: data.y,
				playerId: player.id,
				color: player.color
			};


			this.setNewUnitXY({
				unit: unit,
				controller: controller,
				x: data.x,
				y: data.y
			});

			newUnit = controller.appendUnit(unit); // to controller
			controller.view.appendUnit(newUnit);

			controller.wispAction();

			return true;

		},
		showUnitInfo: function(e) {

			var $this = $(e.currentTarget),
				unitName = $this.data('name'),
				$description = this.$el.find('.js-unit-description[data-name="'+ unitName +'"]');

			this.$el.find('.js-unit-card[data-name="' + unitName + '"]').removeClass('buying-animation');

			return $description.hasClass('hidden') ? $description.removeClass('hidden') : $description.addClass('hidden');

		},
		setNewUnitXY: function (data) {

			var xy = {
					x: data.x,
					y: data.y
				},
				unit = data.unit,
				controller = data.controller,
				width = controller.map.size.width,
				height = controller.map.size.height,
				places = [],
				i, j;

			for (i = 0; i < width; i += 1) { // x
				for (j = 0; j < height; j += 1) { // y
					if ( !controller.getUnitsByCoordinates({x: i, y: j })[0] ) { // detect no unit on XY
						places.push({x: i, y: j });
					}
				}
			}

			function getLength(xy1, xy2) {
				return Math.pow(xy1.x - xy2.x, 2) + Math.pow(xy1.y - xy2.y, 2);
			}

			places.sort(function() {
				return Math.random() - 0.5;
			}).sort(function(xy1, xy2) {
				return getLength(xy1, xy) - getLength(xy2, xy);
			});

			unit.x = places[0].x;
			unit.y = places[0].y;

		},

		bindScroll: function () {

			if (win.info.isAndroid) { // do not add listeners for android
				return;
			}

			//debugger;

			this.$el[0].addEventListener('touchstart', function () {

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
					return;
				}

				if (wrapperHeight + scrollTop >= containerHeight) {
					this.scrollTop -= 1;
				}

			}, false);


		}

	});

}(window));