(function() {

	/*jhat's global configure settings*/
	var config = {
		host: 'http://localhost',
		port: ':8080',
		style: '/jhat/css/jhat.css',
		template: '/jhat/loadTemplate',
	};
	config.url = function() {
		return this.host + this.port;
	};


	/*deal with or without jQuery*/
	var $ = null;
	if(jQuery || Zepto) {
		$ = jQuery || Zepto;
	} else {
		$ = function(selector) {
		};
	}

	/* Error handling, I have no idea how to figure out 
	 * a better way than console it out. 
	 * */
	function errorHandler(msg) {
		console.log(msg);
	};

	/*global variables*/
	var $body = $(document.body)
	,	$style = $('<link>') // jhat's css style 
	, 	$template = null // jhat's dom template
	, 	speed = 500
	, 	$dialogue = null; // dialogue template, will init when $template is load

	/*Load style*/
	$style.attr({
		'type': 'text/css',
		'rel': 'stylesheet',
		'href': config.host + config.port + config.style
	});
	$body.append($style);

	/*Load template*/
	$.ajax({
		url: config.url() + config.template,
		type: 'GET',
		dateType: 'text/html',
		success: function(data) {
			$template = $(data);
			$dialogue = $template.filter('div.jhat-dialogue');
			init();
		},  
		error: function(err) {
			errorHandler('templates error from Jhat');
		}
	}); 

	/*Scroll plugin function*/
	(function($) {

		var def = {
			pace: 2.5
		};


		$.fn.jhatScroll = function(options) {
			var settings = $.extend({}, def, options);
			var pace = settings.pace;

			this.each(function(i) {
				var $this = $(this)
				,	$scrollbar = $('<div class="jhat-scrollbar"></div>')
				,	$scrollInner = $this.find('.jhat-scroll-inner')
				,	clientY = 0;

				$this.append($scrollbar);

				$this.hover(function(event) {
					$scrollbar.stop(true, true).fadeIn(200);
				}, function(event) {
					$scrollbar.stop(true, true).fadeOut(200);
				});

				function scrolling($outer, pace, dirct) {
					/* My wired algorithm, 
					 * It's to wired too explain it.
					 * */
					var $that = this
					,	$other = ($that == $scrollbar ? $scrollInner : $scrollbar)  	
					,	top = $that.position().top
					,	bottom = $outer.height() - $that.height() || -1
					,	newTop = 0
					,	otherBottom = $outer.height() - $other.height()
					,	newOtherTop = 0
					,	dist = 0;

					/*restrict the scrolling area*/
					newTop = top + pace;
					dist = (bottom - newTop) * dirct;
					if(dist < 0) {
						newTop = bottom; 
					} else if(dist > bottom * dirct) {
						newTop = 0;
					} 
					$that.css({top: newTop + 'px'});

					/*Coordinate with the other*/
					newOtherTop =  (newTop / bottom) * otherBottom;
					$other.css({top: newOtherTop + 'px'});
				}; 

				$this.on('mousewheel DOMMouseScroll', function(event) {
					event.preventDefault();
					var scrollTo = 0
				    ,	top = $scrollInner.position().top
				    ,	outerHeight = $this.height()	
					,	innerHeight = $scrollInner.height()
				    ,	newTop = 0
					,	bottom = outerHeight - innerHeight
					,	scrollbarBottom = outerHeight - $scrollbar.height()
					,	scrollbarTop = 0;

					/* get the mousewheel dirction, and calculate the pace(px) per scroll*/
					if (event.type == 'mousewheel') {
						scrollTo = (event.originalEvent.wheelDelta / 30 * -1 * pace);
					}
					else if (event.type == 'DOMMouseScroll') {
						scrollTo = event.originalEvent.detail * pace;
					}

					/* scroll the inner page*/
					scrolling.call($scrollInner, $this, -scrollTo, -1);
				});

				/* How the mouse control the scrollbar*/
				function mousemove(event) {
					event.preventDefault();
					event.stopPropagation();

					var dist = event.clientY - clientY
					,	$that = $(this)
					,	top = $scrollbar.position().top;

					clientY = event.clientY; 

					//$scrollbar.css({top: top + dist + 'px'});
					scrolling.call($scrollbar, $this, dist, 1);

				}; 

				$scrollbar.on('mousedown', function(event) {
					event.preventDefault();
					clientY = event.clientY;
					$this.on('mousemove', mousemove);
				});

				$(document.body).on('mouseup', function(event) {
					$this.off('mousemove', mousemove);
					scrolling.call($scrollInner, $this, 0, -1);
				});

			});

			return this;

		};

	})($);

	/*Module with cache functions*/
	var Widget = (function() {
		/*Cache functions*/
		function hide() {
			this.$dom.fadeOut(speed);
			return this;
		};
		function show() {
			this.$dom.fadeIn(speed);
			return this;
		};
		function destory() {
			this.$dom.remove();
			return this;
		};
		function extend(obj) {
			for(var i in obj) {
				if(!this[i]) {
					this[i] = obj[i];
				}
			};
			return this;
		};
		/*Module function*/
		return function($widget) {
			var $dom = $widget || $('div');
			$dom.addClass('jhat-widget');
			$dom.appendTo($body);
			return {
				$dom: $dom, 
				hide: hide,
				destory: destory,
				show: show,
				extend: extend
			};
		};
	})(); 

	/*Dialogue module, inherit from Widget*/
	var Dialogue = function(friend) {
		var dialogue  = Widget($dialogue.clone(true)); 
		dialogue.$dom.find('.jhat-scroll').jhatScroll({
			pace: 8
		});
		return dialogue.extend({
			currendFriend: friend
		});
	};

	function init() {
		widget();
		var newDialogue = Dialogue();
		newDialogue.show();
	};

	function widget() {
		var speed = 200
		,	$show = $template.filter('div.jhat-show').appendTo($body)
		,	$box = $template.filter('div.jhat-box').appendTo($body)
		,	$hide = $box.find('li.jhat-icon-hide');

		$box.find('div.jhat-list-content').jhatScroll({pace: 9});

		$show.extend({
			display: function() {
				$(this).animate({
					right: '5px'
				}, speed);
			},
			disappear: function() {
				$(this).animate({
					right: '-45px'
				}, speed);
			},
			destory: function() {
				$(this).remove();
			}
		});

		$box.extend({
			display: function() {
				$(this).animate({
					right: '0px'
				}, speed);
			},
			disappear: function() {
				$(this).animate({
					right: '-245px'
				}, speed);
			},
			destory: function() {
				$(this).remove();
			}
		});

		$show.on('click', function(event) {
			$box.display();
			$show.disappear();
		});

		/* Update the user's signature. After typing the
		 * signature, the code coming after aim to send a  
		 * XHR request to update it in Mongodb database 
		 * */
		$box.find('input.jhat-signature')
			.on('blur', function(event) {
			var $this = $(this)
			,	signature = $this.val();

			$this.attr('title', signature);

			$.ajax({
				url: config.url() + '/changeSignature',
				type: 'POST',
				data: 'signature=' + signature,
				success: function(data) {
					if(data !== 'OK') {
						alert(data);
					}
				},
				error: function(err) {
					alert('Server error');
				} 
			});
		});

		/*The button for hiding the side */
		$hide.on('click', function(event) {
			$box.disappear();
			$show.display();
		});

		$show.click();
	};
})();
