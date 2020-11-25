/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global console, alert, window, document */
	/*global */

	var terrainPath = 'i/map/terra/terra/',
		anglePath = 'i/map/terra/angle/',
		buildingPath = 'i/map/terra/building/';

	win.APP.mapTiles = {

		// main
		'bridge-1': terrainPath + 'bridge-1.png',
		'bridge-2': terrainPath + 'bridge-2.png',
		'forest-1': terrainPath + 'forest-1.png',
		'forest-2': terrainPath + 'forest-2.png',
		'hill-1': terrainPath + 'hill-1.png',
		'road-1': terrainPath + 'road-1.png',
		'stone-1': terrainPath + 'stone-1.png',
		'stone-2': terrainPath + 'stone-2.png',
		'terra-1': terrainPath + 'terra-1.png',
		'terra-2': terrainPath + 'terra-2.png',
		'terra-3': terrainPath + 'terra-3.png',
		'terra-4': terrainPath + 'terra-4.png',
		'terra-5': terrainPath + 'terra-5.png',
		'water-1': terrainPath + 'water-1.png',
		'water-2': terrainPath + 'water-2.png',
		'water-3': terrainPath + 'water-3.png',

		// angles
			// road
		'a-road-1': anglePath + 'road-1.png',
		'a-road-2': anglePath + 'road-2.png',
		'a-road-3': anglePath + 'road-3.png',
		'a-road-4': anglePath + 'road-4.png',
		'a-road-6': anglePath + 'road-6.png',
		'a-road-7': anglePath + 'road-7.png',
		'a-road-8': anglePath + 'road-8.png',
		'a-road-9': anglePath + 'road-9.png',
		'a-road-1-s': anglePath + 'road-1-s.png',
		'a-road-3-s': anglePath + 'road-3-s.png',
		'a-road-7-s': anglePath + 'road-7-s.png',
		'a-road-9-s': anglePath + 'road-9-s.png',
		
			// water
		'a-water-1': anglePath + 'water-1.png',
		'a-water-2': anglePath + 'water-2.png',
		'a-water-3': anglePath + 'water-3.png',
		'a-water-4': anglePath + 'water-4.png',
		'a-water-6': anglePath + 'water-6.png',
		'a-water-7': anglePath + 'water-7.png',
		'a-water-8': anglePath + 'water-8.png',
		'a-water-9': anglePath + 'water-9.png',
		'a-water-1-s': anglePath + 'water-1-s.png',
		'a-water-3-s': anglePath + 'water-3-s.png',
		'a-water-7-s': anglePath + 'water-7-s.png',
		'a-water-9-s': anglePath + 'water-9-s.png'

	};

	win.APP.mapTilesPreview = {
		'bridge-1': terrainPath + 'bridge-1.png',
		'bridge-2': terrainPath + 'bridge-2.png',
		'forest-1': terrainPath + 'forest-1.png',
		'forest-2': terrainPath + 'forest-2.png',
		'hill-1': terrainPath + 'hill-1.png',
		'road-1': terrainPath + 'road-1.png',
		'stone-1': terrainPath + 'stone-1.png',
		'stone-2': terrainPath + 'stone-2.png',
		'terra-1': terrainPath + 'terra-1.png',
		'terra-2': terrainPath + 'terra-2.png',
		'terra-3': terrainPath + 'terra-3.png',
		'terra-4': terrainPath + 'terra-4.png',
		'terra-5': terrainPath + 'terra-5.png',
		'water-1': terrainPath + 'water-1.png',
		'water-2': terrainPath + 'water-2.png',
		'water-3': terrainPath + 'water-3.png',

		// buildings
		'well': buildingPath + 'well.png',
		'temple': buildingPath + 'temple.png',
		'castle-black': buildingPath + 'castle-black.png',
		'castle-blue': buildingPath + 'castle-blue.png',
		'castle-gray': buildingPath + 'castle-gray.png',
		'castle-green': buildingPath + 'castle-green.png',
		'castle-red': buildingPath + 'castle-red.png',
		'farm-black': buildingPath + 'farm-black.png',
		'farm-blue': buildingPath + 'farm-blue.png',
		'farm-gray': buildingPath + 'farm-gray.png',
		'farm-green': buildingPath + 'farm-green.png',
		'farm-red': buildingPath + 'farm-red.png',
		'farm-destroyed': buildingPath + 'farm-destroyed.png'
	};

}(window));
