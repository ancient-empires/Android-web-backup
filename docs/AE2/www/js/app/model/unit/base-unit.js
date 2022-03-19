/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global console, alert, window, document */
	/*global Backbone, $, _ */

	win.APP.BB.Unit = {};

	win.APP.BB.Unit.BaseUnitModel = Backbone.Model.extend({

		//////////
		// init
		//////////

		initialize: function(data) {

			data = data || {};

			var unit = this;

			// default state
			unit.setDefaultState();

			unit.set('health', data.health || 100);
			unit.set('defaultHealth', 100);
			unit.set('xp', data.xp || 0);
			unit.set('level', data.level || 0);

			unit.set('silents', {}); // hack for triggering

			unit.autoSetLevel();  // workaround for commanders before listeners

			unit.bindEventListener();

		},

		setBy: function (key, delta) {

			return this.set(key, this.get(key) + delta);

		},

		bindEventListener: function () {
			var unit = this;
			unit.on('change:isActive', unit.onChangeIsActive);
			unit.on('change:x', unit.autoSetWispAura);
			unit.on('change:y', unit.autoSetWispAura);
			unit.on('change:underWispAura', unit.onUnderWispAuraChange);
			unit.on('change:poisonCount', unit.onPoisonCountChange);
			unit.on('change:level', unit.onChangeLevel);
			unit.on('change:health', unit.onChangeHealth);
			unit.on('change:xp', unit.onChangeXp);
		},

		unbindEventListener: function () {
			this.off();
		},

		silentOn: function () {
			var unit = this,
				silents = unit.get('silents');
			_.each(arguments, function (eventName) {
				silents[eventName] = true;
			});
		},

		silentOff: function () {
			var unit = this,
				silents = unit.get('silents');
			_.each(arguments, function (eventName) {
				silents[eventName]= null;
				delete silents[eventName];
			});
		},

		//////////
		// on changes
		//////////

		onChangeIsActive: function (e, isActive) {

			var unit = this,
				view = unit.get('view');

			return isActive ? view.setActiveUnit(unit) : view.setNotActiveUnit(unit);

		},

		autoSetWispAura: function () {

			var unit = this,
				silents = unit.get('silents'),
				model = unit.get('model');

			if ( silents.x || silents.y ) {
				return;
			}

			model.checkCases();
			model.autoSetWispAura();

		},

		onUnderWispAuraChange: function (e, underWispAura) {

			var unit = this,
				view = unit.get('view');

			view.setWispAuraState({
				unit: unit,
				wispAuraState: underWispAura
			});

		},

		onPoisonCountChange: function (e, poisonCount) {

			var unit = this,
				view = unit.get('view');

			view.setPoisonState({
				unit: unit,
				poisonCount: poisonCount
			});

		},

		onChangeLevel: function () {

			var unit = this,
				view = unit.get('view');

			view.setUnitLevel({ unit: unit });

		},

		onChangeHealth: function (e, health) {

			var unit = this,
				silents = unit.get('silents'),
				player;

			if (silents.health) {
				return;
			}

			if ( health <= 0 && unit.isCommander() ) {
				player = unit.getOwner();
				player.commander.isLive = false;
				player.commander.deadCount = (player.commander.deadCount || 0) + 1;
			}

		},

		onChangeXp: function (e, xp) {

			var unit = this,
				player;

			if ( unit.isCommander() ) {
				player = unit.getOwner();
				player.commander.xp = xp;
			}

		},

		setDefaultState: function () {

			this.set('isActive', true);
			this.set('didMove', false);
			this.set('didAttack', false);
			//this.set('didRaise', false);
			this.set('poisonCount', 0);
			//this.set('didPoison', false);
			this.set('underWispAura', false);
			this.set('gotBuilding', false);
			this.set('fixedBuilding', false);

		},

		autoSetLevel: function () {

			var unit = this,
				xp = unit.get('xp'),
				level = unit.get('level'),
				levelList = win.APP.unitMaster.levelList;

			_.each(levelList, function (levelPoint, index) {
				if (xp >= levelPoint) {
					level = index;
				}
			});

			unit.set('level', level);

		},

		//////////
		// getting data
		//////////

		autoSetActiveState: function () {

			var unit = this,
				actions = unit.getAvailableActions(),
				isActive = false;

			isActive = isActive || (actions.availablePathWithTeamUnit && actions.availablePathWithTeamUnit.length);
			isActive = isActive || (actions.availablePathViewWithoutTeamUnit && actions.availablePathViewWithoutTeamUnit.length);
			isActive = isActive || actions.buildingToFix;
			isActive = isActive || actions.buildingToOccupy;
			isActive = isActive || (actions.gravesToRaise && actions.gravesToRaise.length);
			isActive = isActive || (actions.unitsUnderAttack && actions.unitsUnderAttack.length);

			unit.set('isActive', Boolean(isActive));

		},

		getAvailableActions: function () {

			if ( !this.get('isActive') ) {
				return {};
			}

			var unit = this,
				unitTeamNumber = unit.get('teamNumber'),
				units = unit.get('model').get('units'),
				teamUnits = [], // done
				enemyUnits = [], // done
				availablePathWithTeamUnit, // done
				availablePathViewWithoutTeamUnit, // done
				unitsUnderAttack,
				gravesToRaise,
				buildingToFix,
				buildingToOccupy,
				openStore;

			// get team and enemy units
			_.each(units, function (unit) {
				if ( unit.get('teamNumber') === unitTeamNumber ) {
					teamUnits.push(unit);
				} else {
					enemyUnits.push(unit);
				}
			});

			// get available path view with team unit
			availablePathWithTeamUnit = unit.getAvailablePathWithTeamUnit();

			// get available path view withOUT team unit
			availablePathViewWithoutTeamUnit = _.filter(availablePathWithTeamUnit, function (xy) {
				var founded = false;
				_.each(teamUnits, function (unit) {
					if ( unit.get('x') === xy.x && unit.get('y') === xy.y ) {
						founded = true;
					}
				});
				return !founded;
			});

			// get unitsUnderAttack
			unitsUnderAttack = unit.getUnitsUnderAttack();

			// get graves to raise
			gravesToRaise = unit.getGravesToRaise();

			// detect building (farm) to fix
			buildingToFix = unit.getBuildingToFix();

			// get building to occupy (farm and castle)
			buildingToOccupy = unit.getBuildingToOccupy();

			// show $ to go to store
			openStore = unit.getCanOpenStore();

			return {
				unit: unit,
				openStore: openStore,
				buildingToOccupy: buildingToOccupy,
				buildingToFix: buildingToFix,
				gravesToRaise: gravesToRaise,
				unitsUnderAttack: unitsUnderAttack,
				availablePathWithTeamUnit: availablePathWithTeamUnit,
				availablePathViewWithoutTeamUnit: availablePathViewWithoutTeamUnit
			};

		},

		getAvailablePathFull: function (dataArg) {

			if ( this.get('didMove') ) {
				return [];
			}

			var data = dataArg || {},
				unit = this,
				view = unit.get('view'),
				map = view.get('map'),
				terrain = map.terrain,
				pathFinder,
				unitMaster = win.APP.unitMaster,
				reduceByPoison = unit.get('poisonCount') ? unitMaster.reduceMoveByPoison : 0;

			pathFinder = new PathFinder({
				terrain: terrain,
				mov: unit.get('mov') - 1 - reduceByPoison,
				x: unit.get('x'),
				y: unit.get('y'),
				blackWholes: data.blackWholes || [],
				moveType: unit.get('moveType'),
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: true
			});

			return pathFinder.getAvailablePath();

		},

		getAvailablePathWithTeamUnit: function (data) {

			if ( this.get('didMove') ) {
				return [];
			}

			data = data || {};

			var unit = this,
				view = unit.get('view'),
				model = unit.get('model'),
				units = model.get('units'),
				unitTeamNumber = unit.get('teamNumber'),
				map = view.get('map'),
				terrain = map.terrain,
				pathFinder,
				blackWholes = [],
				unitMaster = win.APP.unitMaster,
				reduceByPoison = (unit.get('poisonCount') && !data.removePoisonCount) ? unitMaster.reduceMoveByPoison : 0;

			_.each(units, function (unit) {

				if ( unit.get('teamNumber') === unitTeamNumber ) { // unit can move around alias units
					return;
				}

				blackWholes.push('x' + unit.get('x') + 'y' + unit.get('y'));

			});

			pathFinder = new PathFinder({
				blackWholes: blackWholes,
				terrain: terrain,
				mov: unit.get('mov') - 1 - reduceByPoison,
				x: unit.get('x'),
				y: unit.get('y'),
				moveType: unit.get('moveType'),
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: true
			});

			return pathFinder.getAvailablePath();

		},

		getUnitsUnderAttack: function () {

			var unit = this,
				model = unit.get('model'),
				units = model.get('units'),
				enemyUnits = [],
				availableAttackXYs,
				underAttackXYs = [],
				unitTeamNumber = unit.get('teamNumber');

			if ( unit.get('didAttack') ) {
				return underAttackXYs; // []
			}

			_.each(units, function (unit) {
				if ( unit.get('teamNumber') !== unitTeamNumber ) {
					enemyUnits.push(unit);
				}
			});

			availableAttackXYs = unit.getAvailableAttackMap();

			_.each(enemyUnits, function (enemyUnit) {

				var xy = {
					x: enemyUnit.get('x'),
					y: enemyUnit.get('y')
				};

				if ( _.find(availableAttackXYs, xy) ) {
					underAttackXYs.push(xy);
				}

			});

			return underAttackXYs;

		},

		getAvailableAttackMap: function () {

			var unit = this,
				view = unit.get('view'),
				map = view.get('map'),
				pathFinder;

			pathFinder = new PathFinder({
				mov: unit.get('atkRange') - 1,
				x: unit.get('x'),
				y: unit.get('y'),
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: false
			});

			return pathFinder.getAvailablePath();

		},

		getAvailableAttackMapFromXy: function (xy) {

			var unit = this,
				view = unit.get('view'),
				map = view.get('map'),
				pathFinder;

			pathFinder = new PathFinder({
				mov: unit.get('atkRange') - 1,
				x: xy.x,
				y: xy.y,
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: false
			});

			return pathFinder.getAvailablePath();

		},

		getAvailableAttackMapWithPath: function (data) {

			var unit = this,
				attacksMap = [{
					x: unit.get('x'), // add unit's xy
					y: unit.get('y')
				}],
				availablePath = unit.getAvailablePathWithTeamUnit(data);

			_.each(availablePath, function (xy) {
				_.each(unit.getAvailableAttackMapFromXy(xy), function (xy) {
					return _.find(attacksMap, xy) || attacksMap.push(xy);
				});
			});

			attacksMap.shift(); // remove unit's xy

			return attacksMap;

		},

		getGravesToRaise: function () {

			var unit = this,
				view = unit.get('view'),
				model = unit.get('model'),
				map = view.get('map'),
				graves = model.get('graves'),
				availableGraves = [],
				raiseRange = unit.get('raiseRange'),
				availableXYToRaise,
				pathFinder;

			if ( !raiseRange ) {
				return availableGraves;
			}

			pathFinder = new PathFinder({
				mov: raiseRange - 1,
				x: unit.get('x'),
				y: unit.get('y'),
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: false
			});

			availableXYToRaise = pathFinder.getAvailablePath();

			_.each(availableXYToRaise, function (xy) {
				var graveToAdd = _.find(graves, xy);
				if ( graveToAdd && !model.getUnitByXY(xy) ) {
					availableGraves.push(graveToAdd);
				}
			});

			return availableGraves;

		},

		getConfirmMoveActions: function (xy) {

			var unit = this,
				view = unit.get('view'),
				sizes = view.get('map').size,
				undoMoveActions = [],
				curX = xy.x,
				curY = xy.y,
				beforeX = xy.beforeX,
				beforeY = xy.beforeY,
				x, y,
				xLen, yLen;

			for (x = 0, xLen = sizes.width; x < xLen; x += 1) {
				for (y = 0, yLen = sizes.height; y < yLen; y += 1) {
					undoMoveActions.push({
						x: x,
						y: y,
						beforeX: beforeX,
						beforeY: beforeY
					});
				}
			}

			return {
				unit: unit,
				confirmMoveAction: {
					x: curX,
					y: curY
				},
				undoMoveActions: undoMoveActions
			};

		},

		getConfirmAttackActions: function (xy) {

			var unit = this,
				view = unit.get('view'),
				sizes = view.get('map').size,
				undoAttackActions = [],
				curX = xy.x,
				curY = xy.y,
				x, y,
				xLen, yLen;

			for (x = 0, xLen = sizes.width; x < xLen; x += 1) {
				for (y = 0, yLen = sizes.height; y < yLen; y += 1) {
					undoAttackActions.push({
						x: x,
						y: y
					});
				}
			}

			return {
				unit: unit,
				confirmAttackAction: {
					x: curX,
					y: curY
				},
				undoAttackActions: undoAttackActions
			};

		},

		canStrikeBack: function (enemy) {

			var unit = this,
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				enemyX = enemy.get('x'),
				enemyY = enemy.get('y'),
				dX = Math.abs(unitX - enemyX),
				dY = Math.abs(unitY - enemyY);

			return dX + dY <= 1;

		},

		getAttackToUnit: function (enemy, dataArg) {

			var data = dataArg || {},
				unit = this,
				model = unit.get('model'),
				unitXY = {
					x: unit.get('x'),
					y: unit.get('y')
				},
				enemyXY = {
					x: enemy.get('x'),
					y: enemy.get('y')
				},
				unitMaster = win.APP.unitMaster,
				unitLevel = unit.get('level'),
				unitAktBonusByLevel = unitMaster.atkByLevel * unitLevel,
				unitAkt = unit.get('atk'),
				unitMaxAtk = unitAkt.max,
				unitMinAtk = unitAkt.min,
				unitAktBonusByWispAura = unit.get('underWispAura') ? unitMaster.bonusAtkByWispAura : 0,
				unitAtkReduceByPoison = unit.get('poisonCount') ? unitMaster.reduceAktPoison : 0,
				unitMoveType = unit.get('moveType'),
				unitTerrain = model.getTerrainByXY(unitXY),
				unitFlowAtkBonus = (unitMoveType === 'flow' && unitTerrain.terrainType === 'water') ? unitMaster.bonusAtkByWater : 0,
				enemyMoveType = enemy.get('moveType'),
				enemyType = enemy.get('type'),
				unitAtkBonusAgainstFly = ( enemyMoveType === 'fly' && unit.get('bonusAtkAgainstFly') ) ? unit.get('bonusAtkAgainstFly') : 0,
				unitAtkBonusAgainstSkeleton = ( enemyType === 'skeleton' && unit.get('bonusAtkAgainstSkeleton') ) ? unit.get('bonusAtkAgainstSkeleton') : 0,
				enemyDef = enemy.get('def'),
				enemyDefTerrain = model.getArmorByXY(enemyXY),
				enemyTerrain = model.getTerrainByXY(enemyXY),
				enemyLevel = enemy.get('level'),
				enemyDefBonusByLevel = unitMaster.defByLevel * enemyLevel,
				enemyDefReduceByPoison = enemy.get('poisonCount') ? unitMaster.reduceDefPoison : 0,
				enemyFlowDefBonus = (enemyMoveType === 'flow' && enemyTerrain.terrainType === 'water') ? unitMaster.bonusDefByWater : 0,
				unitStartAtk = 0,
				unitQ = unit.get('health') / unit.get('defaultHealth'),
				randonKeys,
				//enemyQ = enemy.get('health') / enemy.get('defaultHealth'),
				atk;

			if (data.average) {
				unitStartAtk = Math.round( (unitMinAtk + unitMaxAtk) / 2);
			} else {
				randonKeys = ['atkRange', 'def', 'health', 'id', 'level', 'mov', 'ownerId', 'poisonCount', 'teamNumber',  'y', 'x', 'xp'];
				_.each(model.get('units'), function (item) {

					if (item === unit) {
						return;
					}

					_.each(randonKeys, function (key) {
						unitStartAtk += item.get(key) || 0;
					});

					var unitAtk = item.get('atk'),
						type = item.get('type');

					unitStartAtk += unitAtk.min + unitAtk.max + type.length;

				});

				unitStartAtk *= 86;
				unitStartAtk += 36;

				unitStartAtk = (unitMaxAtk - unitMinAtk) * ((unitStartAtk % 100) / 100) + unitMinAtk;
				//unitStartAtk = unit.util.getRandomBetween(unitMinAtk, unitMaxAtk);

			}

			atk = ( unitStartAtk + unitAktBonusByLevel + unitFlowAtkBonus + unitAtkBonusAgainstFly + unitAtkBonusAgainstSkeleton - unitAtkReduceByPoison  + unitAktBonusByWispAura) * unitQ - ( enemyDefBonusByLevel + enemyFlowDefBonus - enemyDefReduceByPoison + enemyDef + enemyDefTerrain) * unitQ; // * enemyQ;

			atk = Math.max(atk, 1);

			atk = Math.min(atk, enemy.get('health'));

			return Math.round(atk);

		},

		getBuildingToFix: function () {

			var unit = this,
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				model = unit.get('model'),
				buildings = model.get('buildings'),
				building = false;

			if ( unit.get('canFixBuilding') ) {
				building = _.find(buildings, {x: unitX, y: unitY, state: 'destroyed'});
			}

			return building;

		},

		getBuildingToOccupy: function () {

			var unit = this,
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				model = unit.get('model'),
				unitOwnerId = unit.get('ownerId'),
				listOccupyBuilding = unit.get('listOccupyBuilding'),
				buildings = model.get('buildings'),
				building = _.find(buildings, {x: unitX, y: unitY});

			if ( !listOccupyBuilding || !building ) {
				return false;
			}

			if ( building.state !== 'normal' ) {
				return false;
			}

			if ( building.ownerId === unitOwnerId ) {
				return false;
			}

			if ( !_.contains(listOccupyBuilding, building.type) ) {
				return false;
			}

			return building;

		},

		getWispAuraMap: function () {

			var unit = this,
				view = unit.get('view'),
				map = view.get('map'),
				auraRange = unit.get('auraRange'),
				pathFinder;

			pathFinder = new PathFinder({
				mov: auraRange - 1,
				x: unit.get('x'),
				y: unit.get('y'),
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: false
			});

			return pathFinder.getAvailablePath();

		},

		getCanOpenStore: function () {

			var unit = this,
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				unitOwnerId = unit.get('ownerId'),
				model = unit.get('model'),
				buildings = model.get('buildings'),
				building;

			building = _.find(buildings, {x: unitX, y: unitY});

			if ( !building ) {
				return false;
			}

			if ( !win.APP.building.list[building.type].canBeStore ) {
				return false;
			}

			if ( building.ownerId !== unitOwnerId ) {
				return false;
			}

			return {
				x: unitX,
				y: unitY
			};

		},

		getOwner: function () {

			var unit = this,
				model = unit.get('model'),
				players = model.get('players');

			return _.find( players, { id: unit.get('ownerId') } );

		},

		isCommander: function () {

			var unit = this,
				unitType = unit.get('type'),
				commanderList = win.APP.unitMaster.commanderList;

			return _.contains(commanderList, unitType);

		},

		//////////
		// unit's action
		//////////

		moveTo: function (data) {

			var unit = this,
				deferred = $.Deferred(),
				model = unit.get('model'),
				view = unit.get('view'),
				playerType = model.get('activePlayer').type,

				x = data.x,
				y = data.y,

				beforeX = unit.get('x'),
				beforeY = unit.get('y');

			view
				.moveUnitTo(data)
				.done(function () {

					unit.set('x', x);
					unit.set('y', y);

					unit.set('didMove', true);

					// detect - confirm move

					var availableActions;

					if ( view.info.get('confirmMove') === 'on' && playerType !== 'cpu' ) {
						availableActions = unit.getConfirmMoveActions({
							x: x,
							y: y,
							beforeX: beforeX,
							beforeY: beforeY
						});
					} else {
						unit.autoSetActiveState();
						availableActions = unit.getAvailableActions(); // view.info.get('confirmMove') === 'off'
					}

					view.showAvailableActions(availableActions);
					model.set('availableActions', availableActions);

					deferred.resolve();

				});

			return deferred.promise();

		},

		confirmMove: function () {

			this.autoSetActiveState();

			var unit = this,
				model = unit.get('model'),
				view = unit.get('view'),
				availableActions = unit.getAvailableActions();

			view.clearAvailableActions();
			model.clearAvailableActions();

			view.showAvailableActions(availableActions);
			model.set('availableActions', availableActions);

		},

		attackToXy: function (action) {

			var unit = this,
				x = action.attackX,
				y = action.attackY,
				enemyUnit,
				enemyBuilding,
				model = unit.get('model'),
				view = unit.get('view'),
				playerType = model.get('activePlayer').type,
				availableActions;

			if ( view.info.get('confirmAttack') === 'on' && !action.confirmed && playerType !== 'cpu' ) {

				availableActions = unit.getConfirmAttackActions({
					x: x,
					y: y
				});

				model.set('availableActions', availableActions);
				view.showAvailableActions(availableActions);

			} else {

				model.clearAvailableActions();
				view.clearAvailableActions();

				enemyUnit = model.getUnitByXY({
					x: x,
					y: y
				});

				if (enemyUnit) {
					unit.attackToUnit(enemyUnit);
					return;
				}

				enemyBuilding = model.getBuildingByXY({
					x: x,
					y: y
				});

				if ( enemyBuilding ) {
					unit.attackToBuilding(enemyBuilding);
				}


			}

		},

		attackToUnit: function (enemyUnit) {

			var unit = this,
				view = unit.get('view');

			view.moveBack.clear();

			//view.showFightScreen({
			//	attacker: unit,
			//	defender: enemyUnit
			//}).then(function () {

				view.showAttack({
					attacker: unit,
					defender: enemyUnit,
					from: {
						x: unit.get('x'),
						y: unit.get('y')
					},
					to: {
						x: enemyUnit.get('x'),
						y: enemyUnit.get('y')
					}
				}).then(function () {

					unit.set('isActive', false);

					var atk = unit.getAttackToUnit(enemyUnit);

					enemyUnit.setBy('health', -atk);

					//enemyUnit.setBy('poisonCount', unit.get('poisonPeriod') || 0);

					unit.setBy('xp', atk);

					return view.showDifferentUnitHealth({
						unit: enemyUnit,
						differentHealth: -atk
					});

				}).then(function () {

					var enemyUnitHealth = enemyUnit.get('health'),
						model = enemyUnit.get('model');

					if (enemyUnitHealth > 0) {

						if ( enemyUnit.canStrikeBack(unit) ) {

							view.showAttack({
								from: {
									x: enemyUnit.get('x'),
									y: enemyUnit.get('y')
								},
								to: {
									x: unit.get('x'),
									y: unit.get('y')
								}
							}).then(function () {

								var atk = enemyUnit.getAttackToUnit(unit);

								unit.setBy('health', -atk);

								enemyUnit.setBy('xp', atk);

								return view.showDifferentUnitHealth({
									unit: unit,
									differentHealth: -atk
								});

							}).then(function () {

								var unitHealth = unit.get('health'),
									model = unit.get('model');

								if ( unitHealth <= 0 ) {

									model.addGraveInsteadUnit(unit);
									//uni
									enemyUnit.autoSetLevel();
								} else {
									enemyUnit.autoSetLevel();
									unit.autoSetLevel();
								}

								enemyUnit.setBy('poisonCount', unit.get('poisonPeriod') || 0);

							});

						} else {
							log('-- can NOT strike BACK');
							enemyUnit.setBy('poisonCount', unit.get('poisonPeriod') || 0);
							unit.autoSetLevel();

						}

					} else {
						model.addGraveInsteadUnit(enemyUnit);
						log(' -- create grove for enemy unit');
						unit.autoSetLevel();
					}

				});


			//});


		},

		attackToBuilding: function (building) {

			var unit = this,
				view = unit.get('view');

			view.moveBack.clear();

			view.showAttack({
				from: {
					x: unit.get('x'),
					y: unit.get('y')
				},
				to: {
					x: building.x,
					y: building.y
				}
			}).then(function () {

				building.color = null;
				delete building.color;
				building.teamNumber = null;
				building.ownerId = null;
				delete building.ownerId;
				building.state = 'destroyed';

				view.redrawBuilding(building);

				unit.set('isActive', false);
				unit.setBy('xp', unit.get('atk').min);
				unit.autoSetLevel();
			});

		},

		undoMoveAction: function (data) {

			var unit = this,
				model = unit.get('model'),
				view = unit.get('view'),

				x = data.beforeX,
				y = data.beforeY;

			view
				.moveUnitTo({
					x: x,
					y: y,
					unit: data.unit
				})
				.done(function () {

					unit.set('x', x);
					unit.set('y', y);

					unit.set('didMove', false);

					var availableActions = unit.getAvailableActions();
					view.markActiveSquare({
						x: x,
						y: y
					});
					view.showAvailableActions(availableActions);
					model.set('availableActions', availableActions);

				});

		},

		confirmAttack: function (action) {

			this.attackToXy({
				attackX: action.x,
				attackY: action.y,
				confirmed: true
			});

		},

		undoAttack: function () {

			var unit = this,
				model = unit.get('model'),
				view = unit.get('view'),
				availableActions = unit.getAvailableActions();

			view.clearAvailableActions();
			model.clearAvailableActions();

			view.showAvailableActions(availableActions);
			model.set('availableActions', availableActions);

			view.markActiveSquare({
				x: unit.get('x'),
				y: unit.get('y')
			});

		},

		raise: function (action) {

			var unit = this,
				model = unit.get('model'),
				view = unit.get('view'),
				x = action.x,
				y = action.y,
				graves = model.get('graves'),
				grave = _.find(graves, { x: x, y: y }),
				newUnitData,
				newUnit;

			view.moveBack.clear();

			model.removeGrave(grave);
			view.removeGrave(grave);

			model.clearAvailableActions();
			view.clearAvailableActions();

			unit.set('isActive', false);

			newUnitData = {
				ownerId: unit.get('ownerId'),
				type: 'skeleton',
				x: x,
				y: y,
				teamNumber: unit.get('teamNumber'),
				color: unit.get('color')
			};

			newUnit = model.appendUnit(newUnitData);

			newUnit.set('isActive', false);

			view.updateStatusBar();

		},

		fixBuilding: function (action) {

			var unit = this,
				view = unit.get('view'),
				model = unit.get('model'),
				building = action.buildingToFix;

			view.moveBack.clear();

			unit.set('isActive', false);

			view.clearAvailableActions();
			model.clearAvailableActions();

			building.state = 'normal';
			view.redrawBuilding(building);

		},

		occupyBuilding: function (action) {

			var unit = this,
				view = unit.get('view'),
				model = unit.get('model'),
				building = action.buildingToOccupy;

			view.moveBack.clear();

			unit.set('isActive', false);

			view.clearAvailableActions();
			model.clearAvailableActions();

			building.color = unit.get('color');
			building.ownerId = unit.get('ownerId');
			building.teamNumber = unit.get('teamNumber');

			view.redrawBuilding(building);

			model.checkPlayerDefeat();
			model.checkEndMission();

		},

		healthUpByBuilding: function (building) {

			if ( !building ) {
				return;
			}

			var unit = this,
				unitTeamNumber = unit.get('teamNumber'),
				unitHealth = unit.get('health'),
				defaultHealth = unit.get('defaultHealth'),
				view = unit.get('view'),
				buildingType = building.type,
				buildingTeamNumber = building.teamNumber,

				deltaHealth = defaultHealth - unitHealth,
				buildingUpHealth = win.APP.building.list[buildingType].healthUp;

			deltaHealth = Math.min(deltaHealth, buildingUpHealth);

			if ( !deltaHealth ) {
				return;
			}

			switch (buildingType) {

				case 'well':
				case 'temple':
					unit.setBy('health', deltaHealth);
					view.showDifferentUnitHealth({
						unit: unit,
						differentHealth: deltaHealth
					});
					break;

				case 'castle':
				case 'farm':
					if ( unitTeamNumber === buildingTeamNumber ) {
						unit.setBy('health', deltaHealth);
						view.showDifferentUnitHealth({
							unit: unit,
							differentHealth: deltaHealth
						});
					}
					break;

			}

		},

		prepareToNextTurn: function () {

			var unit = this;

			// todo: see unit.setDefaultState();
			unit.set('isActive', true);
			unit.set('didMove', false);
			unit.set('didAttack', false);
			//unit.set('didRaise', false);
			//unit.set('poisonCount', false); // sen only by dire wolf or 'next turn'
			//unit.set('didPoison', false);
			//unit.set('underWispAura', false); // set only from wisp autoSetWispAura
			unit.set('gotBuilding', false);
			unit.set('fixedBuilding', false);

		},

		util: {
			getRandomBetween: function (start, end) {
				return Math.floor(Math.random() * (end - start + 1) + start);
			}
		}

	});




	function PathFinder(data) {

		this.attr = {};

		this.setAttributes(data);

		if ( !data.blackWholes ) {
			this.set('blackWholes', []);
		}

		this.set('availablePath', []);
		this.set('donePathPoints', []);

		this.setTerrainType();

	}

	win.APP.PathFinder = PathFinder;

	PathFinder.prototype = {

		set: function (key, value) {
			this.attr[key] = value;
			return value;
		},

		get: function (key) {
			return this.attr[key];
		},

		setAttributes: function (data) {
			var key;

			data = JSON.parse(JSON.stringify(data));

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					this.set(key, data[key]);
				}
			}
		},

		setTerrainType: function () {

			var terrain = this.get('terrain'),
				key;

			for (key in terrain) {
				if (terrain.hasOwnProperty(key)) {
					terrain[key] = win.APP.map.getTypeByTileName(terrain[key]);
				}
			}

		},

		getSquareByXY: function (x, y) {
			return this.get('terrain')['x' + x + 'y' + y];
		},

		getAvailablePath: function () {

			var availablePath,
				point = new PathFinderPoint({
					pathFinder: this,
					mov: this.get('mov'),
					x: this.get('x'),
					y: this.get('y')
				});

			availablePath = this.get('availablePath');

			// remove first xy with unit's xy
			availablePath.shift();

			this.set('availablePath', availablePath);

			return this.get('availablePath');

		},

		addCoordinatesToAvailablePath: function (data) {

			var isInPoints = false,
				x = data.x,
				y = data.y;

			this.get('availablePath').every(function (point) {

				if (point.x === x && point.y === y) {
					isInPoints = true;
					return false;
				}

				return true;

			});

			if (isInPoints) {
				return;
			}

			this.get('availablePath').push(data);

		},

		isInDonePoints: function (x, y, mov) {

			var isInDonePoints = false;

			this.get('donePathPoints').forEach(function (point) {
				if ( point.x === x && point.y === y && mov <= point.mov ) {
					isInDonePoints = true;
				}
			});

			return isInDonePoints;

		},

		addToDonePoints: function (x, y, mov) {

			if (this.isInDonePoints(x, y, mov)) {
				return;
			}

			this.get('donePathPoints').push({ x: x, y: y, mov: mov });
		}

	};


	function PathFinderPoint(data) {
		this.attr = data;
		this.run();
	}

	PathFinderPoint.prototype = {

		set: function (key, value) {
			this.attr[key] = value;
			return value;
		},

		get: function (key) {
			return this.attr[key];
		},

		run: function () {

			var x = this.get('x'),
				y = this.get('y'),
				xy2 = {x: x, y: y - 1},
				xy4 = {x: x - 1, y: y},
				xy6 = {x: x + 1, y: y},
				xy8 = {x: x, y: y + 1},
				mov = this.get('mov'),
				pathFinder = this.get('pathFinder');

			// this is in donePoints
			if ( pathFinder.isInDonePoints(x, y, mov) ) {
				return;
			}

			pathFinder.addToDonePoints(x, y, mov);

			// add current coordinates to parent
			pathFinder.addCoordinatesToAvailablePath({x: x, y: y});

			this.tryGoToSquare(xy4);
			this.tryGoToSquare(xy6);
			this.tryGoToSquare(xy2);
			this.tryGoToSquare(xy8);

		},

		tryGoToSquare: function (coordinates) {

			var x = coordinates.x,
				y = coordinates.y,
				mov = this.get('mov'),
				pathFinder = this.get('pathFinder'),
				minX = pathFinder.get('minX'),
				minY = pathFinder.get('minY'),
				maxX = pathFinder.get('maxX'),
				maxY = pathFinder.get('maxY'),
				blackWholes = pathFinder.get('blackWholes'),
				isRelativeTypeSpace = pathFinder.get('relativeTypeSpace'),
				squareType,
				unitMoveType,
				pathResistance = 1;

			// detect max and min xy
			if ( x > maxX || x < minX || y > maxY || y < minY ) {
				return;
			}

			// detect blackWholes
			if ( blackWholes.indexOf('x' + x + 'y' + y) !== -1 ) {
				return;
			}

			if (isRelativeTypeSpace) {

				squareType = pathFinder.getSquareByXY(x, y);
				unitMoveType = pathFinder.get('moveType');

				switch (unitMoveType) {
					case 'fly':
						pathResistance = 1;
						break;
					case 'flow':
						if (squareType === 'water') {
							pathResistance = win.APP.map.water.flowPathResistance;
						} else {
							pathResistance = win.APP.map[squareType].pathResistance;
						}
						break;
					default :
						pathResistance = win.APP.map[squareType].pathResistance;

				}

			}

			if ( mov >= pathResistance ) {
				new PathFinderPoint({
					pathFinder: pathFinder,
					mov: mov - pathResistance,
					x: x,
					y: y
				});
			}

		}

	};


}(window));