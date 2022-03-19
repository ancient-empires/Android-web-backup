(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	win.APP = win.APP || {};

	function BattleController(data) {

		this.unitCounter = 0;
		this.units = {};
		this.buildings = {};
		this.unitsRIP = {};
		this.map = {};
		this.view = {};
		this.lifeAfterDeadLimit = 3;
		this.unitAvailableActions = {};

		this.activePlayer = null;

		util.extend(this, data);

	}

	BattleController.prototype = {

		setMap: function(map) {
			this.map = util.createCopy(map);

			// add extra methods
			var originalMap = APP.maps[map.jsName];

			if ( originalMap.gameOverDetect ) {
				this.gameOverDetect = originalMap.gameOverDetect;
			}

			this.map.steps = originalMap.steps || [];

		},

		setView: function(view) {
			this.view = view;
		},

		setState: function (state) {

			switch (state) {
				case 'disable':

					this.view.setDisableScreen(true);

					break;

				case 'enable':

					this.view.setDisableScreen(false);


			}

		},

		setMapForView: function() {
			this.addUnitsToControllerAndView();
			this.addBuildingsToControllerAndView();
		},
		addUnitsToControllerAndView: function() {

			// get units
			var units = this.map.units;

			units.forEach(function(unit){

				var player = this.getPlayerById(unit.playerId),
					newUnit;

				unit.color = player.color;

				//debugger

				newUnit = this.appendUnit(unit); // to controller

				this.view.appendUnit(newUnit); // and view

			}, this);

		},
		getPlayerById: function(id) {

			var playerById = null;

			this.players.every(function(player){
				if (player.id === id) {
					playerById = player;
					return false;
				}
				return true;
			});

			return playerById;


		},
		addBuildingsToControllerAndView: function() {
			var buildings = this.map.buildings;

			buildings.forEach(function(build){
				var newBuild = this.appendBuilding(build); // to controller
				this.view.appendBuilding(newBuild);
			}, this);

		},
		appendUnit: function(data) {
			var unit = new APP.units[data.type](data),
				unitId = this.unitCounter;

			unit.id = unitId;

			this.units[unitId] = unit;

			this.unitCounter += 1;

			return unit;
		},
		appendBuilding: function(build) {
			this.buildings['x' + build.x + 'y' + build.y] = build;
			if (build.hasOwnProperty('playerId')) {

				var playerId = build.playerId;

				this.players.forEach(function (player) {
					if (player.id === playerId) {
						build.color = player.color;

					}
				});
				this.view.setBuildingColor(build);

			}
			return build;
		},

		hideAllActions: function() {
			this.view.hideAvailablePath();
			this.view.highlightUnit();
			this.view.hideUnitsUnderAttack();
			this.view.hideGetBuilding();
		},

		createAvailableActions: function(unit) {

			var actions = {};

			this.hideAllActions();

			unit.availableActions.forEach(function(action){

				var availablePath, availableAttack, unitX, unitY, units, key, itemUnit, building;

				unitX = unit.x;
				unitY = unit.y;

				switch (action) {

					case 'move':

						if (!unit.wasMove) {

							availablePath = unit.getAvailablePath(this);
							availablePath.forEach(function(xy){
								actions['x' + xy.x + 'y' + xy.y] = 'move';
							}, this);

							// remove other units coords

							units = this.units;

							for (key in units) {
								if (units.hasOwnProperty(key)) {
									itemUnit = units[key];
								}
							}

							this.view.highlightPath({ path: availablePath, color: unit.color });

						}

						break;

					case 'attack':

						if (!unit.wasAttack) {

							availableAttack = unit.findUnitsUnderAttack(this.units) || [];
							availableAttack.forEach(function(xy){
								actions['x' + xy.x + 'y' + xy.y] = 'attack';
							}, this);

							this.view.showUnitsUnderAttack(availableAttack);

						}

						break;

					case 'getBuilding':

						if (!unit.wasGetBuilding) {

							building = this.buildings['x' + unitX + 'y' + unitY];

							if (
								building &&
								building.playerId !== unit.playerId &&
								util.has(unit.availableBuildingsType, building.type)
								) {
								actions['x' + unitX + 'y' + unitY] = 'getBuilding';
								this.view.showGetBuilding(unit);
							}

						}

						break;

					case 'upBones':

						if (!unit.wasUpBones) {

							var graves = unit.findGravesForUp(this.unitsRIP, this.units) || [];

							graves.forEach(function(xy){
								actions['x' + xy.x + 'y' + xy.y] = 'upBones';
							}, this);

							this.view.showGravesForUp(graves);

						}

						break;

				}


			}, this);


			return actions;

		},

		getUnitAction: function(x, y) {
			return this.unitAvailableActions['x' + x + 'y' + y];
		},

		endAction: function() {

			var x, y;
			x = this.focusedUnit.x;
			y = this.focusedUnit.y;
			this.focusedUnit = false;
			this.unitAvailableActions = {};
			this.onClick({x: x, y: y, endAction: true});

		},

		detectGoToStore: function (xy, cssClassWasDeleteXY) {

			var xyStr = 'x' + xy.x + 'y' + xy.y,
				building = this.buildings[xyStr],
				unit = this.getUnitsByCoordinates(xy)[0];

			if (building && building.type === 'castle' && building.playerId === this.activePlayer.id) {

				if (unit) {

					if (unit.playerId === this.activePlayer.id) {

						if (cssClassWasDeleteXY) {

							if (cssClassWasDeleteXY.x === unit.x && cssClassWasDeleteXY.y === unit.y) {
								this.view.goToStore({
									x: xy.x,
									y: xy.y,
									controller: this
								});
							} else {
								this.view.showGoToStore(unit);
							}

						} else {
							this.view.showGoToStore(unit);
						}

					} else {
						this.view.goToStore({
							x: xy.x,
							y: xy.y,
							controller: this
						});
					}

				} else {

					this.view.goToStore({
						x: xy.x,
						y: xy.y,
						controller: this
					});

				}

			} else {
				return false;
			}

		},

		onClick: function(coordinates) {

			APP.notificationView.hideNotification();

			this.checkParts();

			var cssClassWasDeleteXY = this.view.hideGoToStore();

			var units, unit, x, y, unitAction;

			x = coordinates.x;
			y = coordinates.y;

			units = this.getUnitsByCoordinates(coordinates);

			unit = units[units.length - 1]; // get las unit // workaround for store

			unitAction = this.getUnitAction(x, y);

			if (unitAction) {

				switch (unitAction) {
					case 'move':
						this.focusedUnit.moveTo(coordinates, this);
						this.view.moveUnit(this.focusedUnit);

						this.endAction();
						this.wispAction();
						break;

					case 'attack':
						this.attackUnit(this.focusedUnit, unit);
						this.view.hideUnitsUnderAttack();

						setTimeout(function () {
							this.endAction();
							this.wispAction();
						}.bind(this), APP.units.info.timer.attack);

						break;

					case 'getBuilding':

						this.focusedUnit.getBuilding(this);

						this.view.hideGetBuilding();

						this.endAction();
						//this.setStoreButtonStateForActivePlayer();
						break;

					case 'upBones':

						this.upBonesFromGrave(this.focusedUnit, coordinates);

						this.endAction();

						break;

				}

				if ( this.gameOverDetect(this) ) {
					return;
				}

			} else {

				this.focusedUnit = false;
				this.unitAvailableActions = {};

				if (unit) {
					this.focusedUnit = unit;
					if (unit.playerId === this.activePlayer.id) {
						this.unitAvailableActions = this.createAvailableActions(unit);
						this.view.highlightUnit(unit);
						// detect - no available action of unit
						if (!Object.keys(this.unitAvailableActions).length) {
							this.focusedUnit.setEndTurn();
							this.view.showEndUnitTurn(unit);
						}
					} else {
						this.view.highlightPath({ path: unit.getAvailablePath(this), color: unit.color });
						this.view.highlightUnit(unit);
					}

					this.view.showUnitInfo(unit);

				} else {
					this.focusedUnit = false;
					this.unitAvailableActions = {};
					this.hideAllActions();

					this.view.showPlaceInfo({
						map: this.map,
						coordinates: coordinates
					});

				}

				if ( !coordinates.endAction ) {
					this.detectGoToStore(coordinates, cssClassWasDeleteXY);
				}

			}

		},

		attackUnit: function(active, passive) {

			this.setState('disable');

			this.view.showAttackAnimation(active, passive);

			// show animation
			console.log('show animation here animation ' + Date.now());

			setTimeout(function (active, passive) {

				console.log('attack active to passive action ' + Date.now());

				active.attackTo(passive, this);

				this.view.redrawHealthUnit(passive);
				this.view.redrawLevelUnit(passive);

				this.setState('enable');

				if (passive.health <= 0) {
					this.killUnit(passive);
				} else {
					// detect - can passive attack active
					if (passive.canAttackUnit(active, this)) {

						this.setState('disable');

						console.log('attack passive to active animation ' + Date.now());
						this.view.showAttackAnimation(passive, active);

						setTimeout(function (active, passive) {

							console.log('attack passive to active action ' + Date.now());

							passive.attackTo(active, this);

							if (active.health <= 0) {
								this.killUnit(active);
							}

							this.view.redrawHealthUnit(active);
							this.view.redrawLevelUnit(active);

							this.setState('enable');

						}.bind(this, active, passive), APP.units.info.timer.attack);

					}
				}

			}.bind(this, active, passive), APP.units.info.timer.attack);



		},

		upBonesFromGrave: function(active, coordinates) {
			active.setEndTurn();
			this.createUnitByCoordinates(coordinates, 'Bones', active.playerId);
			this.removeGraveByCoordinates(coordinates);
		},

		createUnitByCoordinates: function(xy, type, id) {

			var unit = {
				type: type,
				x: xy.x,
				y: xy.y,
				playerId: id
			},
				player = this.getPlayerById(unit.playerId),
				newUnit;

			unit.color = player.color;

			newUnit = this.appendUnit(unit);

			this.view.appendUnit(newUnit);

			newUnit.setEndTurn();
			this.view.showEndUnitTurn(newUnit);

		},

		removeGraveByCoordinates: function(coordinates) {
			var graves = this.unitsRIP,
				x = coordinates.x,
				y = coordinates.y,
				key,
				grave, graveX, graveY;

			for (key in graves) {
				if (graves.hasOwnProperty(key)) {
					grave = graves[key];
					graveX = grave.x;
					graveY = grave.y;
					if (graveX === x && graveY === y) {
						// remove grave
						this.view.removeRIP(grave);
						delete graves[key];
					}

				}
			}

		},

		killUnit: function(unit) {

			unit.level = 0;

			if ( unit.notCreateGrave ) {
				this.view.removeRIP(unit); // hack - use removeRIP instead removeUnit (removeUnit is not implemented)
			} else {
				this.appendRIP(unit);
				this.view.drawRIP(unit);
			}

			delete this.units[unit.id];

		},

		appendRIP: function(unit) {
			unit.lifeAfterDeadLength = 0;
			this.unitsRIP[unit.id] = unit;
			return unit;

		},

		updateRIPs: function() {
			var RIPs = this.unitsRIP,
				key, unit;
			for (key in RIPs) {
				if (RIPs.hasOwnProperty(key)) {
					unit = RIPs[key];
					unit.lifeAfterDeadLength += 1;

					if (unit.lifeAfterDeadLength >= this.lifeAfterDeadLimit) {
						this.view.removeRIP(unit);
						delete RIPs[key];
					}

				}
			}

		},

		getUnitsByCoordinates: function(coordinates) {
			var key,
				units = [],
				allUnits = this.units,
				unitForTest;

			for (key in allUnits) {
				if (allUnits.hasOwnProperty(key)) {

					unitForTest = allUnits[key];

					if (unitForTest.x === coordinates.x && unitForTest.y === coordinates.y) {
						units.push(unitForTest);
					}

				}
			}

			return units;

		},

		startBattle: function() {
//			this.endTurn();
			this.step();
			this.getFirstBuilding();
			this.view.showFirstUnit();
		},

		getFirstBuilding: function () {

			var units = this.units,
				buildings = this.buildings,
				knights = [],
				unit,
				castles = [],
				building,
				key;

			for (key in units) {
				if (units.hasOwnProperty(key)) {
					unit = units[key];
					if (unit.type === 'Knight') {
						knights.push(unit);
					}
				}
			}

			for (key in buildings) {
				if (buildings.hasOwnProperty(key)) {
					building = buildings[key];
					if (building.type === 'castle') {
						castles.push(building);
					}
				}
			}

			knights.forEach(function (knight) {
				castles.forEach(function (castle) {
					if (castle.x === knight.x && castle.y === knight.y) {
						castle.playerId = knight.playerId;
						castle.color = knight.color;
						this.view.setBuildingColor(castle);
					}
				}, this);
			}, this);

		},

		isEqualBy: function (obj) {

			var key,
				list = [],
				item,
				playerId,
				checkForUndefined = true;

			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					item = obj[key];
					playerId = item.playerId;
					checkForUndefined = checkForUndefined && playerId !== undefined;
					list.push(playerId);
				}
			}

			if (!checkForUndefined) {
				return false;
			}

			return Math.max.apply(null, list) === Math.min.apply(null, list);

		},

		isGameOver: function () {

			var result = {};

			result.isEnd = this.isEqualBy(this.buildings);

			return result;

		},

		gameOverDetect: function () {

			var result = this.isGameOver();

			if (result.isEnd) {
				util.clearTimeouts();

				// get winner player
				result.winner = util.findBy(this.players, 'id', util.objToArray(this.buildings)[0].value.playerId).item;

				this.showEndGame(result);

			}

			return result.isEnd;

		},
		showEndGame: function (result) {

			this.view.endGameAlert(result);

		},

		checkParts: function () {

			var steps = this.map.steps || [];

			var controller = this;

			steps.every(function (step) {


				if (step.isDone) {
					return true;
				}

				if ( step.check(controller) ) {
					step.run(controller);
				}

				return false;

			});

		},

		step: function() {

			win.androidAds.showAd();

			this.stepCount = this.stepCount || 0;

			this.stepCount += 0.5;

			this.view.activeButtons(true);

			this.checkParts();

			if (this.gameOverDetect(this)) {
				return;

			} else {
				this.view.hideGoToStore();
				this.setActivePlayer();
				this.setStatusBarForActivePlayer();
				this.updateRIPs();
				this.updateUnitsOnBuilding();
				this.wispAction();

				this.runCpu();

				if ( this.map.type === 'mission' ) {
					APP.notificationView.show({
						color: this.activePlayer.color,
						text: this.activePlayer.color,
						tmpl: 'n-turn',
						onHide: APP.maps[this.map.jsName].notification
					});
				} else {
					APP.notificationView.show({
						color: this.activePlayer.color,
						text: this.activePlayer.color,
						tmpl: 'n-turn'
					});
				}


			}

		},

		runCpu: function() {

			if (this.activePlayer.type !== 'cpu') {
				return;
			}

			this.view.activeButtons(false);

			var cpu = new APP.Cpu({
				view: this.view,
				controller: this,
				player: this.activePlayer
			});

			cpu.run();

		},

		wispAction: function(argsPlayer) {

			// 0 - get players
			// 1 - get wisps
			// 2 - create active map
			// 3 - get all units
			// 4 - set state for each units

			var ctrl = this,
				players = ctrl.players,
				view = ctrl.view;

			players.forEach(function(player){

				var allUnits = ctrl.getUnitByPlayer(player),
					wisps = ctrl.getUnitByPlayerAndType(player, 'Wisp'),
					auraMap = ctrl.createAuraMap(wisps);

				// apply aura to needed units
				allUnits.forEach(function(unit){

					var x = unit.x,
						y = unit.y;

					if ( auraMap['x' + x + 'y' + y] ) {

						if (unit.underWispAura || unit.canNotBeUnderWispAura) {
							// do nothing, unit is OK
						} else {
							unit.underWispAura = true;
							view.showWispAura(unit);
						}

					} else {

						view.hideWispAura(unit);
						unit.underWispAura = false;

					}

				});

			});

			view.removeWispAuraFromGraves();

		},
		getUnitByPlayer: function(player) {
			var unitsByPlayer = [],
				allUnits = this.units,
				key, unit,
				playerId = player.id;

			for (key in allUnits) {
				if (allUnits.hasOwnProperty(key)) {
					unit = allUnits[key];
					if (unit.playerId === playerId) {
						unitsByPlayer.push(unit);
					}
				}
			}

			return unitsByPlayer;

		},
		getUnitByPlayerAndType: function(player, type) {

			var allUnits = this.getUnitByPlayer(player),
				neededUnits = [];

			allUnits.forEach(function(unit){
				if (unit.type === type) {
					neededUnits.push(unit);
				}
			});

			return neededUnits;

		},
		getUnitBy: function(data) {
			var playerId = data.playerId,
				unitId = data.unitId,
				foundUnit;

			win.util.objForEach(this.units, function(unit) {
				if ( unit.playerId === playerId && unit.id === unitId ) {
					foundUnit = unit;
				}
			});

			return foundUnit;

		},
		createAuraMap: function(units) {

			var map = {};

			units.forEach(function(unit){

				var unitMap = unit.getAuraMap();

				unitMap.forEach(function(xy){
					map['x' + xy.x + 'y' + xy.y] = xy;
				});

			});

			return map;

		},

		updateUnitsOnBuilding: function() {
			var player = this.activePlayer,
				playerId = player.id,
				units = this.units,
				buildings = this.buildings,
				key,
				that = this;

			for (key in units) {
				if (units.hasOwnProperty(key)) {

					(function (unit) {

						// filter only for active unit
						if (unit.playerId !== playerId) {
							return;
						}

						var x = unit.x,
							y = unit.y,
							building = buildings['x' + x + 'y' + y],
							addedHealth,
							endHealth;

						// detect building
						if (!building) {
							return;
						}

						// detect only building for active player
						if (building.playerId !== playerId) {
							return;
						}

						addedHealth = APP.map.healthFrom[building.type];
						endHealth = addedHealth + unit.health;


						if ( endHealth > unit.defaultHealth ) {
							addedHealth = unit.defaultHealth - unit.health;
							unit.health = unit.defaultHealth;
						} else {
							unit.health += addedHealth;
						}
						that.view.addHealthToUnit({
							endHealth: unit.health,
							addedHealth: addedHealth,
							unit: unit
						});

					}(units[key]));

				}
			}

		},
		setStatusBarForActivePlayer: function() {
			this.setMoneyForActivePlayer();
			//this.setStoreButtonStateForActivePlayer();
		},
		setMoneyForActivePlayer: function() {

			var buildings = this.buildings,
				key,
				building,
				player = this.activePlayer,
				playerId = player.id,
				moneyFrom = APP.map.moneyFrom;

			for (key in buildings) {
				if (buildings.hasOwnProperty(key)) {
					building = buildings[key];
					if (building.playerId === playerId) {
						player.gold += moneyFrom[building.type];
					}
				}
			}

			this.view.showPlayerInfo(player);

		},
		//setStoreButtonStateForActivePlayer: function() {
		//
		//	//this.view.setStoreButtonState( this.getPlayerCastle() );
		//
		//},
		setActivePlayer: function() {
			// set active player
			var index,
				players = this.players;
			if ( this.activePlayer ) {
				index = players.indexOf(this.activePlayer);
				this.activePlayer = players[index + 1] || players[0];
			} else {
				this.activePlayer = players[0];
			}


			this.view.showPlayerInfo(this.activePlayer);


		},
		endTurn: function() {

			// set default properties all units
			var units = this.units,
				unit,
				key;

			for (key in units) {
				if (units.hasOwnProperty(key)) {
					unit = units[key];
					unit.setDefaultProperties();
				}
			}

			this.focusedUnit = false;
			this.unitAvailableActions = {};

			this.hideAllActions();

			this.step();

		},
		getPlayerCastle: function(player) {

			player = player || this.activePlayer;

			var buildings = this.buildings,
				building,
				playerId = player.id,
				key;

			for (key in buildings) {
				if (buildings.hasOwnProperty(key)) {
					building = buildings[key];
					if (building.playerId === playerId && building.type === 'castle') {
						return building;
					}
				}
			}

			return false;

		},

		getDefByBuilding: function(unit) {

			var unitX = unit.x,
				unitY = unit.y,
				building = this.buildings['x' + unitX + 'y' + unitY];

			if (!building) {
				return 0;
			}

			return APP.map.defence[building.type];

		},

		getDefByTerrain: function(unit) {

			var unitX = unit.x,
				unitY = unit.y,
				terrain = this.map.terrain['x' + unitX + 'y' + unitY];

			if (!terrain) {
				return 0;
			}

			// lizard only
			if (unit.runType === 'flow' && terrain === 'water') {
				return APP.map[terrain].specialDefence;
			}

			return APP.map[terrain].defence;


		}



	};

	APP.BattleController = BattleController;

}(window, document, document.documentElement));