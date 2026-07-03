/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window */
	/*global */

	win.APP.soundMaster = win.APP.soundMaster || {};

	win.APP.soundMaster.webPlayer = {

		roads: new Array(4),

		pathPrefix: 'sounds/',

		init: function () {

			var player = this;

			player.roads = _.map(player.roads, function () {
				return new Audio();
			});

		},

		playWhenAllowed: function (audio, roadNumber, shouldResume) {

			var player = this,
				playPromise;

			if ( win.APP.info.get('music') === 'off' || player.roads[roadNumber] !== audio ) {
				return;
			}

			playPromise = audio.play();

			if ( playPromise && playPromise.then ) {
				playPromise.then(function () {
					player.clearUserGesture(audio);
				}, function (error) {
					if (!shouldResume) {
						return;
					}

					if ( error && error.name !== 'NotAllowedError' ) {
						return;
					}

					player.waitForUserGesture(audio, roadNumber);
				});
			}

		},

		waitForUserGesture: function (audio, roadNumber) {

			var player = this,
				resume = audio.soundMasterResume;

			if (resume) {
				return;
			}

			resume = function () {
				player.clearUserGesture(audio);
				player.playWhenAllowed(audio, roadNumber, true);
			};

			audio.soundMasterResume = resume;

			win.addEventListener('click', resume, true);
			win.addEventListener('touchend', resume, true);
			win.addEventListener('keydown', resume, true);

		},

		clearUserGesture: function (audio) {

			var resume = audio.soundMasterResume;

			if (!resume) {
				return;
			}

			win.removeEventListener('click', resume, true);
			win.removeEventListener('touchend', resume, true);
			win.removeEventListener('keydown', resume, true);

			audio.soundMasterResume = null;

		},

		play: function (data) {

			var player = this,
				roadNumber = data.road,
				isLoop = data.isLoop,
				sound = data.sound,
				newAudio;

			player.stop(data);

			newAudio = new Audio();
			if (isLoop) {
				newAudio.addEventListener('ended', function() {
					if ( win.APP.info.get('music') === 'off' ) {
						return;
					}
					var audio = this;
					audio.currentTime = 0;
					player.playWhenAllowed(audio, roadNumber, true);
				}, false);
			}

			newAudio.addEventListener('canplay', function () {
				if ( win.APP.info.get('music') === 'off' ) {
					return;
				}
				player.playWhenAllowed(this, roadNumber, isLoop);
			});

			player.roads[roadNumber].src = '';
			player.roads[roadNumber] = newAudio;

			newAudio.src = player.pathPrefix + sound;

			if (isLoop) {
				player.waitForUserGesture(newAudio, roadNumber);
			}

		},

		stop: function (data) {

			var player = this,
				roadNumber = data.road,
				road = player.roads[roadNumber];

			if (road) {
				player.clearUserGesture(road);
			}

			if (road && road.pause) {
				road.pause();
			}

			if (road && road.currentTime && road.currentTime < 0.1) {
				road.currentTime = 0;
			}

		}

	}

}(window));