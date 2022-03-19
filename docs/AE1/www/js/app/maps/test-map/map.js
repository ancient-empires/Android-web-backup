(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP */

	var terra = APP.map.terrainTypes,
		build = APP.map.buildingsTypes;

	APP.maps = APP.maps || {};

	APP.maps.testMap = {

		name: 'test map',
		jsName: 'testMap',

		size: {
			width: 20,
			height: 10
		},

		units: [

			{
				type: 'Archer',
				x: 0,
				y: 0,
				playerId: 1
			},

			{
				type: 'Bones',
				x: 3,
				y: 3,
				playerId: 1
			},

			{
				type: 'Catapult',
				x: 0,
				y: 1,
				playerId: 1
			},
			{
				type: 'Golem',
				x: 0,
				y: 2,
				playerId: 1
			},
			{
				type: 'Knight',
				x: 0,
				y: 3,
				playerId: 1
			},
			{
				type: 'Lizard',
				x: 0,
				y: 4,
				playerId: 1
			},
			{
				type: 'Soldier',
				x: 0,
				y: 5,
				playerId: 1
			},
			{
				type: 'Spider',
				x: 0,
				y: 6,
				playerId: 1
			},
			{
				type: 'Wisp',
				x: 0,
				y: 7,
				playerId: 1
			},
			{
				type: 'Wizard',
				x: 0,
				y: 8,
				playerId: 1
			},
			{
				type: 'Wyvern',
				x: 0,
				y: 9,
				playerId: 1
			},

			{
				type: 'Soldier',
				x: 1,
				y: 1,
				playerId: 1
			},
			{
				type: 'Soldier',
				x: 16,
				y: 4,
				playerId: 0
			},
			{
				type: 'Archer',
				x: 3,
				y: 1,
				playerId: 1
			},
			{
				type: 'Archer',
				x: 13,
				y: 4,
				playerId: 0
			},
			{
				type: 'Knight',
				x: 5,
				y: 1,
				playerId: 1
			},
			{
				type: 'Knight',
				x: 10,
				y: 4,
				playerId: 0
			}
		],

		buildings: [
			{
				type: build[0],
				x: 1,
				y: 2
			},
			{
				type: build[1],
				x: 2,
				y: 3
			},
			{
				type: build[0],
				x: 11,
				y: 9
			},
			{
				type: build[1],
				x: 10,
				y: 4
			}
		],
		// terrainTypes: ['forest', 'green', 'hill', 'road', 'stone', 'water'],
		terrain: {
			x1y1: terra[0],
			x1y2: terra[1],
			x1y3: terra[2],
			x1y4: terra[3],
			x1y5: terra[4],
			x2y5: terra[5]
		}

	};

}(window, document, document.documentElement));