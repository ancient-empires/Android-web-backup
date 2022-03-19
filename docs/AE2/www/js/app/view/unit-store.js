/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window, setTimeout */
	/*global $, templateMaster, APP, Backbone, _ */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.UnitStoreView = APP.BB.BaseView.extend({

		selectors: {
			storeWrapper: '.js-store-wrapper',
			card: '.js-unit-card',
			buyUnitCount: '.js-buy-unit-count',
			descriptionUnitInfo: '.js-description-unit-info',
			disableUnitStore: '.js-disable-unit-store'
		},

		settings: {
			url: 'unit-store'
		},

		events: {
			'hide-unit-store': 'hide',
			'click .js-buy-unit': 'buyUnit',
			'click .js-show-unit-description': 'showUnitDescription'
			//'click .js-change-on-off-setting': 'changeOnOffSetting',
			//'click .js-change-select-setting': 'changeSelectSetting'
		},

		deltaActionTime: 360,

		initialize: function (data) {

			var view = this;

			if ( data.model.isUnitsTooMuch() ) {

				view.showTicket({
					popupData: {
						text: win.APP.lang.get('tooMuchUnits')
					},
					cssClass: 'error'
				});

				return;
			}

			view.set('createTime', Date.now());

			if (Backbone.history.fragment !== view.settings.url) {
				view.navigate(view.settings.url);
			}

			view.extendFromObj(data);

			view.proto.initialize.apply(view, arguments);

			view.render();

		},

		render: function () {

			var view = this,
				model = view.get('model'),
				map = model.get('map'),
				battleView = model.get('view'),
				player = model.get('activePlayer'),
				storeWrapper = view.$wrapper.find(view.selectors.storeWrapper);

			battleView.$el.find(battleView.selectors.moveAreaContainer).addClass('hidden');

			view.$el = $(view.tmpl['unit-store']({
				commander: player.commander,
				playerColor: player.color,
				availableStoreUnits: map.availableStoreUnits
			}));

			view.autoSetCardState();
			storeWrapper.append(view.$el);

		},

		buyUnit: function (e) {

			var view, model, mapSize, unitLimit, mapWidth, mapHeight, x, y, xy, currentXY, getPathSize, player,
				playerUnits, playerMoney, $this, unitType, unitData, unitCost, freeXYs, unitMaster, isCommander,
				firstXY, filteredXYs, moveBack;

			if (e.state === 'cpu') { // bot

				view = e.view;
				model = e.model;

				currentXY = {
					x: e.x,
					y: e.y
				};

				player = e.player;

				//$this;
				unitType = e.unitType;

			} else { // human

				view = this;
				model = view.get('model');

				if (Date.now() - view.get('createTime') < view.deltaActionTime) {
					return;
				}

				currentXY = {
					x: view.get('x'),
					y: view.get('y')
				};

				player = view.get('player');

				$this = $(e.currentTarget);
				unitType = $this.attr('data-unit-key');

			}

			mapSize = model.get('map').size;
			unitLimit = model.get('unitLimit');
			mapWidth = mapSize.width;
			mapHeight = mapSize.height;
			getPathSize = win.APP.util.getPathSize;
			playerUnits = model.getUnitsByOwnerId(player.id);
			playerMoney = player.money;
			unitData = win.APP.unitMaster.list[unitType];
			unitCost = unitData.cost;
			freeXYs = [];
			unitMaster = win.APP.unitMaster;
			isCommander = _.contains(unitMaster.commanderList, unitType);
			moveBack = model.get('view').moveBack;

			if ( isCommander ) {
				unitCost += (player.commander.deadCount || 0) * unitMaster.commanderAddedCost;
			}

			if ( playerUnits.length >= unitLimit ) {
				return;
			}

			if ( unitCost > playerMoney ) {
				return;
			}

			// if commander is live - return
			// do not buy 2+ commander
			if ( player.commander.isLive && isCommander ) {
				return;
			}

			player.money -= unitCost;

			for (x = 0; x < mapWidth; x += 1) {
				for (y = 0; y < mapHeight; y += 1) {
					xy = {x: x, y: y};
					if ( !model.getUnitByXY(xy) ) {
						freeXYs.push(xy);
					}
				}
			}

			freeXYs = freeXYs.sort(function (xy1, xy2) {

				var pathSize1 = getPathSize(currentXY, xy1),
					pathSize2 = getPathSize(currentXY, xy2);

				xy1.pathSize = pathSize1;
				xy2.pathSize = pathSize2;

				return pathSize1 - pathSize2;

			});

			// find nearest non player building
			firstXY = freeXYs[0];
			filteredXYs = _.filter(freeXYs, function (xy) {
				return Math.abs(firstXY.pathSize - xy.pathSize) < 0.00001;
			});

			filteredXYs = win.APP.util.assortArray(filteredXYs);

			_.each(filteredXYs, function (xy) {

				var unitTeamNumber = player.teamNumber,
					allBuildings = model.get('buildings'),
					buildingData = win.APP.building,
					wantedBuildingList = buildingData.wantedBuildingList,
					wantedBuildings = _.filter(allBuildings, function (building) {
						return building.teamNumber !== unitTeamNumber && _.contains(wantedBuildingList, building.type);
					}),

					nearestBuildingPathSize = Infinity;

				_.each(wantedBuildings, function (building) {
					nearestBuildingPathSize = Math.min(nearestBuildingPathSize, getPathSize(xy, building));
				});

				xy.nearestBuildingPathSize = nearestBuildingPathSize;

			});

			filteredXYs = filteredXYs.sort(function (xy1, xy2) {
				return xy1.nearestBuildingPathSize - xy2.nearestBuildingPathSize;
			});

			firstXY = filteredXYs[0];

			if ( moveBack.unitSavedData && moveBack.unitSavedData.x === firstXY.x && moveBack.unitSavedData.y === firstXY.y ) {
				moveBack.clear();
			}

			model.appendUnit({
				type: unitType,
				ownerId: player.id,
				teamNumber: player.teamNumber,
				color: player.color,
				x: firstXY.x,
				y: firstXY.y
			});

			if (e.state === 'cpu') { // bot
				view.updateStatusBar();
			} else {
				view.autoSetCardState();
				view.get('view').updateStatusBar();
				view.setUnitCounter(unitType);

				if ( model.isUnitsTooMuch() ) {
					view.routeBack();
					view.showTicket({
						popupData: {
							text: win.APP.lang.get('tooMuchUnits')
						},
						cssClass: 'error'
					});
				}

			}

		},

		autoSetCardState: function () {

			var view = this,
				model = view.get('model'),
				player = view.get('player'),
				playerUnits = model.getUnitsByOwnerId(player.id),
				unitLimit = model.get('unitLimit'),
				playerMoney = player.money,
				unitData = win.APP.unitMaster.list,
				$cards = view.$el.find(view.selectors.card),
				$commanderCard = view.$el.find(view.selectors.card + '[data-is-commander="true"]');

			// set commander state
			if ( player.commander.isLive ) {
				$commanderCard.addClass('hidden');
			} else {
				$commanderCard.removeClass('hidden');
			}

			// detect unit limit exceed
			if ( playerUnits.length >= unitLimit ) {
				$cards.addClass('disabled-card');
				return;
			}

			_.each($cards, function (card) {

				var $card = $(card),
					unitType = $card.attr('data-unit-card-name'),
					unitCost = unitData[unitType].cost;

				return unitCost > playerMoney ? $card.addClass('disabled-card') : $card.removeClass('disabled-card');

			});

		},

		setUnitCounter: function (type) {

			var view = this,
				selectors = view.selectors,
				$count = view.$el.find(selectors.buyUnitCount + '[data-unit-key="' + type + '"]'),
				count = parseInt($count.attr('data-unit-count'), 10) + 1;

			$count
				.removeClass('hidden')
				.attr('data-unit-count', count)
				.html('[' + count + ']');

		},

		showUnitDescription: function (e) {

			var view = this,
				$button = $(e.currentTarget),
				unitKey = $button.attr('data-unit-key'),
				state = $button.attr('data-description-is-show'),
				$description = view.$el.find(view.selectors.descriptionUnitInfo + '[data-unit-key="' + unitKey + '"]');

			if (Date.now() - view.get('createTime') < view.deltaActionTime) {
				return;
			}

			if ( state === 'no' ) {
				$description.removeClass('hidden');
				$button.attr('data-description-is-show', 'yes');
			} else {
				$description.addClass('hidden');
				$button.attr('data-description-is-show', 'no');
			}

		},

		hide: function () {

			var view = this,
				battleView = view.get('view'),
				battleModel = view.get('model');

			battleModel.clearAvailableActions();
			battleView.clearAvailableActions();
			battleView.removeActiveSquare();

			return view.proto.hide.apply(view, arguments);

		}


	});

}(window));
