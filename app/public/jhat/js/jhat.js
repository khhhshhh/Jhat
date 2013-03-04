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
		template: '/jhat/templates/jhat.html'
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
		url: config.host + config.port + config.template,
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
			}
		});

		$show.on('click', function(event) {
			$box.display();
			$show.disappear();
		});

		$hide.on('click', function(event) {
			$box.disappear();
			$show.display();
		});

		$show.click();
		
	};
})();
