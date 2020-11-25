(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP */

	APP.maps = APP.maps || {};

	APP.maps.testMap2 = {

		name: 'test map 2',
		jsName: 'testMap2',

		"size": {"width": 10, "height": 10},

		"units": [
			{"type": "Soldier", "x": 7, "y": 1, playerId: 0},
			{"type": "Knight", "x": 8, "y": 1, playerId: 0},
			{"type": "Bones", "x": 7, "y": 2, playerId: 0},
			{"type": "Spider", "x": 7, "y": 0, playerId: 0},
			{"type": "Wizard", "x": 6, "y": 2, playerId: 0},
			{"type": "Wisp", "x": 6, "y": 1, playerId: 0},

			{"type": "Knight", "x": 1, "y": 8, playerId: 1},
			{"type": "Soldier", "x": 2, "y": 8, playerId: 1},
			{"type": "Bones", "x": 2, "y": 7, playerId: 1},
			{"type": "Spider", "x": 2, "y": 9, playerId: 1},
			{"type": "Wizard", "x": 3, "y": 7, playerId: 1},
			{"type": "Wisp", "x": 3, "y": 8, playerId: 1}
		],

		"buildings": [
			{"type": "farm", "x": 9, "y": 0},
			{"type": "farm", "x": 1, "y": 1},
			{"type": "castle", "x": 8, "y": 1},
			{"type": "farm", "x": 2, "y": 4},
			{"type": "farm", "x": 7, "y": 5},
			{"type": "castle", "x": 1, "y": 8},
			{"type": "farm", "x": 8, "y": 8},
			{"type": "farm", "x": 0, "y": 9}
		],

		"terrain": {"x0y0": "forest", "x1y0": "forest", "x2y0": "hill", "x3y0": "hill", "x4y0": "hill", "x5y0": "forest", "x6y0": "forest", "x7y0": "forest", "x8y0": "forest", "x9y0": "green", "x0y1": "forest", "x1y1": "green", "x2y1": "green", "x3y1": "green", "x4y1": "road", "x5y1": "road", "x6y1": "road", "x7y1": "road", "x8y1": "green", "x9y1": "forest", "x0y2": "water", "x1y2": "water", "x2y2": "water", "x3y2": "water", "x4y2": "road", "x5y2": "green", "x6y2": "hill", "x7y2": "hill", "x8y2": "road", "x9y2": "forest", "x0y3": "green", "x1y3": "road", "x2y3": "road", "x3y3": "bridge-horizontal", "x4y3": "road", "x5y3": "green", "x6y3": "hill", "x7y3": "stone", "x8y3": "road", "x9y3": "forest", "x0y4": "green", "x1y4": "road", "x2y4": "green", "x3y4": "water", "x4y4": "water", "x5y4": "water", "x6y4": "green", "x7y4": "green", "x8y4": "road", "x9y4": "forest", "x0y5": "forest", "x1y5": "road", "x2y5": "green", "x3y5": "green", "x4y5": "water", "x5y5": "water", "x6y5": "water", "x7y5": "green", "x8y5": "road", "x9y5": "green", "x0y6": "forest", "x1y6": "road", "x2y6": "stone", "x3y6": "hill", "x4y6": "green", "x5y6": "road", "x6y6": "bridge-horizontal", "x7y6": "road", "x8y6": "road", "x9y6": "green", "x0y7": "forest", "x1y7": "road", "x2y7": "hill", "x3y7": "hill", "x4y7": "green", "x5y7": "road", "x6y7": "water", "x7y7": "water", "x8y7": "water", "x9y7": "water", "x0y8": "forest", "x1y8": "green", "x2y8": "road", "x3y8": "road", "x4y8": "road", "x5y8": "road", "x6y8": "green", "x7y8": "green", "x8y8": "green", "x9y8": "forest", "x0y9": "green", "x1y9": "forest", "x2y9": "forest", "x3y9": "forest", "x4y9": "forest", "x5y9": "hill", "x6y9": "hill", "x7y9": "hill", "x8y9": "forest", "x9y9": "forest"}

	};

}(window, document, document.documentElement));