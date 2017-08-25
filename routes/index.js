
var express = require('express');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.sockets.on('connection', function(socket){
    socket.on('send message', function(data){
        io.sockets.emit('new message', data);
        //socket.broadcast.emit('new message', data);
    });
});



module.exports = router;
