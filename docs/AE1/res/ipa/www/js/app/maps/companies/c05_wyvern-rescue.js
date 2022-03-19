(function () {

	"use strict";
	/*global window, document */
	/*global APP */

	APP.maps = APP.maps || {};

	APP.maps.c05_wyvernRescue = {
		"missionNumber": 5,
		"type": "mission",
		"size": {"width": 15, "height": 12},
		"name": "Wyvern Rescue!",
		"jsName": "c05_wyvernRescue",
		"units": [
			{"type": "Knight", "x": 2, "y": 2, playerId: 1},
			{"type": "Soldier", "x": 3, "y": 2, playerId: 1},
			{"type": "Archer", "x": 4, "y": 2, playerId: 1},
			{"type": "Lizard", "x": 3, "y": 3, playerId: 1},
			{"type": "Golem", "x": 4, "y": 4, playerId: 1},
			{"type": "Bones", "x": 6, "y": 5, playerId: 1},
			{"type": "Golem", "x": 11, "y": 9, playerId: 0},
			{"type": "Soldier", "x": 12, "y": 9, playerId: 0},
			{"type": "Archer", "x": 12, "y": 10, playerId: 0},
			{"type": "Lizard", "x": 10, "y": 11, playerId: 0},
			{"type": "Knight", "x": 13, "y": 11, playerId: 0}
		],
		"buildings": [
			{"type": "farm", "x": 2, "y": 0, playerId: 1},
			{"type": "farm", "x": 14, "y": 0, playerId: 1},
			{"type": "castle", "x": 2, "y": 2},
			{"type": "farm", "x": 10, "y": 3, playerId: 1},
			{"type": "farm", "x": 0, "y": 5, playerId: 1},
			{"type": "farm", "x": 6, "y": 5, playerId: 1},
			{"type": "farm", "x": 9, "y": 5},
			{"type": "farm", "x": 3, "y": 7, playerId: 1},
			{"type": "farm", "x": 6, "y": 7},
			{"type": "farm", "x": 14, "y": 7},
			{"type": "farm", "x": 7, "y": 9},
			{"type": "farm", "x": 12, "y": 9, playerId: 0},
			{"type": "farm", "x": 1, "y": 11, playerId: 1},
			{"type": "castle", "x": 13, "y": 11}
		],
		"terrain": {
			"x0y0": "stone",
			"x1y0": "stone",
			"x2y0": "green",
			"x3y0": "forest",
			"x4y0": "green",
			"x5y0": "forest",
			"x6y0": "forest",
			"x7y0": "hill",
			"x8y0": "hill",
			"x9y0": "hill",
			"x10y0": "hill",
			"x11y0": "green",
			"x12y0": "green",
			"x13y0": "green",
			"x14y0": "green",
			"x0y1": "road",
			"x1y1": "road",
			"x2y1": "road",
			"x3y1": "road",
			"x4y1": "road",
			"x5y1": "green",
			"x6y1": "green",
			"x7y1": "green",
			"x8y1": "green",
			"x9y1": "hill",
			"x10y1": "hill",
			"x11y1": "green",
			"x12y1": "green",
			"x13y1": "forest",
			"x14y1": "forest",
			"x0y2": "stone",
			"x1y2": "stone",
			"x2y2": "green",
			"x3y2": "green",
			"x4y2": "road",
			"x5y2": "green",
			"x6y2": "water",
			"x7y2": "water",
			"x8y2": "water",
			"x9y2": "water",
			"x10y2": "hill",
			"x11y2": "green",
			"x12y2": "stone",
			"x13y2": "forest",
			"x14y2": "forest",
			"x0y3": "stone",
			"x1y3": "hill",
			"x2y3": "hill",
			"x3y3": "water",
			"x4y3": "bridge-vertical",
			"x5y3": "water",
			"x6y3": "water",
			"x7y3": "green",
			"x8y3": "green",
			"x9y3": "water",
			"x10y3": "green",
			"x11y3": "green",
			"x12y3": "green",
			"x13y3": "stone",
			"x14y3": "stone",
			"x0y4": "forest",
			"x1y4": "hill",
			"x2y4": "water",
			"x3y4": "water",
			"x4y4": "green",
			"x5y4": "green",
			"x6y4": "green",
			"x7y4": "road",
			"x8y4": "green",
			"x9y4": "water",
			"x10y4": "water",
			"x11y4": "water",
			"x12y4": "green",
			"x13y4": "road",
			"x14y4": "stone",
			"x0y5": "green",
			"x1y5": "green",
			"x2y5": "water",
			"x3y5": "water",
			"x4y5": "green",
			"x5y5": "hill",
			"x6y5": "green",
			"x7y5": "road",
			"x8y5": "green",
			"x9y5": "green",
			"x10y5": "green",
			"x11y5": "water",
			"x12y5": "green",
			"x13y5": "road",
			"x14y5": "green",
			"x0y6": "forest",
			"x1y6": "green",
			"x2y6": "water",
			"x3y6": "green",
			"x4y6": "road",
			"x5y6": "road",
			"x6y6": "road",
			"x7y6": "road",
			"x8y6": "road",
			"x9y6": "road",
			"x10y6": "road",
			"x11y6": "bridge-horizontal",
			"x12y6": "road",
			"x13y6": "road",
			"x14y6": "green",
			"x0y7": "green",
			"x1y7": "green",
			"x2y7": "water",
			"x3y7": "green",
			"x4y7": "road",
			"x5y7": "green",
			"x6y7": "green",
			"x7y7": "road",
			"x8y7": "stone",
			"x9y7": "stone",
			"x10y7": "green",
			"x11y7": "water",
			"x12y7": "green",
			"x13y7": "green",
			"x14y7": "green",
			"x0y8": "road",
			"x1y8": "road",
			"x2y8": "bridge-horizontal",
			"x3y8": "road",
			"x4y8": "road",
			"x5y8": "green",
			"x6y8": "green",
			"x7y8": "road",
			"x8y8": "forest",
			"x9y8": "green",
			"x10y8": "water",
			"x11y8": "green",
			"x12y8": "stone",
			"x13y8": "stone",
			"x14y8": "hill",
			"x0y9": "road",
			"x1y9": "green",
			"x2y9": "water",
			"x3y9": "water",
			"x4y9": "green",
			"x5y9": "forest",
			"x6y9": "forest",
			"x7y9": "green",
			"x8y9": "road",
			"x9y9": "road",
			"x10y9": "bridge-horizontal",
			"x11y9": "road",
			"x12y9": "green",
			"x13y9": "green",
			"x14y9": "green",
			"x0y10": "road",
			"x1y10": "green",
			"x2y10": "green",
			"x3y10": "water",
			"x4y10": "water",
			"x5y10": "water",
			"x6y10": "water",
			"x7y10": "green",
			"x8y10": "green",
			"x9y10": "green",
			"x10y10": "water",
			"x11y10": "road",
			"x12y10": "road",
			"x13y10": "road",
			"x14y10": "road",
			"x0y11": "road",
			"x1y11": "green",
			"x2y11": "hill",
			"x3y11": "green",
			"x4y11": "green",
			"x5y11": "green",
			"x6y11": "water",
			"x7y11": "water",
			"x8y11": "water",
			"x9y11": "water",
			"x10y11": "water",
			"x11y11": "green",
			"x12y11": "green",
			"x13y11": "green",
			"x14y11": "green"
		},

		steps: [],
		availableUnits: ['soldier', 'archer', 'lizard', 'wizard', 'wisp', 'spider', 'golem', 'catapult'],
		gameOverDetect: function (controller) {

			// if knight is dead -> end game
			var human = controller.players[0],
				knight,
				humanUnits = controller.getUnitByPlayer(human),
				result = {};

			humanUnits.forEach(function (unit) {
				if (unit.type === 'Knight') {
					knight = unit;
				}
			});

			// if knight is dead - defeat
			if (!knight) {
				util.clearTimeouts();
				result.winner = controller.players[1];
				result.message = '<span class="color-red">X ' + window.langs[window.info.lang].missions.c05_wyvernRescue['Keep the knight'] + '</span>';
				this.showEndGame(result);
				return true;
			}

			var castles = [],
				buildings = controller.buildings,
				key, building,
				enemyUnits = controller.getUnitByPlayer(controller.players[1]);

			// enemy units is - 0 &&
			// both castle belongs to player
			for (key in buildings) {
				if (buildings.hasOwnProperty(key)) {
					building = buildings[key];
					if (building.type === 'castle' && building.playerId === 0) {
						castles.push(building);
					}
				}
			}

			if ( castles.length === 2 && enemyUnits.length === 0 ) {

				window.info.pushNewMission('c06_siege');

				var words = window.langs[window.info.lang].missions.c05_wyvernRescue;

				controller.view.goToXY({ x: 2, y: 2 }); // show new units

				// remove units by coordinates
				var coordinates = [
					{ x:1, y:2 },
					{ x:3, y:2 }
				];

				coordinates.forEach(function (xy) {

					var x = xy.x,
						y = xy.y,
						units = controller.units,
						unit,
						key;

					for (key in units) {
						if (units.hasOwnProperty(key)) {
							unit = units[key];
							if ( unit.x === x && unit.y === y ) {
								unit.notCreateGrave = true;
								controller.killUnit(unit);
							}
						}
					}

				});

				coordinates.forEach(function (xy) {

					var newUnit = controller.appendUnit({
							color: "blue",
							playerId: 0,
							type: "Wyvern",
							x: xy.x,
							y: xy.y
						}); // to controller

					controller.view.appendUnit(newUnit); // and view

				});

				APP.notificationView.show({
					text: words.H2, tmpl: 'n-banner', image: { url: 'img/face/helper-1.png' },
					onHide: function () {

						result.message = 'you win';

						util.clearTimeouts();

						// get winner player
						result.winner = util.findBy(this.players, 'id', util.objToArray(controller.buildings)[0].value.playerId).item;

						result.nextMissionNumber = controller.map.missionNumber + 1;

						this.showEndGame(result);

					}.bind(this)
				});

				return true;

			}

			return false;

		},
		notification: function () {

			if (APP.maps.c05_wyvernRescue.wasNotification) {
				return;
			}

			APP.maps.c05_wyvernRescue.wasNotification = true;

			var words = window.langs[window.info.lang].missions.c05_wyvernRescue;

			APP.notificationView.show({
				type: 'alert', text: words.A1, tmpl: 'n-banner', header: words.A1Header,

				onHide: function () {

					APP.notificationView.show({

						text: words.G1, tmpl: 'n-banner', image: { url: 'img/face/galamar-1.png' },

						onHide: function () {

							APP.notificationView.show({

								text: words.H1, tmpl: 'n-banner', image: { url: 'img/face/helper-2.png', cssClass: 'right' }, from: 'right',

								onHide: function () {

									APP.notificationView.show({
										type: 'alert',
										text: words.T1,
										textCssClass: 'text-indent-with-margin-3',
										header: window.langs[window.info.lang].objective,
										headerCssClass: 'text-align-left',
										tmpl: 'n-banner',
										bannerCssClass: 'target-alert'
									});

								}

							});


						}

					});

				}
			});

		}

	};

}());