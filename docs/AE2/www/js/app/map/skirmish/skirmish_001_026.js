/*jslint white: true, nomen: true */
(function (win) {

    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_026 = {
        version: 1,
        "type": "skirmish",
        "size": {"width": 9, "height": 12},
        "name": "Siege 3",
        "name-es": "Cerco 3",
        "name-ru": "Осада 3",
        "isOpen": true,
        "maxPlayers": 2,
        "units": [{"x": 4, "y": 3, "type": "catapult", "ownerId": 0}, {
            "x": 4,
            "y": 11,
            "type": "commander",
            "ownerId": 1
        }, {"x": 2, "y": 11, "type": "catapult", "ownerId": 1}, {
            "x": 3,
            "y": 10,
            "type": "catapult",
            "ownerId": 1
        }, {"x": 4, "y": 9, "type": "catapult", "ownerId": 1}, {
            "x": 5,
            "y": 10,
            "type": "catapult",
            "ownerId": 1
        }, {"x": 6, "y": 11, "type": "catapult", "ownerId": 1}],
        "buildings": [{"x": 3, "y": 1, "type": "farm", "state": "normal"}, {
            "x": 5,
            "y": 1,
            "type": "farm",
            "state": "normal"
        }, {"x": 4, "y": 1, "type": "farm", "state": "normal"}, {
            "x": 5,
            "y": 2,
            "type": "farm",
            "state": "normal"
        }, {"x": 5, "y": 3, "type": "farm", "state": "normal"}, {
            "x": 4,
            "y": 3,
            "type": "farm",
            "state": "normal"
        }, {"x": 3, "y": 3, "type": "farm", "state": "normal"}, {
            "x": 3,
            "y": 2,
            "type": "farm",
            "state": "normal"
        }, {"x": 6, "y": 6, "type": "farm", "state": "normal"}, {
            "x": 5,
            "y": 7,
            "type": "farm",
            "state": "normal"
        }, {"x": 2, "y": 6, "type": "farm", "state": "normal"}, {
            "x": 3,
            "y": 7,
            "type": "farm",
            "state": "normal"
        }, {"x": 5, "y": 6, "type": "farm", "state": "destroyed"}, {
            "x": 6,
            "y": 7,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 2, "y": 7, "type": "farm", "state": "destroyed"}, {
            "x": 3,
            "y": 6,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 8, "y": 0, "type": "farm", "state": "destroyed"}, {
            "x": 0,
            "y": 0,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 4, "y": 2, "type": "castle", "state": "normal", "ownerId": 0}, {
            "x": 4,
            "y": 11,
            "type": "castle",
            "state": "normal",
            "ownerId": 1
        }],
        "terrain": {
            "x0y0": "terra-1",
            "x0y1": "terra-1",
            "x0y2": "terra-1",
            "x0y3": "terra-1",
            "x0y4": "terra-1",
            "x0y5": "terra-1",
            "x0y6": "terra-1",
            "x0y7": "terra-1",
            "x0y8": "terra-1",
            "x0y9": "forest-2",
            "x0y10": "terra-1",
            "x1y0": "road-1",
            "x1y1": "road-1",
            "x1y2": "road-1",
            "x1y3": "road-1",
            "x1y4": "road-1",
            "x1y5": "road-1",
            "x1y6": "road-1",
            "x1y7": "road-1",
            "x1y8": "road-1",
            "x1y9": "terra-1",
            "x1y10": "terra-1",
            "x2y0": "water-1",
            "x2y1": "water-1",
            "x2y2": "water-1",
            "x2y3": "water-1",
            "x2y4": "water-1",
            "x2y5": "road-1",
            "x2y6": "terra-1",
            "x2y7": "terra-1",
            "x2y8": "road-1",
            "x2y9": "forest-1",
            "x2y10": "terra-1",
            "x3y0": "water-1",
            "x3y1": "terra-1",
            "x3y2": "terra-1",
            "x3y3": "terra-1",
            "x3y4": "water-1",
            "x3y5": "road-1",
            "x3y6": "terra-1",
            "x3y7": "terra-1",
            "x3y8": "road-1",
            "x3y9": "terra-1",
            "x3y10": "terra-1",
            "x4y0": "water-1",
            "x4y1": "terra-1",
            "x4y2": "road-1",
            "x4y3": "terra-1",
            "x4y4": "water-1",
            "x4y5": "road-1",
            "x4y6": "road-1",
            "x4y7": "road-1",
            "x4y8": "road-1",
            "x4y9": "road-1",
            "x4y10": "road-1",
            "x5y0": "water-1",
            "x5y1": "terra-1",
            "x5y2": "terra-1",
            "x5y3": "terra-1",
            "x5y4": "water-1",
            "x5y5": "road-1",
            "x5y6": "terra-1",
            "x5y7": "terra-1",
            "x5y8": "road-1",
            "x5y9": "terra-1",
            "x5y10": "terra-1",
            "x6y0": "water-1",
            "x6y1": "water-1",
            "x6y2": "water-1",
            "x6y3": "water-1",
            "x6y4": "water-1",
            "x6y5": "road-1",
            "x6y6": "terra-1",
            "x6y7": "terra-1",
            "x6y8": "road-1",
            "x6y9": "forest-2",
            "x6y10": "terra-1",
            "x7y0": "road-1",
            "x7y1": "road-1",
            "x7y2": "road-1",
            "x7y3": "road-1",
            "x7y4": "road-1",
            "x7y5": "road-1",
            "x7y6": "road-1",
            "x7y7": "road-1",
            "x7y8": "road-1",
            "x7y9": "terra-1",
            "x7y10": "terra-1",
            "x8y0": "terra-1",
            "x8y1": "terra-1",
            "x8y2": "terra-1",
            "x8y3": "terra-1",
            "x8y4": "terra-1",
            "x8y5": "terra-1",
            "x8y6": "terra-1",
            "x8y7": "terra-1",
            "x8y8": "terra-1",
            "x8y9": "forest-1",
            "x8y10": "terra-1",
            "x0y11": "terra-1",
            "x1y11": "forest-2",
            "x2y11": "terra-1",
            "x3y11": "terra-1",
            "x4y11": "road-1",
            "x5y11": "terra-1",
            "x6y11": "terra-1",
            "x7y11": "forest-1",
            "x8y11": "terra-1"
        }
    };

}(window));