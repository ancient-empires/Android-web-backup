/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window, document */
	/*global APP */

	win.APP.maps = win.APP.maps || {};

	win.APP.maps.skirmish_001_058 = {
		"type": "skirmish",
		"size": {"width": 10, "height": 17},
		"name": "Wall",
		"name-es": "Pared",
		"name-ru": "Стена",
		"isOpen": true,
		"maxPlayers": 2,
		"units": [{"x": 3, "y": 13, "type": "commander", "ownerId": 1}, {"x": 3, "y": 3, "type": "commander", "ownerId": 0}],
		"buildings": [{"x": 4, "y": 1, "type": "well", "state": "normal"}, {"x": 5, "y": 1, "type": "well", "state": "normal"}, {"x": 6, "y": 1, "type": "well", "state": "normal"}, {"x": 3, "y": 1, "type": "well", "state": "normal"}, {"x": 8, "y": 3, "type": "well", "state": "normal"}, {"x": 8, "y": 4, "type": "well", "state": "normal"}, {"x": 3, "y": 6, "type": "well", "state": "normal"}, {"x": 4, "y": 6, "type": "well", "state": "normal"}, {"x": 5, "y": 6, "type": "well", "state": "normal"}, {"x": 6, "y": 6, "type": "well", "state": "normal"}, {"x": 3, "y": 15, "type": "well", "state": "normal"}, {"x": 4, "y": 15, "type": "well", "state": "normal"}, {"x": 5, "y": 15, "type": "well", "state": "normal"}, {"x": 6, "y": 15, "type": "well", "state": "normal"}, {"x": 3, "y": 10, "type": "well", "state": "normal"}, {"x": 4, "y": 10, "type": "well", "state": "normal"}, {"x": 5, "y": 10, "type": "well", "state": "normal"}, {"x": 6, "y": 10, "type": "well", "state": "normal"}, {"x": 1, "y": 3, "type": "well", "state": "normal"}, {"x": 1, "y": 4, "type": "well", "state": "normal"}, {"x": 8, "y": 12, "type": "well", "state": "normal"}, {
			"x": 8,
			"y": 13,
			"type": "well",
			"state": "normal"
		}, {"x": 1, "y": 12, "type": "well", "state": "normal"}, {"x": 1, "y": 13, "type": "well", "state": "normal"}, {"x": 2, "y": 10, "type": "temple", "state": "normal"}, {"x": 1, "y": 11, "type": "temple", "state": "normal"}, {"x": 7, "y": 10, "type": "temple", "state": "normal"}, {"x": 8, "y": 11, "type": "temple", "state": "normal"}, {"x": 8, "y": 5, "type": "temple", "state": "normal"}, {"x": 7, "y": 6, "type": "temple", "state": "normal"}, {"x": 2, "y": 6, "type": "temple", "state": "normal"}, {"x": 1, "y": 5, "type": "temple", "state": "normal"}, {"x": 0, "y": 0, "type": "farm", "state": "normal", "ownerId": 0}, {"x": 9, "y": 0, "type": "farm", "state": "normal", "ownerId": 0}, {"x": 7, "y": 1, "type": "farm", "state": "normal", "ownerId": 0}, {"x": 2, "y": 1, "type": "farm", "state": "normal", "ownerId": 0}, {"x": 8, "y": 1, "type": "castle", "state": "normal", "ownerId": 0}, {"x": 1, "y": 1, "type": "castle", "state": "normal", "ownerId": 0}, {"x": 8, "y": 2, "type": "farm", "state": "normal", "ownerId": 0}, {"x": 1, "y": 2, "type": "farm", "state": "normal", "ownerId": 0}, {"x": 8, "y": 15, "type": "castle", "state": "normal", "ownerId": 1}, {
			"x": 1,
			"y": 15,
			"type": "castle",
			"state": "normal",
			"ownerId": 1
		}, {"x": 8, "y": 14, "type": "farm", "state": "normal", "ownerId": 1}, {"x": 7, "y": 15, "type": "farm", "state": "normal", "ownerId": 1}, {"x": 2, "y": 15, "type": "farm", "state": "normal", "ownerId": 1}, {"x": 1, "y": 14, "type": "farm", "state": "normal", "ownerId": 1}, {"x": 0, "y": 16, "type": "farm", "state": "normal", "ownerId": 1}, {"x": 9, "y": 16, "type": "farm", "state": "normal", "ownerId": 1}],
		"terrain": {
			"x0y6": "stone-1",
			"x0y7": "stone-1",
			"x0y8": "stone-1",
			"x0y9": "stone-1",
			"x0y10": "stone-1",
			"x0y11": "stone-1",
			"x0y12": "stone-1",
			"x0y13": "stone-1",
			"x0y14": "stone-1",
			"x0y15": "stone-1",
			"x0y16": "terra-1",
			"x1y6": "stone-1",
			"x1y7": "stone-1",
			"x1y8": "stone-1",
			"x1y9": "stone-1",
			"x1y10": "stone-1",
			"x1y11": "road-1",
			"x1y12": "road-1",
			"x1y13": "road-1",
			"x1y14": "terra-1",
			"x1y15": "road-1",
			"x1y16": "stone-1",
			"x2y6": "road-1",
			"x2y7": "stone-1",
			"x2y8": "stone-1",
			"x2y9": "stone-1",
			"x2y10": "road-1",
			"x2y11": "road-1",
			"x2y12": "road-1",
			"x2y13": "road-1",
			"x2y14": "road-1",
			"x2y15": "terra-1",
			"x2y16": "stone-1",
			"x3y6": "road-1",
			"x3y7": "stone-1",
			"x3y8": "stone-1",
			"x3y9": "stone-1",
			"x3y10": "road-1",
			"x3y11": "road-1",
			"x3y12": "road-1",
			"x3y13": "road-1",
			"x3y14": "road-1",
			"x3y15": "road-1",
			"x3y16": "stone-1",
			"x4y6": "road-1",
			"x4y7": "stone-1",
			"x4y8": "stone-1",
			"x4y9": "stone-1",
			"x4y10": "road-1",
			"x4y11": "road-1",
			"x4y12": "road-1",
			"x4y13": "road-1",
			"x4y14": "road-1",
			"x4y15": "road-1",
			"x4y16": "stone-1",
			"x5y6": "road-1",
			"x5y7": "stone-1",
			"x5y8": "stone-1",
			"x5y9": "stone-1",
			"x5y10": "road-1",
			"x5y11": "road-1",
			"x5y12": "road-1",
			"x5y13": "road-1",
			"x5y14": "road-1",
			"x5y15": "road-1",
			"x5y16": "stone-1",
			"x6y6": "road-1",
			"x6y7": "stone-1",
			"x6y8": "stone-1",
			"x6y9": "stone-1",
			"x6y10": "road-1",
			"x6y11": "road-1",
			"x6y12": "road-1",
			"x6y13": "road-1",
			"x6y14": "road-1",
			"x6y15": "road-1",
			"x6y16": "stone-1",
			"x7y6": "road-1",
			"x7y7": "stone-1",
			"x7y8": "stone-1",
			"x7y9": "stone-1",
			"x7y10": "road-1",
			"x7y11": "road-1",
			"x7y12": "road-1",
			"x7y13": "road-1",
			"x7y14": "road-1",
			"x7y15": "terra-1",
			"x7y16": "stone-1",
			"x8y6": "stone-1",
			"x8y7": "stone-1",
			"x8y8": "stone-1",
			"x8y9": "stone-1",
			"x8y10": "stone-1",
			"x8y11": "road-1",
			"x8y12": "road-1",
			"x8y13": "road-1",
			"x8y14": "terra-1",
			"x8y15": "road-1",
			"x8y16": "stone-1",
			"x9y6": "stone-1",
			"x9y7": "stone-1",
			"x9y8": "stone-1",
			"x9y9": "stone-1",
			"x9y10": "stone-1",
			"x9y11": "stone-1",
			"x9y12": "stone-1",
			"x9y13": "stone-1",
			"x9y14": "stone-1",
			"x9y15": "stone-1",
			"x9y16": "terra-1",
			"x0y5": "stone-1",
			"x1y5": "road-1",
			"x2y5": "road-1",
			"x3y5": "road-1",
			"x4y5": "road-1",
			"x5y5": "road-1",
			"x6y5": "road-1",
			"x7y5": "road-1",
			"x8y5": "road-1",
			"x9y5": "stone-1",
			"x0y4": "stone-1",
			"x1y4": "road-1",
			"x2y4": "road-1",
			"x3y4": "road-1",
			"x4y4": "road-1",
			"x5y4": "road-1",
			"x6y4": "road-1",
			"x7y4": "road-1",
			"x8y4": "road-1",
			"x9y4": "stone-1",
			"x0y3": "stone-1",
			"x1y3": "road-1",
			"x2y3": "road-1",
			"x3y3": "road-1",
			"x4y3": "road-1",
			"x5y3": "road-1",
			"x6y3": "road-1",
			"x7y3": "road-1",
			"x8y3": "road-1",
			"x9y3": "stone-1",
			"x0y2": "stone-1",
			"x1y2": "terra-1",
			"x2y2": "road-1",
			"x3y2": "road-1",
			"x4y2": "road-1",
			"x5y2": "road-1",
			"x6y2": "road-1",
			"x7y2": "road-1",
			"x8y2": "terra-1",
			"x9y2": "stone-1",
			"x0y1": "stone-1",
			"x1y1": "road-1",
			"x2y1": "terra-1",
			"x3y1": "road-1",
			"x4y1": "road-1",
			"x5y1": "road-1",
			"x6y1": "road-1",
			"x7y1": "terra-1",
			"x8y1": "road-1",
			"x9y1": "stone-1",
			"x0y0": "terra-1",
			"x1y0": "stone-1",
			"x2y0": "stone-1",
			"x3y0": "stone-1",
			"x4y0": "stone-1",
			"x5y0": "stone-1",
			"x6y0": "stone-1",
			"x7y0": "stone-1",
			"x8y0": "stone-1",
			"x9y0": "terra-1"
		}
	};

}(window));