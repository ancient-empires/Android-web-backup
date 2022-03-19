/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window, setTimeout */
	/*global _, log, $ */

	function Cpu(json) { // model, player:'activePlayer'

		var cpu = this;
		cpu.attr = {};
		cpu.extend(json);

	}

	Cpu.prototype = {

		get: function (key) {
			return this.attr[key];
		},

		set: function (key, value) {
			this.attr[key] = value;
			return this;
		},

		extend: function (json) {
			_.extend(this.attr, json);
			return this;
		},

		rates: {
			severalBuildings: -20, // if unit can work with several buildings, reduce rate
			lowPriority: -1000,
			highPriority: 1000,
			killUnit: 40,
			destroyEnemyBuilding: 40,
			building: {
				castle: 100,
				farm: 0
			},

			q: {
				nearestNonOwnedBuilding: -1,
				placeArmor: 0.5,
				upHealth: 1,
				availableReceiveDamage: -0.1,
				listOccupyBuilding: 50
			},

			onHealthUpBuilding: 10
		},

		rates_hard: { // default rates
			severalBuildings: -20, // if unit can work with several buildings, reduce rate
			lowPriority: -1000,
			highPriority: 1000,
			killUnit: 40,
			destroyEnemyBuilding: 40,
			building: {
				castle: 100,
				farm: 0
			},

			q: {
				nearestNonOwnedBuilding: -1,
				placeArmor: 0.5,
				upHealth: 1,
				availableReceiveDamage: -0.1,
				listOccupyBuilding: 50
			},

			onHealthUpBuilding: 10
		},

		rates_normal: {
			severalBuildings: -20, // if unit can work with several buildings, reduce rate
			lowPriority: -1000,
			highPriority: 1000,
			killUnit: 40,
			destroyEnemyBuilding: 40,
			building: {
				castle: 100,
				farm: 0
			},

			q: {
				nearestNonOwnedBuilding: -1,
				placeArmor: 0, // dif
				upHealth: 1,
				availableReceiveDamage: -0.1,
				listOccupyBuilding: 50
			},

			onHealthUpBuilding: 0
		},

		rates_easy: {
			severalBuildings: 0, // if unit can work with several buildings, reduce rate
			lowPriority: -1000,
			highPriority: 1000,
			killUnit: 1000,
			destroyEnemyBuilding: 0,
			building: {
				castle: 0,
				farm: 0
			},

			q: {
				nearestNonOwnedBuilding: -1,
				placeArmor: -0.5,
				upHealth: 0,
				availableReceiveDamage: 0.1,
				listOccupyBuilding: 50
			},

			onHealthUpBuilding: 0
		},

		run: function () {

			var cpu = this;

			cpu.setRates();

			cpu.buyUnits();
			cpu.turnUnit();

		},

		setRates: function () {

			var cpu = this,
				difficult = win.APP.info.get('difficult');

			cpu.rates = cpu['rates_' + difficult];

		},

		runScenario: function (scenario) {

			var cpu = this,
				model = cpu.get('model'),
				view = model.get('view'),
				unit = scenario.get('unit'),
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				x = scenario.get('x'),
				y = scenario.get('y'),
				xy = {
					x: x,
					y: y
				};

			// see view.onClick
			view.markActiveSquare({
				x: unitX,
				y: unitY
			}); // {x: number, y: number}
			view.autoSetSquareInfo();
			view.centerToXY(xy);

			// show available actions
			view
				.showAvailableActions(unit.getAvailableActions())
				// move if needed
				.then(function () {

					var deferred = $.Deferred();

					if ( unitX !== x || unitY !== y ) {

						view.markActiveSquare(xy); // {x: number, y: number}
						view.autoSetSquareInfo();

						unit.moveTo({
								x: x,
								y: y,
								type: 'move',
								unit: unit,
								confirmed: true
							})
							.then(function () {
								deferred.resolve();
							});
					} else {
						deferred.resolve();
					}

					return deferred.promise();

				})
				// after move
				.then(function () {

					setTimeout(function () {
						cpu.runScenarioAction(scenario);
					}, win.APP.info.actionTime());

				});

		},

		runScenarioAction: function (scenario) {

			var cpu = this,
				model = cpu.get('model'),
				action = scenario.get('action'),
				x = scenario.get('x'),
				y = scenario.get('y'),
				xy = {
					x: x,
					y: y
				},
				unit = scenario.get('unit'),
				actionName = scenario.get('action').name,
				q = 1;

			switch (actionName) {

				case 'move':

					// do nothing, move was in past step

					unit.set('isActive', false);

					break;

				case 'attack':

					unit.attackToXy({
						attackX: action.enemy.x,
						attackY: action.enemy.y
					});

					q = 4;

					break;

				case 'fixBuilding':

					unit.fixBuilding({
						buildingToFix: model.getBuildingByXY(xy)
					});

					break;

				case 'getBuilding':

					unit.occupyBuilding({
						buildingToOccupy: model.getBuildingByXY(xy)
					});

					break;

				case 'raiseSkeleton':

					unit.raise({
						x: action.grave.x,
						y: action.grave.y
					});

					break;

			}

			setTimeout(function () {
				cpu.turnUnit();
			}, win.APP.info.actionTime() * q);

		},

		buyUnits: function () {

			// 1 - detect castle closest to enemy castle
			var cpu = this,
				model = cpu.get('model'),
				player = cpu.get('player'),
				playerMoney = player.money,
				activePlayer = model.get('activePlayer'),
				teamNumber = activePlayer.teamNumber,
				allUnits = model.get('units'),
				enemyUnits,
				unitsBuyList,
				unitList,
				enemyUnitsGetAvailableBuildings = [],
				enemyUnitsAvailablePath = [],
				stores = cpu.getStores(),
				store = cpu.getStore(),
				needToCoverStores = [];

			if ( !store ) { // no store, no units ))
				return;
			}

			// buy commander if needed and can
			// buy commander, or no any buy
			cpu.buyUnit({
				store: store,
				type: player.commander.name
			});

			// detect enemy can stay on castle
			enemyUnits = _.filter(allUnits, function (unit) {
				return unit.get('teamNumber') !== teamNumber;
			});

			_.each(enemyUnits, function (enemy) {
				_.each( enemy.getAvailablePathWithTeamUnit(), function (xy) {
					return _.find(enemyUnitsAvailablePath, xy) || enemyUnitsAvailablePath.push(xy);
				});
			});

			_.each(enemyUnitsAvailablePath, function (enemyXY) {
				var coveredStore = _.find(stores, enemyXY);
				return coveredStore && needToCoverStores.push(coveredStore);
			});


			if (needToCoverStores.length) {
				playerMoney = player.money;
				unitList = win.APP.unitMaster.list;
				unitsBuyList = [
					{
						type: 'soldier',
						cost: unitList.soldier.cost
					},
					{
						type: 'archer',
						cost: unitList.archer.cost
					},
					{
						type: 'golem',
						cost: unitList.golem.cost
					}
				];

				_.each(needToCoverStores, function (store) {

					// detect the most expensive unit from list
					var buyUnit;
					_.each(unitsBuyList, function (unitData) {
						buyUnit = unitData.cost <= playerMoney ? unitData : buyUnit;
					});

					if (buyUnit) {
						cpu.buyUnit({
							store: store,
							type: buyUnit.type
						});
					}

				});
			}

			if ( !model.playerHasCommander(player) ) {
				return;
			}

			// buy next needed unit, called him self
			cpu.buyNextUnit({
				store: store
			});

		},

		buyNextUnit: function (data) {
			var cpu = this,
				util = win.APP.util,
				assortArray = util.assortArray,
				model = cpu.get('model'),
				player = cpu.get('player'),
				units = model.getUnitsByOwnerId(player.id),
				unitLimit = model.get('unitLimit'),
				unitTypeToBuy,
				unitMaster = win.APP.unitMaster,
				unitCounts = [
					{ type: 'soldier', 		count: 2, currentCount: 0 },
					{ type: 'archer',		count: 2, currentCount: 0 }
					//{ type: 'sorceress', 	count: 1, currentCount: 0 }
					//{ type: 'golem',	 	count: 1, currentCount: 0 },
					//{ type: 'dire-wolf',	count: 1, currentCount: 0 }
				],
				otherUnits = [];

			otherUnits.push('soldier', 'archer', 'catapult');
			otherUnits.push('sorceress', 'golem', 'dire-wolf', 'dragon');
			otherUnits.push('sorceress', 'golem', 'dire-wolf', 'dragon');

			if (cpu.detectCanButWaterUnits(data)) {
				otherUnits.push('elemental', 'elemental');
			}

			unitCounts = assortArray(unitCounts);

			if ( model.isUnitsTooMuch() ) {
				log('too much units CPU');
				return;
			}

			// do not buy if limit exceed
			if ( unitLimit <= units.length) {
				return;
			}

			_.each(unitCounts, function (data) {

				_.each(units, function (unit) {
					if ( unit.get('type') === data.type ) {
						data.currentCount += 1;
					}
				});

			});

			_.each(unitCounts, function (data) {
				if ( data.currentCount < data.count && !unitTypeToBuy ) {
					unitTypeToBuy = data.type;
				}
			});

			if ( unitTypeToBuy && unitMaster.list[unitTypeToBuy].cost <= player.money ) {
				cpu.buyUnit({
					store: data.store,
					type: unitTypeToBuy
				});
				cpu.buyNextUnit({
					store: data.store
				});
				return;
			}

			unitTypeToBuy = win.APP.util.assortArray(otherUnits)[0];

			if ( unitTypeToBuy && unitMaster.list[unitTypeToBuy].cost <= player.money ) {
				cpu.buyUnit({
					store: data.store,
					type: unitTypeToBuy
				});
				cpu.buyNextUnit({
					store: data.store
				});
				return;
			}


			log('buy other units');

			// buy other units




		},

		detectCanButWaterUnits: function (data) {

			var cpu = this,
				model = cpu.get('model'),
				map = model.get('map'),
				terrain = map.terrain,
				store = data.store,
				x0 = store.x,
				y0 = store.y,
				storeField = ['store', 'x', x0, 'y', y0, 'can-buy-water-unit'].join('-'),
				cachedValue = cpu.get(storeField),
				isWater = false,
				PathFinder = win.APP.PathFinder,
				unitMasterElemental = win.APP.unitMaster.list.elemental,
				pathFinder,
				path;

			if (cachedValue !== undefined) {
				return cachedValue;
			}

			pathFinder = new PathFinder({
				terrain: terrain,
				mov: unitMasterElemental.mov,
				x: store.x,
				y: store.y,
				moveType: unitMasterElemental.moveType,
				minX: 0,
				minY: 0,
				maxX: map.size.width - 1,
				maxY: map.size.height - 1,
				relativeTypeSpace: true
			});

			path = pathFinder.getAvailablePath();

			_.each(path, function (xy) {
				if (!isWater) {
					isWater = (terrain[['x', xy.x, 'y', xy.y].join('')] || '').indexOf('water-') === 0;
				}
			});

			cpu.set(storeField, isWater);

			return isWater;

		},

		getStore: function () {

			var cpu = this,
				util = win.APP.util,
				model = cpu.get('model'),
				units = model.get('units'),
				player = cpu.get('player'),
				teamNumber = player.teamNumber,
				ownerId = player.id,
				buildings = model.get('buildings'),
				unitData = win.APP.unitMaster,
				commandersList = unitData.commanderList,
				pairs,
				enemyCommanders = _.filter(units, function (unit) {
					return unit.get('teamNumber') !== teamNumber && _.contains(commandersList, unit.get('type'));
				}),
				enemyStores = _.filter(buildings, function (building) {
					return building.canBeStore && building.teamNumber !== teamNumber && building.teamNumber !== null;
				}),
				stores = _.where(buildings, { ownerId: ownerId, canBeStore: true });

			if ( !stores.length ) {
				return false;
			}

			if ( enemyCommanders.length ) {
				pairs = [];
				_.each(enemyCommanders, function (unit) {
					_.each(stores, function (store) {
						pairs.push({
							unit: unit,
							store: store,
							pathSize: util.getPathSize(store, {
								x: unit.get('x'),
								y: unit.get('y')
							})
						});
					});
				});

				pairs = pairs.sort(function (a, b) {
					return a.pathSize - b.pathSize;
				});

				log('-- before stores ');
				log(pairs);

				return pairs[0].store;

			}

			if ( enemyStores.length ) {
				pairs = [];

				_.each(enemyStores, function (enemyStore) {
					_.each(stores, function (store) {
						pairs.push({
							store: store,
							pathSize: util.getPathSize(store, enemyStore)
						});
					});
				});

				pairs = pairs.sort(function (a, b) {
					return a.pathSize - b.pathSize;
				});

				log('-- no commanders');
				log(pairs);
				return pairs[0].store;

			}

			// it non reach code, if enemyCommanders.length === 0 and enemyStores.length === 0 -> end game
			return stores[0];

		},

		getStores: function () {

			var cpu = this,
				model = cpu.get('model'),
				player = cpu.get('player'),
				ownerId = player.id,
				buildings = model.get('buildings');

			return _.where(buildings, { ownerId: ownerId, canBeStore: true });

		},

		buyUnit: function (data) {

			var cpu = this,
				model = cpu.get('model'),
				unitType = data.type,
				store = data.store,
				unitStore = win.APP.BB.UnitStoreView.prototype;

			unitStore.buyUnit({
				state: 'cpu',
				view: model.get('view'),
				model: model,
				player: cpu.get('player'),
				unitType: unitType,
				x: store.x,
				y: store.y
			});

		},

		turnUnit: function () {

			if ( this.get('model').get('isEndGame') ) {
				log('end game from CPU');
				return;
			}

			var cpu = this,
				rates = cpu.rates,
				model = cpu.get('model'),
				player = cpu.get('player'),
				privateUnits = model.getUnitsByOwnerId(player.id),
				scenarios = [],
				coverBuildingScenarios,
				lowPriorityScenarios = [],
				highPriorityScenarios = [],
				firstCoverBuildingScenarioCount,
				scenarioIsDone = false;

			// get ALL scenarios, except nonActive units
			_.each(privateUnits, function (unit) {

				if ( !unit.get('isActive') ) {
					return;
				}

				var scenario = cpu.getUnitScenarios(unit);
				scenarios = scenarios.concat(scenario);

			});

			_.each(scenarios, function (scenario) {
				cpu.setAutoRate(scenario, scenarios);
			});

			_.each(scenarios, function (scenario) {

				var actionName = scenario.get('action').name;

				if ( actionName === 'move' ) {
					lowPriorityScenarios.push(scenario);
				} else {
					highPriorityScenarios.push(scenario);
				}

			});

			// reRate move
			_.each(lowPriorityScenarios, function (lowPriorityScenario) {

				_.each(highPriorityScenarios, function (sc) {
					var action = sc.get('action'),
						grave,
						x = lowPriorityScenario.get('x'),
						y = lowPriorityScenario.get('y'),
						scX = sc.get('x'),
						scY = sc.get('y'),
						isTheSamePlace = (scX === x && scY === y),
						building;

					// if this move disturbs other scenarios
					switch (action.name) {
						case 'fixBuilding':
						case 'getBuilding':
							if ( isTheSamePlace ) {
								lowPriorityScenario.set('rate', rates.lowPriority);
							}
							break;
						case 'raiseSkeleton':
							grave = action.grave;
							if ( isTheSamePlace || (grave.x === x && grave.y === y) ) {
								lowPriorityScenario.set('rate', rates.lowPriority);
							}
							break;
						case 'attack':
							if ( sc.get('rate') === rates.lowPriority && isTheSamePlace ) {

								building = model.getBuildingByXY({x: x, y: y});
								if ( building ) { // stay on building
									lowPriorityScenario.set('rate', rates.highPriority);
								} else { // other cases
									lowPriorityScenario.set('rate', rates.lowPriority);
								}

							}
							break;
					}

				});

			});

			 _.each(scenarios, function (scenario) {
				 cpu.setAutoAvailableByPosition(scenario); // detect available position
				 cpu.setAutoAvailableByRaiseSkeleton(scenario); // detect raise skeleton
			 });

			cpu.detectScenarioCanCoverBuilding(scenarios);

			scenarios = _.filter(scenarios, function (scenario) {
				return scenario.get('isAvailable') && scenario.get('rate') !== rates.lowPriority;
			});

			cpu.setAutoRateBuildingWork(scenarios);

			if ( !scenarios.length ) {
				model.newTurn();
				return;
			}

			// find get building - 1
			// find raise skeleton - 2
			// find attack - 3
			// find fix building - 4
			// find move - 5

			coverBuildingScenarios = _.filter(scenarios, function (scenario) {
				return scenario.get('coverBuildingCount') > 0;
			});

			if (coverBuildingScenarios.length) {
				coverBuildingScenarios = coverBuildingScenarios.sort(function (sc1, sc2) {
					return sc2.get('coverBuildingCount') - sc1.get('coverBuildingCount');
				});

				firstCoverBuildingScenarioCount = coverBuildingScenarios[0].get('coverBuildingCount');

				scenarios = _.filter(coverBuildingScenarios, function (sc) {
					return firstCoverBuildingScenarioCount === sc.get('coverBuildingCount');
				});

			}

			_.each(['getBuilding', 'raiseSkeleton', 'attack', 'fixBuilding', 'move'], function (scenarioType) {

				if ( scenarioIsDone ) {
					return;
				}

				var filteredScenarios = _.filter(scenarios, function (scenario) {
						return scenario.get('action').name === scenarioType;
					}),
					noStrikeBack,
					killUnitAttack,
					poisonAttack,
					moveHp40Plus,
					nullAvailableReceiveDamage,
					gameDifficult = win.APP.info.get('difficult');

				if ( !filteredScenarios.length ) {
					return;
				}

				switch (scenarioType) {

					case 'getBuilding':

						_.each(filteredScenarios, function (scenarion) {

							var building = scenarion.get('action').building,
								addedRate = rates.building[building.type];

							scenarion.changeBy('rate', addedRate);

						});

						filteredScenarios = filteredScenarios.sort(function (sc1, sc2) {
							return sc2.get('rate') - sc1.get('rate');
						});

						break;

					case 'raiseSkeleton':

						_.each(filteredScenarios, function (scenario) {

							var dataByPosition = scenario.get('dataByPosition'),
								placeArmor = dataByPosition.placeArmor,
								availableReceiveDamage = dataByPosition.availableReceiveDamage,
								onHealthUpBuilding = dataByPosition.onHealthUpBuilding;

							if (availableReceiveDamage) {
								scenario.changeBy('rate', placeArmor + onHealthUpBuilding + availableReceiveDamage * rates.q.availableReceiveDamage);
							}

						});

						filteredScenarios = filteredScenarios.sort(function (sc1, sc2) {
							return sc2.get('rate') - sc1.get('rate');
						});

						break;

					case 'attack':

						// detect attack with / without strike back
						noStrikeBack = [];
						poisonAttack = [];

						// try to find poison attack
						_.each(filteredScenarios, function (scenario) {
							return scenario.get('isPoisonAttack') && poisonAttack.push(scenario);
						});

						if (poisonAttack.length) { // find poison attack
							filteredScenarios = poisonAttack;
						} else { // find no strike back attack

							_.each(filteredScenarios, function (scenario) {
								return scenario.get('availableResponseDamage') || noStrikeBack.push(scenario);
							});

							if (noStrikeBack.length) {
								filteredScenarios = noStrikeBack;
							}

						}

						_.each(filteredScenarios, function (scenario) {

							var dataByPosition = scenario.get('dataByPosition'),
								placeArmor = dataByPosition.placeArmor,
								availableReceiveDamage = dataByPosition.availableReceiveDamage,
								onHealthUpBuilding = dataByPosition.onHealthUpBuilding;

							if (availableReceiveDamage) {
								scenario.changeBy('rate', placeArmor + onHealthUpBuilding + availableReceiveDamage * rates.q.availableReceiveDamage - scenario.get('availableResponseDamage'));
							}

						});

						filteredScenarios = filteredScenarios.sort(function (sc1, sc2) {
							return sc2.get('rate') - sc1.get('rate');
						});

						// detect kill several unit
						if (filteredScenarios[0].get('killUnit')) {

							killUnitAttack = [];

							_.each(filteredScenarios, function (scenario) {
								return scenario.get('killUnit') && killUnitAttack.push(scenario);
							});


							//todo: add kill unit on the farm/town at first queue

							killUnitAttack = killUnitAttack.sort(function (sc1, sc2) {
								var scs = [sc1, sc2].map(function (sc) {
									var enemyUnit = cpu.get('model').getUnitByXY(sc.get('action').enemy);
									return enemyUnit.get('cost') + enemyUnit.get('health');
								});
								return scs[1] - scs[0];
							});

							filteredScenarios = killUnitAttack;

						}

						break;

					case 'fixBuilding':

						filteredScenarios = filteredScenarios.sort(function (sc1, sc2) {
							return sc2.get('rate') - sc1.get('rate');
						});

						break;

					case 'move':

						_.each(filteredScenarios, function (scenario) {

							var dataByPosition = scenario.get('dataByPosition'),
								placeArmor = dataByPosition.placeArmor,
								availableReceiveDamage = dataByPosition.availableReceiveDamage,
								onHealthUpBuilding = dataByPosition.onHealthUpBuilding;

							if (availableReceiveDamage) {
								scenario.changeBy('rate', placeArmor + onHealthUpBuilding + availableReceiveDamage * rates.q.availableReceiveDamage);
							}

						});

						// find scenarios with unit.hp > 40
						if ( gameDifficult !== 'easy' && (model.playerHasCastle(player) || model.playerHasCommander(player) || gameDifficult === 'hard' || (gameDifficult === 'normal' && Math.random() > 0.5 )) ) { // if mission has no buildings

							moveHp40Plus = _.filter(filteredScenarios, function (scenario) {

								var unit = scenario.get('unit'),
									health = unit.get('health'),
									onHealthUpBuilding = scenario.get('dataByPosition').onHealthUpBuilding;

								// try to save commander
								if ( unit.isCommander() ) {
									return health > 80 || (health > 60 && onHealthUpBuilding);
								} else {
									return health > 40 || onHealthUpBuilding;
								}

							});

							if (moveHp40Plus.length) { // find scenario for normal move

								filteredScenarios = moveHp40Plus.sort(function (sc1, sc2) {

									var unit1 = sc1.get('unit'),
										unit2 = sc2.get('unit'),
										length1 = (unit1.get('listOccupyBuilding') || []).length * rates.q.listOccupyBuilding,
										length2 = (unit2.get('listOccupyBuilding') || []).length * rates.q.listOccupyBuilding;

									return (sc2.get('rate') + length1) - (sc1.get('rate') + length2);

								});

							} else { // retreat scenarios

								// find min Available Receive Damage
								nullAvailableReceiveDamage = _.filter(filteredScenarios, function (sc) {
									return !sc.get('dataByPosition').availableReceiveDamageWithPath;
								});

								if ( nullAvailableReceiveDamage.length ) { // if nullAvailableReceiveDamage is exist

									// find nearest heals up building
									_.each(nullAvailableReceiveDamage, function (sc) {
										cpu.rateMoveToHealthUp({
											scenario: sc
										});
									});

									filteredScenarios = nullAvailableReceiveDamage.sort(function (sc1, sc2) {
										return sc2.get('rate') - sc1.get('rate');
									});

								} else {
									filteredScenarios = filteredScenarios.sort(function (sc1, sc2) {
										return sc1.get('dataByPosition').availableReceiveDamageWithPath - sc2.get('dataByPosition').availableReceiveDamageWithPath;
									});
								}

							}

						} else {

							filteredScenarios = filteredScenarios.sort(function (sc1, sc2) {

								var unit1 = sc1.get('unit'),
									unit2 = sc2.get('unit'),
									length1 = (unit1.get('listOccupyBuilding') || []).length * rates.q.listOccupyBuilding,
									length2 = (unit2.get('listOccupyBuilding') || []).length * rates.q.listOccupyBuilding;

								return (sc2.get('rate') + length1) - (sc1.get('rate') + length2);

							});
						}

						break;

				}

				scenarioIsDone = true;
				cpu.runScenario( filteredScenarios[0] );

			});

		},

		// getting action of unit
		getUnitScenarios: function (unit) {

			var cpu = this,
				availableXYs = cpu.getAvailableUnitXYs(unit),
				scenarios = [];

			_.each(availableXYs, function (xy) {

				var xyScenarios = cpu.getUnitScenariosByXY({
					x: xy.x,
					y: xy.y,
					unit: unit
				});

				scenarios = scenarios.concat(xyScenarios);

			});

			return scenarios;

		},

		getAvailableUnitXYs: function (unit) {

			var cpu = this,
				model = cpu.get('model'),
				fullPath = unit.getAvailablePathWithTeamUnit(),
				restPath,
				units = model.get('units');

			restPath = _.filter(fullPath, function (xy) {

				var unit = model.getUnitByXY(xy);

				if ( !unit ) {
					return true;
				}

				return unit.get('isActive');

			});

			restPath.push({
				x: unit.get('x'),
				y: unit.get('y')
			});

			return restPath;

		},

		getUnitScenariosByXY: function (data) {

			var cpu = this,
				model = cpu.get('model'),
				x = data.x,
				y = data.y,
				unit = data.unit,
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				gravesToRaise,
				scenarios = [],
				actionList = ['move', 'attack', 'fixBuilding', 'getBuilding', 'raiseSkeleton'],
				Scenario = win.APP.Scenario;

			unit.silentOn('x', 'y');
			unit.set('x', x);
			unit.set('y', y);

			_.each(actionList, function (action) {

				var scenario,
					unitsUnderAttack,
					buildingToGet,
					buildingToFix;

				switch (action) {

					case 'move':

						scenario = new Scenario({
							x: x,
							y: y,
							unit: unit,
							action: {
								name: action
							}
						});

						scenarios.push(scenario);
						break;

					case 'attack':

						// todo: add IF for cristal, cristal can not attack - needless for CPU

						if ( !(unit.get('canNotActionAfterMove') && ( unitX !== x || unitY !== y )) ) { // detect moved catapult

							unitsUnderAttack = unit.getUnitsUnderAttack();

							_.each(unitsUnderAttack, function (enemyUnitXY) {

								var scenario = new Scenario({
									x: x,
									y: y,
									unit: unit,
									action: {
										name: action,
										enemy: {
											x: enemyUnitXY.x,
											y: enemyUnitXY.y
										}
									}
								});

								scenarios.push(scenario);

							});

						}


						break;

					case 'fixBuilding':

						buildingToFix = unit.getBuildingToFix();

						if (buildingToFix) {

							scenario = new Scenario({
								x: x,
								y: y,
								unit: unit,
								action: {
									name: action
								}
							});

							scenarios.push(scenario);

						}

						break;

					case 'getBuilding':

						// detect can unit get this building
						buildingToGet = unit.getBuildingToOccupy();

						if ( buildingToGet && buildingToGet.teamNumber !== unit.get('teamNumber') ) {

							scenario = new Scenario({
								x: x,
								y: y,
								unit: unit,
								action: {
									name: action,
									building: {
										type: buildingToGet.type
									}
								}
							});

							scenarios.push(scenario);

						}

						break;

					case 'raiseSkeleton':

						gravesToRaise = unit.getGravesToRaise();

						_.each(gravesToRaise, function (grave) {

							var scenario = new Scenario({
								x: x,
								y: y,
								unit: unit,
								action: {
									name: action,
									grave: {
										x: grave.x,
										y: grave.y
									}
								}
							});

							scenarios.push(scenario);

						});

						break;

				}

			});

			unit.set('x', unitX);
			unit.set('y', unitY);
			unit.silentOff('x', 'y');

			return scenarios;

		},

		setAutoAvailableByRaiseSkeleton: function (scenario) {

			var cpu = this,
				model = cpu.get('model'),
				action = scenario.get('action'),
				unit = scenario.get('unit'),
				x = scenario.get('x'),
				y = scenario.get('y'),
				xy = {
					x: x,
					y: y
				},
				actionName = action.name,
				unitOnXY = model.getUnitByXY(xy),
				isUnitOnXY = unitOnXY && unitOnXY !== unit,
				graveXY,
				unitOnGraveXY,
				isUnitOnGraveXY;

			// raise
			if ( actionName === 'raiseSkeleton' ) {
				graveXY = action.grave;
				unitOnGraveXY = model.getUnitByXY(graveXY);
				isUnitOnGraveXY = unitOnGraveXY && unitOnGraveXY !== unit;
				if ( isUnitOnXY || isUnitOnGraveXY ) {
					scenario.set('isAvailable', false);
				}
			}


		},

		setAutoAvailableByPosition: function (scenario) {
			var cpu = this,
				model = cpu.get('model'),
				unit = scenario.get('unit'),
				x = scenario.get('x'),
				y = scenario.get('y'),
				xy = {
					x: x,
					y: y
				},
				unitOnXY = model.getUnitByXY(xy),
				isUnitOnXY = unitOnXY && unitOnXY !== unit;

			scenario.set('isAvailable', !isUnitOnXY);

		},

		setAutoRate: function (scenario, allScenarios) {

			var cpu = this,
				action = scenario.get('action'),
				actionName = action.name,
				xy = {
					x: scenario.get('x'),
					y: scenario.get('y')
				},
				util = win.APP.util,
				unit = scenario.get('unit'),
				rates = cpu.rates,
				rate = 0;

			cpu.insertDataByPosition(scenario);

			switch (actionName) {

				case 'move':

					rate = cpu.rateMove({ // usually move rate is <0
						scenario: scenario,
						allScenarios: allScenarios
					});

					break;

				case 'attack':

					rate = cpu.rateAttack({
						scenario: scenario
					});

					break;

				case 'fixBuilding':
				case 'getBuilding':
				case 'raiseSkeleton':

					rate = rates.highPriority - util.getPathSize(xy, {x: unit.get('x'), y: unit.get('y')});

					break;

			}

			scenario.set('rate', rate);

		},

		setAutoRateBuildingWork: function (scenarios) {

			var cpu = this,
				unitWithScenarios = [];

			// detect unit can fix or build 2 and more buildings
			// create array with unit has all own scenarios
			_.each(scenarios, function (scenario) {
				var unit = scenario.get('unit'),
					unitWithScenario = _.find(unitWithScenarios, { unit: unit });

				if ( unitWithScenario ) {
					unitWithScenario.scenarios.push(scenario);
				} else {
					unitWithScenarios.push({
						unit: unit,
						scenarios: [scenario],
						getBuildingCount: 0,
						fixBuildingCount: 0
					});
				}
			});

			_.each(unitWithScenarios, function (unitWithScenario) {
				var scenarios = unitWithScenario.scenarios;
				_.each(scenarios, function (scenario) {
					var actionName = scenario.get('action').name;
					switch ( actionName ){
						case 'fixBuilding':
							unitWithScenario.fixBuildingCount += 1;
							break;
						case 'getBuilding':
							unitWithScenario.getBuildingCount += 1;
							break;
					}
				});
			});

			_.each(unitWithScenarios, function (unitWithScenario) {
				var scenarios = unitWithScenario.scenarios,
					severalBuildings = cpu.rates.severalBuildings,
					fixBuildingCount = unitWithScenario.fixBuildingCount,
					getBuildingCount = unitWithScenario.getBuildingCount;
				_.each(scenarios, function (scenario) {
					var actionName = scenario.get('action').name,
						rate = scenario.get('rate');

					switch ( actionName ) {
						case 'fixBuilding':
							scenario.set('rate', rate + severalBuildings * fixBuildingCount);
							break;
						case 'getBuilding':
							scenario.set('rate', rate + severalBuildings * getBuildingCount);
							break;
					}

				});
			});

		},

		detectScenarioCanCoverBuilding: function (scenarios) {

			var cpu = this,
				model = cpu.get('model'),
				activePlayer = model.get('activePlayer'),
				teamNumber = activePlayer.teamNumber,
				allUnits = model.get('units'),
				enemyUnits,
				teamUnits,
				buildings = model.get('buildings'),
				enemyUnitsGetAvailableBuildingsFull;

			enemyUnits = _.filter(allUnits, function (unit) {
				return unit.get('teamNumber') !== teamNumber;
			});

			teamUnits = _.filter(allUnits, function (unit) {
				return unit.get('teamNumber') === teamNumber;
			});

			function getXyBuildingToEnemyGet(dataArg) {

				var data = dataArg || {},
					enemyUnitsGetAvailableBuildings = [];

				// detect building which can be got by enemy
				_.each(enemyUnits, function (enemy) {

					var cachedMoveField = ['move', enemy.get('type'), 'x', enemy.get('x'), 'y', enemy.get('y')].join('-'),
						cachedAvailableMoveMap = cpu.get(cachedMoveField),
						availableMoveMap,
						enemyTeamNumber = enemy.get('teamNumber'),
						listOccupyBuilding = enemy.get('listOccupyBuilding') || [],
						enemyXY = {
							x: enemy.get('x'),
							y: enemy.get('y')
						},
						blackWholesXYs,
						isBlackWholeInCachedAvailableMoveMap = false;

					if ( _.find(data.killUnitsXY, enemyXY) ) {
						return;
					}

					if ( !listOccupyBuilding.length ) { // detect units who can get buildings
						return;
					}

					if (data.blackWholes) {

						if ( cachedAvailableMoveMap ) {
							blackWholesXYs = data.blackWholesXYs;
							_.each(cachedAvailableMoveMap, function (xy) {
								return isBlackWholeInCachedAvailableMoveMap || (isBlackWholeInCachedAvailableMoveMap = _.find(blackWholesXYs, xy));
							});
							availableMoveMap = isBlackWholeInCachedAvailableMoveMap ? enemy.getAvailablePathFull(data) : cachedAvailableMoveMap;
						} else {
							availableMoveMap = enemy.getAvailablePathFull(data);
						}

					} else {
						// try to get available path map from cache
						if ( cachedAvailableMoveMap ) {
							availableMoveMap = cachedAvailableMoveMap;
						} else {
							availableMoveMap = enemy.getAvailablePathFull();
							cpu.set(cachedMoveField, availableMoveMap);
						}
					}

					_.each(availableMoveMap, function (moveXY) {

						var building = _.find(buildings, moveXY);

						if ( !building ) { // if no building
							return;
						}

						if ( listOccupyBuilding.indexOf(building.type) === -1 ) { // if building is not in occupy list
							return;
						}

						if ( building.teamNumber === enemyTeamNumber ) { // enemy not reason get own building twice
							return;
						}

						if ( !_.find(enemyUnitsGetAvailableBuildings, moveXY) ) {
							enemyUnitsGetAvailableBuildings.push(moveXY);
						}

					});

				});

				return enemyUnitsGetAvailableBuildings;

			}

			enemyUnitsGetAvailableBuildingsFull = getXyBuildingToEnemyGet();

			// mark scenarios which cover building which can be got by enemy
			//_.each(scenarios, function (scenario) {
			//	// detect scenario where unit can raise skeleton
			//	var action = scenario.get('action'),
			//		x = scenario.get('x'),
			//		y = scenario.get('y'),
			//		grave = action.grave,
			//		buildingXY = _.find(enemyUnitsGetAvailableBuildings, {x: x, y: y}) || (grave && _.find(enemyUnitsGetAvailableBuildings, grave));
			//
			//	if ( buildingXY && !_.find(coveringBuilding, buildingXY) ) {
			//		coveringBuilding.push(buildingXY);
			//		//scenario.set('coverBuilding', true);
			//	}
			//
			//});

			// если у юнита есть сценарии при котором захваченных зданий меньше чем coveringBuilding, то те сценарии где мньше, сетаем как 'coverBuilding' true
			_.each(teamUnits, function (unit) {

				var unitScenarios = _.filter(scenarios, function (scenario) {
						return scenario.get('unit') === unit;
					}),
					otherTeamUnits = _.filter(teamUnits, function (teamUnit) {
						return teamUnit !== unit;
					}),
					teamBlackWholes = _.map(otherTeamUnits, function (teamUnit) {
						return {
							x: teamUnit.get('x'),
							y: teamUnit.get('y')
						}
					});

				_.each(unitScenarios, function (unitScenario) {

					var blackWholes = JSON.parse(JSON.stringify(teamBlackWholes)),
						action = unitScenario.get('action'),
						x = unitScenario.get('x'),
						y = unitScenario.get('y'),
						grave = action.grave,
						enemyUnitsGetAvailableBuildingsByScenario,
						killUnitsXY = [],
						blackWholesStrings;

					if ( action.name === 'attack' && unitScenario.get('killUnit') ) {
						killUnitsXY.push(action.enemy);
					}

					blackWholes.push({
						x: unitScenario.get('x'),
						y: unitScenario.get('y')
					});

					if (grave) {
						blackWholes.push(grave);
					}

					blackWholesStrings = _.map(blackWholes, function (xy) {
						return ['x', xy.x, 'y', xy.y].join('');
					});

					enemyUnitsGetAvailableBuildingsByScenario = getXyBuildingToEnemyGet({
						blackWholes: blackWholesStrings,
						blackWholesXYs: blackWholes,
						killUnitsXY: killUnitsXY
					});

					unitScenario.set('coverBuildingCount', enemyUnitsGetAvailableBuildingsFull.length - enemyUnitsGetAvailableBuildingsByScenario.length);

				});

			});

		},
		
		insertDataByPosition: function (scenario) {

			var cpu = this,
				rates = cpu.rates,
				model = cpu.get('model'),
				allUnits = model.get('units'),
				unit = scenario.get('unit'),
				x = scenario.get('x'),
				y = scenario.get('y'),
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				unitTeamNumber = unit.get('teamNumber'),
				enemyUnits,
				availableReceiveDamage = 0, // +
				availableReceiveDamageWithPath = 0, // +
				placeArmor, // +
				upHealth = 0, // ---
				building,
				buildingData = win.APP.building,
				buildingUpHealthList = buildingData.upHealthList,
				buildingList = buildingData.list,
				onHealthUpBuilding = 0,
				onEnemyBuilding = false,
				onTeamBuilding = false,
				onFreeBuilding = false,
				onBuilding = false;

			unit.silentOn('x', 'y');
			unit.set('x', x);
			unit.set('y', y);

			enemyUnits = _.filter(allUnits, function (unit) {
				return unit.get('teamNumber') !== unitTeamNumber;
			});

			_.each(enemyUnits, function (enemy) {

				// try to get available attack map from cache
				var cachedAttackField = ['attack', enemy.get('type'), 'x', enemy.get('x'), 'y', enemy.get('y')].join('-'),
					cachedAvailableAttackMap = cpu.get(cachedAttackField),
					availableAttackMap,
					cachedAttackFieldWithPath = ['attack-with-path', enemy.get('type'), 'x', enemy.get('x'), 'y', enemy.get('y')].join('-'),
					cachedAvailableAttackMapWithPath = cpu.get(cachedAttackFieldWithPath),
					availableAttackMapWithPath;

				if (cachedAvailableAttackMap) {
					availableAttackMap = cachedAvailableAttackMap;
				} else {
					availableAttackMap = enemy.getAvailableAttackMap();
					cpu.set(cachedAttackField, availableAttackMap);
				}

				if (_.find(availableAttackMap, {x: x, y: y})) {
					availableReceiveDamage += enemy.getAttackToUnit(unit, {average: true});
				}

				// with path
				if (cachedAvailableAttackMapWithPath) {
					availableAttackMapWithPath = cachedAvailableAttackMapWithPath;
				} else {
					availableAttackMapWithPath = enemy.getAvailableAttackMapWithPath({ removePoisonCount: true });
					cpu.set(cachedAttackFieldWithPath, availableAttackMapWithPath);
				}

				if (_.find(availableAttackMapWithPath, {x: x, y: y})) {
					availableReceiveDamageWithPath += enemy.getAttackToUnit(unit, {average: true});
				}

			});

			placeArmor = model.getArmorByXY({
				x: x,
				y: y
			});

			building = model.getBuildingByXY({ x: x, y: y });
			if ( building ) {

				onBuilding = true;

				if ( (building.ownerId === unit.get('ownerId') || _.contains(buildingUpHealthList, building.type) || building.teamNumber === unit.get('teamNumber')) ) {
					upHealth = buildingList[building.type].healthUp;
					upHealth = Math.min(upHealth, unit.get('defaultHealth') - unit.get('health'));
					onHealthUpBuilding = rates.onHealthUpBuilding;
				}

				if ( building.teamNumber === null ) {
					onFreeBuilding = true;
				} else {
					if ( building.teamNumber !== unit.get('teamNumber') ) { // detect enemy building
						onEnemyBuilding = true;
					} else {
						onTeamBuilding = true;
					}
				}

			}

			unit.set('x', unitX);
			unit.set('y', unitY);
			unit.silentOff('x', 'y');

			scenario.set('dataByPosition', {
				placeArmor: placeArmor,
				availableReceiveDamage: availableReceiveDamage,
				availableReceiveDamageWithPath: availableReceiveDamageWithPath,
				upHealth: upHealth,
				onHealthUpBuilding: onHealthUpBuilding,
				onBuilding: onBuilding,
				onFreeBuilding: onFreeBuilding,
				onEnemyBuilding: onEnemyBuilding,
				onTeamBuilding: onTeamBuilding
			});

		},

		rateMove: function (data) {

			var cpu = this,
				model = cpu.get('model'),
				player = model.get('activePlayer'),
				hasCastle = model.playerHasCastle(player),
				hasCommander = model.playerHasCommander(player),
				allBuildings = model.get('buildings'),
				wantedBuildings,
				util = win.APP.util,
				scenario = data.scenario,
				unit = scenario.get('unit'),
				unitTeamNumber = unit.get('teamNumber'),
				allUnits = model.get('units'),
				enemyUnits = _.filter(allUnits, function (unit) {
					return unit.get('teamNumber') !== unitTeamNumber;
				}),
				//allScenarios = data.allScenarios,
				rates = cpu.rates,
				buildingData = win.APP.building,
				dataByPosition = scenario.get('dataByPosition'),
				wantedBuildingList = unit.get('listOccupyBuilding') || buildingData.wantedBuildingList,
				x = scenario.get('x'),
				y = scenario.get('y'),
				xy = {
					x: x,
					y: y
				},
				//building = model.getBuildingByXY(xy),
				pathToBuildingLength = Infinity,
				//pathToEnemyLength = Infinity,
				rate;

			// 1 detect: enemy unit which can get or stay on building
			//if ( building ) {
			//
			//	// can enemy get building
			//	_.each(enemyUnits, function (enemy) {
			//
			//		var path = enemy.getAvailablePathFull(),
			//			buildingTypeList = enemy.get('listOccupyBuilding');
			//
			//		if ( !_.find(path, xy) || !buildingTypeList ) {
			//			return;
			//		}
			//
			//	});
			//
			//}

			// 2 - nearest non player and available to get building
			wantedBuildings = _.filter(allBuildings, function (building) {
				return building.teamNumber !== unitTeamNumber && _.contains(wantedBuildingList, building.type);
			});

			if ( !wantedBuildings.length || ( !hasCastle && !hasCommander ) ) { // if mission or no needed buildings

				_.each(enemyUnits, function (enemy) {
					pathToBuildingLength = Math.min(pathToBuildingLength, util.getPathSize({ x: enemy.get('x'), y: enemy.get('y') }, xy));
				});

			} else {

				_.each(wantedBuildings, function (building) {

					var teamUnit = model.getUnitByXY(building);

					if ( teamUnit && teamUnit.get('teamNumber') === unitTeamNumber && _.contains(teamUnit.get('listOccupyBuilding'), building.type) ) {
						return;
					}

					pathToBuildingLength = Math.min(pathToBuildingLength, util.getPathSize(building, xy));

				});

			}

			// set rate by nearest non owned building
			rate = pathToBuildingLength * rates.q.nearestNonOwnedBuilding;

			// add rate by upHealth
			rate += dataByPosition.upHealth * rates.q.upHealth;

			return rate;

		},

		rateMoveToHealthUp: function (data) {

			// find health up building
			var cpu = this,
				rates = cpu.rates,
				model = cpu.get('model'),
				player = model.get('activePlayer'),
				teamNumber = player.teamNumber,
				allBuildings = model.get('buildings'),
				healthUpBuilding = win.APP.building.upHealthList,
				wantedBuildings = _.filter(allBuildings, function (building) {
					return healthUpBuilding.indexOf(building.type) !== -1 || building.teamNumber === teamNumber;
				}),
				pathToBuildingLength = Infinity,
				util = win.APP.util,
				scenario = data.scenario,
				x = scenario.get('x'),
				y = scenario.get('y');

			_.each(wantedBuildings, function (building) {
				pathToBuildingLength = Math.min(pathToBuildingLength, util.getPathSize(building, {x: x, y: y}));
			});

			scenario.set('rate', pathToBuildingLength * rates.q.nearestNonOwnedBuilding);

		},

		rateAttack: function (data) {

			var cpu = this,
				rates = cpu.rates,
				model = cpu.get('model'),
				scenario = data.scenario,
				action = scenario.get('action'),
				scenarioX = scenario.get('x'),
				scenarioY = scenario.get('y'),
				unit = scenario.get('unit'),
				unitX = unit.get('x'),
				unitY = unit.get('y'),
				enemyXY = action.enemy,
				enemy = model.getUnitByXY(enemyXY),
				enemyHealth = enemy ? enemy.get('health') : 0,
				enemyBuilding = model.getBuildingByXY(enemyXY),
				availableGivenDamage,
				availableResponseDamage = 0,
				dataByPosition = scenario.get('dataByPosition'),
				rate;

			scenario.set('isPoisonAttack', unit.get('poisonPeriod') ); // turn poison attack at first

			if ( !enemy && enemyBuilding && unit.get('canDestroyBuilding') ) {
				return rates.destroyEnemyBuilding;
			}

			unit.silentOn('x', 'y');
			unit.set('x', scenarioX);
			unit.set('y', scenarioY);

			// count
			availableGivenDamage = unit.getAttackToUnit(enemy, {average: true});

			// detect can enemy do strike back
			if ( availableGivenDamage < enemyHealth && enemy.canStrikeBack(unit) ) {
				enemy.silentOn('health');
				enemy.set('health', enemyHealth - availableGivenDamage);
				availableResponseDamage = enemy.getAttackToUnit(unit, {average: true});
				enemy.set('health', enemyHealth);
				enemy.silentOff('health');
			}

			if ( availableGivenDamage >= enemyHealth ) {
				rate = rates.killUnit;
				scenario.set('killUnit', true); // use for detect priority to kill unit
			} else {
				if ( availableResponseDamage < unit.get('health') - 20 ) { // detect: unit will be alive after attack
					rate = availableGivenDamage; // unit alive
				} else {
					rate = rates.lowPriority;  // unit die
				}
			}

			if (rate !== rates.lowPriority) {
				rate += dataByPosition.onBuilding ? 1 : 0;
				rate += dataByPosition.onFreeBuilding ? 5 : 0;
				rate += dataByPosition.onEnemyBuilding ? 5 : 0;
				rate += dataByPosition.onTeamBuilding ? 10 : 0;
			}

			scenario.set('availableResponseDamage', availableResponseDamage);

			unit.set('x', unitX);
			unit.set('y', unitY);
			unit.silentOff('x', 'y');

			return rate;

		}


	};

	win.APP.Cpu = Cpu;

}(window));