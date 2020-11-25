(function () {

	"use strict";
	/*global window, document */
	/*global APP */

	APP.maps = APP.maps || {};

	APP.maps.c07_finalAssault = {
		"missionNumber": 7,
		"type": "mission",
		"size": {"width": 14, "height": 15},
		"name": "Final Assault",
		"jsName": "c07_finalAssault",
		"units": [
			{"type": "Catapult", "x": 12, "y": 0, playerId: 1},
			{"type": "Soldier", "x": 13, "y": 0, playerId: 1},
			{"type": "Wyvern", "x": 0, "y": 1, playerId: 1},
			{"type": "Knight", "x": 1, "y": 1, playerId: 1},
			{"type": "Soldier", "x": 1, "y": 2, playerId: 1},
			{"type": "Golem", "x": 1, "y": 11, playerId: 1},
			{"type": "Soldier", "x": 1, "y": 12, playerId: 1},
			{"type": "Catapult", "x": 12, "y": 11, playerId: 0},
			{"type": "Soldier", "x": 11, "y": 12, playerId: 0},
			{"type": "Wyvern", "x": 13, "y": 12, playerId: 0},
			{"type": "Knight", "x": 10, "y": 13, playerId: 0},
			{"type": "Wizard", "x": 11, "y": 14, playerId: 0},

			{"type": "Wyvern", "x": 5, "y": 1, playerId: 1},
			//{"type": "Wyvern", "x": 4, "y": 2, playerId: 1},
			{"type": "Wyvern", "x": 3, "y": 3, playerId: 1},
			//{"type": "Wyvern", "x": 2, "y": 4, playerId: 1},
			{"type": "Wyvern", "x": 1, "y": 5, playerId: 1}

			//{"type": "Golem", "x": 1, "y": 4, playerId: 1},
			//{"type": "Golem", "x": 2, "y": 3, playerId: 1},
			//{"type": "Golem", "x": 3, "y": 2, playerId: 1},
			//{"type": "Golem", "x": 4, "y": 1, playerId: 1}


		],
		"buildings": [
			{"type": "farm", "x": 13, "y": 0, playerId: 1},
			{"type": "castle", "x": 1, "y": 1, playerId: 1},
			{"type": "farm", "x": 4, "y": 1, playerId: 0},
			{"type": "farm", "x": 1, "y": 2, playerId: 1},
			{"type": "farm", "x": 3, "y": 3, playerId: 1},
			{"type": "farm", "x": 8, "y": 5},
			{"type": "farm", "x": 2, "y": 6, playerId: 1},
			{"type": "farm", "x": 5, "y": 8},
			{"type": "farm", "x": 12, "y": 8, playerId: 1},
			{"type": "farm", "x": 1, "y": 12, playerId: 1},
			{"type": "farm", "x": 11, "y": 12, playerId: 1},
			{"type": "farm", "x": 13, "y": 12, playerId: 1},
			{"type": "farm", "x": 10, "y": 13, playerId: 1},
			{"type": "castle", "x": 13, "y": 13, playerId: 0},
			{"type": "farm", "x": 7, "y": 14, playerId: 1}
		],
		"terrain": {
			"x0y0": "forest",
			"x1y0": "forest",
			"x2y0": "green",
			"x3y0": "forest",
			"x4y0": "forest",
			"x5y0": "green",
			"x6y0": "green",
			"x7y0": "green",
			"x8y0": "green",
			"x9y0": "water",
			"x10y0": "green",
			"x11y0": "forest",
			"x12y0": "road",
			"x13y0": "green",
			"x0y1": "road",
			"x1y1": "road",
			"x2y1": "road",
			"x3y1": "green",
			"x4y1": "green",
			"x5y1": "road",
			"x6y1": "road",
			"x7y1": "road",
			"x8y1": "road",
			"x9y1": "bridge-horizontal",
			"x10y1": "road",
			"x11y1": "road",
			"x12y1": "road",
			"x13y1": "forest",
			"x0y2": "green",
			"x1y2": "green",
			"x2y2": "road",
			"x3y2": "green",
			"x4y2": "forest",
			"x5y2": "green",
			"x6y2": "green",
			"x7y2": "green",
			"x8y2": "water",
			"x9y2": "water",
			"x10y2": "green",
			"x11y2": "forest",
			"x12y2": "road",
			"x13y2": "forest",
			"x0y3": "forest",
			"x1y3": "forest",
			"x2y3": "road",
			"x3y3": "green",
			"x4y3": "green",
			"x5y3": "green",
			"x6y3": "green",
			"x7y3": "water",
			"x8y3": "water",
			"x9y3": "green",
			"x10y3": "forest",
			"x11y3": "road",
			"x12y3": "road",
			"x13y3": "hill",
			"x0y4": "green",
			"x1y4": "green",
			"x2y4": "road",
			"x3y4": "road",
			"x4y4": "road",
			"x5y4": "road",
			"x6y4": "green",
			"x7y4": "water",
			"x8y4": "water",
			"x9y4": "green",
			"x10y4": "hill",
			"x11y4": "road",
			"x12y4": "stone",
			"x13y4": "hill",
			"x0y5": "green",
			"x1y5": "stone",
			"x2y5": "green",
			"x3y5": "green",
			"x4y5": "green",
			"x5y5": "road",
			"x6y5": "green",
			"x7y5": "water",
			"x8y5": "green",
			"x9y5": "stone",
			"x10y5": "stone",
			"x11y5": "road",
			"x12y5": "stone",
			"x13y5": "stone",
			"x0y6": "hill",
			"x1y6": "forest",
			"x2y6": "green",
			"x3y6": "water",
			"x4y6": "water",
			"x5y6": "bridge-vertical",
			"x6y6": "water",
			"x7y6": "water",
			"x8y6": "forest",
			"x9y6": "hill",
			"x10y6": "stone",
			"x11y6": "road",
			"x12y6": "road",
			"x13y6": "stone",
			"x0y7": "forest",
			"x1y7": "green",
			"x2y7": "water",
			"x3y7": "green",
			"x4y7": "green",
			"x5y7": "road",
			"x6y7": "green",
			"x7y7": "water",
			"x8y7": "green",
			"x9y7": "green",
			"x10y7": "stone",
			"x11y7": "stone",
			"x12y7": "road",
			"x13y7": "road",
			"x0y8": "forest",
			"x1y8": "green",
			"x2y8": "water",
			"x3y8": "green",
			"x4y8": "forest",
			"x5y8": "green",
			"x6y8": "green",
			"x7y8": "water",
			"x8y8": "green",
			"x9y8": "green",
			"x10y8": "green",
			"x11y8": "stone",
			"x12y8": "green",
			"x13y8": "road",
			"x0y9": "green",
			"x1y9": "green",
			"x2y9": "water",
			"x3y9": "water",
			"x4y9": "green",
			"x5y9": "road",
			"x6y9": "green",
			"x7y9": "bridge-horizontal",
			"x8y9": "road",
			"x9y9": "road",
			"x10y9": "road",
			"x11y9": "hill",
			"x12y9": "green",
			"x13y9": "road",
			"x0y10": "green",
			"x1y10": "green",
			"x2y10": "green",
			"x3y10": "water",
			"x4y10": "water",
			"x5y10": "bridge-vertical",
			"x6y10": "water",
			"x7y10": "water",
			"x8y10": "green",
			"x9y10": "forest",
			"x10y10": "road",
			"x11y10": "green",
			"x12y10": "green",
			"x13y10": "road",
			"x0y11": "road",
			"x1y11": "road",
			"x2y11": "road",
			"x3y11": "bridge-horizontal",
			"x4y11": "green",
			"x5y11": "green",
			"x6y11": "green",
			"x7y11": "water",
			"x8y11": "forest",
			"x9y11": "green",
			"x10y11": "road",
			"x11y11": "road",
			"x12y11": "road",
			"x13y11": "road",
			"x0y12": "green",
			"x1y12": "green",
			"x2y12": "green",
			"x3y12": "water",
			"x4y12": "green",
			"x5y12": "stone",
			"x6y12": "hill",
			"x7y12": "water",
			"x8y12": "water",
			"x9y12": "water",
			"x10y12": "green",
			"x11y12": "green",
			"x12y12": "road",
			"x13y12": "green",
			"x0y13": "green",
			"x1y13": "water",
			"x2y13": "water",
			"x3y13": "water",
			"x4y13": "green",
			"x5y13": "hill",
			"x6y13": "forest",
			"x7y13": "forest",
			"x8y13": "green",
			"x9y13": "water",
			"x10y13": "green",
			"x11y13": "road",
			"x12y13": "road",
			"x13y13": "green",
			"x0y14": "green",
			"x1y14": "water",
			"x2y14": "green",
			"x3y14": "green",
			"x4y14": "forest",
			"x5y14": "forest",
			"x6y14": "forest",
			"x7y14": "green",
			"x8y14": "green",
			"x9y14": "bridge-horizontal",
			"x10y14": "forest",
			"x11y14": "green",
			"x12y14": "road",
			"x13y14": "green"
		},
		steps: [],
		availableUnits: ['soldier', 'archer', 'lizard', 'wizard', 'wisp', 'spider', 'golem', 'catapult', 'wyvern'],
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
				result.message = '<span class="color-red">X ' + window.langs[window.info.lang].missions.c07_finalAssault['Keep the knight'] + '</span>';
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

				util.clearTimeouts();

				var words = window.langs[window.info.lang].missions.c07_finalAssault;

				APP.notificationView.show({

					text: words.V2, tmpl: 'n-banner', image: { url: 'img/face/valadorn-2.png', cssClass: 'right' }, from: 'right',

					onHide: function () {

						APP.notificationView.show({

							text: words.G3, tmpl: 'n-banner', image: { url: 'img/face/galamar-1.png' },

							onHide: function () {

								APP.notificationView.show({
									type: 'alert',
									text: words.A2,
									//textCssClass: 'text-indent-with-margin-3',
									//header: window.langs[window.info.lang].objective,
									headerCssClass: 'text-align-left',
									tmpl: 'n-banner',
									bannerCssClass: 'target-alert',
									onHide:	function () {

										APP.notificationView.show({
											type: 'alert',
											text: window.langs[window.info.lang].thanks,
											textCssClass: 'text-align-center',
											//header: window.langs[window.info.lang].objective,
											headerCssClass: 'text-align-left',
											tmpl: 'n-banner',
											bannerCssClass: 'target-alert',

											onHide:	function () {
												APP.BattleMenuView.prototype.quitMission();

											}

										});

									}
								});

							}

						});

					}

				});

				return true;

			}

			return false;

		},
		notification: function () {

			if (APP.maps.c07_finalAssault.wasNotification) {
				return;
			}

			APP.maps.c07_finalAssault.wasNotification = true;

			var words = window.langs[window.info.lang].missions.c07_finalAssault;

			APP.notificationView.show({
				type: 'alert', text: words.A1, tmpl: 'n-banner', header: words.A1Header,

				onHide: function () {

					APP.notificationView.show({

						text: words.G1, tmpl: 'n-banner', image: { url: 'img/face/galamar-1.png' },

						onHide: function () {

							APP.notificationView.show({

								text: words.V1, tmpl: 'n-banner', image: { url: 'img/face/valadorn-2.png', cssClass: 'right' }, from: 'right',

								onHide: function () {

									APP.notificationView.show({

										text: words.G2, tmpl: 'n-banner', image: { url: 'img/face/galamar-1.png' },

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