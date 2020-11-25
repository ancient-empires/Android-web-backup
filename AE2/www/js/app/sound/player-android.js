/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window */
	/*global */

	win.APP.soundMaster = win.APP.soundMaster || {};

	win.APP.soundMaster.androidPlayer = {

		pathPrefix: 'www/sounds/',

		init: function () {

		},

		play: function (data) {

			var player = this,
				roadNumber = data.road,
				isLoop = data.isLoop,
				sound = data.sound,
				src = player.pathPrefix + sound,
				andAud = window['AndAud_' + roadNumber];

			if (isLoop) {
				andAud.playAudioLooping(src);
			} else {
				andAud.playAudio(src);
			}

		},

		stop: function (data) {

			var roadNumber = data.road,
				andAud = window['AndAud_' + roadNumber];

			andAud.stop();

		}

	}

}(window));