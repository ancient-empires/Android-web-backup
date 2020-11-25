/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window */
	/*global */

	win.APP.soundMaster = win.APP.soundMaster || {};

	win.APP.soundMaster.iosPlayer = {

		roads: new Array(4),

		pathPrefix: 'sounds/',

		init: function () {

		},

		play: function (data) {

			if (data.road) {
				return;
			}

			var player = this,
				roadNumber = data.road,
				isLoop = data.isLoop,
				sound = data.sound,
				newAudio,
				settings = {
					playAudioWhenScreenIsLocked: false
				};

			player.stop(data);

			newAudio = new Media(player.pathPrefix + sound);

			if (isLoop) {
				settings.numberOfLoops = 9;
			}

			newAudio.play(settings); // play audio with needed settings

			player.roads[roadNumber] = newAudio;

		},

		stop: function (data) {

			var player = this,
				roadNumber = data.road,
				road = player.roads[roadNumber];

			if ( road && road.release ) {
				player.roads[roadNumber].stop();
				player.roads[roadNumber].release();
			}

		}

	}

}(window));