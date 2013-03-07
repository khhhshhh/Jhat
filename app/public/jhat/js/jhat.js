(function() {

	/*deal with / without jQuery*/
	var $ = null;
	if(jQuery) {
		$ = jQuery;
	} else {
		$ = function(selector) {
		};
	}

	function errorHandler(msg) {
		console.log(msg);
	};

	/*jhat's global configure settings*/
	var config = {
		host: 'http://localhost',
		port: ':8080',
		style: '/jhat/css/jhat.css',
		template: /*'/jhat/templates/jhat.html'*/ '/jhat/loadTemplate',
	};
	config.url = function() {
		return this.host + this.port;
	};

	/*global variables*/
	var $body = $(document.body);
	var $style = $('<link>'); // jhat's css style 
	var $template = null ; // jhat's dom template

	$style.attr({
		'type': 'text/css',
		'rel': 'stylesheet',
		'href': config.host + config.port + config.style
	});

	/*Load style*/
	$body.append($style);

	/*Load template*/
	$.ajax({
		url: config.ur() + config.template,
		type: 'GET',
		dateType: 'text/html',
		success: function(data) {
			$template = $(data);
			$body.append($template);
			init();
		},  
		error: function(err) {
			errorHandler('templates error from Jhat');
		}
	}); 

	function init() {
		widget();
	};

	/*Side widget*/
	function Side() {};
	Side.fn = Side.prototype;
	Side.fn = {
		contructor: 'Side',
		init: function(){},  
		$dom: null,
		show: function(speed) {
			var speed = speed || 200;
			this.$dom.animate({
				right: '5px'
			}, speed);
		},
		hide: function(speed) {
			var speed = speed || 200;
			this.$dom.animate({
				right: '-45px'
			}, speed);
		},
		destory: function() {
			this.$dom.remove();
		}
	};

	function widget() {
		var speed = 200;
		var $show = $template.filter('div.jhat-show');
		var $box = $template.filter('#jhat-box');
		var $hide = $box.find('li.jhat-icon-hide');

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

		$box.find('#jhat-signature').on('blur', function(event) {
			var $this = $(this);
			var signature = $this.val();

			$this.attr('');

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

		$hide.on('click', function(event) {
			$box.disappear();
			$show.display();
		});

		$show.click();
	};
})();
