/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window */
	/*global _, $ */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.MapEditorView = APP.BB.BattleView.extend({

		events: {
			'click .js-open-map-popup': 'openMapPopup',
			'click .js-delete-map-popup': 'deleteMapPopup',
			//'change .js-tool-size': 'changeSize',

			'click .js-set-brush-type': 'setBrushType',
			'click .js-set-brush-color': 'setBrushColor',
			'click .js-set-brush-form': 'setBrushForm',

			'click .js-save-map': 'saveMap',
			'click .js-size-button': 'setMapSize',
			'input .js-map-name': 'onChangeMapName',
			'focus .js-map-name': 'disableMapEditor',
			'blur .js-map-name': 'enableMapEditor',
			'click .js-map-editor-disable-screen': 'enableMapEditor',
			'click .js-clear-map-popup': 'popupClearMap'

		},

		selectors: {

			// self
			toolsWrapper: '.js-map-editor-tools-wrapper',
			disableScreen: '.js-map-editor-disable-screen',
			mapSize: '.js-map-size',

			// nested
			mapImageWrapper: '.js-map-image-wrapper',
			mapImage: '.js-map-image',
			moveAreaWrapper: '.js-move-area-wrapper',
			moveAreaContainer: '.js-move-area-container',
			mainEventHandler: '.js-main-event-handler',
			eventHandlerWrapper: '.js-event-handler-wrapper',
			eventSquares: '.js-event-square',
			//activeEventSquare: '.active-event-square',
			//activeSquareMark: '.active-square-mark',
			buildingWrapper: '.js-building-wrapper',
			unitsWrapper: '.js-units-wrapper',
			unitWrapper: '.js-unit-wrapper',
			building: '.js-building',
			//smokeWrapper: '.js-smoke-wrapper',
			//viewDisable: '.js-view-disable',
			//viewCpuDisable: '.js-view-cpu-disable',
			square: '.js-square',
			statusBar: '.js-battle-view-status-bar',
			styleSquareSize: '.js-style-square-size',
			mapNameInput: '.js-map-name',
			saveButton: '.js-save-map'
			//unitInfoWrapper: '.js-unit-info-wrapper',
		},

		defaultMap: {
			type: 'userMap',
			size: {
				width: 11,
				height: 11
			},
			name: '',
			isOpen: true,
			maxPlayers: null, // set automatically
			units: [],
			buildings: [],
			terrain: {}

		},

		defaults: {
			map: {
				size: {
					min: 4,
					max: 25
				}
			},
			brush: {
				color: 'blue',
				type: 'terrain', // terrain, unit, building
				form: ''
			}
		},

		squareSize: win.APP.map.squareSize,

		initialize: function (data) {

			//win.APP.bb.battleData = {};

			$('.js-map-editor-wrapper').trigger('hide'); // remove previous map editor

			data = data || {};

			var view = this,
				util = view.util;

			view.set('brush', view.defaults.brush);

			view.set('clickXY', {});

			view.battleProto = APP.BB.BattleView.prototype;

			view.detectClickEvent();

			view.$el = $(view.tmpl['map-editor']({
				mapName: (data.map && data.map.name) || view.defaultMap.name
			}));

			view.set('map', util.copyJSON(data.map || view.defaultMap));

			// set sizes
			view.setSize();

			view.drawMap();

			// draw buildings
			view.drawBuildings();

			// draw units
			view.drawUnits();

			// bind move area
			view.bindMoveArea();

			view.bindEventListeners();

			view.render();

			view.proto.initialize.apply(view, arguments);

			view.updateTools();

			view.onChangeMapName();

			view.updateMapSize();

		},

		onChangeMapName: function () {

			var view = this,
				dbMaster = win.APP.map.db,
				$mapNameInput = view.$el.find(view.selectors.mapNameInput),
				mapName = $mapNameInput.val().trim(),
				$saveButton = view.$el.find(view.selectors.saveButton),
				jsMapKey = 'userMap_' + mapName,
				mapType = 'userMap';

			dbMaster.mapIsExist({
				jsMapKey: jsMapKey,
				type: mapType
			}).then(function (isExist) {

				var lang = win.APP.lang;

				if (isExist) {
					$saveButton
						.html(lang.get('replace'))
						.removeClass('map-editor-status-save')
						.addClass('map-editor-status-replace');
				} else {
					$saveButton
						.html(lang.get('save'))
						.addClass('map-editor-status-save')
						.removeClass('map-editor-status-replace');
				}

			});

		},

		onClick: function (xy) {

			var view = this,
				xyStr = 'x' + xy.x + 'y' + xy.y,
				map = view.get('map'),
				brush = view.get('brush'),
				util = win.APP.util,
				buildingMaster = win.APP.building,
				mapMaster = win.APP.map,
				unitMaster = win.APP.unitMaster,
				playerColors = mapMaster.playerColors,
				buildingData,
				unitType = brush.form,
				unitForRemove;

			if (brush.type === 'terrain' && brush.form) {
				if (brush.form === 'eraser') {
					map.terrain[xyStr] = 'terra-1';
				} else {
					map.terrain[xyStr] = brush.form;
				}
				view.drawPartMap(xy);
				return;
			}

			if (brush.type === 'unit' && unitType) {
				util.arrayRemoveByValue(map.units, _.find(map.units, xy));
				if (brush.form !== 'eraser') {

					if ( _.contains(unitMaster.commanderList, unitType) ) {
						unitForRemove = _.find(map.units, {type: unitType});
						if (unitForRemove) {
							win.APP.util.arrayRemoveByValue(map.units, unitForRemove);
						}
					}

					map.units.push({
						x: xy.x,
						y: xy.y,
						type: brush.form,
						ownerId: playerColors.indexOf(brush.color)
					});
				}
				view.reDrawUnits();
				return;
			}

			if (brush.type === 'building' && brush.form) {
				util.arrayRemoveByValue(map.buildings, _.find(map.buildings, xy));

				if (brush.form !== 'eraser') {
					buildingData = {
						x: xy.x,
						y: xy.y,
						type: brush.form,
						state: 'normal'
					};

					if ( _.contains(buildingMaster.noMansBuildingsList, brush.form) ) {
						buildingData.color = 'gray';
					}

					if ( brush.form === 'farm-destroyed' ) {
						buildingData.type = 'farm';
						buildingData.state = 'destroyed';
						buildingData.color = 'gray';
					}

					if ( buildingData.color !== 'gray' ) {
						buildingData.ownerId = playerColors.indexOf(brush.color);
					}

					map.buildings.push(buildingData);
				}

				view.reDrawBuildings();
				//view.drawMap();
				view.drawPartMap(xy);
				return;
			}


		},

		// just overwrite
		detectDblClick: function () {
			win.log('dbl click is');
		},

		openMapPopup: function () {

			var view = this;

			win.APP.map.db.getMapsInfo({
				type: 'userMap'
			}).then(function (mapsData) {

				var mapsInfo = [],
					language = view.info.get('language');

				_.each(mapsData, function (item, key) {
					item.jsKey = key;
					mapsInfo.push(item);
				});

				mapsInfo = mapsInfo.sort(function (a, b) {

					var aName = a['name-' + language] || a.name,
						bName = b['name-' + language] || b.name;

					return ((a.maxPlayers + aName) > (b.maxPlayers + bName)) ? 1 : -1;

				});

				view.showPopup({
					popupName: 'map-list-popup',
					parentView: view,
					popupData: {
						mapsInfo: mapsInfo
					},
					cssClass: 'no-image-border'
				});

			});

		},

		deleteMapPopup: function () {

			var view = this;

			win.APP.map.db.getMapsInfo({
				type: 'userMap'
			}).then(function (mapsInfo) {
				view.showPopup({
					popupName: 'map-list-popup-delete',
					parentView: view,
					popupData: {
						mapsInfo: mapsInfo
					},
					cssClass: 'no-image-border'
				});
			});

		},

		drawMap: function (data) {

			data = data || {};

			// prepare empty map's squares
			var view = this,
				map = view.get('map'),
				x, y,
				lenX, lenY,
				tileXY;

			for (x = 0, lenX = map.size.width; x < lenX; x += 1) {
				for (y = 0, lenY = map.size.height; y < lenY; y += 1) {
					tileXY = 'x' + x + 'y' + y;
					if ( !map.terrain[tileXY] ) {
						map.terrain[tileXY] = 'terra-1';
					}
				}
			}



			var $mapImageWrapper = view.$el.find(view.selectors.mapImageWrapper),
				//canvas = doc.createElement('canvas'),
				canvas = $mapImageWrapper.get(0),
				ctx = canvas.getContext('2d'),
				getXYFromStringXY = view.util.getXYFromStringXY,
				xyStr = view.util.getStringFromXY,
				squareSize = view.squareSize.max,
				squareSizeX2,
				mapTiles = win.APP.mapTiles,
				terrains = map.terrain,
				angleTypes = ['road', 'water'],
				mapWidth = map.size.width,
				mapHeight = map.size.height,
				maxCanvasSize = win.APP.map.maxCanvasSize;

			//if ( !this.info.get('isAndroid', true) ) { // for NOT android set size 24
				squareSize = 48; // see tiles image size 24 * 2
			//}

			// adjust square size
			while ( mapWidth * mapHeight * squareSize * squareSize * 4 > maxCanvasSize ) {
				squareSize -= 6;
			}

			squareSize -= 6;

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

					// redraw only needed squares
					if (data.hasOwnProperty('x') && Math.abs(data.x - xy.x) <= 1 && Math.abs(data.y - xy.y) <= 1 ) {
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

			//$mapImageWrapper.find('img')[0].src = canvas.toDataURL();

		},

		drawPartMap: function (xy) {

			this.drawMap(xy);

		},

		drawBuildings: function () {

			var view = this,
				map = view.get('map'),
				maxX = map.size.width - 1,
				maxY = map.size.height - 1,
				buildings = map.buildings,
				mapMaster = win.APP.map,
				playerColors = mapMaster.playerColors;

			_.each(buildings, function (building) {

				var x, y;

				x = building.x;
				y = building.y;

				if (x > maxX || y > maxY || x < 0 || y < 0) {
					return;
				}

				building.color = playerColors[building.ownerId] || 'gray';
				if (building.color === 'gray') {
					building.ownerId = null;
					delete building.ownerId;
				}
				view.appendBuilding(building);
			});

		},

		drawUnits: function () {

			var view = this,
				map = view.get('map'),
				maxX = map.size.width - 1,
				maxY = map.size.height - 1,
				units = map.units,
				mapMaster = win.APP.map,
				playerColors = mapMaster.playerColors,
				unitMaster = win.APP.unitMaster,
				commanderList = unitMaster.commanderList;

			_.each(units, function (unitData) {

				var unit,
					x = unitData.x,
					y = unitData.y,
					unitType,
					isCommander;

				if (x > maxX || y > maxY || x < 0 || y < 0) {
					return;
				}

				unitType = unitData.type;
				isCommander = unitType === 'commander' || _.contains(commanderList, unitType);

				unitData.color = playerColors[unitData.ownerId];

				if ( isCommander ) {
					unitData.type = commanderList[unitData.ownerId];
				}

				unit = unitMaster.createUnit(unitData);
				view.appendUnit(unit);

			});


		},

		updateTools: function () {

			var view = this,
				map = view.get('map'),
				$wrapper = view.$el.find(view.selectors.toolsWrapper),
				$node,
				parseData = {};

			parseData.brush = view.get('brush');

			parseData.mapName = map.name;

			parseData.hasCommander = false;

			$node = $(view.tmpl['map-editor-tools'](parseData));

			$wrapper.empty();

			$wrapper.append($node);

			view.delegateEvents();

		},

		reDrawUnits: function () {
			this.$el.find(this.selectors.unitsWrapper).empty();
			this.drawUnits();
		},

		reDrawBuildings: function () {

			this.$el.find(this.selectors.buildingWrapper).empty();
			this.drawBuildings();

		},

		setBrushType: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				brush = view.get('brush');

			brush.type = $this.attr('data-brush-type');
			brush.form = '';

			view.updateTools();

		},

		setBrushColor: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				brush = view.get('brush');

			brush.color = $this.attr('data-brush-color');

			brush.form = undefined;

			view.updateTools();

		},

		setBrushForm: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				brush = view.get('brush');

			brush.form = $this.attr('data-brush-form');

			view.updateTools();

		},

		redHighlightMapName: function () {

			var view = this,
				$nodes = view.$el.find([view.selectors.mapNameInput, view.selectors.mapSize].join(','));

			$nodes.addClass('error-highlight');

			setTimeout(function () {
				$('.error-highlight').removeClass('error-highlight');
			}, 1300);

		},

		saveMap: function () {

			var view = this,
				map = view.get('map'),
				endMap = view.util.copyJSON(map),
				maxX = map.size.width - 1,
				maxY = map.size.height - 1,
				buildings = map.buildings || [],
				units = map.units || [],
				getXYFromStringXY = view.util.getXYFromStringXY,
				terrain = map.terrain,
				mapName = view.$el.find(view.selectors.mapNameInput).val().trim(),
				unitMaster = win.APP.unitMaster,
				commanderList = unitMaster.commanderList,
				dbMaster = win.APP.map.db,
				jsMapKey = 'userMap_' + mapName,
				ids = {
					'0': false,
					'1': false,
					'2': false,
					'3': false
				},
				i, j,
				lang = win.APP.lang,
				detectGap = function () {
					_.each(ids, function (value, key) {
						key = Number(key);
						ids[key] = Boolean(_.find(units, {ownerId: key}) || _.find(buildings, {ownerId: key}));
					});
				};

			endMap.units = [];
			endMap.buildings = [];
			endMap.terrain = {};
			endMap.name = mapName;

			if ( !endMap.name.length ) {

				view.showTicket({
					popupData: {
						text: lang.get('enterMapName')
					},
					cssClass: 'error'
				});

				view.redHighlightMapName();

				return;
			}

			_.each(terrain, function (type, xyStr) {

				var xy = getXYFromStringXY(xyStr),
					x = xy.x,
					y = xy.y;

				if ( x > maxX || y > maxY || x < 0 || y < 0 ) {
					return;
				}

				endMap.terrain[xyStr] = type;

			});

			_.each(buildings, function (building) {

				var x = building.x,
					y = building.y;

				if ( x > maxX || y > maxY || x < 0 || y < 0 ) {
					return;
				}

				building = view.util.copyJSON(building);

				building.color = null;
				delete building.color;

				endMap.buildings.push(building);

			});

			_.each(units, function (unit) {

				var x = unit.x,
					y = unit.y;

				if ( x > maxX || y > maxY || x < 0 || y < 0 ) {
					return;
				}

				unit = view.util.copyJSON(unit);

				unit.color = null;
				delete unit.color;
				unit.id = null;
				delete unit.id;

				if ( _.contains(commanderList, unit.type) ) {
					unit.type = 'commander';
				}

				endMap.units.push(unit);

			});

			detectGap();
			for (i = 0; i < 4; i += 1) {
				if ( !ids[String(i)] ) {
					for (j = i; j < 4; j += 1) {
						_.each(endMap.units, function (unit) {
							if (unit.ownerId > j) {
								unit.ownerId -= 1;
							}
						});
						_.each(endMap.buildings, function (building) {
							if (building.ownerId > j) {
								building.ownerId -= 1;
							}
						});
					}
				}
				detectGap();
			}

			detectGap();

			endMap.maxPlayers = 0;
			_.each(ids, function (value) {
				endMap.maxPlayers += value ? 1 : 0;
			});

			if (endMap.maxPlayers < 2) {
				view.showTicket({
					popupData: {
						text: lang.get('needMoreUnitsOrBuildings')
					},
					cssClass: 'error'
				});
				return;
			}

			// put map to db
			dbMaster.removeMap({
				jsMapKey: jsMapKey,
				type: endMap.type
			}).then(function () {
				return dbMaster.insertMap(endMap, jsMapKey);
			}).then(function () {
				return view.showTicket({
					popupData: {
						text: endMap.name + ' - ' + win.APP.lang.get('mapHasBeenSaved')
					}
				});
			}).then(function () {
				view.onChangeMapName();
			});

		},

		deleteMap: function (data) {

			var view = this,
				type = data.type,
				dbMaster = win.APP.map.db,
				jsMapKey = data.jsMapKey;

			dbMaster.removeMap({
				jsMapKey: jsMapKey,
				type: type
			}).then(function () {
				return view.showTicket({
					popupData: {
						text: data.mapName + ' - ' + win.APP.lang.get('mapHasBeenDeleted')
					}
				});
			}).then(function () {
				view.onChangeMapName();
			});

		},

		//changeSize: function (e) {
		//
		//	var view = this,
		//		map = view.get('map'),
		//		$this = $(e.currentTarget),
		//		value = $this.attr('data-value');
		//
		//	map.size[$this.attr('data-group-name')] = parseInt(value, 10);
		//	view.drawMap();
		//	view.setSize();
		//
		//	view.get('mover').setDefaultContainerState();
		//
		//	view.reDrawUnits();
		//	view.reDrawBuildings();
		//
		//},

		setMapSize: function (e) {

			var view = this,
				defaults = view.defaults,
				max = defaults.map.size.max,
				min = defaults.map.size.min,
				//util = view.util,
				appUtil = win.APP.util,
				getBetween = appUtil.getBetween,
				map = view.get('map'),
				terrain = map.terrain,
				units = map.units || [],
				buildings = map.buildings || [],
				newTerrain = {},
				$button = $(e.currentTarget),
				delta = $button.attr('data-delta'),
				deltaNumber = parseInt(delta, 10),
				position = $button.attr('data-position');

			if (position === 'up' || position === 'down') {

				if (map.size.height + deltaNumber !== getBetween(min, map.size.height + deltaNumber, max)) {
					return;
				}

				map.size.height += deltaNumber;

				if (position === 'up') {

					_.each(terrain, function (value, key) {
						var xy = key.match(/\-?\d+/g),
							x = xy[0],
							y = parseInt(xy[1], 10) + deltaNumber;
						newTerrain['x' + x + 'y' + y] = value;
					});

					_.each(units, function (unit) {
						unit.y += deltaNumber;
					});

					_.each(buildings, function (building) {
						building.y += deltaNumber;
					});

					map.terrain = newTerrain;

				}

			}

			if (position === 'left' || position === 'right') {

				if (map.size.width + deltaNumber !== getBetween(min, map.size.width + deltaNumber, max)) {
					return;
				}

				map.size.width += deltaNumber;

				if (position === 'left') {

					_.each(terrain, function (value, key) {
						var xy = key.match(/\-?\d+/g),
							x = parseInt(xy[0], 10) + deltaNumber,
							y = xy[1];
						newTerrain['x' + x + 'y' + y] = value;
					});

					_.each(units, function (unit) {
						unit.x += deltaNumber;
					});

					_.each(buildings, function (building) {
						building.x += deltaNumber;
					});

					map.terrain = newTerrain;

				}

			}


			view.drawMap();
			view.setSize();

			view.get('mover').setDefaultContainerState();

			view.reDrawUnits();
			view.reDrawBuildings();

			view.updateMapSize();

		},

		popupClearMap: function () {

			var view = this;

			view.showPopup({
				popupName: 'clear-map',
				parentView: view,
				popupData: {}
			});

		},

		clearMap: function () {
			this.initialize();
		},

		disableMapEditor: function () {
			this.$el.find(this.selectors.disableScreen).removeClass('hidden');
		},

		enableMapEditor: function () {
			this.$el.find(this.selectors.disableScreen).addClass('hidden');
		},

		updateMapSize: function () {

			var view = this,
				map = view.get('map'),
				$mapSize = view.$el.find(view.selectors.mapSize);

			$mapSize.html(map.size.width + '&times;' + map.size.height)

		}

	});


}(window));