/*jslint white: true, nomen: true */
(function (win) {

    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_029 = {
        version: 1,
        "type": "skirmish",
        "size": {"width": 8, "height": 8},
        "name": "Chess 2",
        "name-es": "Ajedrez 2",
        "name-ru": "Шахматы 2",
        "isOpen": true,
        "maxPlayers": 2,
        "units": [{"x": 4, "y": 0, "type": "commander", "ownerId": 0}, {
            "x": 3,
            "y": 0,
            "type": "sorceress",
            "ownerId": 0
        }, {"x": 5, "y": 0, "type": "dire-wolf", "ownerId": 0}, {
            "x": 2,
            "y": 0,
            "type": "dire-wolf",
            "ownerId": 0
        }, {"x": 6, "y": 0, "type": "archer", "ownerId": 0}, {"x": 1, "y": 0, "type": "archer", "ownerId": 0}, {
            "x": 7,
            "y": 0,
            "type": "golem",
            "ownerId": 0
        }, {"x": 0, "y": 0, "type": "golem", "ownerId": 0}, {"x": 0, "y": 1, "type": "soldier", "ownerId": 0}, {
            "x": 1,
            "y": 1,
            "type": "soldier",
            "ownerId": 0
        }, {"x": 2, "y": 1, "type": "soldier", "ownerId": 0}, {
            "x": 3,
            "y": 1,
            "type": "soldier",
            "ownerId": 0
        }, {"x": 4, "y": 1, "type": "soldier", "ownerId": 0}, {
            "x": 5,
            "y": 1,
            "type": "soldier",
            "ownerId": 0
        }, {"x": 6, "y": 1, "type": "soldier", "ownerId": 0}, {
            "x": 7,
            "y": 1,
            "type": "soldier",
            "ownerId": 0
        }, {"x": 4, "y": 7, "type": "commander", "ownerId": 1}, {
            "x": 3,
            "y": 7,
            "type": "sorceress",
            "ownerId": 1
        }, {"x": 5, "y": 7, "type": "dire-wolf", "ownerId": 1}, {
            "x": 2,
            "y": 7,
            "type": "dire-wolf",
            "ownerId": 1
        }, {"x": 6, "y": 7, "type": "archer", "ownerId": 1}, {"x": 1, "y": 7, "type": "archer", "ownerId": 1}, {
            "x": 7,
            "y": 7,
            "type": "golem",
            "ownerId": 1
        }, {"x": 0, "y": 7, "type": "golem", "ownerId": 1}, {"x": 0, "y": 6, "type": "soldier", "ownerId": 1}, {
            "x": 1,
            "y": 6,
            "type": "soldier",
            "ownerId": 1
        }, {"x": 2, "y": 6, "type": "soldier", "ownerId": 1}, {
            "x": 3,
            "y": 6,
            "type": "soldier",
            "ownerId": 1
        }, {"x": 4, "y": 6, "type": "soldier", "ownerId": 1}, {
            "x": 5,
            "y": 6,
            "type": "soldier",
            "ownerId": 1
        }, {"x": 6, "y": 6, "type": "soldier", "ownerId": 1}, {"x": 7, "y": 6, "type": "soldier", "ownerId": 1}],
        "buildings": [{"x": 5, "y": 2, "type": "farm", "state": "destroyed"}, {
            "x": 7,
            "y": 4,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 2, "y": 5, "type": "farm", "state": "destroyed"}, {
            "x": 0,
            "y": 3,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 4, "y": 0, "type": "castle", "state": "normal", "ownerId": 0}, {
            "x": 4,
            "y": 7,
            "type": "castle",
            "state": "normal",
            "ownerId": 1
        }],
        "terrain": {
            "x0y0": "forest-1",
            "x0y1": "terra-1",
            "x0y2": "forest-1",
            "x0y3": "terra-1",
            "x0y4": "forest-1",
            "x0y5": "terra-1",
            "x0y6": "forest-1",
            "x0y7": "terra-1",
            "x1y0": "terra-1",
            "x1y1": "forest-2",
            "x1y2": "terra-1",
            "x1y3": "forest-2",
            "x1y4": "terra-1",
            "x1y5": "forest-2",
            "x1y6": "terra-1",
            "x1y7": "forest-2",
            "x2y0": "forest-1",
            "x2y1": "terra-1",
            "x2y2": "forest-1",
            "x2y3": "terra-1",
            "x2y4": "forest-1",
            "x2y5": "terra-1",
            "x2y6": "forest-1",
            "x2y7": "terra-1",
            "x3y0": "terra-1",
            "x3y1": "forest-2",
            "x3y2": "terra-1",
            "x3y3": "forest-2",
            "x3y4": "terra-1",
            "x3y5": "forest-2",
            "x3y6": "terra-1",
            "x3y7": "forest-2",
            "x4y0": "road-1",
            "x4y1": "terra-1",
            "x4y2": "forest-1",
            "x4y3": "terra-1",
            "x4y4": "forest-1",
            "x4y5": "terra-1",
            "x4y6": "forest-1",
            "x4y7": "road-1",
            "x5y0": "terra-1",
            "x5y1": "forest-2",
            "x5y2": "terra-1",
            "x5y3": "forest-2",
            "x5y4": "terra-1",
            "x5y5": "forest-2",
            "x5y6": "terra-1",
            "x5y7": "forest-2",
            "x6y0": "forest-1",
            "x6y1": "terra-1",
            "x6y2": "forest-1",
            "x6y3": "terra-1",
            "x6y4": "forest-1",
            "x6y5": "terra-1",
            "x6y6": "forest-1",
            "x6y7": "terra-1",
            "x7y0": "terra-1",
            "x7y1": "forest-2",
            "x7y2": "terra-1",
            "x7y3": "forest-2",
            "x7y4": "terra-1",
            "x7y5": "forest-2",
            "x7y6": "terra-1",
            "x7y7": "forest-2"
        }
    };

}(window));