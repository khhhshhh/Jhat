(function() {
/* Jhat-global
 * -------------------------------------------------------------------*/
	/*Who you are*/
	var me = '';

	/*jhat's global configure settings*/
	var config = {
		host: 'http://10.0.2.15'
		, port: ':8080'
		, style: '/jhat/css/jhat.css'
		, template: '/jhat/loadTemplate'
		, avatarDir: '/img/avatar/'
		, socketIO: '/socket.io/socket.io.js'		
	};

	config.url = function() {
		return this.host + this.port;
	};
	config.avatar = function() {
		return this.url() + this.avatarDir;
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


/* Jhat-load
 * -------------------------------------------------------------------*/
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

			var myInfo = $template.filter('div.jhat-box:eq(0)').attr('data-me');
			myInfo = JSON.parse(myInfo);
			me = myInfo._id;
			userManager.set(myInfo);

			$dialogue = $template.filter('div.jhat-dialogue');
			init();
		},  
		error: function(err) {
			errorHandler('templates error from Jhat');
		}
	}); 

	/*Load socket.io*/
	var $script = $('<script></script>');
	$script.attr({
		type: 'text/javascript',
		src: config.url() + config.socketIO
	});
	$body.append($script);

/* Jhat-plugin 
 * -------------------------------------------------------------------*/
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

				$body.on('mouseup', function(event) {
					$this.off('mousemove', mousemove);
					scrolling.call($scrollInner, $this, 0, -1);
				});

			});

			return this;

		};

	})($);

	/*Jhat's drag plugin*/
	(function($) {
		/* 兼容浏览器 */
		function getOffset() {
			return {
				y: window.pageOffsetY 
				|| document.documentElement.scrollTop 
				|| document.body.scrollTop
				|| 0,

				x: window.pageOffsetX 
				|| document.documentElement.scrollLeft 
				|| document.body.scrollLeft
				|| 0,
				
			}; 
		};
		$.fn.jhatDrag = function(target) {
			return this.each(function(i) {
				var $this = $(this)
				,	$target = $this.find(target)
				,	clientX = 0
				,	clientY = 0;

				function drag(event) {
					var distX = event.clientX - clientX
					,	distY = event.clientY - clientY
					,	position = $this.position()
					,	offset = getOffset();

					clientX = event.clientX;
					clientY = event.clientY;

					$this.css({
						'top' : position.top - offset.y + distY + 'px',
						'left' : position.left - offset.x + distX + 'px' 
					});
				};

				$target.on('mousedown', function(event) {
					event.preventDefault();
					clientX = event.clientX;
					clientY = event.clientY;
					$body.on('mousemove', drag);
				});

				$body.on('mouseup', function(event) {
					$body.off('mousemove', drag);
				});

			});
		};  
	})($);

/* Jhat-module
 * -------------------------------------------------------------------*/
	/*Module with cache functions*/
	var Widget = (function() {
		/*Cache functions*/
		function hide() {
			this.$dom.fadeOut(speed);
			this.isShow = false;
			return this;
		};
		function show() {
			this.$dom.fadeIn(speed);
			this.isShow = true;
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
				isShow: false,
				hide: hide,
				destory: destory,
				show: show,
				extend: extend
			};
		};
	})(); 

	/* Dialogue module, inherit from Widge 
	 * Never destory a Dialogue throught: 
	 *      dialogue.destory();
	 * it will cause the dialgManager will hold the obj
	 * you're should destory a Dialogue like this : 
	 * 	    dialgManager.destory(id);
     */
	var Dialogue = function(friend) {
		var dialogue  = Widget($dialogue.clone(true))
		,	id= friend._id
		,	$dom = dialogue.$dom
		,	def = {
				_id: 'default'
				,extName: '.jpg'
				,nickname: 'Default'
				,signature: 'Not signature'
			};

		var friend = $.extend({}, def, friend);

		$dom.find('.jhat-scroll').jhatScroll({
			pace: 8
		});

		$dom.jhatDrag('div.jhat-bg');
		$dom.find('img.jhat-avatar-large')
			.attr('src', config.avatar() + friend._id + friend.extName);
		$dom.find('div.jhat-signature').text(friend.signature);
		$dom.find('textarea').data('_id', friend._id);
		$dom.find('div.jhat-nickname').text(friend.nickname || friend.name);
		$dom.attr('id', 'jhat-' + friend._id);
		$dom.find('textarea').on('keyup', function(event) {
			var $this = $(this)
			,	msg = ''; 
			if(event.keyCode == 13) {
				msg = $this.val();
				if(msg != '') {
					dialogue.createMyMsg(msg);
					$this.val('');
					socket.emit('msg', me, id, msg);
				}
			}
		});

		return dialogue.extend({
			_id: friend._id,
		    createItsMsg: function(msg) {
				showMsg.call($dom, id, msg, false);
			},
			createMyMsg: function(msg) {
				console.log(me);
				showMsg.call($dom, me, msg, true);
			}
		});
	};

	/* Dialogue Manager
	 * All operations are running around "id"
	 * ,*/
	var dialgManager = (function() {
		var dialogues = [];
		return {
			set: function(obj) {
				return (dialogues[obj._id] = Dialogue(obj));
			},
			get: function(id) {
				return dialogues[id];
			},
			destory: function(id) {
				dialogue[id].destory();
				delete dialogues[id];
			},
			has: function(id) {
				return (dialogues[id] !== undefined);
			}
		};
	})();

	var userManager = (function() {
		var users = []; 
		return {
			me: me,
			set: function(obj, id) {
				if(id) {
					users[id] = obj;
				} else {
					users[obj._id] = obj;
				}
			},
			get: function(id) {
				return users[id];
			},
			getExt: function(id) {
				return users[id].extName;
			},
			getImg: function(id) {
				var user = users[id]; 
				return user._id + user.extName;
			},
			getEmail: function(id) {
				return user[id].email;
			},
			getProfile: function() {
				return user[id].profile;
			}
		};
	})();

	var msgManager = (function() {
		/* Use to cache the unread msg, id to an array*/
		var msgCache = [];
		return {
			sendFrom: function(fromId, msg) {
				var dialogue = dialgManager.get(fromId);
				if(dialogue && dialogue.isShow) {
					dialogue.createItsMsg(msg);
				} else {
					var msgs = msgCache[fromId] || [];
					msgs.push(msg);
					shaker.shake(fromId);
				};
			},
			pullMsg: function(id) {
					shaker.stop(id);
					var msgs = msgCache[id]
					,	dialogue = dialgManager.get(id);
					if(msgs) {
						for(var i = 0, len = msgs.length; i < len; i++) {
							dialogue.createItsMsg(msgs[i]);
						}
					}
			} 
		};
	})();

	var shaker = {
		shake: function(fromId) {
			console.log('start shake' + fromId);
		},
		stop: function(fromId) {
			console.log('stop shake' + fromId);
		}
	};

