(function (win, doc) {

	"use strict";
	/*global window */
	/*global info */

	win.lang = {
		push: function(lang) {
			this.name = lang;
			var obj = win.langs[lang],
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					this[key] = obj[key];
				}
			}

			var node = doc.querySelector('.js-wrapper');

			if (!node) {
				return;
			}

			info.availableLangs.forEach(function (lang) {
				node.classList.remove(lang);
			});

			node.classList.add(lang);

		}
	};

}(window, document));