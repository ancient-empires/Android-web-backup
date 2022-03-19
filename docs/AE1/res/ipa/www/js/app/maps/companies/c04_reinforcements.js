(function () {

	"use strict";
	/*global window, document */
	/*global APP */

	APP.maps = APP.maps || {};

	var the4thStep = {

		isDone: false,
		check: function (controller) {

			// first kill
			// get groves
			var ripsUnit = controller.unitsRIP,
				rip,
				key;

			for (key in ripsUnit) {
				if (ripsUnit.hasOwnProperty(key)) {
					rip = ripsUnit[key];
					if (rip.playerId === 0) {
						return true;
					}

				}
			}

			return false;

		},
		run: function (controller) {

			if (this.isDone) {
				return;
			}

			this.isDone = true;

			var newUnit;

			newUnit = controller.appendUnit({ color: "red", playerId: 1, type: "Knight", x: 2, y: 0 }); // to controller
			controller.view.appendUnit(newUnit); // and view

			newUnit = controller.appendUnit({ color: "red", playerId: 1, type: "Spider", x: 1, y: 0 }); // to controller
			controller.view.appendUnit(newUnit); // and view

			newUnit = controller.appendUnit({ color: "red", playerId: 1, type: "Spider", x: 3, y: 0 }); // to controller
			controller.view.appendUnit(newUnit); // and view

			newUnit = controller.appendUnit({ color: "red", playerId: 1, type: "Spider", x: 2, y: 1 }); // to controller
			controller.view.appendUnit(newUnit); // and view

			var words = window.langs[window.info.lang].missions.c04_reinforcements;

			setTimeout(function () {
				APP.notificationView.hideNotification();

				APP.notificationView.show({

					text: words.H2, tmpl: 'n-banner', image: { url: 'img/face/helper-1.png' },

					onHide: function () {

						APP.notificationView.show({
							text: words.V1, tmpl: 'n-banner', image: { url: 'img/face/valadorn-2.png', cssClass: 'right' }, from: 'right'
						});

					}

				});

			}, 2000);

			return false;

		}

	};



	APP.maps.c04_reinforcements = {
		"missionNumber": 4,
		"type": "mission",
		"size": {"width": 15, "height": 15},
		"name": "Reinforcements",
		"jsName": "c04_reinforcements",
		"units": [
			{"type": "Archer", "x": 3, "y": 11, playerId: 1},
			{"type": "Wisp", "x": 2, "y": 12, playerId: 1},
			{"type": "Soldier", "x": 3, "y": 12, playerId: 1},
			{"type": "Spider", "x": 1, "y": 13, playerId: 1},
			{"type": "Wizard", "x": 2, "y": 13, playerId: 1},
			{"type": "Catapult", "x": 2, "y": 14, playerId: 1},
			{"type": "Lizard", "x": 13, "y": 12, playerId: 0},
			{"type": "Soldier", "x": 12, "y": 13, playerId: 0},
			{"type": "Wisp", "x": 13, "y": 13, playerId: 0},
			{"type": "Knight", "x": 14, "y": 13, playerId: 0},
			{"type": "Archer", "x": 13, "y": 14, playerId: 0},
			{"type": "Wizard", "x": 14, "y": 14, playerId: 0}
		],
		"buildings": [
			{"type": "farm", "x": 0, "y": 0, playerId: 1},
			{"type": "castle", "x": 2, "y": 0},
			{"type": "farm", "x": 8, "y": 0, playerId: 1},
			{"type": "farm", "x": 13, "y": 1},
			{"type": "farm", "x": 7, "y": 4, playerId: 1},
			{"type": "farm", "x": 12, "y": 4},
			{"type": "farm", "x": 2, "y": 6, playerId: 1},
			{"type": "farm", "x": 11, "y": 8},
			{"type": "farm", "x": 3, "y": 12, playerId: 1},
			{"type": "castle", "x": 14, "y": 13, playerId: 0},
			{"type": "farm", "x": 11, "y": 14, playerId: 0}
		],
		"terrain": {
			"x0y0": "green",
			"x1y0": "green",
			"x2y0": "green",
			"x3y0": "green",
			"x4y0": "forest",
			"x5y0": "forest",
			"x6y0": "stone",
			"x7y0": "green",
			"x8y0": "green",
			"x9y0": "water",
			"x10y0": "green",
			"x11y0": "green",
			"x12y0": "green",
			"x13y0": "green",
			"x14y0": "green",
			"x0y1": "road",
			"x1y1": "road",
			"x2y1": "road",
			"x3y1": "green",
			"x4y1": "green",
			"x5y1": "forest",
			"x6y1": "forest",
			"x7y1": "green",
			"x8y1": "water",
			"x9y1": "water",
			"x10y1": "green",
			"x11y1": "green",
			"x12y1": "green",
			"x13y1": "green",
			"x14y1": "stone",
			"x0y2": "stone",
			"x1y2": "stone",
			"x2y2": "road",
			"x3y2": "road",
			"x4y2": "road",
			"x5y2": "green",
			"x6y2": "forest",
			"x7y2": "green",
			"x8y2": "water",
			"x9y2": "green",
			"x10y2": "green",
			"x11y2": "forest",
			"x12y2": "green",
			"x13y2": "stone",
			"x14y2": "stone",
			"x0y3": "green",
			"x1y3": "stone",
			"x2y3": "stone",
			"x3y3": "green",
			"x4y3": "road",
			"x5y3": "green",
			"x6y3": "green",
			"x7y3": "green",
			"x8y3": "water",
			"x9y3": "green",
			"x10y3": "forest",
			"x11y3": "forest",
			"x12y3": "green",
			"x13y3": "green",
			"x14y3": "green",
			"x0y4": "green",
			"x1y4": "green",
			"x2y4": "stone",
			"x3y4": "green",
			"x4y4": "road",
			"x5y4": "road",
			"x6y4": "road",
			"x7y4": "green",
			"x8y4": "water",
			"x9y4": "green",
			"x10y4": "green",
			"x11y4": "green",
			"x12y4": "green",
			"x13y4": "road",
			"x14y4": "road",
			"x0y5": "green",
			"x1y5": "forest",
			"x2y5": "green",
			"x3y5": "road",
			"x4y5": "road",
			"x5y5": "green",
			"x6y5": "road",
			"x7y5": "road",
			"x8y5": "bridge-horizontal",
			"x9y5": "road",
			"x10y5": "road",
			"x11y5": "road",
			"x12y5": "road",
			"x13y5": "road",
			"x14y5": "green",
			"x0y6": "forest",
			"x1y6": "forest",
			"x2y6": "green",
			"x3y6": "road",
			"x4y6": "green",
			"x5y6": "green",
			"x6y6": "green",
			"x7y6": "green",
			"x8y6": "water",
			"x9y6": "green",
			"x10y6": "green",
			"x11y6": "green",
			"x12y6": "green",
			"x13y6": "green",
			"x14y6": "forest",
			"x0y7": "forest",
			"x1y7": "green",
			"x2y7": "road",
			"x3y7": "road",
			"x4y7": "green",
			"x5y7": "stone",
			"x6y7": "stone",
			"x7y7": "green",
			"x8y7": "water",
			"x9y7": "green",
			"x10y7": "green",
			"x11y7": "forest",
			"x12y7": "green",
			"x13y7": "green",
			"x14y7": "stone",
			"x0y8": "forest",
			"x1y8": "green",
			"x2y8": "road",
			"x3y8": "green",
			"x4y8": "forest",
			"x5y8": "hill",
			"x6y8": "green",
			"x7y8": "water",
			"x8y8": "water",
			"x9y8": "green",
			"x10y8": "forest",
			"x11y8": "green",
			"x12y8": "stone",
			"x13y8": "stone",
			"x14y8": "stone",
			"x0y9": "green",
			"x1y9": "green",
			"x2y9": "road",
			"x3y9": "green",
			"x4y9": "hill",
			"x5y9": "hill",
			"x6y9": "green",
			"x7y9": "water",
			"x8y9": "green",
			"x9y9": "hill",
			"x10y9": "hill",
			"x11y9": "stone",
			"x12y9": "stone",
			"x13y9": "forest",
			"x14y9": "forest",
			"x0y10": "green",
			"x1y10": "green",
			"x2y10": "road",
			"x3y10": "green",
			"x4y10": "hill",
			"x5y10": "green",
			"x6y10": "green",
			"x7y10": "water",
			"x8y10": "green",
			"x9y10": "green",
			"x10y10": "stone",
			"x11y10": "stone",
			"x12y10": "green",
			"x13y10": "forest",
			"x14y10": "forest",
			"x0y11": "green",
			"x1y11": "green",
			"x2y11": "road",
			"x3y11": "green",
			"x4y11": "green",
			"x5y11": "green",
			"x6y11": "water",
			"x7y11": "water",
			"x8y11": "green",
			"x9y11": "green",
			"x10y11": "stone",
			"x11y11": "green",
			"x12y11": "green",
			"x13y11": "forest",
			"x14y11": "forest",
			"x0y12": "road",
			"x1y12": "road",
			"x2y12": "road",
			"x3y12": "green",
			"x4y12": "green",
			"x5y12": "green",
			"x6y12": "water",
			"x7y12": "green",
			"x8y12": "green",
			"x9y12": "green",
			"x10y12": "green",
			"x11y12": "green",
			"x12y12": "green",
			"x13y12": "forest",
			"x14y12": "green",
			"x0y13": "forest",
			"x1y13": "forest",
			"x2y13": "road",
			"x3y13": "road",
			"x4y13": "road",
			"x5y13": "road",
			"x6y13": "bridge-horizontal",
			"x7y13": "road",
			"x8y13": "road",
			"x9y13": "road",
			"x10y13": "road",
			"x11y13": "road",
			"x12y13": "road",
			"x13y13": "green",
			"x14y13": "green",
			"x0y14": "stone",
			"x1y14": "green",
			"x2y14": "road",
			"x3y14": "forest",
			"x4y14": "green",
			"x5y14": "water",
			"x6y14": "water",
			"x7y14": "green",
			"x8y14": "green",
			"x9y14": "green",
			"x10y14": "green",
			"x11y14": "green",
			"x12y14": "road",
			"x13y14": "road",
			"x14y14": "road"
		},
		steps: [the4thStep],
		availableUnits: ['soldier', 'archer', 'lizard', 'wizard', 'wisp', 'spider'],
		gameOverDetect: function (controller) {

			// if knight is dead -> end game
			var castles = [],
				buildings = controller.buildings,
				key, building,
				human = controller.players[0],
				knight,
				humanUnits = controller.getUnitByPlayer(human),
				enemyUnits = controller.getUnitByPlayer(controller.players[1]),
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
				result.message = '<span class="color-red">X ' + window.langs[window.info.lang].missions.c04_reinforcements['Keep the knight'] + '</span>';
				this.showEndGame(result);
				return true;
			}


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

			if (castles.length === 2 && enemyUnits.length === 0) {

				var words = window.langs[window.info.lang].missions.c04_reinforcements;

				window.info.pushNewMission('c05_wyvernRescue');

				APP.notificationView.show({
					text: words.V2, tmpl: 'n-banner', image: { url: 'img/face/valadorn-2.png', cssClass: 'right' }, from: 'right',
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

			if (APP.maps.c04_reinforcements.wasNotification) {
				return;
			}

			APP.maps.c04_reinforcements.wasNotification = true;

			var words = window.langs[window.info.lang].missions.c04_reinforcements;

			APP.notificationView.show({
				type: 'alert', text: words.A1, tmpl: 'n-banner', header: words.A1Header,

				onHide: function () {

					APP.notificationView.show({
						text: words.H1, tmpl: 'n-banner', image: { url: 'img/face/helper-1.png' },

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

	};

}());