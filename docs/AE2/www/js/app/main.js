/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window, document, setTimeout, history, location, Image*/
	/*global APP, Backbone, FastClick, _, $ */

	win.APP = win.APP || {};

	win.APP.bb = win.APP.bb || {};

	function startApp() {

		$('.js-wrapper').empty().html('');

		var settingsPrototype;
		//win.APP.BB.BaseView.prototype.util.loadSavedTheme();
		win.APP.bb.router = new win.APP.BB.Router();
		Backbone.history.start();
		settingsPrototype = win.APP.BB.SettingsView.prototype;
		settingsPrototype.setSpeedStyle();
		settingsPrototype.autoShowBuildingSmoke();
		settingsPrototype.autoShowUnitAnimation();
		settingsPrototype.autoSetFont();
		win.APP.soundMaster.init();
		win.APP.soundMaster.playBgSound();

		// todo: uncomment for iOS
		//setTimeout(function () {
		//	win.APP.soundMaster.play({
		//		sound: 'click.mp3',
		//		road: 3,
		//		isLoop: false
		//	});
		//}, 1000);
        //
		//setTimeout(function () {
		//	win.APP.soundMaster.playBgSound();
		//}, 2000);

	}

	(function back() {
		if ( !location.hash ) {
			return;
		}
		win.history.back();
		setTimeout(back, 50);
	}());

	function start() {

		var timeInterval = parseFloat(win.APP.info.get('android-version', true)) === 4.1 ? 5e3 : 0;

		setTimeout(function () {

			APP.templateMaster.init();
			win.APP.util.setHTMLStyle();
			win.APP.BB.BaseView.prototype.initStatic();
			FastClick.attach(document.body);

			win.APP.map.preloadData().then(startApp);

		}, timeInterval);

	}

	win.addEventListener('load', start, false);

}(window));