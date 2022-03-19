(function (win, doc) {

	"use strict";
	/*global window, document */

	var templateMaster;

	templateMaster = {
		templateSelector: 'script[type="text/x-template"]',
		tmplText: {},
		tmplFn: {},
		createTemplateFunction: function (str) {
			return new Function("obj",
					"var p=[]; with(obj || {}){p.push('" + str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=([\s\S]*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") + "');} return p.join('');");
		},
		init: function () {

			var templates = doc.querySelectorAll(this.templateSelector);

			Array.prototype.forEach.call(templates, function(tmplNode) {

				var name = tmplNode.dataset.name,
					text = tmplNode.textContent.trim();

				this.tmplText[name] = text;
				this.tmplFn[name] = this.createTemplateFunction(text);

				tmplNode.parentNode.removeChild(tmplNode);

			}, this);

		}

	};

	win.templateMaster = templateMaster;

}(window, document));

