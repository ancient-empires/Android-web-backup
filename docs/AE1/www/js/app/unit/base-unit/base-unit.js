(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, lang, util */

	win.APP = win.APP || {};

	APP.units.BaseUnit = function(data) {

		this.atk = 5;
		this.def = 0;
		this.mov = 4;
		this.cost = 100;

		this.health = 10;
		this.defaultHealth = 10;
		this.attackRange = 1;

		this.runType = 'walk';

		this.damage = {
			given: 0,
			received: 0
		};

		this.level = 0;

		this.availableActionsDefault = ['move', 'attack'];
		this.availableActions = [];

	};

	APP.units.BaseUnit.prototype = {
		levelInfo: {
			upList: [4, 9, 15], // max level is (upList.length + 1)
			attackBonus: 10 // 10% to attack for each unit's level
		},
		underAbilityList: {
			wasPoisoned: false,
			underWispAura: false
		},
		defaultList: {
			wasMove: false,
			wasAttack: false
		},
		baseInit: function(data) {

			var unitInfo = APP.units.info[data.type.toLowerCase()];

			this.defaultList = util.createCopy(this.defaultList);
			this.damage = util.createCopy(this.damage);
			util.extend(this.defaultList, unitInfo.unitDefaultList);
			util.extend(this, unitInfo);
			util.extend(this, data);

			// create full action list
			this.availableActions = this.availableActionsDefault.concat(this.availableActions);

		},
		getAvailablePath: function(controller) {

			var x,
				y,
				maxX = controller.map.size.width,
				maxY = controller.map.size.height,
				pathFinder = new util.PathFinder({
					map: controller.map,
					mov: this.mov - 1,
					x: this.x,
					y: this.y,
					relativeTypeSpace: true
				}),
				availablePath = pathFinder.getAvailablePath({unit: this}),
				units = controller.units,
				key, unit,
				findToRemove = function(xy){

					var pathX = xy.x,
						pathY = xy.y;

					if (pathX === x && pathY === y) {
						return false;
					}

					return !(pathX >= maxX || pathX < 0 || pathY >= maxY || pathY < 0);

				};

			for (key in units) {
				if (units.hasOwnProperty(key)) {
					unit = units[key];
					x = unit.x;
					y = unit.y;
					availablePath = availablePath.filter(findToRemove);
				}
			}

			return availablePath;

		},
		moveTo: function(coordinates, controller) {

			if (this.wasMove) {
				return false;
			}

			var availablePath = this.getAvailablePath(controller),
				canMove = false,
				x = coordinates.x,
				y = coordinates.y;

			availablePath.every(function(xy){

				if (xy.x === x && xy.y === y) {
					canMove = true;
					return false;
				}

				return true;

			});

			if (canMove) {
				this.wasMove = true;
				this.x = coordinates.x;
				this.y = coordinates.y;
				return this;
			}

			return false;

		},
		findUnitsUnderAttack: function(units) {

			var pathFinder = new util.PathFinder({
//				map: map,
				mov: this.attackRange,
				x: this.x,
				y: this.y,
				relativeTypeSpace: false
			}),

			availableSquare = pathFinder.getAvailablePath({unit: this}),
			unitsUnderAttack = [],
			playerId = this.playerId;

			availableSquare.forEach(function(square){

				var x = square.x,
					y = square.y,
					key, unit;

				for (key in units) {
					if (units.hasOwnProperty(key)) {
						unit = units[key];
						if (unit.x === x && unit.y === y && playerId !== unit.playerId) {
							unitsUnderAttack.push(unit);
						}
					}
				}

			});

			if ( !unitsUnderAttack.length ) {
				return false;
			}

			return unitsUnderAttack;

		},

		getAuraMap: function() {

			var pathFinder = new util.PathFinder({
					mov: this.auraRange,
					x: this.x,
					y: this.y,
					relativeTypeSpace: false
				}),
				availableSquare = pathFinder.getAvailablePath({unit: this});

			return availableSquare;

		},

		findGravesForUp: function(graves, units) {

			var pathFinder = new util.PathFinder({
					mov: this.upBonesRange,
					x: this.x,
					y: this.y,
					relativeTypeSpace: false
				}),

				availableSquare = pathFinder.getAvailablePath({unit: this}),
				gravesForUp = [],
				unitsCoordinates = util.xyUnitsMap(units);

			availableSquare.forEach(function(square){

				var x = square.x,
					y = square.y,
					key, grave;

				for (key in graves) {
					if (graves.hasOwnProperty(key)) {
						grave = graves[key];
						if (grave.x === x && grave.y === y && !unitsCoordinates['x' + x + 'y' + y]) {
							gravesForUp.push(grave);
						}
					}
				}

			});

			if ( !gravesForUp.length ) {
				return false;
			}

			return gravesForUp;

		},

		attackTo: function(enemyUnit, controller) {

			if (this.health <= 0) {
				this.setEndTurn();
				return;
			}

			if (this.canPoison && !enemyUnit.canNotBePoisoned) {
				enemyUnit.wasPoisoned = true;
			}

			var defByBuilding = controller.getDefByBuilding(enemyUnit),
				defByTerrain = controller.getDefByTerrain(enemyUnit),
				unitQ = this.health / this.defaultHealth,
				attackValue = this.atk,
				attackBonusByLevel = this.atk * (this.level * this.levelInfo.attackBonus) / 100,
				enemyDef = enemyUnit.def,
				reduceDefBy = APP.units.info.poison.reduce.def;

			this.damage.given += attackValue * unitQ;

			if (enemyUnit.wasPoisoned) {
				enemyDef -= reduceDefBy;
				enemyDef = Math.max(enemyDef, 0);
			}

			if (defByBuilding > 0) {
				defByTerrain = 0;
			}

			attackValue = (attackBonusByLevel + attackValue) * unitQ - (enemyDef + defByBuilding + defByTerrain) * 0.5;

			attackValue = Math.max(attackValue, unitQ);

			if (this.underWispAura) {
				attackValue += APP.units.info.aura.wisp.attack;
			}

			if (this.type === 'Wisp' && enemyUnit.type === 'Bones') {
				attackValue += this.bonesAttackBonus;
			}

			if (this.type === 'Archer' && enemyUnit.type === 'Wyvern') {
				attackValue *= 1.3;
			}

			enemyUnit.damage.received += attackValue;

			enemyUnit.health = enemyUnit.health - attackValue;

			this.setLevel();

			this.setEndTurn();

		},
		getAvailableGivenDamage: function(enemyUnit, controller, reduceByHealth) {

			var defByBuilding, defByTerrain, unitQ, attackValue, attackBonusByLevel, enemyDef, reduceDefBy,
				health = this.health - (reduceByHealth || 0);

			if (health <= 0) {
				return 0;
			}

			defByBuilding = controller.getDefByBuilding(enemyUnit);
			defByTerrain = controller.getDefByTerrain(enemyUnit);
			unitQ = health / this.defaultHealth;
			attackValue = this.atk;
			attackBonusByLevel = this.atk * (this.level * this.levelInfo.attackBonus) / 100;
			enemyDef = enemyUnit.def;
			reduceDefBy = APP.units.info.poison.reduce.def;

			if (this.canPoison && !enemyUnit.canNotBePoisoned) {
				enemyDef -= reduceDefBy;
				enemyDef = Math.max(enemyDef, 0);
			}

			if (defByBuilding > 0) {
				defByTerrain = 0;
			}

			attackValue = (attackBonusByLevel + attackValue) * unitQ - (enemyDef + defByBuilding + defByTerrain) * 0.5;

			attackValue = Math.max(attackValue, unitQ);

			if (this.underWispAura) {
				attackValue += APP.units.info.aura.wisp.attack;
			}

			if (this.type === 'Wisp' && enemyUnit.type === 'Bones') {
				attackValue += this.bonesAttackBonus;
			}

			return attackValue;

		},
		setLevel: function() {

			var attackCount = this.damage.given / this.atk,
				level = 0;

			this.levelInfo.upList.every(function(point, index){

				if (point > attackCount) {
					return false;
				}

				level = index + 1;

				return true;

			});

			this.level = level;


		},
		setDefaultProperties: function() {
			util.extend(this, this.defaultList);
			util.extend(this, this.underAbilityList);
		},
		setEndTurn: function() {

			var key,
				list = this.defaultList;

			for (key in list) {
				if (list.hasOwnProperty(key)) {
					this[key] = !list[key];
				}
			}

		},

		isEndTurn: function () {

			var isEndTurn = true,
				key,
				list = this.defaultList;

			for (key in list) {
				if (list.hasOwnProperty(key)) {

					if (this[key] === list[key] || this[key] === undefined ) { // this[key] === undefined fix the first turn
						isEndTurn = false;
					}

				}
			}

			return isEndTurn;

		},

		getBuilding: function(controller) {
			var build = controller.buildings['x' + this.x + 'y' + this.y];

			build.playerId = this.playerId;
			build.color = this.color;

			controller.view.setBuildingColor(build);

			this.setEndTurn();

		},
		canAttackUnit: function(enemy, controller) {
			var units = this.findUnitsUnderAttack(controller.units);

			// if no any units under attack - return false
			if (!units){
				return false;
			}

			// if has units under attack - search enemy in available units
			return units.indexOf(enemy) !== -1;
		},
		getNearestNoPlayerBuilding: function(controller) {
			var buildings = controller.buildings,
				building,
				pathLength,
				key,
				unit = this,
				playerId = this.playerId,
				noPlayerBuildings = [];

			function getLength(xy1, xy2) {

				if (!xy1 || !xy2) {
					return 0;
				}

				return Math.pow(xy1.x - xy2.x, 2) + Math.pow(xy1.y - xy2.y, 2);
			}

			for (key in buildings) {
				if (buildings.hasOwnProperty(key)) {
					building = buildings[key];
					if (building.playerId !== playerId) {
						noPlayerBuildings.push(building);
					}
				}
			}

			building = noPlayerBuildings.sort(function(b1, b2) {
				return getLength(b1, unit) - getLength(b2, unit);
			})[0];

			pathLength = Math.pow(getLength(building, unit), 0.5);

			return {
				building: building,
				pathLength: pathLength,
				noPlayerBuildings: noPlayerBuildings
			};

		}

	};

}(window, document, document.documentElement));