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
		,$style = $('<link>') // jhat's css style 
		,$template = null // jhat's dom template
		,speed = 500
		,$dialogue = null; // dialogue template, will init when $template is load

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
			$dialogue = $template.find('div.jhat-dialogue');
			init();
		},  
		error: function(err) {
			errorHandler('templates error from Jhat');
		}
	}); 

	/*Inherit method*/
	var inherit = (function(Sup, Sub) {
		function F() {
			if(typeof F.prototype.init == 'function') {
				this.init();
			}
		}; 
		return function(Sup, Sub) {
			F.prototype = Sup.prototype;
			Sub.prototype = new F();
			Sub.uber = Sup;
			Sub.prototype.contructor = Sup;
		};
	})();

	/*Widget contructor, super class of all widget*/
	function Widget(options) {};
	Widget.fn = Widget.prototype;
	Widget.fn = {
		contructor: 'Widget',
		$template: null, 
		init: function() {
			/* init the widget*/ 
			var $widget = this.$dom = this.$template.clone(true);
			$widget.addClass('jhat-widget');
			$widget.appendTo($body);
		},
		hide: function() {
			this.$dom.hide(speed);
		},
		show: function() {
			this.$dom.show(speed);
		},
		destory: function() {
			this.$dom.remove();
		}
	};  

	function init() {
		widget();
	};

	function widget() {
		var speed = 200
			,$show = $template.filter('div.jhat-show').appendTo($body)
			,$box = $template.filter('#jhat-box').appendTo($body)
			,$hide = $box.find('li.jhat-icon-hide');

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
		$box.find('#jhat-signature')
			.on('blur', function(event) {
			var $this = $(this);
			var signature = $this.val();

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