/* Jhat-privataFn
 * -------------------------------------------------------------------*/
	/*display the message on Dialogue*/
	var showMsg = function() {};

	/* inint the showMsg function: called as showMsg.call($this, ....);
	 * userId: who send the messag
	 * imgExt: user's img extend name (e.g '.jpg')
	 * content: the message to be shown
	 * isSelf: boolean, true->the message will show on the right,
	 *         else will show on the right
	 * */
	function initShowMsgFn() {
		var $other = $template.filter('li.jhat-record-other');
		var $self = $template.filter('li.jhat-record-self');
		return function(userId, content, isSelf) {
			var $msg = isSelf ? $self.clone(true) : $other.clone(true)
				$this = this;

			$msg.find('img.jhat-contact-avatar')
				.attr('src', config.avatar() + userManager.getImg(userId));
			$msg.find('p').text(content);

			$this.find('ul.jhat-records').append($msg.show());
			console.log($msg);
		};
	};


/* Jhat-initFn
 * -------------------------------------------------------------------*/
	function init() {
		widget();
		showMsg =  initShowMsgFn();
		initSocket();
	};

	/*A global socket object, I can use it everywhere inside the closure*/
	var socket = null;

	function initSocket() {

		socket = io.connect(config.url());

		/*save the socke on server*/
		socket.on('connect', function() {
			socket.emit('connect', me);
		});

		/*get a message an display it*/
		socket.on('msg', function(fromId, toId, msg) {
			msgManager.sendFrom(fromId, msg);
		});
	};

	function widget() {
		var speed = 200
		,	$show = $template.filter('div.jhat-show').appendTo($body)
		,	$box = $template.filter('div.jhat-box').appendTo($body)
		,	$hide = $box.find('li.jhat-icon-hide')
		,	zIndex = 99999;

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
					right: '-' + ($(this).width() - 5) + 'px'
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

		/*click on the avatar, init a new dialogue */
		$box.find('li.jhat-contact-item').on('dblclick', function(event) {
			var $this = $(this)
			,	info = JSON.parse($this.attr('data-info'))
			,	dialogue = null;
			if($this.data('dialogue')) {
				var id = $this.data('dialogueId');
				$('#jhat-' + id).fadeIn(200).css('z-index', ++zIndex);
				msgManager.pullMsg(id);
				return;
			} else {
				dialogue = dialgManager.set(info).show(); // register dialogue
				userManager.set(info); //register user

				$this.data('dialogueId', info._id);
				$this.data('dialogue', true);

				dialogue.$dom.css('z-index', ++zIndex);
				msgManager.pullMsg(info._id);
			}
		});

		/* dialogue z-index*/
		$body.on('mousedown', 'div.jhat-widget', function(event) {
			event.stopPropagation();
			$(this).css('z-index', ++zIndex);
		});

		$body.on('click', 'div.jhat-dialogue li.jhat-icon-hide', function(event) {
			event.stopPropagation();
			$(this).parents('div.jhat-dialogue').fadeOut(200);
		});

		$show.click();
	};
})();
