(function () {

	"use strict";
	/*global window, document */
	/*global APP */

	APP.maps = APP.maps || {};

	APP.maps.c03_escort = {
		"missionNumber": 3,
		"type": "mission",
		"size": {"width": 15, "height": 15},
		"name": "Escort",
		"jsName": "c03_escort",
		"units": [
			{"type": "Soldier", "x": 13, "y": 1, playerId: 1},
			{"type": "Archer", "x": 14, "y": 1, playerId: 1},
			{"type": "Soldier", "x": 14, "y": 2, playerId: 1},
			{"type": "Soldier", "x": 6, "y": 4, playerId: 1},
			{"type": "Lizard", "x": 7, "y": 4, playerId: 1},
			{"type": "Lizard", "x": 6, "y": 5, playerId: 1},
			{"type": "Soldier", "x": 12, "y": 12, playerId: 0},
			{"type": "Lizard", "x": 14, "y": 12, playerId: 0},
			{"type": "Bones", "x": 3, "y": 13, playerId: 1},
			{"type": "Bones", "x": 4, "y": 13, playerId: 1},
			{"type": "Soldier", "x": 13, "y": 13, playerId: 0},
			{"type": "Knight", "x": 14, "y": 13, playerId: 0},
			{"type": "Wizard", "x": 3, "y": 14, playerId: 1},
			{"type": "Archer", "x": 14, "y": 14, playerId: 0}
		],
		"buildings": [
			{"type": "farm", "x": 14, "y": 0, playerId: 1},
			{"type": "farm", "x": 6, "y": 4, playerId: 1},
			{"type": "farm", "x": 0, "y": 13},
			{"type": "castle", "x": 1, "y": 13}
		],
		"terrain": {
			"x0y0": "green",
			"x1y0": "forest",
			"x2y0": "stone",
			"x3y0": "stone",
			"x4y0": "green",
			"x5y0": "green",
			"x6y0": "green",
			"x7y0": "green",
			"x8y0": "green",
			"x9y0": "green",
			"x10y0": "water",
			"x11y0": "green",
			"x12y0": "green",
			"x13y0": "green",
			"x14y0": "green",
			"x0y1": "forest",
			"x1y1": "stone",
			"x2y1": "stone",
			"x3y1": "stone",
			"x4y1": "green",
			"x5y1": "green",
			"x6y1": "road",
			"x7y1": "road",
			"x8y1": "road",
			"x9y1": "road",
			"x10y1": "bridge-horizontal",
			"x11y1": "road",
			"x12y1": "road",
			"x13y1": "road",
			"x14y1": "road",
			"x0y2": "hill",
			"x1y2": "stone",
			"x2y2": "green",
			"x3y2": "green",
			"x4y2": "green",
			"x5y2": "road",
			"x6y2": "road",
			"x7y2": "green",
			"x8y2": "green",
			"x9y2": "water",
			"x10y2": "water",
			"x11y2": "green",
			"x12y2": "green",
			"x13y2": "green",
			"x14y2": "green",
			"x0y3": "green",
			"x1y3": "green",
			"x2y3": "green",
			"x3y3": "road",
			"x4y3": "road",
			"x5y3": "road",
			"x6y3": "green",
			"x7y3": "green",
			"x8y3": "water",
			"x9y3": "water",
			"x10y3": "water",
			"x11y3": "water",
			"x12y3": "green",
			"x13y3": "green",
			"x14y3": "green",
			"x0y4": "road",
			"x1y4": "road",
			"x2y4": "road",
			"x3y4": "road",
			"x4y4": "green",
			"x5y4": "green",
			"x6y4": "green",
			"x7y4": "green",
			"x8y4": "water",
			"x9y4": "water",
			"x10y4": "water",
			"x11y4": "water",
			"x12y4": "green",
			"x13y4": "forest",
			"x14y4": "forest",
			"x0y5": "road",
			"x1y5": "green",
			"x2y5": "forest",
			"x3y5": "forest",
			"x4y5": "green",
			"x5y5": "green",
			"x6y5": "green",
			"x7y5": "water",
			"x8y5": "water",
			"x9y5": "water",
			"x10y5": "water",
			"x11y5": "green",
			"x12y5": "forest",
			"x13y5": "forest",
			"x14y5": "stone",
			"x0y6": "green",
			"x1y6": "forest",
			"x2y6": "stone",
			"x3y6": "forest",
			"x4y6": "green",
			"x5y6": "green",
			"x6y6": "green",
			"x7y6": "water",
			"x8y6": "water",
			"x9y6": "water",
			"x10y6": "water",
			"x11y6": "green",
			"x12y6": "green",
			"x13y6": "stone",
			"x14y6": "stone",
			"x0y7": "green",
			"x1y7": "stone",
			"x2y7": "stone",
			"x3y7": "forest",
			"x4y7": "green",
			"x5y7": "green",
			"x6y7": "green",
			"x7y7": "water",
			"x8y7": "water",
			"x9y7": "water",
			"x10y7": "water",
			"x11y7": "green",
			"x12y7": "hill",
			"x13y7": "hill",
			"x14y7": "stone",
			"x0y8": "stone",
			"x1y8": "stone",
			"x2y8": "forest",
			"x3y8": "hill",
			"x4y8": "green",
			"x5y8": "green",
			"x6y8": "green",
			"x7y8": "green",
			"x8y8": "water",
			"x9y8": "water",
			"x10y8": "water",
			"x11y8": "water",
			"x12y8": "green",
			"x13y8": "forest",
			"x14y8": "forest",
			"x0y9": "forest",
			"x1y9": "forest",
			"x2y9": "forest",
			"x3y9": "hill",
			"x4y9": "hill",
			"x5y9": "green",
			"x6y9": "green",
			"x7y9": "water",
			"x8y9": "water",
			"x9y9": "water",
			"x10y9": "water",
			"x11y9": "water",
			"x12y9": "green",
			"x13y9": "green",
			"x14y9": "forest",
			"x0y10": "forest",
			"x1y10": "forest",
			"x2y10": "forest",
			"x3y10": "forest",
			"x4y10": "forest",
			"x5y10": "green",
			"x6y10": "water",
			"x7y10": "water",
			"x8y10": "water",
			"x9y10": "water",
			"x10y10": "water",
			"x11y10": "green",
			"x12y10": "green",
			"x13y10": "green",
			"x14y10": "green",
			"x0y11": "forest",
			"x1y11": "forest",
			"x2y11": "green",
			"x3y11": "green",
			"x4y11": "green",
			"x5y11": "water",
			"x6y11": "water",
			"x7y11": "water",
			"x8y11": "water",
			"x9y11": "water",
			"x10y11": "water",
			"x11y11": "green",
			"x12y11": "green",
			"x13y11": "green",
			"x14y11": "green",
			"x0y12": "forest",
			"x1y12": "green",
			"x2y12": "road",
			"x3y12": "road",
			"x4y12": "road",
			"x5y12": "water",
			"x6y12": "water",
			"x7y12": "water",
			"x8y12": "water",
			"x9y12": "water",
			"x10y12": "road",
			"x11y12": "road",
			"x12y12": "green",
			"x13y12": "green",
			"x14y12": "green",
			"x0y13": "green",
			"x1y13": "green",
			"x2y13": "road",
			"x3y13": "green",
			"x4y13": "green",
			"x5y13": "water",
			"x6y13": "water",
			"x7y13": "water",
			"x8y13": "water",
			"x9y13": "water",
			"x10y13": "green",
			"x11y13": "road",
			"x12y13": "road",
			"x13y13": "road",
			"x14y13": "road",
			"x0y14": "road",
			"x1y14": "road",
			"x2y14": "road",
			"x3y14": "green",
			"x4y14": "water",
			"x5y14": "water",
			"x6y14": "water",
			"x7y14": "water",
			"x8y14": "water",
			"x9y14": "water",
			"x10y14": "green",
			"x11y14": "green",
			"x12y14": "green",
			"x13y14": "green",
			"x14y14": "green"
		},
		steps: [],
		availableUnits: ['soldier', 'archer', 'lizard'],
		gameOverDetect: function (controller) {

			var castle = controller.buildings['x1y13'],
				human = controller.players[0],
				knight,
				lizard,
				humanUnits = controller.getUnitByPlayer(human),
				result = {};

			humanUnits.forEach(function (unit) {
				if (unit.type === 'Knight') {
					knight = unit;
				}
				if (unit.type === 'Lizard') {
					lizard = unit;
				}
			});

			// if knight is dead - defeat
			if (!knight) {
				util.clearTimeouts();
				result.winner = controller.players[1];
				result.message = '<span class="color-red">X ' + window.langs[window.info.lang].missions.c03_escort['Keep the knight'] + '</span>';
				this.showEndGame(result);
				return true;
			}

			// if lizard is dead - > end game
			if (!lizard) {
				util.clearTimeouts();
				result.winner = controller.players[1];
				result.message = '<span class="color-red">X ' + window.langs[window.info.lang].missions.c03_escort['Keep the Lizard Chief'] + '</span>';
				this.showEndGame(result);
				return true;
			}

			// if castle is occupy
			if ( castle.playerId === human.id ) {

				result.message = 'you win';

				window.info.pushNewMission('c04_reinforcements');

				util.clearTimeouts();

				// get winner player
				result.winner = util.findBy(this.players, 'id', util.objToArray(controller.buildings)[0].value.playerId).item;

				result.nextMissionNumber = controller.map.missionNumber + 1;

				this.showEndGame(result);

				return true;

			}

			return false;

		},
		notification: function () {

			if (APP.maps.c03_escort.wasNotification) {
				return;
			}

			APP.maps.c03_escort.wasNotification = true;

			var words = window.langs[window.info.lang].missions.c03_escort;

			APP.notificationView.show({
				type: 'alert', text: words.A1, tmpl: 'n-banner', header: words.A1Header,

				onHide: function () {

					APP.notificationView.show({
						text: words.H1, tmpl: 'n-banner', image: { url: 'img/face/helper-1.png' },

						onHide: function () {

							APP.notificationView.show({
								text: words.G1, tmpl: 'n-banner', image: { url: 'img/face/galamar-1.png' }, from: 'right',

								onHide: function () {
									APP.notificationView.show({
										text: words.H2, tmpl: 'n-banner', image: { url: 'img/face/helper-1.png' },

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
			});

		}

	};

}());