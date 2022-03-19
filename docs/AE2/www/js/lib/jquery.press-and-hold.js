/* http://stackoverflow.com/questions/4080497/how-can-i-listen-for-a-click-and-hold-in-jquery */
(function($) {

	function startTrigger(e) {
		var $elem = $(this);
		$elem.data('mouseheld_timeout', setTimeout(function() {
			$elem.trigger('mouseheld');
		}, e.data));
	}

	function stopTrigger() {
		var $elem = $(this);
		clearTimeout($elem.data('mouseheld_timeout'));
	}

	var mouseheld = $.event.special.mouseheld = {
		setup: function(data) {
			// the first binding of a mouseheld event on an element will trigger this
			// lets bind our event handlers
			var $this = $(this);
			$this.bind('mousedown', +data || mouseheld.time, startTrigger);
			$this.bind('mouseleave mouseup', stopTrigger);
		},
		teardown: function() {
			var $this = $(this);
			$this.unbind('mousedown', startTrigger);
			$this.unbind('mouseleave mouseup', stopTrigger);
		},
		time: 750 // default to 750ms
	};

})(jQuery);