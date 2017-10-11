var http = require('http');
var express = require('express'),
	app = module.exports.app = express();
/*
	{
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },

*/

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(3000);  //listen on port 80

io.on('connection', function (socket) {
	socket.emit('userId',{userId:socket.id});
	socket.on('messages', function (data) {
		let messageObj = {
			_id: new Date().getTime()+'#'+socket.id,
			text: data.text,
			createdAt: new Date(),
			user:{
				_id: socket.id,
				name: data.username
			}
		};
		console.log('messageObj => ', messageObj);
		socket.broadcast.emit('messages',{'messages':messageObj});
		socket.emit('messages',{'messages':messageObj});
  });
});