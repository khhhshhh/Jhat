var io = require('socket.io')
,	User = require('./models/user.js')
,	Message = require('./models/message.js');

/*var socketManager = (function() {
	// A array stores arrays , 
	// You can find your sockets arrays throught _idToSockets[id]
	var	_idToSockets = [];
	return {
		// add a new socket to certain user 
		add: function(_id, socket) {
			socket.connecting = true;
			var sockets = _idToSockets[_id] || [];
			sockets.push(socket);
		},
		remove: function(_id ,socket) {
			// a flag which points out that 
			// if the socket is connecting
			// when socket disconnect, it should be set to false 
			// it used to gurantee the users sockets are all connecting 
			socket.connecting = false; 
		},
		sendMsg: function(fromId, toId, msg){
			// send a Message to certain user, iterate the sockets array,
			// send the Message to damn all sockets,
			// and remove the socket which has beeen disconnected
			var sockets = _idToSockets[toId]
			,	newSockets = []
			,	socket = null;
			if(!sockets) return;
			else {
				for(var i = 0, len = sockets.length; i < len; i++) {
					socket = sockets[i];
					if(socket.connecting) {
						socket.emit(fromId, 'msg');
						newSockets.push(socket);
					}
				}
				if(newSockets.length == 0) {
					delete _idToSockets[toId];
				};
			};
		}
	};
})();*/

/*socketManager = (function() {
	var _idToSockets = [];
	return {
		set: function(_id, socket) {
			_idToSockets[_id] = socket;
		},
		unset: function(_id) {
			delete _idToSockets[_id]; 
		},
		sendMsg: function(fromId, toId, msg) {
			var socket = _idToSockets[toId];
			if(socket) {
				socket.emit('msg', fromId, msg);
			} else {
				// to do with database
			}
		}
	};
})();

module.exports = function (server) {
	io = io.listen(server);
	io.sockets.on('connection', function(socket) {

		socket.on('connect', function(me) {
			socketManager.set(me, socket);
		});

		socket.on('disconnect', function(me) {
			socketManager.unset(me, socket);
		});

		socket.on('msg', function(fromId, toId, msg){
			socketManager.sendMsg(fromId, toId, msg);
		});
	});
};*/

module.exports = function(server) {
	io = io.listen(server);
	io.sockets.on('connection', function(socket) {

		socket.on('connect', function(_id) {
			socket.join(_id);
		});

		socket.on('msg', function(fromId, toId, msg) {
			io.sockets.in(toId).emit('msg', fromId, toId, msg);
		});
	});
};
