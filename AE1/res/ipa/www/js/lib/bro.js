(function (win, doc, docElem) {

	"use strict";
	/*global console, alert, window, document, Event */

	var isTouch, info, bro, Bro, re;

	Bro = function (selector, context) {
		if (!this) {
			return new Bro(selector, context);
		}
		if (selector instanceof Bro) {
			return selector;
		}
		this.init(selector, context);
	};

	bro = function (selector, context) {
		return new Bro(selector, context);
	};

//	win.$ = bro;
	//win.Bro = Bro;
	win.bro = bro;
	win.$ = bro;

	re = {
		htmlNode: /(^|\s+)<[\s\S]+>($|\s+)/,
		json: /(^|\s+)\{[\s\S]*\}($|\s+)/,
		xToX: function (str) {
			return str.replace(/-\w/gi, Function.prototype.call.bind(String.prototype.toUpperCase)).replace(/-/gi, '');
		},
		capitalize: function (str) {
			return str.replace(/(^|\s)\w/gi, Function.prototype.call.bind(String.prototype.toUpperCase));
		}
	};

//	events = {
//		type: ['blur', 'focus', 'focusin', 'focusout', 'load', 'resize', 'scroll', 'unload',
//			'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
//			'mouseenter', 'mouseleave', 'change', 'select', 'submit', 'keydown',
//			'keypress', 'keyup', 'error', 'contextmenu']
//	};

	isTouch = 'ontouchstart' in docElem;

	//=== info start ===//
	info = {
		isPhone: false,
		isTouch: isTouch,
		preCSS: '-webkit-', // see bro vendorPrefix
		preJS: 'webkit',
		canScroll: true,
		isAndroid: (/android/i).test(win.navigator.userAgent),
		evt: {
			down: isTouch ? 'touchstart' : 'mousedown',
			move: isTouch ? 'touchmove' : 'mousemove',
			up: isTouch ? 'touchend' : 'mouseup',
			out: isTouch ? 'touchcancel' : 'mouseout',
			touchStart: {
				x: 0,
				y: 0
			},
			touchMove: {
				x: 0,
				y: 0
			},
			maxDistance: {
				x: 0,
				y: 0
			},
			updateMaxDistance: function () {
				this.maxDistance.x = Math.max(this.maxDistance.x, Math.abs(this.touchMove.x - this.touchStart.x));
				this.maxDistance.y = Math.max(this.maxDistance.y, Math.abs(this.touchMove.y - this.touchStart.y));
			},
			resetMaxDistance: function () {
				this.maxDistance = {
					x: 0,
					y: 0
				};
			},
			before: {
				down: {
					nodes: [],
					time: 0
				},
				up: {
					nodes: [],
					time: 0
				},
				click: {
					time: 0,
					x: NaN,
					y: NaN
				}
			},
			current: {
				down: {
					nodes: [],
					time: 0
				},
				up: {
					nodes: [],
					time: 0
				},
				click: {
					time: 0,
					x: NaN,
					y: NaN
				}
			},
			defaultEventContainer: {
				down: {
					nodes: [],
					time: 0
				},
				up: {
					nodes: [],
					time: 0
				},
				click: {
					time: 0,
					x: NaN,
					y: NaN
				}
			},
			extraTypes: isTouch ? ['click', 'dblclick', 'hold', 'swipe', 'swipe-up', 'swipe-down', 'swipe-left', 'swipe-right'] : ['hold', 'swipe', 'swipe-up', 'swipe-down', 'swipe-left', 'swipe-right'],
			touchTypes: ['mousedown', 'mousemove', 'mouseup'],
			touchMouseMap: {
				mousedown: 'touchstart',
				mousemove: 'touchmove',
				mouseup: 'touchend'
			},
			isActive: false,
			isClick: function () {
				return Math.max(this.maxDistance.x, this.maxDistance.y) < 10;
			},
			dispatchEvent: function (node) {

				var now = Date.now(),
					evt, dX, dY, direction;

				// detect click
				// detect node
				if (this.current.down.nodes.indexOf(node) === -1) {
					return false;
				}

				// detect swipe - begin
				if ((now - this.current.down.time) < 600 && Math.max(this.maxDistance.x, this.maxDistance.y) > 60) { // 600 - max swipe time, 70 - min swipe distance

					dX = this.current.down.x - this.touchMove.x;
					dY = this.current.down.y - this.touchMove.y;

					if (Math.abs(dX) > Math.abs(dY)) {
						direction = (dX > 0) ? 'left' : 'right';
					} else {
						direction = (dY > 0) ? 'up' : 'down';
					}

					evt = doc.createEvent('Event');   // todo: future use evt = new Event(type);
					evt.direction = direction;
					evt.initEvent('$swipe$', true, true);      // todo: future use evt = new Event(type);
					node.dispatchEvent(evt);

					evt = doc.createEvent('Event');   // todo: future use evt = new Event(type);
					evt.direction = direction;
					evt.initEvent('$swipe-' + direction + '$', true, true);      // todo: future use evt = new Event(type);
					node.dispatchEvent(evt);

				}
				// detect swipe - end

				// detect click position
				if (!this.isClick()) {
					return false;
				}

				// detect time of last probably click
				if ((now - this.current.down.time) > 300) {
					return false;
				}

				evt = doc.createEvent('Event');   // todo: future use evt = new Event(type);
				evt.initEvent('$click$', true, true);      // todo: future use evt = new Event(type);
				node.dispatchEvent(evt);
				//node.dispatchEvent(new Event('$click$'));

				this.before.click = Object.create(this.current.click);
				this.current.click = {
					time: now,
					x: this.touchMove.x,
					y: this.touchMove.y
				};

				// detect dblclick time
				if (this.current.click.time - this.before.click.time > 300) {
					return false;
				}

				// detect dblclick position
				if (Math.max(Math.abs(this.before.click.x - this.current.click.x), Math.abs(this.before.click.y - this.current.click.y)) > 10) {
					return false;
				}

				evt = doc.createEvent('Event');   // todo: future use evt = new Event(type);
				evt.initEvent('$dblclick$', true, true);      // todo: future use evt = new Event(type);
				node.dispatchEvent(evt);
				//node.dispatchEvent(new Event('$dblclick$'));

			},
			detectHold: function () {

				var evt;
				if (((Date.now() - this.current.up.time) < this.holdPeriod) || !this.isClick()) { // to little to create hold event
					return false;
				}

				evt = doc.createEvent('Event');   // todo: future use evt = new Event(type);
				evt.initEvent('$hold$', true, true);      // todo: future use evt = new Event(type);
				this.current.down.nodes.forEach(function (node) {
					node.dispatchEvent(evt);
				});

			},
			holdPeriod: 500
		},
		screen: {
			getWidth: function () {
				return docElem.clientWidth;
			},
			getHeight: function () {
				return docElem.clientHeight;
			},
			getAspectRatio: function () {
				return docElem.clientWidth / docElem.clientHeight;
			}
		},
		init: function () {
			this.getIsPhone();
			this.runDetector();
			this.bindBodyScroll();
		},
		getIsPhone: function () {
			this.isPhone = Math.max(docElem.clientWidth, docElem.clientHeight) < 700;
			return this.isPhone;
		},
		runDetector: function () {

			var body = doc.body,
				that = this;

			// detect XY onTouchStart
			if (this.isTouch) {

				body.addEventListener(this.evt.down, function (e) {
					that.evt.current.down = {
						time: Date.now(),
						nodes: [],
						x: e.touches[0].pageX,
						y: e.touches[0].pageY
					};

					win.setTimeout(that.evt.detectHold.bind(that.evt), that.evt.holdPeriod);

					that.evt.isActive = true;
					that.evt.resetMaxDistance();
					that.evt.touchStart = {
						x: e.touches[0].pageX,
						y: e.touches[0].pageY
					};
					that.evt.touchMove = that.evt.touchStart;
				}, true);
				body.addEventListener(this.evt.move, function (e) {
					that.evt.touchMove = {
						x: e.touches[0].pageX,
						y: e.touches[0].pageY
					};
					that.evt.updateMaxDistance();
				}, true);

			} else {

				body.addEventListener(this.evt.down, function (e) {
					win.setTimeout(that.evt.detectHold.bind(that.evt), that.evt.holdPeriod);
					that.evt.current.down = {
						time: Date.now(),
						nodes: [],
						x: e.pageX,
						y: e.pageY
					};

					that.evt.isActive = true;
					that.evt.resetMaxDistance();
					that.evt.touchStart = {
						x: e.pageX,
						y: e.pageY
					};
					that.evt.touchMove = that.evt.touchStart;
				}, true);
				body.addEventListener(this.evt.move, function (e) {
					that.evt.touchMove = {
						x: e.pageX,
						y: e.pageY
					};
					that.evt.updateMaxDistance();
				}, true);

			}

			body.addEventListener(this.evt.up, function () {
				that.evt.current.up.time = Date.now();
				that.evt.isActive = false;
			}, true);

		},
		bindBodyScroll: function () {
			doc.body.addEventListener('touchmove', function (e) {
				return !this.canScroll && e.preventDefault();
			}.bind(this), false);
		}

	};

	win.addEventListener('load', info.init.bind(info), false);
	//=== info end ===//

	Bro.prototype = Object.create(Array.prototype);

	Bro.prototype.html = function (html) {
		var elem = this[0] || {};
		if (!arguments.length) {
			return elem.innerHTML || '';
		}
		elem.innerHTML = html;
		return this;
	};

	Bro.prototype.attr = function (attribute, value) {

		// try to get attribute
		if (value === undefined && typeof attribute === 'string') {
			if (!this.length) {
				return '';
			}
			return this[0].getAttribute(attribute);
		}

		this.setAttribute(attribute, value);

		return this;

	};

	Bro.prototype.removeAttr = function (attr) {
		this.forEach(function (node) {
			node.removeAttribute(attr);
		});
	};

	Bro.prototype.init = function (selector, context) {

		// detect empty selector
		if (!selector) {
			return this;
		}

		if (typeof selector === 'function') {
			win.addEventListener('load', selector, false);
			return this;
		}

		// detect Bro
		if (selector instanceof Bro) {
			return selector;
		}

		if (typeof selector === "string") {

			var nodes, isHTML, tempNode;
			if (re.htmlNode.test(selector)) {
				// create new node
				tempNode = doc.createElement('div');
				tempNode.innerHTML = selector;
				nodes = tempNode.childNodes;
				isHTML = true;
			} else {
				// find nodes
				if (context && context.querySelectorAll) {
					// detect DOMNode or doc
					nodes = context.querySelectorAll(selector);
				} else if (context && context.find) {
					// detect bro
					nodes = context.find(selector);
				} else {
					// find in doc
					nodes = doc.querySelectorAll(selector);
				}
			}

			this.forEach.call(nodes, function (node) {
				this.push(node);
			}, this);

			if (isHTML && context) {
				if (context.append) {
					context.append(this);
				} else if (context.appendChild) {
					this.forEach(function (node) {
						context.appendChild(node);
					});
				}
			}

			// detect single node
		} else if (selector.nodeType || selector === win || selector === doc) {
			this.selector = selector;
			this.push(selector);
			// detect nodeList and Array
		} else if (typeof selector.length === 'number') {
			this.forEach.call(selector, function (node) {
				this.push(node);
			}, this);
			this.selector = selector;
		}

		if (this.isPlainObject(context)) {
			this.setAttribute(context);
		}

		this.context = context;

		return this;

	};

	Bro.prototype.isEmpty = function () {
		return !this.length;
	};

	Bro.prototype.setAttribute = function (attribute, value) {

		// try to set attribute
		if (typeof attribute === 'string') {
			this.forEach(function (node) {
				node.setAttribute(attribute, value);
			});
		} else {
			this.forEach(function (node) {
				var key;
				for (key in attribute) {
					if (attribute.hasOwnProperty(key)) {
						node.setAttribute(key, attribute[key]);
					}
				}
			});
		}

		return this;

	};

	Bro.prototype.find = function (selecotor) {
		var nodes = [];
		this.forEach(function (node) {

			if (!node.querySelectorAll) {
				return;
			}

			var childes = node.querySelectorAll(selecotor);
			this.forEach.call(childes, function (node) {
				nodes.push(node);
			});
		}, this);
		return new Bro(nodes);
	};

	Bro.prototype.append = function (nodes) {
		var elem = this[0];

		if (!elem) {
			return this;
		}

		nodes = new Bro(nodes);

		nodes.forEach(function (node) {
			elem.appendChild(node);
		});

		return this;

	};

	Bro.prototype.appendTo = function (elem) {

		if (!elem) {
			return this;
		}

		if (typeof elem === 'string') {
			elem = new Bro(elem);
		}

		if (elem.append) {
			elem.append(this);
			return this;
		}

		elem = elem[0] || elem;
		if (elem.appendChild) {
			this.forEach(function (node) {
				elem.appendChild(node);
			});
		}

		return this;

	};

	Bro.prototype.hasClass = function () {
		var has = false,
			args = this.toArray(arguments);
		this.forEach(function (node) {
			if (has) {
				return;
			}
			args.forEach(function (className) { // this workaround only for old android and io6
				has = has || node.classList.contains(className);
			});
			// has = node.classList.contains.apply(node.classList, args); // todo: uncommet this in future
		});
		return has;
	};

	Bro.prototype.addClass = function () {
		var args = this.toArray(arguments);
		this.forEach(function (node) {
			args.forEach(function (className) { // this workaround only for old android and io6
				return className && node.classList.add(className);
			});
			//node.classList.add.apply(node.classList, args); // todo: uncommet this in future
		});
		return this;
	};

	Bro.prototype.removeClass = function () {
		var args = this.toArray(arguments);
		this.forEach(function (node) {
			args.forEach(function (className) { // this workaround only for old android and io6
				node.classList.remove(className);
			});
			//node.classList.remove.apply(node.classList, args); // todo: uncommet this in future
		});
		return this;
	};

	Bro.prototype.toggleClass = function (className, addOrRemove) {

		if (addOrRemove !== undefined) {
			if (addOrRemove) {
				this.addClass(className);
			} else {
				this.removeClass(className);
			}
			return this;
		}

		this.forEach(function (node) {
			node.classList.toggle(className);
		});

		return this;

	};

	Bro.prototype.each = function (func) {
		this.forEach(function (node, index) {
			func.call(node, index, node);
		}, this);

		return this;

	};

	function pushNode() {
		info.evt.current.down.nodes.push(this);
	}

	function dispatchEventNode() {
		info.evt.dispatchEvent(this);
	}

	Bro.prototype.on = function (type, selector, data, func) {

		var evt, nodes, newType;

		newType = info.evt.touchMouseMap[type];

		if (isTouch && newType) {
			type = newType;
		}

		if (info.evt.extraTypes.indexOf(type) !== -1) {
			type = '$' + type + '$';
		}

		if ((this.isPlainObject(selector) && !data) || !selector) { // click or click {rr:55}
			data = selector;

			evt = doc.createEvent('Event');   // todo: future use evt = new Event(type);
			evt.initEvent(type, true, true);      // todo: future use evt = new Event(type);

			if (data) {
				evt.data = data;
			}
			this.forEach(function (node) {
				node.dispatchEvent(evt);
			});
			return this;
		}

		nodes = this;

		if (typeof selector === 'function') { // click, func
			func = selector;
		} else if (typeof func === 'function') { // click, 'span', {rr:55}, func
			nodes = this.find(selector);
		} else if (this.isPlainObject(selector)) { // click, {rr:55}, func
			func = data;
			data = selector;
		} else {                                    // click, 'span', func
			nodes = this.find(selector);
			func = data;
			data = undefined;
		}

		if (data) {
			nodes.forEach(function (node) {
				node.removeEventListener(info.evt.down, pushNode);
				node.removeEventListener(info.evt.up, dispatchEventNode);
				node.addEventListener(info.evt.down, pushNode, false);
				node.addEventListener(info.evt.up, dispatchEventNode, false);

				node.addEventListener(type, function (e) {
					var key, dataObj;
					if (e.data) {
						dataObj = Object.create(data);
						for (key in e.data) {
							if (e.data.hasOwnProperty(key)) {
								dataObj[key] = e.data[key];
							}
						}
						e.data = dataObj;
					} else {
						e.data = data;
					}
					func.call(node, e);
				}, false);
			});
		} else {
			nodes.forEach(function (node) {
				node.removeEventListener(info.evt.down, pushNode);
				node.removeEventListener(info.evt.up, dispatchEventNode);
				node.addEventListener(info.evt.down, pushNode, false);
				node.addEventListener(info.evt.up, dispatchEventNode, false);
				node.addEventListener(type, func, false);
			});
		}

		return this;

	};

	Bro.prototype.off = function (type, selector, func) {

		var nodes = this;

		if (typeof selector === 'string') { // click, selector, func
			nodes = this.find(selector);
		} else {
			func = selector;
		}

		if (type) {
			nodes.forEach(function (node) {
				node.removeEventListener(type, func);
			});
		} else {
			nodes.forEach(function (node, index, arr) {
				var silentNode = node.cloneNode(true);
				arr[index] = silentNode;
				node.parentNode.replaceChild(silentNode, node);
			});
		}

		return this;

	};

	Bro.prototype.remove = function () {
		this.forEach(function (node) {
			return node.parentNode && node.parentNode.removeChild(node);
		}, this);
		this.splice(0, this.length);
		return this;
	};

	Bro.prototype.show = function () {
		this.forEach(function (node) {
			node.style.display = 'block';
		});
		return this;
	};

	Bro.prototype.hide = function () {
		this.forEach(function (node) {
			node.style.display = 'none';
		});
		return this;
	};

	Bro.prototype.css = function (css, value) {

		if (value !== undefined) { /// display , block -- z-index - 0
			this.forEach(function (node) {
				node.style[css] = value;
			});
			return this;
		}

		if (typeof css === "string") { // display
			if (this.length) {
				return win.getComputedStyle(this[0], null)[css];
			}
			return '';
		}

		this.forEach(function (node) { // {}
			var key;
			for (key in css) {
				if (css.hasOwnProperty(key)) {
					node.style[key] = css[key];
				}
			}
		});

		return this;

	};

	Bro.prototype.eq = function (number) {
		return new Bro(this[number]);
	};

	Bro.prototype.empty = function () {
		this.forEach(function (node) {
			node.textContent = '';
		});
		return this;
	};

	Bro.prototype.val = function (value) {

		if (typeof value === 'string') {
			this.forEach(function (node) {
				node.value = value;
			});
		} else {
			return this.length ? this[0].value : '';
		}

		return this;

	};

	Bro.prototype.data = function (key, value) {

		if (!key) { // ()
			console.warn('dataset - do not support for old android browser');
			return this.length ? this[0].dataset : {};
		}

		if (this.isPlainObject(key)) {
			for (var i in key) {
				if (key.hasOwnProperty(i)) {
					this.forEach(function (node) {
						node.dataset[i] = key[i];
					});
				}
			}

			return this;
		}


		// some-tome-tone -> someTomeTone
		key = re.xToX(key);

		if (typeof key === 'string') {
			if (value !== undefined) { // 'key'

				if (this.isPlainObject(value)) {
					value = JSON.stringify(value);
				}

				this.forEach(function (node) {
					node.dataset[key] = value;
				});

				return this;
			}

			value = this.length ? this[0].dataset[key] : '';
			if (re.json.test(value)) {
				try {
					return JSON.parse(this[0].dataset[key]);
				} catch (e) {
					return value;
				}
			}

			return value;

		}

		if (this.isPlainObject(key)) {

			this.forEach(function (node) {
				var i;
				for (i in key) {
					if (key.hasOwnProperty(i)) {
						if (this.isPlainObject(key[i])) {
							node.dataset[i] = JSON.stringify(key[i]);
						} else {
							node.dataset[i] = key[i];
						}
					}
				}
			}, this);

			return this;

		}

		return this;

	};

	Bro.prototype.prop = function (key, value) {

		if (typeof key === 'string' && value === undefined) {
			return this.length ? this[0][key] : '';
		}


		if (this.isPlainObject(key)) { // {},
			this.forEach(function (node) {
				var i;
				for (i in key) {
					if (key.hasOwnProperty(i)) {
						node[i] = key[i];
					}
				}
			});
			return this;
		}

		if (typeof value === 'function') { // 'checked', function
			this.forEach(function (node, index) {
				node[key] = value.call(node, index, node[key]);
			});
			return this;
		}

		this.forEach(function (node) { // 'checked', some value
			node[key] = value;
		});
		return this;

	};

	Bro.prototype.getSize = function (prop) { // width or height

		var size = 0;

		this.every(function(node){
			size = node['client' + this.capitalize(prop)];
			return false;
		}, this);

		return size;

	};

	Bro.prototype.setSize = function (prop, value) { // width or height

		this.css(prop, value);

	};

	Bro.prototype.height = function(height) {

		if (height === undefined) {
			return this.getSize('height');
		}

		this.setSize('height', height);
		return this;

	};

	Bro.prototype.width = function(width) {

		if (width === undefined) {
			return this.getSize('width');
		}

		this.setSize('width', width);
		return this;

	};

	// util section
	Bro.prototype.template = function (str) {
		return new Function("obj",
			"var p=[]; with(obj){p.push('" + str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=([\s\S]*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'") + "');} return p.join('');");
	};

	Bro.prototype.capitalize = function(str) {
		return re.capitalize(str);
	};


	Bro.prototype.toArray = function (arr) {
		return Array.prototype.slice.call(arr);
	};

	Bro.prototype.inArray = function (arr, obj) {
		return arr.indexOf(obj) !== -1;
	};

	Bro.prototype.shuffle = function (arr) {
		return arr.sort(function () {
			return Math.random() - 0.5;
		});
	};

	Bro.prototype.duplicate = function (obj) {
		return JSON.parse(JSON.stringify(obj));
	};

	Bro.prototype.isPlainObject = function (obj) {
		return obj && obj.constructor === Object;
	};

	Bro.prototype.isEmptyObject = function (obj) {

		if (!this.isPlainObject(obj)) {
			return false;
		}

		return !Object.keys(obj).length;

	};

	Bro.prototype.extend = function (obj, add) {

		if (!this.isPlainObject(add)) {
			return;
		}

		var key;

		for (key in add) {
			if (add.hasOwnProperty(key)) {
				obj[key] = add[key];
			}
		}

		return obj;

	};

	Bro.prototype.screen = function () {
		var data = {},
			width = docElem.clientWidth,
			height = docElem.clientHeight;

		data.width = width;
		data.height = height;
		data.orientation = width > height ? 'landscape' : 'portrait';
		data.aspectRatio = width / height;
		data.smallestSide = width > height ? height : width;
		data.biggestSide = width < height ? height : width;
		data.center = {
			x: width / 2,
			y: height / 2
		};

		return data;

	};

	Bro.prototype.setBodyScroll = function (canScroll) {
		info.canScroll = canScroll;
	};

	Bro.prototype.getVendorPrefix = function () {

		var data = {
				js: '',
				css: ''
			},
			tempStyle = doc.createElement('div').style,
			vendors = ['t','webkitT','MozT','msT','OT'];

		// find vendors by css transform property
		vendors.forEach(function(vendor){

			var transform = vendor + 'ransform';

			if (!tempStyle.hasOwnProperty(transform)) {
				return;
			}

			vendor = vendor.replace(/t$/i, ''); // remove 't' from vendor

			data = {
				js: vendor,
				css: '-' + vendor.toLocaleLowerCase() + '-'
			};

		});

		return data;

	};

	Bro.prototype.ajax = function (data) {

		data.type = data.type || 'GET';

		data.success = data.success || function () {
		};
		data.error = data.error || function () {
		};

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.status !== 200) {
				data.error();
				return;
			}

			data.success(xhr.responseText);
		};

		switch (data.type) {
			case 'GET':
				xhr.open(data.type, data.url, true);
				xhr.send(null);
				break;
			default :
				console.warn('not supported type of ajax request');

		}

		return xhr;

	};

	Bro.prototype.info = function () {

		return info;

	};

	Bro.prototype.testConnection = function (data) { // data -> onSuccess, onError

		var img = new Image();

		if (data instanceof Function) {
			data = { success: data };
		}

		data.error = data.error || function () {
		};

		data.success = data.success || function () {
		};

		img.addEventListener('load', data.success, false);
		img.addEventListener('error', data.error, false);

		img.src = 'http://statlex.com/img/statlex-icon.png?no-cache=' + Math.random();

	};


}(window, document, document.documentElement));