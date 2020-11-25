(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP */

	/*
	* setting
	* 1 - music off/on
	* 2 - ask for switch turn
	* 3 - animation speed -                 slow - 1 2 [3] 4 5 - fast
	*
	*
	* */

	/*

	[*] music
	[*] end turn confirm

	 animation speed
	 slow - 1 2 [3] 4 5 - fast

*/


	win.APP = win.APP || {};

	APP.SettingView = APP.BaseView.extend({

		templates: ['setting'],


		events: {

		},

		init: function() {

			this.$el = $(this.tmpl.setting());

			this.$wrapper = $('.js-wrapper');

			this.$wrapper.html('');

			this.setSettingsState();

			this.$wrapper.append(this.$el);

		},

		setSettingsState: function () {

			var $node, setting;

			setting = win.info.get('setting');

			// set end turn confirm
			$node = this.$el.find('.js-confirm-end-turn-checkbox');
			if ( setting.endTurnConfirm ) {
				$node.addClass('input-checked');
				$node[0].checked = true;
			} else {
				$node.removeClass('input-checked');
				$node[0].checked = false;
			}
			$node.on('change', function () {
				var setting =  win.info.get('setting'),
					$this = $(this),
					isChecked = this.checked;

				setting.endTurnConfirm = this.checked;

				win.info.set('setting', setting, true);

				if (isChecked) {
					$this.addClass('input-checked');
				} else {
					$this.removeClass('input-checked');
				}

				//return util.forceReDraw($(this.parentNode).find('span'));

			});

			// set music
			$node = this.$el.find('.js-music-checkbox');
			if ( setting.music ) {
				$node.addClass('input-checked');
				$node[0].checked = true;
			} else {
				$node.removeClass('input-checked');
				$node[0].checked = false;
			}
			$node.on('change', function () {
				var setting =  win.info.get('setting'),
					$this = $(this),
					isChecked = this.checked;

				setting.music = this.checked;

				win.info.set('setting', setting, true);

				if (isChecked) {
					$this.addClass('input-checked');
				} else {
					$this.removeClass('input-checked');
				}

				//return util.forceReDraw($(this.parentNode).find('span'));

			});

			// set lang
			$node = this.$el.find('.js-game-lang[value="' + win.info.lang + '"]');
			if (!$node.length) {
				return;
			}

			$node.addClass('input-checked');

			$node = this.$el.find('.js-game-lang');
			$node.on('change', function () {

				$('.js-game-lang.input-checked').removeClass('input-checked');
				$(this).addClass('input-checked');

				var setting =  win.info.get('setting');
				setting.lang = this.value;
				win.info.set('setting', setting, true);
				win.info.set('lang', this.value, true);
				win.lang.push(win.info.lang);
				// set game lang

				Backbone.history.loadUrl();

			});

			// set game speed
			$node = this.$el.find('.js-game-speed[value="' + setting.gameSpeed + '"]');

			if (!$node.length) {
				return;
			}

			$node.addClass('input-checked');

			$node = this.$el.find('.js-game-speed');
			$node.on('change', function () {

				$('.js-game-speed.input-checked').removeClass('input-checked');
				$(this).addClass('input-checked');

				var setting =  win.info.get('setting');
				setting.gameSpeed = this.value;
				win.info.set('setting', setting, true);

				// set game speed
				APP.units.info.timer = APP.units.info.timersBySpeed[setting.gameSpeed];

				//return util.forceReDraw($(this.parentNode.parentNode).find('span'));

			});

		}

	});

}(window));