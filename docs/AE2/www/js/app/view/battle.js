/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win, doc) {

	// todo: bug - after resize on ios - smoke is wrong

	"use strict";
	/*global window, document, setTimeout, history, Image */
	/*global Backbone, $, templateMaster, APP, log, Mover, _ */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.BattleView = APP.BB.BaseView.extend({

		events: {
			'click .js-end-turn': 'endTurn',
			'click .js-battle-menu-button': 'openMenu',
			'click .js-help-button': 'showHelp',
			'click .js-move-back-button': 'moveUndo',
			'hideHouseSmoke': 'hideHouseSmoke',
			'showHouseSmoke': 'showHouseSmoke'
		},

		selectors: {
			mapImageWrapper: '.js-map-image-wrapper',
			mapImage: '.js-map-image',
			moveAreaWrapper: '.js-move-area-wrapper',
			moveAreaContainer: '.js-move-area-container',
			mainEventHandler: '.js-main-event-handler',
			eventHandlerWrapper: '.js-event-handler-wrapper',
			eventSquares: '.js-event-square',
			activeEventSquare: '.active-event-square',
			activeSquareMark: '.active-square-mark',
			buildingWrapper: '.js-building-wrapper',
			unitsWrapper: '.js-units-wrapper',
			unitWrapper: '.js-unit-wrapper',
			building: '.js-building',
			smokeWrapper: '.js-smoke-wrapper',
			viewDisable: '.js-view-disable',
			viewCpuDisable: '.js-view-cpu-disable',
			square: '.js-square',
			statusBar: '.js-battle-view-status-bar',
			styleSquareSize: '.js-style-square-size',
			unitInfoWrapper: '.js-unit-info-wrapper',
			moveBack: '.js-move-back-button',
			helpButton: '.js-help-button'
		},

		squareSize: win.APP.map.squareSize,

		initialize: function (data) {

			var view = this;

			view.detectClickEvent();

			view.$el = $(view.tmpl.battle());

			if (data.fromSave) {

				view.info.set('difficult', data.difficult);

				var args = {
					jsMapKey: data.jsMapKey,
					money: 500,
					players: data.players,
					unitLimit: data.unitLimit,
					difficult: data.difficult,
					fromSave: true
				};

				view.set('args', args);
				view.set('argsForRestart', data.argsForRestart);

				view.set('map', data.map);

				// see normal load
				view.set('model', new win.APP.BB.BattleModel({
					view: view,
					args: view.get('args'),
					map: view.get('map'),
					savedData: data
				}));

				view.set('markActiveSquare', {}); // {x: number, y: number}

				view.set('infoSquareXY', {x: 0, y: 0}); // {x: number, y: number}

				// set sizes
				view.setSize();

				// draw map
				//setTimeout(function () {
				view.drawMap();
				//}, 50);

				// draw buildings
				view.drawBuildings(); // +

				// draw units
				view.drawUnits(); // +

				view.drawGraves();

				// bind move area
				view.bindMoveArea();

				view.bindEventListeners();

				view.render();

				view.moveBack.init({ view: view });

				// start game from model
				view.get('model').startGame();

				view.proto.initialize.apply(view, arguments);

				return;
			}

			// get map
			view.set('args', data);
			view.set('argsForRestart', view.util.copyJSON(data));

			win.APP.map.db.getMap({
				jsMapKey: data.jsMapKey,
				type: data.type
			}).then(function (map) {

				view.set('map', map);

				view.set('model', new win.APP.BB.BattleModel({
					view: view,
					args: view.get('args'),
					map: view.get('map')
				}));

				view.set('markActiveSquare', {}); // {x: number, y: number}

				view.set('infoSquareXY', {x: 0, y: 0}); // {x: number, y: number}

				// set sizes
				view.setSize();

				 //draw map
				view.drawMap();

				// draw buildings
				view.drawBuildings();

				// draw units
				view.drawUnits();

				// bind move area
				view.bindMoveArea();

				view.bindEventListeners();

				view.render();

				view.moveBack.init({ view: view });

				// start game from model
				view.get('model').startGame();

				view.proto.initialize.apply(view, arguments);

			});

		},

		moveUndo: function () {
			this.moveBack.moveBack();
		},

		moveBack: {

			init: function (data) {

				var moveBack = this,
					view = data.view;

				moveBack.view = view;

				moveBack.$button = view.$el.find(view.selectors.moveBack);

			},

			pushUnit: function (unit) {

				var moveBack = this;

				moveBack.unitSavedData = unit.toJSON();
				moveBack.unit = unit;

				if ( unit.get('model').get('activePlayer').type !== 'cpu' ) {
					moveBack.showButton();
				}

			},

			moveBack: function () {

				var moveBack = this,
					view = moveBack.view,
					unit = moveBack.unit,
					xy;

				unit.set(moveBack.unitSavedData);

				xy = {
					x: unit.get('x'),
					y: unit.get('y')
				};

				moveBack.view.moveUnitTo({
					unit: unit,
					x: xy.x,
					y: xy.y
				}).then(function () {
					moveBack.clear();
					view.onClick(xy);
				});

			},

			showButton: function () {

				var moveBack = this;

				moveBack.$button.removeClass('hidden');

			},

			hideButton: function () {

				var moveBack = this;

				moveBack.$button.addClass('hidden');

			},

			clear: function () {

				var moveBack = this;

				moveBack.hideButton();

				moveBack.unitSavedData = null;
				delete moveBack.unitSavedData;
				moveBack.unit = null;
				delete moveBack.unit;

			}

		},

		restart: function () {

			var view = this,
				args = view.get('argsForRestart');

			view.trigger('hide');

			new view.constructor(args);

		},

		disable: function () {
			this.$el.find(this.selectors.viewDisable).removeClass('hidden');
		},

		enable: function () {
			this.$el.find(this.selectors.viewDisable).addClass('hidden');
		},

		onClick: function (xy) {

			var view = this;

			view.markActiveSquare(xy);
			view.autoSetSquareInfo();

			// 0 - show unit available attack (using available path) - hold or dblclick
			// 1 - show unit info in popup - hold or dblclick
			// 5 - show available path - only for player unit - click

			view.get('model').click(xy);


		},

		endTurn: function () {

			var view = this,
				info = view.info;

			if ( info.get('confirmTurn') === 'on' ) {
				view.showPopup({
					popupName: 'end-turn-popup',
					parentView: view
				});
				return;
			}

			view.confirmedEndTurn();

		},

		confirmedEndTurn: function () {

			var view = this;

			view.get('model').newTurn();
			view.removeActiveSquare();
			view.clearAvailableActions();

		},

		markActiveSquare: function (xy) {

			this.removeActiveSquare();

			var view = this,
				x = xy.x,
				y = xy.y,
				util = view.util,
				selectors = view.selectors,
				squareEventHandler = util.findIn(view.$el[0], selectors.eventSquares + '[data-xy="x' + x + 'y' + y + '"]');

			if ( !squareEventHandler ) {
				squareEventHandler = view.createEventHandlerListener({
					x: xy.x,
					y: xy.y
				});
			}

			view.set('markActiveSquare', {
				x: x,
				y: y
			});

			$(squareEventHandler).html('<div class="' + view.classNames.activeSquareMark + '">&nbsp;</div>');

			view.showUnitInfo();

		},

		removeActiveSquare: function () {

			var view = this,
				node = view.util.findIn(view.$el[0], view.selectors.activeSquareMark);

			view.set('markActiveSquare', {
				x: null,
				y: null
			});

			view.hideUnitInfo();

			//return node && node.parentNode.removeChild(node);
			return node && $(node).remove();

		},

		restoreActiveSquare: function () {

			var view = this,
				markActiveSquareXy = view.get('markActiveSquare');

			if ( markActiveSquareXy.x === null || markActiveSquareXy.y === null ) {
				return;
			}

			view.markActiveSquare(markActiveSquareXy);
			view.showUnitInfo();

		},

		showAvailableActions: function (actions) {

			var view = this,
				deferred = $.Deferred();

			view.clearAvailableActions();

			if ( actions.availablePathWithTeamUnit ) {
				view.showAvailablePathWithTeamUnit(actions.availablePathWithTeamUnit);
			}

			if ( actions.confirmMoveAction ) {
				view.showConfirmMoveAction(actions.confirmMoveAction);
			}

			if ( actions.unitsUnderAttack ) {
				view.showUnitsUnderAttack(actions.unitsUnderAttack);
			}

			if ( actions.confirmAttackAction ) {
				view.showConfirmAttackAction(actions.confirmAttackAction);
			}

			if ( actions.gravesToRaise ) {
				view.showGravesToRaise(actions.gravesToRaise);
			}

			if ( actions.buildingToFix ) {
				view.showFixBuilding(actions.buildingToFix);
			}

			if ( actions.buildingToOccupy ) {
				view.showBuildingToOccupy(actions.buildingToOccupy);
			}

			if ( actions.openStore ) {
				view.showOpenStore(actions.openStore);
			}

			if ( actions.availableAttackMapWithPath ) {
				view.showAvailableAttackMapWithPath(actions.availableAttackMapWithPath);
			}

				setTimeout(function () {
					deferred.resolve();
				}, win.APP.info.actionTime());

			return deferred.promise();

		},

		showAvailablePathWithTeamUnit: function (path) {

			path.forEach(function (xy) {
				this.createEventHandlerListener({
					x: xy.x,
					y: xy.y,
					className: 'show-available-path'
				});
			}, this);

		},

		showConfirmMoveAction: function (confirmMoveAction) {

			this.createEventHandlerListener({
				x: confirmMoveAction.x,
				y: confirmMoveAction.y,
				className: 'show-confirm-move'
			});

		},

		showUnitsUnderAttack: function (unitsUnderAttack) {

			unitsUnderAttack.forEach(function (xy) {
				this.createEventHandlerListener({
					x: xy.x,
					y: xy.y,
					className: 'show-unit-under-attack'
				});
			}, this);

		},

		showConfirmAttackAction: function (confirmAttackAction) {

			this.createEventHandlerListener({
				x: confirmAttackAction.x,
				y: confirmAttackAction.y,
				className: 'show-confirm-attack'
			});

		},

		showGravesToRaise: function (graves) {

			graves.forEach(function (xy) {
				this.createEventHandlerListener({
					x: xy.x,
					y: xy.y,
					className: 'show-raise-skeleton'
				});
			}, this);

		},

		showFixBuilding: function (building) {

			this.createEventHandlerListener({
				x: building.x,
				y: building.y,
				className: 'show-fix-building'
			});

		},

		showBuildingToOccupy: function (building) {

			this.createEventHandlerListener({
				x: building.x,
				y: building.y,
				className: 'show-occupy-building'
			});

		},

		showOpenStore: function (xy) {

			this.createEventHandlerListener({
				x: xy.x,
				y: xy.y,
				className: 'show-open-store'
			});

		},

		showAvailableAttackMapWithPath: function (attackSquares) {

			var view = this,
				util = view.util,
				el = view.$el[0],
				squareSelector = view.selectors.eventSquares,
				availableAttackClassName = 'show-available-attack';

			attackSquares.forEach(function (xy) {

				var x = xy.x,
					y = xy.y,
					node = util.findIn(el, squareSelector + '[data-xy="x' + x + 'y' + y + '"]');

				if ( node ) {
					node.classList.add(availableAttackClassName);
					return;
				}

				view.createEventHandlerListener({
					x: x,
					y: y,
					className: availableAttackClassName
				});

			});

		},

		clearAvailableActions: function () {

			var view = this,
				//util = view.util,
				//nodes = util.findInAll(view.$el[0], view.selectors.eventSquares),
				nodes = view.$el.find(view.selectors.eventSquares);
				//parentNode = nodes[0] && nodes[0].parentNode;

			nodes.remove().empty();

			//nodes.forEach(function (node) {
			//	parentNode.removeChild(node);
			//});

			view.restoreActiveSquare();

		},

		updateStatusBar: function () {

			var view = this,
				util = view.util,
				hideSymbols = util.hideSymbols,
				model = view.get('model'),
				activePlayer = model.get('activePlayer'),
				unitLimit = model.get('unitLimit'),
				color = activePlayer.color,
				money = activePlayer.money,
				playerUnits = model.getUnitsByOwnerId(activePlayer.id),
				isCpu = activePlayer.type === 'cpu',
				obj = {
					color: color,
					unitLimit: isCpu ? hideSymbols(unitLimit, '-') : unitLimit,
					unitCount: isCpu ? hideSymbols(playerUnits.length, '-') : playerUnits.length,
					money: isCpu ? hideSymbols(money, '-') : money
				},
				$node = view.tmpl['battle-view-status-bar'](obj),
				$statusBarWrapper = view.$el.find(view.selectors.statusBar);

			$statusBarWrapper.empty().append($node);

			view.autoSetSquareInfo();

		},

		autoSetSquareInfo: function () {

			var view = this,
				xy = view.get('markActiveSquare'),
				model = view.get('model'),
				isNotXY = typeof xy.x !== 'number' || typeof xy.y !== 'number',
				building,
				terrain,
				infoViewObj = {},
				$el = view.$el,
				$node;

			if ( isNotXY ) {
				xy = view.get('infoSquareXY');
				xy.x = xy.x || 0;
				xy.y = xy.y || 0;
			}

			view.set('infoSquareXY', xy);

			building = model.getBuildingByXY(xy);
			terrain = model.getTerrainByXY(xy);
			infoViewObj.armor = model.getArmorByXY(xy);

			if ( building ) {
				if (building.state === 'normal') {
					infoViewObj.className = 'building-' + building.type + '-' + building.color;
				}
				if (building.state === 'destroyed') {
					infoViewObj.className = 'building-' + building.type + '-destroyed';
				}
			} else if ( terrain ) { // find terrain
				infoViewObj.className = 'terrain-' + terrain.terrainName;
			}

			$node = $(view.tmpl['battle-view-info-square'](infoViewObj));
			$el.find('.js-status-bar-info-square-container').remove().empty();
			$el.find('.js-status-bar-info-square-wrapper').append($node);

		},

		bindEventListeners: function () {
			var device = win.APP.device;
			this.listenTo(device, 'resize', this.onResize);
		},

		unbindEventListeners: function () {
			this.stopListening();
			this.get('mover').unbindEventListeners();
		},

		onResize: function () {

			var mover = this.get('mover');
			mover.detectSizes();
			mover.detectEdgePositions();
			mover.onResizeCheckState();

		},

		createEventHandlerListener: function (data) { // x, y, className

			var view = this,
				util = view.util,
				x = data.x,
				y = data.y,
				className = data.className || '',
				squareSize = view.getSquareSize(),
				pre = view.info.get('pre', true).css,
				node = doc.createElement('div'),
				prevNode = util.findIn(view.$el[0], view.selectors.eventSquares + '[data-xy="x' + x + 'y' + y + '"]'),
				wrapper;

			node.innerHTML = '&nbsp;';

			if ( prevNode ) {
				$(prevNode).remove().empty();
				//prevNode.parentNode.removeChild(prevNode);
			}

			node.className = ('js-square js-event-square square ' + className).trim();

			node.setAttribute('data-xy', 'x' + x + 'y' + y);
			node.setAttribute('data-x', x);
			node.setAttribute('data-y', y);

			node.setAttribute('style', pre + 'transform: translate3d(' + (x * squareSize) + 'px, ' +  (y * squareSize) + 'px, 0);');

			wrapper = util.findIn(view.$el[0], view.selectors.eventHandlerWrapper);
			wrapper.appendChild(node);

			return node;
		},

		drawMap: function () {

			var view = this,
				$mapImageWrapper = view.$el.find(view.selectors.mapImageWrapper),
				canvas = doc.createElement('canvas'),
				//canvas = $mapImageWrapper.get(0),
				ctx = canvas.getContext('2d'),
				getXYFromStringXY = view.util.getXYFromStringXY,
				xyStr = view.util.getStringFromXY,
				map = view.get('map'),
				squareSize = view.squareSize.max,
				squareSizeX2,
				mapTiles = win.APP.mapTiles,
				terrains = map.terrain,
				angleTypes = ['road', 'water'],
				mapWidth = map.size.width,
				mapHeight = map.size.height,
				maxCanvasSize = win.APP.map.maxCanvasSize,
				args = view.get('args'),
				mapType = args.type,
				jsMapKey = args.jsMapKey;

			// detect skirmish and missions
			if ( ['skirmish', 'mission'].indexOf(mapType) !== -1 ) {
				$mapImageWrapper.html('&nbsp;').css('background-image', 'url(map/' + jsMapKey + '.png)');
				return;
			}

			//if ( !this.info.get('isAndroid', true) ) { // for NOT android set size 24
			//	squareSize = 48; // see tiles image size 24 * 2
			//}

			// adjust square size
			while ( mapWidth * mapHeight * squareSize * squareSize * 4 >= maxCanvasSize ) {
				squareSize -= 6;
			}

			//squareSize -= 6;

			squareSizeX2 = squareSize * 2;

			canvas.width = mapWidth * squareSizeX2;
			canvas.height = mapHeight * squareSizeX2;

			// reduce blur for ios devices
			ctx.webkitImageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false; // future

			// prepare buildings
			_.each(terrains, function (value, xy) {

				var building = _.find(map.buildings, getXYFromStringXY(xy));

				if ( !building ) {
					return;
				}

				if ( 'farm' === building.type ) {
					terrains[xy] = 'terra-1';
				} else {
					terrains[xy] = 'road-1';
				}

			});

			// draw main tiles
			_.each(terrains, function (value, xy) {
				xy = getXYFromStringXY(xy);
				ctx.drawImage(mapTiles[value].img, xy.x * squareSizeX2, xy.y * squareSizeX2, squareSizeX2, squareSizeX2);
			});

			function isReal(x, y) {
				return x >= 0 && y >= 0 && x < mapWidth && y < mapHeight;
			}

			// draw angles road
			angleTypes.forEach(function (type) {

				_.each(terrains, function (value, xy) {

					if ( value.indexOf(type) === -1 ) {
						return;
					}

					xy = getXYFromStringXY(xy);

					var x = xy.x,
						y = xy.y,
						xl = x - 1,
						xr = x + 1,
						yu = y - 1,
						yd = y + 1,
						xSquareSizeX2 = x * squareSizeX2,
						ySquareSizeX2 = y * squareSizeX2,
						xSquareSizeX2Half = xSquareSizeX2 + squareSize,
						ySquareSizeX2Half = ySquareSizeX2 + squareSize,

						terrain1Real = isReal(xl, yu) && terrains[xyStr(xl, yu)],
						terrain2Real = isReal(x, yu) && terrains[xyStr(x, yu)],
						terrain3Real = isReal(xr, yu) && terrains[xyStr(xr, yu)],
						terrain4Real = isReal(xl, y) && terrains[xyStr(xl, y)],
						terrain6Real = isReal(xr, y) && terrains[xyStr(xr, y)],
						terrain7Real = isReal(xl, yd) && terrains[xyStr(xl, yd)],
						terrain8Real = isReal(x, yd) && terrains[xyStr(x, yd)],
						terrain9Real = isReal(xr, yd) && terrains[xyStr(xr, yd)],

						terrain1 = terrain1Real || value,
						terrain2 = terrain2Real || value,
						terrain3 = terrain3Real || value,
						terrain4 = terrain4Real || value,
						terrain6 = terrain6Real || value,
						terrain7 = terrain7Real || value,
						terrain8 = terrain8Real || value,
						terrain9 = terrain9Real || value,

						// true if no bridge or no terrain type
						t1 = terrain1.indexOf(type) && terrain1.indexOf('bridge'),
						t2 = terrain2.indexOf(type) && terrain2.indexOf('bridge'),
						t3 = terrain3.indexOf(type) && terrain3.indexOf('bridge'),
						t4 = terrain4.indexOf(type) && terrain4.indexOf('bridge'),
						t6 = terrain6.indexOf(type) && terrain6.indexOf('bridge'),
						t7 = terrain7.indexOf(type) && terrain7.indexOf('bridge'),
						t8 = terrain8.indexOf(type) && terrain8.indexOf('bridge'),
						t9 = terrain9.indexOf(type) && terrain9.indexOf('bridge');

					if (type === 'road') {

						if (!terrain2Real) {
							t2 = !t4 || !t6;
						}

						if (!terrain4Real) {
							t4 = !t2 || !t8;
						}

						if (!terrain6Real) {
							t6 = !t2 || !t8;
						}

						if (!terrain8Real) {
							t8 = !t4 || !t6;
						}

					}

					// draw 2, 4, 6, 8
					if ( t2 ) { // up is different type
						ctx.drawImage(mapTiles['a-' + type + '-2'].img, xSquareSizeX2, ySquareSizeX2, squareSizeX2, squareSize);
					}

					if ( t4 ) {
						ctx.drawImage(mapTiles['a-' + type + '-4'].img, xSquareSizeX2, ySquareSizeX2, squareSize, squareSizeX2);
					}

					if ( t6 ) {
						ctx.drawImage(mapTiles['a-' + type + '-6'].img, xSquareSizeX2Half, ySquareSizeX2, squareSize, squareSizeX2);
					}

					if ( t8 ) {
						ctx.drawImage(mapTiles['a-' + type + '-8'].img, xSquareSizeX2, ySquareSizeX2Half, squareSizeX2, squareSize);
					}

					// draw 1, 3, 7, 9 - normal
					if ( t2 && t4 ) {
						ctx.drawImage(mapTiles['a-' + type + '-1'].img, xSquareSizeX2, ySquareSizeX2, squareSize, squareSize);
					}

					if ( t2 && t6 ) {
						ctx.drawImage(mapTiles['a-' + type + '-3'].img, xSquareSizeX2Half, ySquareSizeX2, squareSize, squareSize);
					}

					if ( t4 && t8 ) {
						ctx.drawImage(mapTiles['a-' + type + '-7'].img, xSquareSizeX2, ySquareSizeX2Half, squareSize, squareSize);
					}

					if ( t6 && t8 ) {
						ctx.drawImage(mapTiles['a-' + type + '-9'].img, xSquareSizeX2Half, ySquareSizeX2Half, squareSize, squareSize);
					}

					// draw 1, 3, 7, 9 - small
					if ( !t2 && !t4 && t1 ) {
						ctx.drawImage(mapTiles['a-' + type + '-1-s'].img, xSquareSizeX2, ySquareSizeX2, squareSize, squareSize);
					}

					if ( !t2 && !t6 && t3 ) {
						ctx.drawImage(mapTiles['a-' + type + '-3-s'].img, xSquareSizeX2Half, ySquareSizeX2, squareSize, squareSize);
					}

					if ( !t4 && !t8 && t7 ) {
						ctx.drawImage(mapTiles['a-' + type + '-7-s'].img, xSquareSizeX2, ySquareSizeX2Half, squareSize, squareSize);
					}

					if ( !t6 && !t8 && t9 ) {
						ctx.drawImage(mapTiles['a-' + type + '-9-s'].img, xSquareSizeX2Half, ySquareSizeX2Half, squareSize, squareSize);
					}

					// fix building

				});

			});

			$mapImageWrapper.find('img')[0].src = canvas.toDataURL();

		},

		drawBuildings: function () {

			var view = this,
				model = view.get('model'),
				info = view.info,
				smokeState = info.get('buildingSmoke');

			model.appendBuildings();

			if (smokeState === 'on') {
				view.showHouseSmoke();
			} else {
				view.hideHouseSmoke();
			}

		},

		hideHouseSmoke: function () {

			this.$el.find(this.selectors.smokeWrapper).remove().empty();

		},

		showHouseSmoke: function () {

			var view = this,
				model = view.get('model'),
				buildings = model.get('buildings'),
				$el = view.$el,
				selectors = view.selectors,
				$eventHandleWrapper = $el.find(selectors.eventHandlerWrapper),
				$smokeWrapper = $('<div/>').attr('class', 'js-smoke-wrapper smoke-wrapper').attr('style', $eventHandleWrapper.attr('style'));

			view.hideHouseSmoke();

			$eventHandleWrapper.after($smokeWrapper);

			_.each(buildings, function (building) {
				if ( building.type === 'farm' && building.hasOwnProperty('ownerId') ) {
					view.addSmokeToBuilding(building);
				}
			});

		},

		appendBuilding: function (building) {

			var $node = $('<div>&nbsp;</div>'),
				x = building.x,
				y = building.y,
				dY = building.type === 'castle' ? -1 : 0,
				squareSize = this.getSquareSize(),
				height = squareSize - squareSize * dY,
				pre = this.info.get('pre', true).css,
				$wrapper = this.$el.find(this.selectors.buildingWrapper);

			$node.attr('data-xy', 'x' + x + 'y' + y).attr('data-x', x).attr('data-y', y).attr('data-type', building.type);

			$node.addClass('building').addClass('js-building').addClass('square');

			if (building.state === 'normal') {
				$node.addClass( 'building-' + building.type + '-' + (building.color || 'gray') );
			}

			if (building.state === 'destroyed') {
				$node.addClass( 'building-' + building.type + '-destroyed' );
			}

			x = x * squareSize;
			y = (y + dY) * squareSize;

			$node.css(pre + 'transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

			$node.css({
				height: height + 'px'
			});

			if (building.type === 'farm' && building.hasOwnProperty('ownerId')) {
				this.addSmokeToBuilding(building);
			}

			$wrapper.append($node);

		},

		redrawBuilding: function (building) {

			var view = this,
				state = building.state,
				color = building.color || win.APP.building.defaults.color,
				type = building.type,
				x = building.x,
				y = building.y,
				$wrapper = view.$el.find(view.selectors.buildingWrapper),
				$buildingNode = $wrapper.find('[data-xy="x' + x + 'y' + y + '"]');

			$buildingNode.attr('class', '').addClass('building js-building square');

			if ( state === 'normal' ) {
				$buildingNode.addClass( 'building-' + type + '-' + color );
			}

			if ( state === 'destroyed' ) {
				$buildingNode.addClass( 'building-' + type + '-destroyed' );
				view.removeSmokeToBuilding(building);
			}

			if ( type === 'farm' && building.hasOwnProperty('ownerId') ) {
				view.addSmokeToBuilding(building);
			} else {
				view.removeSmokeToBuilding(building);
			}

		},

		redrawUnit: function (unit) {

			var view = this,
				x = unit.get('x'),
				y = unit.get('y'),
				color = unit.get('color'),
				$unitWrapper = view.$el.find(view.selectors.unitsWrapper),
				allColors = win.APP.map.allColors,
				type = unit.get('type'),
				$unit = $unitWrapper.find('[data-xy="x' + x + 'y' + y + '"]'),
				$unitImage = $unit.find('.js-unit-image');

			_.each(allColors, function (color) {
				$unitImage.removeClass('unit-image-' + type + '-' + color);
			});

			$unitImage.addClass('unit-image-' + type + '-' + color);

		},

		addSmokeToBuilding: function (building) {

			var x = building.x,
				y = building.y,
				pre = this.info.get('pre', true).css,
				squareSize = this.getSquareSize(),
				$wrapper = this.$el.find(this.selectors.smokeWrapper),
				$smokeContainer = $('<div class="square js-square"><div class="building-smoke-mover"><div class="building-smoke">&nbsp;</div></div></div>');

			if (!$wrapper.length) {
				return;
			}

			$wrapper.find('[data-xy="x' + x +'y' + y + '"]').remove().empty();

			$smokeContainer.attr('data-xy', 'x' + x + 'y' + y).attr('data-x', x).attr('data-y', y);

			x *= squareSize;
			y *= squareSize;

			$smokeContainer.css(pre + 'transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

			$wrapper.append($smokeContainer);


		},

		removeSmokeToBuilding: function (building) {

			var x = building.x,
				y = building.y,
				$wrapper = this.$el.find(this.selectors.smokeWrapper),
				$smokeContainer = $wrapper.find('[data-xy="x' + x + 'y' + y + '"]');

			if (!$wrapper.length) {
				return;
			}

			$smokeContainer.remove().empty();

		},

		drawUnits: function () {
			var model = this.get('model');
			model.appendUnits();
		},

		drawGraves: function () {
			var model = this.get('model');
			model.appendGraves();
		},

		appendUnit: function (unit) {

			var view = this,
				pre = view.info.get('pre', true).css,
				$unitWrapper = $('<div></div>'),
				squareSize = view.getSquareSize(),
				$unitBlock = $('<div>&nbsp;</div>'),
				unitInfo = unit.toJSON(),
				x = unitInfo.x,
				y = unitInfo.y,
				cssX = x * squareSize,
				cssY = y * squareSize,
				unitType = unit.get('type'),
				$unitLayerWrapper = view.$el.find(view.selectors.unitsWrapper),
				unitImage,
				animationEnd = view.info.get('animationEnd', true);

			$unitWrapper.css(pre + 'transform', 'translate3d(' + cssX + 'px, ' + cssY + 'px, 0)');

			$unitWrapper.attr({
				'data-x': x,
				'data-y': y,
				'data-xy': 'x' + x + 'y' + y,
				'data-unit-id': unitInfo.id
			});

			$unitWrapper.addClass('js-square square unit-wrapper unit-wrapper-' + unitType);

			$unitWrapper.append($unitBlock);

			$unitBlock.addClass('js-unit-image unit-image unit-image-' + unitType + '-' + unitInfo.color);

			// health
			//$unitWrapper.append('<div class="js-unit-health unit-health"><div class="js-unit-health-ten unit-health-ten">&nbsp;</div><div class="js-unit-health-one unit-health-one">&nbsp;</div></div>');

			// delta health
			//$unitWrapper.append('<div class="js-delta-unit-health delta-unit-health"><div class="js-delta-unit-health-sign delta-unit-health-sign">&nbsp;</div><div class="js-delta-unit-health-ten delta-unit-health-ten">&nbsp;</div><div class="js-delta-unit-health-one delta-unit-health-one">&nbsp;</div></div>');

			// wisp aura
			//$unitWrapper.append('<div class="js-under-wisp-aura-image under-wisp-aura-image">&nbsp;</div>');

			// poisoned
			//$unitWrapper.append('<div class="js-under-poison-image under-poison-image">&nbsp;</div>');

			// level
			//$unitWrapper.append('<div class="js-unit-level unit-level">&nbsp;</div>');

			// level up
			//$unitWrapper.append('<div class="js-unit-level-up unit-level-up">&nbsp;</div>');

			// show unit appear animation
			unitImage = $unitWrapper.find('.unit-image');
			unitImage.one(animationEnd, function () {
				$(this).removeClass('show-new-unit');
			}); // work only one time
			unitImage.addClass('show-new-unit');

			$unitLayerWrapper.append($unitWrapper);

			view.setUnitHealth({ unit: unit });

			view.setUnitLevel({ unit: unit, doNotShowLevelUp: Boolean(unit.get('xp')) });

		},


		removeUnit: function (unit) {

			this.getUnitByUnit(unit).remove().empty();

		},

		getUnitByUnit: function (unit) {
			return this.$el.find(this.selectors.unitsWrapper + ' [data-unit-id="' + unit.get('id') + '"]');
		},

		setActiveUnit: function (unit) {
			this.getUnitByUnit(unit).removeClass('not-active');
		},

		setNotActiveUnit: function (unit) {
			this.getUnitByUnit(unit).addClass('not-active');
		},

		addGrave: function (grave) {

			var view = this,
				pre = view.info.get('pre', true).css,
				$graveWrapper = $('<div>&nbsp;</div>'),
				squareSize = view.getSquareSize(),
				x = grave.x,
				y = grave.y,
				cssX = x * squareSize,
				cssY = y * squareSize,
				$unitLayerWrapper = view.$el.find(view.selectors.unitsWrapper);

			$graveWrapper.css(pre + 'transform', 'translate3d(' + cssX + 'px, ' + cssY + 'px, 0)');

			$graveWrapper.attr({
				'data-x': x,
				'data-y': y,
				'data-xy': 'x' + x + 'y' + y,
				'data-grave-id': grave.id
			});

			$graveWrapper.addClass('js-square square grave-wrapper');

			$unitLayerWrapper.append($graveWrapper);

		},

		removeGrave: function (grave) {

			var view = this,
				$graveWrapper = view.$el.find(view.selectors.unitsWrapper + ' [data-grave-id="' + grave.id + '"]');

			$graveWrapper.remove().empty();

		},

		setWispAuraState: function (data) {

			var view = this,
				unit = data.unit,
				wispAuraState = data.wispAuraState,
				$unitNode = view.getUnitByUnit(unit),
				$wispAura;

			if (wispAuraState) {
				// do not add node if node exist
				$wispAura = $unitNode.find('.js-under-wisp-aura-image');
				if (!$wispAura.length) {
					$unitNode.append('<div class="js-under-wisp-aura-image under-wisp-aura-image">&nbsp;</div>')
				}
			} else {
				//remove wist aura
				$unitNode.find('.js-under-wisp-aura-image').remove().empty();
			}

		},

		setPoisonState: function (data) {

			var view = this,
				unit = data.unit,
				poisonCount = data.poisonCount,
				$unitNode = view.getUnitByUnit(unit),
				$poison;

			if (poisonCount) {
				// do not add node if node exist
				$poison = $unitNode.find('.js-under-poison-image');
				if (!$poison.length) {
					$unitNode.append('<div class="js-under-poison-image under-poison-image">&nbsp;</div>')
				}
			} else {
				$unitNode.find('.js-under-poison-image').remove().empty();
			}

		},

		getSquareSize: function () {
			return this.info.get('squareSize');
		},

		setSize: function () {

			var squareSize = this.getSquareSize() || this.squareSize.default,
				selectors = this.selectors,
				$moveAreaContainer = this.$el.find(selectors.moveAreaContainer),
				$mapImageWrapper = this.$el.find(selectors.mapImageWrapper),
				$eventHandlerWrapper = this.$el.find(selectors.eventHandlerWrapper),
				$squares = this.$el.find(selectors.square),
				$buildings = this.$el.find(selectors.building),
				map = this.get('map'),
				pre = this.info.get('pre', true).css,
				width = map.size.width * squareSize,
				height = map.size.height * squareSize,
				$innerBlocks = this.$el.find(selectors.moveAreaContainer + '> div');

			this.info.set('squareSize', squareSize);

			// set container
			$moveAreaContainer.css({
					width: width + 'px',
					height: height + 'px'
				});

			// set canvas
			$mapImageWrapper.css({
					width: width + 'px',
					height: height + 'px'
				});

			// set event handler wrapper
			$eventHandlerWrapper.css({
					width: width + 'px',
					height: height + 'px'
				});

			// set .building-wrapper, units-wrapper and etc.
			$innerBlocks.css({
					width: width + 'px',
					height: height + 'px'
				});

			// set squares sizes
			$squares.each(function () {

				var $this = $(this),
					x = Number($this.attr('data-x')) * squareSize,
					y = Number($this.attr('data-y')) * squareSize;

				$this.css(pre + 'transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

			});

			// set buildings position
			$buildings.each(function () {

				var $this = $(this),
					type = $this.attr('data-type'),
					x = Number($this.attr('data-x')),
					y = Number($this.attr('data-y')),
					dY = type === 'castle' ? -1 : 0,
					nodeHeight = squareSize - squareSize * dY;

				x = x * squareSize;
				y = (y + dY) * squareSize;

				$this.css(pre + 'transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

				$this.css({
					height: nodeHeight + 'px'
				});

			});

			this.autoSetStyleForSize();

		},

		autoSetStyleForSize: function () {

			var view = this,
				squareSize = view.getSquareSize(),
				$el = view.$el,
				selectors = view.selectors,
				$style = $el.find(selectors.styleSquareSize);

			$style.html('.square-grid { background-size: ' + squareSize + 'px ' + squareSize + 'px } .square { width: ' + squareSize + 'px; height: ' + squareSize + 'px; }');

		},

		bindMoveArea: function () {

			var moveAreaWrapper = this.$el.find(this.selectors.moveAreaWrapper),
				moveAreaContainer = moveAreaWrapper.find(this.selectors.moveAreaContainer),
				mover = new Mover({
					wrapper: moveAreaWrapper,
					container: moveAreaContainer,
					onRedraw: {
						context: this,
						fn: this.onRedrawMapFromMover
					}
				});

			mover.init();

			this.set('mover', mover);

		},

		onRedrawMapFromMover: function (data) {

			var xyzs = data.xyzs,
				time = xyzs.hasOwnProperty('time') ? xyzs.time : 300,
				scale = xyzs.scale,
				x = xyzs.x,
				y = xyzs.y,
				z = xyzs.z,
				squareSize = Math.round(this.getSquareSize() * scale),
				mover = this.get('mover');

			squareSize = win.APP.util.getBetween(this.squareSize.min, squareSize, this.squareSize.max);

			this.info.set('squareSize', squareSize);

			this.setSize();

			mover.detectSizes();
			mover.detectEdgePositions();
			mover.setDefaultContainerSize();
			mover.setStyleByXYZS({
				x: x,
				y: y,
				z: z,
				time:  time,
				check: true // fix if user up two finger simultaneously
			});

			mover.set('currentContainerXY', { // fix if user up two finger simultaneously
				x: x,                         // see mover.fixAfterResizing
				y: y
			});

		},

		detectClickEvent: function () {

			var view = this,
				selectors = view.selectors;

			$.Finger.pressDuration = 600;

			view.events[view.eventTypes.down + ' ' + selectors.moveAreaContainer] = 'saveDownEvent';
			view.events[view.eventTypes.move + ' ' + selectors.moveAreaContainer] = 'saveMoveEvent';
			view.events[view.eventTypes.up + ' ' + selectors.mainEventHandler] = 'detectClick';
			view.events[view.eventTypes.dbl + ' ' + selectors.mainEventHandler] = 'detectDblClick';
			view.events['press' + ' ' + selectors.mainEventHandler] = 'detectPress';

		},

		detectClick: function () {

			var view = this,
				downXY = view.get('downEvent'),
				moveXY = view.get('moveEvent'),
				maxDeltaMove = 10,
				xy;

			if ( !downXY || !moveXY ) {
				return;
			}

			if ( Math.abs(downXY.x - moveXY.x) + Math.abs(downXY.y - moveXY.y) >  maxDeltaMove ) {
				return;
			}

			xy = view.getEventXy();

			view.onClick(xy);

		},

		detectPress: function () {

			var view = this,
				downEvent = view.get('downEvent'),
				moveEvent = view.get('moveEvent'),
				lang,
				model, xy, unit, levelPercent, unitLangData, placeArmor;

			if ( Math.abs(downEvent.x - moveEvent.x) + Math.abs(downEvent.y - moveEvent.y) > 7 )  { // detect press event without move
				return;
			}

			model = view.get('model');
			xy = view.getEventXy();
			unit = model.getUnitByXY(xy);

			if ( !unit ) {
				return;
			}

			model.clearAvailableActions();
			view.clearAvailableActions();

			lang = win.APP.lang;
			unitLangData = lang.get('unitsList')[unit.get('langKey')];

			levelPercent = (function (){

				var levelList = win.APP.unitMaster.levelList,
					xp = unit.get('xp') || 0,
					level = unit.get('level') || 0,
					min = levelList[level],
					max = levelList[level + 1],
					length = max - min;

				if ( !max ) { // max level exceed
					return 100;
				}

				return (xp - min) / length * 100; // de

			}());

			/*jslint white: true, nomen: true */
			placeArmor = (function () {

				var unitXY = {
						x: unit.get('x'),
						y: unit.get('y')
					},
					unitMoveType = unit.get('moveType'),
					unitTerrain = model.getTerrainByXY(unitXY);

				// detect armor for elementals
				if (unitMoveType === 'flow' && unitTerrain.terrainType === 'water') {
					return win.APP.unitMaster.bonusDefByWater;
				}

				return model.getArmorByXY(unitXY);

			}());

			view.showPopup({
				cssClass: 'full',
				popupName: 'full-unit-info',
				popupData: {
					unit: unit,
					defByTerrain: placeArmor,
					img: ['unit-image', unit.get('type'), unit.get('color')].join('-'),
					name: unitLangData.name,
					description: unitLangData.description,
					levelPercent: levelPercent
				}
			});

		},

		detectDblClick: function () {

			var view = this,
				model = view.get('model'),
				xy = view.getEventXy(),
				activePlayer = model.get('activePlayer'),
				availableActions,
				availableAttackMapWithPath,
				//x = markActiveSquareXy.x,
				//y = markActiveSquareXy.y,
				unit = model.getUnitByXY(xy);

			if ( !unit ) {
				return;
			}

			availableAttackMapWithPath = unit.getAvailableAttackMapWithPath();

			if ( unit.get('ownerId') === activePlayer.id ) { // 'active' unit

				availableActions = unit.getAvailableActions();
				availableActions.availableAttackMapWithPath = availableAttackMapWithPath;
				view.showAvailableActions(availableActions);
				model.set('availableActions', availableActions);

			} else { // enemy or teams unit

				model.clearAvailableActions();
				view.clearAvailableActions();
				view.showAvailableActions({
					availablePathWithTeamUnit: unit.getAvailablePathWithTeamUnit(),
					availableAttackMapWithPath: availableAttackMapWithPath
				});

			}

		},

		getEventXy: function () {

			var view = this,
				x, y,
				downXY = view.get('downEvent'),
				selectors = view.selectors,
				$el = view.$el,
				$moveAreaWrapper = $el.find(selectors.moveAreaWrapper),
				$moveAreaContainer = $el.find(selectors.moveAreaContainer),
				squareSize = view.getSquareSize(),
				$mainEventHandler = $el.find(selectors.mainEventHandler),
				w = $moveAreaWrapper.width(),
				h = $moveAreaWrapper.height(),
				aw = $mainEventHandler.width(),
				ah = $mainEventHandler.height(),
				dxy = view.util.getXyFromStyle($moveAreaContainer.attr('style'));

			x = (aw - w) / 2 + downXY.x - dxy.x;
			y = (ah - h) / 2 + downXY.y - dxy.y;

			x = Math.floor( x / squareSize );
			y = Math.floor( y / squareSize );

			return {
				x: x,
				y: y
			};

		},

		saveDownEvent: function (e) {

			var events = this.getEvents(e);

			if (events.length === 1) {
				this.set('downEvent', events.events[0]);
				this.set('moveEvent', events.events[0]);
			} else {
				this.set('downEvent', false);
				this.set('moveEvent', false);
			}

		},

		saveMoveEvent: function (e) {

			var events = this.getEvents(e);

			if (events.length === 1) {
				this.set('moveEvent', events.events[0]);
			} else {
				this.set('moveEvent', false);
			}

		},

		getEvents: function (e) {

			e = e.originalEvent;

			var evt = {},
				touches = e.touches,
				events = touches || [e];

			evt.events = [];

			evt.length = events.length;

			_.each(events, function (e) {
				evt.events.push({
					x: e.clientX,
					y: e.clientY
				});

			});

			return evt;

		},

		//////////////////
		// unit actions
		//////////////////

		moveUnitTo: function (data) {

			var view = this,
				model = view.get('model'),
				deferred = $.Deferred(),
				pre = view.info.get('pre', true).css,
				transitionEnd = view.info.get('transitionEnd', true),
				squareSize = view.getSquareSize(),
				$unitNode = view.getUnitByUnit(data.unit),
				x = data.x,
				y = data.y,
				xPx = x * squareSize,
				yPx = y * squareSize;

			view.moveBack.pushUnit(data.unit);

			view.disable();

			$unitNode.addClass('moving');

			// set action on move end
			$unitNode.one(transitionEnd, function () {

				$(this)
					.removeClass('moving')
					.attr('data-x', x)
					.attr('data-y', y)
					.attr('data-xy', 'x' + x + 'y' + y);

				model.clearAvailableActions();
				view.clearAvailableActions();

				view.enable();

				deferred.resolve();

			}); // work only one time

			$unitNode.css(pre + 'transform', 'translate3d(' + xPx + 'px, ' + yPx + 'px, 0)');

			return deferred.promise();

		},

		//showFightScreen: function (data) {
		//
		//	var view = this,
		//		info = view.info,
		//		deferred = $.Deferred(),
		//		fightAnimationView;
		//
		//	if (info.get('fightAnimation') === 'on') {
		//		fightAnimationView = new win.APP.BB.FightAnimationView({
		//			parentView: view,
		//			parentDeferred: deferred,
		//			attacker: {
		//				unit: data.attacker
		//			},
		//			defender: {
		//				unit: data.defender
		//			}
		//		});
		//
		//		view.set('fightAnimationView', fightAnimationView);
		//
		//	} else {
		//		deferred.resolve();
		//	}
		//
		//	return deferred.promise();
		//
		//},

		showAttack: function (data) {

			var view = this,
				model = view.get('model'),
				from = data.from,
				to = data.to,
				deferred = $.Deferred(),
				pre = view.info.get('pre', true).css,
				transitionEnd = view.info.get('transitionEnd', true),
				squareSize = view.getSquareSize(),
				attackNode = doc.createElement('div'),
				$attackNode,
				//$attackNode = $('<div class="attack-square square js-attack-square">&nbsp;</div>'),
				$unitsWrapper = view.$el.find(view.selectors.unitsWrapper);

			attackNode.className = 'attack-square square js-attack-square';
			attackNode.innerHTML = '<div class="spark">&nbsp;</div>';

			$attackNode = $(attackNode);

			view.removeActiveSquare();

			$unitsWrapper.append($attackNode);

			$attackNode.css(pre + 'transform', 'translate3d(' + (from.x * squareSize) + 'px, ' + (from.y * squareSize) + 'px, 0)');


			$attackNode.one(transitionEnd, function () {

				//$(this).remove();
				view.$el.find('.js-attack-square').remove().empty();

				model.clearAvailableActions();
				view.clearAvailableActions();

				view.enable();

				deferred.resolve();

			}); // work only one time

			view.disable();

			$attackNode.addClass('moving');

			setTimeout(function () { // todo: try to do transitionEnd without this hack
				$attackNode.css(pre + 'transform', 'translate3d(' + (to.x * squareSize) + 'px, ' + (to.y * squareSize) + 'px, 0)');
			}, 50);

			return deferred.promise();

		},

		showDifferentUnitHealth: function (data) {

			var view = this,
				info = view.info,
				unit = data.unit,
				differentHealth = data.differentHealth,
				deferred = $.Deferred(),
				$unitWrapper = view.getUnitByUnit(unit),
				$deltaHealth = $('<div class="js-delta-unit-health delta-unit-health"><div class="js-delta-unit-health-sign delta-unit-health-sign">&nbsp;</div><div class="js-delta-unit-health-ten delta-unit-health-ten">&nbsp;</div><div class="js-delta-unit-health-one delta-unit-health-one">&nbsp;</div></div>'),
				animationEnd = view.info.get('animationEnd', true);

			$unitWrapper.append($deltaHealth);

			view.disable();

			view.setUnitHealth({ unit: unit });

			view.setUnitDifferentHealth({
				unit: unit,
				differentHealth: differentHealth
			});

			$deltaHealth.one(animationEnd, function () {

				$(this).remove().empty();

				view.enable();

				deferred.resolve();

			}); // work only one time

			//if (info.get('fightAnimation') === 'on') {
			//	view.get('fightAnimationView').refreshStatusBar();
			//}

			$deltaHealth.addClass('bounce');

			return deferred.promise();

		},

		chars: {
			charsList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'none', 'plus', 'minus', 'slash'],
			charReference: {
				'-': 'minus',
				'+': 'plus',
				'/': 'slash'
			}
		},

		setUnitHealth: function (data) {

			var view = this,
				unit = data.unit,
				health = unit.get('health'),
				defaultHealth = unit.get('defaultHealth'),
				$unitWrapper = view.getUnitByUnit(unit),
				one = 'none',
				ten = 'none',
				$healthOne = $unitWrapper.find('.js-unit-health-one'),
				$healthTen = $unitWrapper.find('.js-unit-health-ten');

			if (health === defaultHealth) {
				$healthOne.remove().empty();
				$healthTen.remove().empty();
				return;
			}

			health = health.toString().split('');
			one = health.pop() || one;
			ten = health.pop() || ten;

			if (one === 'none') {
				$healthOne.remove().empty();
			} else {
				if ($healthOne.length) {
					$healthOne.attr('class', 'js-unit-health-one unit-health-one number-1-' + one);
				} else {
					$unitWrapper.append('<div class="js-unit-health-one unit-health-one number-1-' + one + '">&nbsp;</div>')
				}
			}

			if (ten === 'none') {
				$healthTen.remove().empty();
			} else {
				if ($healthTen.length) {
					$healthTen.attr('class', 'js-unit-health-ten unit-health-ten number-1-' + ten);
				} else {
					$unitWrapper.append('<div class="js-unit-health-ten unit-health-ten number-1-' + ten + '">&nbsp;</div>')
				}
			}

		},

		setUnitDifferentHealth: function (data) {

			var view = this,
				$unitWrapper = view.getUnitByUnit(data.unit),
				sign = 'none',
				one = 'none',
				ten = 'none',
				$deltaHealthSign = $unitWrapper.find('.js-delta-unit-health-sign'),
				$deltaHealthOne = $unitWrapper.find('.js-delta-unit-health-one'),
				$deltaHealthTen = $unitWrapper.find('.js-delta-unit-health-ten'),
				differentHealth = data.differentHealth;

			if ( differentHealth > 0 ) {
				sign = 'plus';
			}

			if ( differentHealth < 0 ) {
				sign = 'minus';
			}

			differentHealth = Math.abs(differentHealth).toString();

			if ( differentHealth.length === 1 ) {
				one = differentHealth[0];
			}

			if ( differentHealth.length === 2 ) {
				one = differentHealth[1];
				ten = differentHealth[0];
			}

			$deltaHealthSign.addClass('number-2-' + sign);
			$deltaHealthOne.addClass('number-2-' + one);
			$deltaHealthTen.addClass('number-2-' + ten);

		},

		setUnitLevel: function (data) {

			var view = this,
				unit = data.unit,
				level = unit.get('level'),
				$unitWrapper = view.getUnitByUnit(unit),
				$level = $unitWrapper.find('.js-unit-level');

			if ( !level ) {
				return;
			}

			if ($level.length) {
				$level.attr('class', 'js-unit-level unit-level number-1-' + level);
			} else {
				$unitWrapper.append('<div class="js-unit-level unit-level number-1-' + level + '">&nbsp;</div>')
			}

			if ( !data.doNotShowLevelUp ) { // when commander was killed and was buy in unit store
				view.showLevelUp({
					unit: unit
				});
			}

		},

		showLevelUp: function (data) {

			var view = this,
				unit = data.unit,
				$unitWrapper = view.getUnitByUnit(unit),
				$levelUp = $('<div class="js-unit-level-up unit-level-up">&nbsp;</div>'),
				animationEnd = view.info.get('animationEnd', true);

			$unitWrapper.append($levelUp);

			$levelUp.one(animationEnd, function () {
				$(this).remove().empty();
			}); // work only one time

			$levelUp.addClass('move-up');

		},

		//notifications
		showObjective: function () {

			var view = this,
				model = view.get('model'),
				map = model.get('map'),
				mapType = map.type,
				lang = win.APP.lang,
				languageField = 'objective-' + view.info.get('language');

			if ( mapType === 'mission' ) {
				return view.showPopup({
					popupName: 'simple-notification',
					popupData: {
						header: lang.get('objective'),
						text: map[languageField] || map.objective
					}
				});
			}

			if ( /skirmish|userMap/.test(mapType) ) {
				return view.showPopup({
					popupName: 'simple-notification',
					popupData: {
						header: lang.get('objective'),
						text: lang.get('skirmishObjective')
					}
				});
			}

		},

		showBriefing: function (data) {

			data = data || {};

			var view = this,
				model = view.get('model'),
				info = view.info,
				map = model.get('map'),
				briefingName = data.briefingName,
				languageField = briefingName + '-' + info.get('language'),
				briefingList = map[languageField] || map[briefingName] || [], // [] if map has no needed briefing
				deferred = $.Deferred(),
				promise = deferred.promise(),
				nextFunction;

			_.each(briefingList, function (item) {

				var onShow = item.onShow, onHide = item.onHide;

				if (onShow && onShow.context === 'parentView') {
					onShow.default_context = 'parentView';
					onShow.context = view;
				}

				if (onHide && onHide.context === 'parentView') {
					onHide.default_context = 'parentView';
					onHide.context = view;
				}

				nextFunction = (nextFunction || promise).then(function () {
					return view.showPopup(item);
				});
			});

			setTimeout(function () {
				deferred.resolve();
			}, info.actionTime());

		},
		
		openMenu: function () {

			new APP.BB.BattleMenuView({
				view: this
			});

		},

		showHelp: function () {

			var view = this,
				language = view.info.get('language'),
				model = view.get('model'),
				map = model.get('map'),
				help = map['help-' + language] || map.help || win.APP.lang.get('helpList'),
				$helpButton = view.$el.find(view.selectors.helpButton);

			if ( $helpButton.hasClass('blink') ) {
				$helpButton.addClass('hidden');
				$helpButton.removeClass('blink');
				setTimeout(function () {
					$helpButton.removeClass('hidden');
				}, 200);
			}

			view.showPopup({
				cssClass: 'full',
				popupName: 'help',
				popupData: {
					help: help
				}
			});

		},

		showUnitInfo: function () {

			var view = this,
				model = view.get('model'),
				unit,
				xy = view.get('markActiveSquare'),
				isNotXY = !xy.hasOwnProperty('x') || !xy.hasOwnProperty('y') || xy.x === null || xy.y === null;

			view.hideUnitInfo();

			if (isNotXY) {
				return;
			}

			unit = model.getUnitByXY(xy);
			if (!unit) {
				return;
			}

			var placeArmor = model.getArmorByXY(xy),
				level = unit.get('level'),
				unitMoveType = unit.get('moveType'),
				unitXY = {
					x: unit.get('x'),
					y: unit.get('y')
				},
				unitTerrain = model.getTerrainByXY(unitXY),
				atk = unit.get('atk'),
				atkMax = atk.max,
				atkMin = atk.min,
				def = unit.get('def'),
				underWispAura = unit.get('underWispAura'),
				poisonCount = unit.get('poisonCount'),
				unitMaster = win.APP.unitMaster,
				defByLevel = unitMaster.defByLevel,
				atkByLevel = unitMaster.atkByLevel,
				viewObj = {};

			atkMin = atkMin + level * atkByLevel;
			atkMax = atkMax + level * atkByLevel;
			viewObj.atk = atkMin + '-' + atkMax;
			viewObj.def = def + level * defByLevel;
			viewObj.level = level;
			viewObj.underWispAura = underWispAura;
			viewObj.poisonCount = poisonCount;
			viewObj.placeArmor = placeArmor;

			// detect armor for elementals
			if (unitMoveType === 'flow' && unitTerrain.terrainType === 'water') {
				viewObj.placeArmor = unitMaster.bonusDefByWater;
			}

			view.$el.find(view.selectors.unitInfoWrapper).html(view.tmpl['unit-info'](viewObj));

		},

		hideUnitInfo: function () {

			var view = this;

			view.$el.find(view.selectors.unitInfoWrapper).empty();

		},

		cpuMode: function (onOff) {

			var view = this,
				$node = view.$el.find(view.selectors.viewCpuDisable);

			return onOff ? $node.removeClass('hidden') : $node.addClass('hidden');

		},

		centerToXY: function (xy) {

			var view = this,
				map = view.get('map'),
				mover = view.get('mover'),
				squareSize = view.getSquareSize(),
				width = map.size.width,
				height = map.size.height,
				x = Math.round((xy.x - width / 2) * squareSize),
				y = Math.round((xy.y - height / 2) * squareSize);

			mover.showXY({
				x: -x,
				y: -y,
				time: view.info.actionTime()
			});

		}

	});

}(window, window.document));
