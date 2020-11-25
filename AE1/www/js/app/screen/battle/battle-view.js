(function (win) {

	"use strict";
	/*global window, document, history */
	/*global bingo, $, info, APP, util, Backbone, MoveArea */

	win.APP = win.APP || {};

	APP.BattleView = APP.BaseView.extend({
		templates: ['battle', 'unit', 'build', 'end-game-message'],
		events: {
			'click .js-event-handler-square': 'onClickSquare',
			'click .js-end-turn': 'endTurn',
			'click .js-menu-button': 'showBattleMenu',
			//'click .js-go-to-store': 'goToStore',
			'click .js-scale-button': 'scale'
		},
		squareSize: 26,
		maxSquareSize: 100,
		minSquareSize: 6,
		scaleStep: 1,
		cssSelector: '.square, .unit, .build, .attack-animation-block ',
		styleTagSelector: '.js-battle-styles',
		init: function (data) {

			this.setToDefaultSteps();

			this.setSquareSize();

			this.startingData = util.createCopy(data);

			this.squareSize = win.info.get('squareSize') || this.squareSize;

			//data.gameOverFn = function () {
			//	console.log(this);
			//	return Math.random() > 0.8;
			//};

			// set map to this view
			this.setMap(util.createCopy(data.map));
			// show draft map

			if (!this.map) {
				console.log('Map IS NOT defined');
				return;
			}

			this.$el = $(this.tmpl.battle(this.map || {}));
			this.setFieldSize();

			this.$unitLayer = this.$el.find('.js-units-layer');
			this.$attackBlock = this.$el.find('.js-attack-animation-block');
			this.$buildingsLayer = this.$el.find('.js-buildings-layer');

			this.$eventLayer = this.$el.find('.js-event-handler');
			this.$bgLayer = this.$el.find('.js-background-layer');
			this.$bgCanvasLayer = this.$el.find('.js-background-layer-canvas');

			this.$statusBar = this.$el.find('.js-status-bar');

			// create and set controller

			this.$wrapper = $('.js-wrapper');
			this.$availablePathWrapper = this.$el.find('.js-available-path-layer');
			this.$availablePathSquares = this.$el.find('.js-available-path-square');


			this.$wrapper.html('');
			this.$wrapper.append(this.$el);

			this.controller = new APP.BattleController(data);
			this.controller.setView(this);
			this.controller.setMap(this.map);
			this.controller.setMapForView();
			this.controller.startBattle();

			this.setMoveArea();

			this.setStyles();

			this.drawMap();

			this.coloringBuildings();

		},

		setToDefaultSteps: function () {

			var maps = APP.maps,
				key;

			function isDoneToFalse(step) {
				step.isDone = false;
			}

			for (key in maps) {
				if (maps.hasOwnProperty(key)) {
					maps[key].wasNotification = false;
					(maps[key].steps || []).forEach(isDoneToFalse);
				}
			}

		},

		coloringBuildings: function () {

			var buildings = this.controller.buildings,
				key;

			for (key in buildings) {
				if (buildings.hasOwnProperty(key)) {
					this.setBuildingColor(buildings[key]);
				}
			}

		},

		showFirstUnit: function () {

			var controller = this.controller,
				activePlayerId = controller.activePlayer.id,
				units = controller.units,
				unit,
				key;

			for (key in units) {
				if (units.hasOwnProperty(key)) {
					unit = units[key];
					if (unit.playerId === activePlayerId) {
						this.goToXY(unit);
						return;
					}

				}
			}

		},

		setSquareSize: function () {
			// squareSize
			this.squareSize = Math.round(parseInt(document.body.style.fontSize, 10) * 1.2) * 2;
			this.scaleStep = Math.round(this.squareSize / 6);

			this.maxSquareSize = this.squareSize * 4;
			this.minSquareSize = Math.round(this.squareSize / 4);

		},

		scale: function(e) {

			this.setTransition(false);

			var $node = $(e.currentTarget),
				isIncrease = $node.data('type') === '+' ? 1 : -1,
				newSize = this.squareSize + isIncrease * this.scaleStep;

			if (newSize > this.maxSquareSize || newSize < this.minSquareSize) {
				this.setTransition(true);
				return;
			}

			this.squareSize = newSize;

			win.info.set('squareSize', this.squareSize, true);

			this.setStyles();
			this.setFieldSize();

			this.setBuildingPosition();

			this.setUnitsPosition();

			this.moveArea.onResize();

			this.setTransition(true);

		},

		activeButtons: function (isActive) {

			if (isActive) {
				this.$el.find('.js-cpu-running').addClass('hidden');
			} else {
				this.$el.find('.js-cpu-running').removeClass('hidden');
			}

		},

		goToXY: function (xy) {

			var $layersWrapper = this.$el.find('.js-layers-wrapper'),
				addedPadding = parseInt($layersWrapper.css('padding-top'), 10),
				screenWidth = document.documentElement.clientWidth,
				screenHeight = document.documentElement.clientHeight,
				wrapper = this.$wrapper.find('.js-layers-moving-wrapper')[0],
				squareSize = this.squareSize,
				beginLeft = wrapper.scrollLeft,
				beginTop = wrapper.scrollTop,
				endLeft = xy.x * squareSize - screenWidth / 2 + squareSize / 2 + addedPadding,
				endTop = xy.y * squareSize - screenHeight / 2 + squareSize / 2 + addedPadding;

			function animate(opts) {

				var start = Date.now();

				setTimeout(animFn, 10);

				function animFn() {

					// вычислить сколько времени прошло
					var progress = (Date.now() - start) / opts.duration;
					progress = progress >= 1 ? 1 : progress;
					// отрисовать анимацию
					opts.step(progress);

					if (progress < 1) {
						setTimeout(animFn, 20);
					}

				}

			}

			animate({
				duration: APP.units.info.timer.showPath * 0.5,
				step: function (progress) {
					wrapper.scrollTop = beginTop + (endTop - beginTop) * progress;
					wrapper.scrollLeft = beginLeft + (endLeft - beginLeft) * progress;
				}
			});

		},

		setBuildingPosition: function() {

			var squareSize = this.squareSize;

			this.$buildingsLayer.find('.build').forEach(function(build){
				var $build = $(build),
					x = parseInt($build.data('x'), 10),
					y = parseInt($build.data('y'), 10);

				if ($build.hasClass('build-castle')) {
					$build.css({
						left: squareSize * x + 'px',
						top: squareSize * (y - 1) + 'px',
						height: squareSize * 2 + 'px'
					});
				} else {
					$build.css({
						left: squareSize * x + 'px',
						top: squareSize * y + 'px'
					});
				}

			});

		},

		setUnitsPosition: function() {
			var squareSize = this.squareSize,
				units = this.controller.units,
				graves = this.controller.unitsRIP,
				prefix = info.preJS,
				key, unit, $unit;

			for (key in units) {
				if (units.hasOwnProperty(key)) {
					unit = units[key];
					$unit = this.getUnitById(unit.id);
					$unit.css(prefix+'Transform','translate(' + unit.x * squareSize + 'px, ' + unit.y * squareSize + 'px)');
				}
			}

			for (key in graves) {
				if (graves.hasOwnProperty(key)) {
					unit = graves[key];
					$unit = this.getUnitById(unit.id);
					$unit.css(prefix+'Transform','translate(' + unit.x * squareSize + 'px, ' + unit.y * squareSize + 'px)');
				}
			}


		},

		goToStore: function(data) {

			// to open store user must have the castle
			//if (!this.controller.getPlayerCastle()) {
			//	win.alert('to BUY unit you have to has the castle');
			//	return;
			//}

			var controller = this.controller;

			controller.focusedUnit = false;
			controller.unitAvailableActions = {};
			controller.hideAllActions();

			APP.storeView = new APP.StoreView(data);

			APP.router.navigate('store', {trigger: true});

		},

		showBattleMenu: function () {
			new APP.BattleMenuView({
				jsMapName: this.map.jsName
			});
			APP.router.navigate('battle-menu', {trigger: true});
		},

		setFieldSize: function () {
			var size = this.squareSize,
				sizes = this.map.size,
				$node = this.$el.find('.js-layers-wrapper');
			$node.css({
				width: size * sizes.width + 'px',
				height: size * sizes.height + 'px'
			});
		},
		onClickSquare: function (e) {

			var data = e.currentTarget.dataset;

			this.controller.onClick({x: +data.x, y: +data.y});

		},
		setMap: function (map) {
			this.map = map;
		},
		drawMap: function () {

			var map = this.map,
				mapData = map.terrain,
				tileSize = APP.map.tile.size,
				tiles = APP.map.tile,
				tileImage = new Image(),
				key, x, y, terrainType,
				nearTerran,
				xRe = /^x(\d+)y\d+$/i,
				yRe = /^x\d+y(\d+)$/i,
				canvas = win.document.createElement('canvas'),
				ctx = canvas.getContext('2d');

			canvas.width = map.size.width * tileSize;
			canvas.height = map.size.height * tileSize;

			function drawAngle (placeNumber) {

					var placeName = nearTerran[placeNumber],
						placeNameUp = nearTerran[2],
						placeNameDown = nearTerran[8],
						placeNameLeft = nearTerran[4],
						placeNameRight = nearTerran[6],
						//tiles = APP.map.tile,
						angleImg;

					if ( !placeName ) {
						return;
					}

					angleImg = tiles.angle[placeNumber.toString()].img;

					switch (placeNumber) {

						case 1:

							if ( tiles[placeNameUp].level < tiles[terrainType].level && tiles[placeNameLeft].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize, y * tileSize);
							}

							break;

						case 2:

							if ( tiles[placeName].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize, y * tileSize);
							}

							break;

						case 3:

							if ( tiles[placeNameUp].level < tiles[terrainType].level && tiles[placeNameRight].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize  + tileSize / 2, y * tileSize);
							}

							break;

						case 4:

							if ( tiles[placeName].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize, y * tileSize);
							}

							break;

						case 6:

							if ( tiles[placeName].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize + tileSize / 2, y * tileSize);
							}

							break;

						case 7:

							if ( tiles[placeNameDown].level < tiles[terrainType].level && tiles[placeNameLeft].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize, y * tileSize + tileSize / 2);
							}

							break;

						case 8:

							if ( tiles[placeName].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize, y * tileSize + tileSize / 2);
							}

							break;

						case 9:

							if ( tiles[placeNameDown].level < tiles[terrainType].level && tiles[placeNameRight].level < tiles[terrainType].level ) {
								ctx.drawImage(angleImg, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
							}

							break;

					}

			}

			for (key in mapData) {
				if (mapData.hasOwnProperty(key)) {
					x = parseInt(key.replace(xRe, '$1'), 10);
					y = parseInt(key.replace(yRe, '$1'), 10);
					terrainType = mapData[key];

					if ( tiles[terrainType].onGreen ) {
						ctx.drawImage(tiles.green.img, x * tileSize, y * tileSize);
					}

					// draw angle on green
					if (tiles[terrainType].onGreen) {
						nearTerran = [''];
						nearTerran.push( mapData['x' + (x - 1) + 'y' + (y - 1)] );
						nearTerran.push( mapData['x' + x + 'y' + (y - 1)] );
						nearTerran.push( mapData['x' + (x + 1) + 'y' + (y - 1)] );

						nearTerran.push( mapData['x' + (x - 1) + 'y' + y] );
						nearTerran.push( mapData['x' + x + 'y' + y] );
						nearTerran.push( mapData['x' + (x + 1) + 'y' + y] );

						nearTerran.push( mapData['x' + (x - 1) + 'y' + (y + 1)] );
						nearTerran.push( mapData['x' + x + 'y' + (y + 1)] );
						nearTerran.push( mapData['x' + (x + 1) + 'y' + (y + 1)] );

						[2, 4, 6, 8, 1, 3, 7, 9].forEach(drawAngle);

					}

					if (terrainType !== 'green') {
						ctx.drawImage(tiles[terrainType].img, x * tileSize, y * tileSize);
					}

				}
			}

			tileImage.addEventListener('load', (function () {
				this.$bgLayer[0].appendChild(tileImage);
			}.bind(this)), false);

			tileImage.className = 'js-background-layer-canvas background-layer-canvas';
			tileImage.src = canvas.toDataURL("image/png");

		},
		appendUnit: function (unit) {

			var $unit = $(this.tmpl.unit({ unit: unit, view: this }));

			this.$unitLayer.append($unit);
			this.redrawHealthUnit(unit);

		},
		appendBuilding: function (build) {

			var $build = $(this.tmpl.build({ build: build, view: this }));
			this.$buildingsLayer.append($build);

		},
		highlightPath: function (data) {

			this.hideAvailablePath();
			this.hideGravesForUp();
			var color = data.color,
				path = data.path;

			path.forEach(function (xy) {
				var $square = this.$availablePathWrapper.find('[data-xy="' + ['x', xy.x, 'y', xy.y].join('') + '"]');
				$square.addClass('available-path-square').data('color', color);
			}, this);

		},

		hideAvailablePath: function () {
			this.hideGravesForUp();
			this.hideUnitsUnderAttack();
			this.$availablePathSquares.removeClass('available-path-square');
		},

		moveUnit: function (moveUnit) {
			this.hideAvailablePath();
			var $unit = this.getUnitById(moveUnit.id),
				size = this.squareSize;
			$unit[0].style[info.preJS + 'Transform'] = 'translate(' +  moveUnit.x * size + 'px, ' + moveUnit.y * size + 'px)';
			//$unit.css( info.preCSS + 'transform', 'translate(' +  moveUnit.x * size + 'px, ' + moveUnit.y * size + 'px)');
		},

		showEndUnitTurn: function(unit) {
			this.getUnitById(unit.id).addClass('unit-end-turn');
		},

		showUnitsUnderAttack: function (units) {
			units.forEach(function (unit) {

				var x = unit.x,
					y = unit.y,
					$block = this.$eventLayer.find('[data-xy="x' + x + 'y' + y + '"]');

				$block.addClass('unit-under-attack');

			}, this);
		},
		hideUnitsUnderAttack: function () {
			this.$eventLayer.find('.unit-under-attack').removeClass('unit-under-attack');
		},

		showGravesForUp: function(graves) {

			graves.forEach(function (grave) {

				var x = grave.x,
					y = grave.y,
					$block = this.$eventLayer.find('[data-xy="x' + x + 'y' + y + '"]');

				$block.addClass('unit-for-grave-up');

			}, this);

		},

		hideGravesForUp: function() {
			this.$eventLayer.find('.unit-for-grave-up').removeClass('unit-for-grave-up');
		},

		endTurn: function (data) {

			data = data || {};

			win.clearTimeout(this.endTurnTimeoutId);

			var $hiddenConfirm = this.$el.find('.js-status-bar-end-turn-hidden-confirm');

			if ( data.force || !$hiddenConfirm.hasClass('hidden') || !win.info.get('setting').endTurnConfirm ) {

				$hiddenConfirm.addClass('hidden');

				this.hideAvailablePath();
				this.hideUnitsUnderAttack();
				this.resetEndTurnState();
				this.drawUnitCurrentState();
				this.goFromStore();
				this.activeButtons(true);
				this.controller.endTurn();

			} else {

				$hiddenConfirm.removeClass('hidden');

				this.endTurnTimeoutId = win.setTimeout(function () {
					var $button = $('.js-wrapper .js-status-bar-end-turn-hidden-confirm');
					return $button.length && $button.addClass('hidden');
				}, 4000);

			}

		},
		goFromStore: function() {
			if (Backbone.history.fragment !== 'battle') {
				history.back();
			}
		},
		resetEndTurnState: function () {
			this.$unitLayer.find('.unit-end-turn').removeClass('unit-end-turn');
		},
		drawUnitCurrentState: function() {

			var controller = this.controller,
				units = controller.units,
				graves = controller.unitsRIP;

			this.$unitLayer.find('[data-id]').forEach(function(node){

				var $unit = $(node),
					id = +$unit.data('id'),
					unit = units[id] || graves[id];

				if (!unit) {
					return;
				}

				if (unit.wasPoisoned) {
					$unit.addClass('unit-poisoned');
				} else {
					$unit.removeClass('unit-poisoned');
				}

			});

		},
		redrawHealthUnit: function (unit) {


			var util = win.util,
				$unit = this.getUnitById(unit.id),
				$health = $unit.find('.js-health'),
				$deltaHealth = $unit.find('.js-delta-health'),
				beforeHealth = parseFloat($health.html()),
				health = unit.health > 0 ? util.round(Math.max(unit.health, 0.1), 1) : 0,
				deltaHealth = util.round(health - beforeHealth, 1);

			$deltaHealth.removeClass('delta-health-animation');

			if (deltaHealth) {

				$deltaHealth
					.removeClass('color-green')
					.removeClass('color-red');

				if (deltaHealth > 0) {
					$deltaHealth.html('+' + deltaHealth);
					$deltaHealth.addClass('color-green');
				} else {
					$deltaHealth.html(deltaHealth);
					$deltaHealth.addClass('color-red');
				}

				setTimeout(function () { // hack for redraw
					$deltaHealth.addClass('delta-health-animation');
				}, 50);

			}

			$health.html(health);

			if (unit.wasPoisoned) {
				this.drawPoisoned($unit);
			}

		},

		redrawLevelUnit: function (unit) {
			var $unit = this.getUnitById(unit.id);
			$unit.data('level', unit.level);
		},

		drawPoisoned: function(unitNode) {
			unitNode.addClass('unit-poisoned');
		},
		drawRIP: function (unit) {
			var $unit = this.getUnitById(unit.id);
			$unit.addClass('grave');
			this.redrawLevelUnit(unit);
		},
		removeRIP: function (unit) {
			this.$unitLayer.find('[data-id="' + unit.id + '"]').remove();
		},
		getUnitById: function (id) {
			return this.$unitLayer.find('[data-id="' + id + '"]');
		},
		setStyles: function () {

			this.squareSize = win.info.get('squareSize') || this.squareSize;

			var $wrapper = this.$wrapper,
				tagSelector = this.styleTagSelector,
				$style = $wrapper.find(tagSelector),
				size = this.squareSize,
				fontSize = Math.round(this.squareSize / 3.5),
				selector = this.cssSelector,
				cssText = selector + '{ width: ' + size + 'px; height: ' + size + 'px; } .delta-health, .unit-health { font-size: ' + fontSize + 'px; line-height: ' + fontSize + 'px; }';

			if (!$style.length) {
				$style = $('<style type="text/css" class="' + tagSelector.substr(1) + '"></style>');
				$wrapper.append($style);
			}

			$style.html(cssText);

			win.info.set('squareSize', this.squareSize, true);

		},

		setTransition: function (isEnable) {

			var $wrapper = this.$wrapper,
				tagSelector = '.js-set-transition',
				$style = $wrapper.find(tagSelector),
				cssText = 'div, p, span { -webkit-transition: none !important; transition: none !important; }';

			if (!$style.length) {
				$style = $('<style type="text/css" class="' + tagSelector.substr(1) + '"></style>');
				$wrapper.append($style);
			}

			$style.html(isEnable ? '' : cssText);

		},

		setBuildingColor: function(build) {
			var x = build.x,
				y = build.y,
				color = build.color,
				$build = this.$buildingsLayer.find('[data-xy="x' + x + 'y' + y + '"]');

			$build.data('building-color', color);

		},
		highlightUnit: function(unit) {

			this.$unitLayer.find('.active-unit').removeClass('active-unit');

			if (!unit) {
				return;
			}

			this.$unitLayer.find('[data-id="' + unit.id + '"]').addClass('active-unit');

		},

		showGoToStore: function (xy) {

			this.$eventLayer
				.find('[data-xy="x' + xy.x + 'y' + xy.y + '"]')
				.addClass('go-to-store-by-unit');

		},

		hideGoToStore: function () {

			var $square = this.$eventLayer.find('.go-to-store-by-unit'),
				xy;

			if ($square.isEmpty()) {
				return false;
			}

			xy = {
				x: +$square.data('x'),
				y: +$square.data('y')
			};

			$square.removeClass('go-to-store-by-unit');

			return xy;

		},

		showUnitInfo: function(unit) {
			this.$statusBar
				.find('.js-status-bar-armor')
				.html(unit.def);
			this.$statusBar
				.find('.js-status-bar-damage')
				.html(unit.atk);
		},

		showPlayerInfo: function(player) {
			player = player || this.controller.activePlayer;
			this.$statusBar.find('.js-status-bar-color')
				//.html(player.color)
				.data('color', player.color);
				//.css('color', player.color);

			var gold = String(player.gold);

			if (player.type === 'cpu') {
				gold = gold.replace(/\d/g, '?');
			}

			this.$statusBar.find('.status-bar-gold').html(gold);

		},

		showPlaceInfo: function(data) {

			var building,
				x = data.coordinates.x,
				y = data.coordinates.y,
				addedArmor = 0;

			data.map.buildings.every(function(build){
				if (build.x === x && build.y === y) {
					building = build;
					return false;
				}
				return true;
			});

			addedArmor = building ? APP.map.defence[building.type] : APP.map[data.map.terrain['x' + x + 'y' + y]].defence;

			this.$statusBar.find('.js-status-bar-armor').html(addedArmor);
			this.$statusBar.find('.js-status-bar-damage').html('X');

		},

		hideGetBuilding: function(){
			this.$eventLayer
				.find('.can-get-building')
				.removeClass('can-get-building')
				.data('building-color', '')
				.data('building-type', '');

		},
		showGetBuilding: function(unit) {
			var x = unit.x,
				y = unit.y,
				build = this.controller.buildings['x' + x + 'y' + y];

			this.$eventLayer
				.find('[data-xy="x' + x + 'y' + y + '"]')
				.addClass('can-get-building')
				.data('building-color', unit.color)
				.data('building-type', build.type);

		},
		//setStoreButtonState: function(isEnable) {
		//	this.$el.find('.js-go-to-store').data('state', isEnable ? 'enable' : 'disable');
		//},
		addHealthToUnit: function(data) {
			this.redrawHealthUnit(data.unit);
		},
		showWispAura: function(unit) {
			var $unit = this.getUnitById(unit.id);
			$unit.addClass('under-wisp-aura');
		},
		hideWispAura: function(unit) {
			var $unit = this.getUnitById(unit.id);
			$unit.removeClass('under-wisp-aura');
		},
		removeWispAuraFromGraves: function() {
			this.$unitLayer.find('.grave').removeClass('under-wisp-aura');
		},
		setMoveArea: function() {
			var $el = this.$el;
			this.moveArea = new MoveArea({
				wrapper: $el.find('.js-layers-moving-wrapper')[0],
				container: $el.find('.js-layers-wrapper')[0]
			});
		},
		setDisableScreen: function (isShow) {

			if (isShow) {
				this.$el.find('.js-disable-screen').removeClass('hidden');
			} else {
				this.$el.find('.js-disable-screen').addClass('hidden');
			}

		},
		showAttackAnimation: function (active, passive) {

			var xy1 = {
					x: active.x * this.squareSize,
					y: active.y * this.squareSize
				},
				xy2 = {
					x: passive.x * this.squareSize,
					y: passive.y * this.squareSize
				},
				$node = this.$attackBlock,
				animationTime = APP.units.info.timer.attack - 50;

			$node.css({
				'opacity': '0',
				'-webkit-transform': 'translate(' + xy1.x + 'px, ' + xy1.y + 'px)',
				'-webkit-transition': 'none'
			});

			setTimeout(function () {
				$node.css('opacity', 1);
			}, 10);

			setTimeout(function () {
				$node.css({
					'-webkit-transition': '-webkit-transform ' + animationTime + 'ms ease-out',
					'-webkit-transform': 'translate(' + xy2.x + 'px, ' + xy2.y + 'px)'
				});
			}, 20);

			setTimeout(function () {
				$node.css('opacity', '0');
			}, animationTime - 10);

		},
		endGameAlert: function (result) {

			this.setDisableScreen(false);

			this.activeButtons(true);

			var players = this.controller.players,
				player1 = players[0],
				player2 = players[1],
				message = '',
				$node;

			if (player1.type === player2.type) {
				message = lang[result.winner.color + 'Win'];
			} else {
				if (result.winner.type === 'human') {
					message = result.message || lang.youWin;
				} else {
					message = result.message || lang.youDefeat;
				}
			}

			$node = $(this.tmpl['end-game-message']({ message: message, nextMissionNumber: result.nextMissionNumber }));

			$node.find('.js-end-game-restart').on('click', function () {
				APP.battleView = new APP.BattleView(util.createCopy(APP.battleView.startingData));
			});

			$node.find('.js-end-game-quit').on('click', function () {
				APP.battleView.doNotShowConfirm = true;
				var history = win.history;
				win.setTimeout(history.back.bind(history), 100);
			});

			this.$el.append($node);

			$node.find('.js-next-mission').on('click', function () {

				var mapNumber = this.getAttribute('data-next-mission-number').trim(),
					maps = APP.maps,
					map,
					key;
				mapNumber = parseInt(mapNumber, 10);

				for ( key in maps ) {
					if ( maps.hasOwnProperty(key) ) {
						map = maps[key];
						if ( map.missionNumber === mapNumber ) {


							APP.router.battle();

							APP.battleView = new APP.BattleView({
								map: map,
								players: [
									{
										color: "blue",
										gold: 300,
										id: 0,
										type: "human"
									},
									{
										color: "red",
										gold: 300,
										id: 1,
										type: "cpu"
									}
								]
							});

							return;

						}

					}
				}




			});


		}

	});

}(window));