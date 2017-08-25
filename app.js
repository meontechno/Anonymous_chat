var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;
server.listen(port, function(){
    console.log('app running...');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

//var usernames = [];
var usernamesobj = {};

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.sockets.on('connection', function(socket){
    
    socket.on('new user', function(data, callback){
        if(data in usernamesobj){
            callback(false);
        } else {
            callback(true);
            socket.name = data;
            usernamesobj[socket.name] = socket;
            //usernames.push(socket.name);
            updateusernames();
        }
    });
    
    function updateusernames(){
        io.sockets.emit('online users', Object.keys(usernamesobj));
    }
    
    socket.on('send message', function(data, callback){    
        if(typeof(data) == "object"){            
            if(data.secretname in usernamesobj){
                usernamesobj[data.secretname].emit('secret message', {msg: data.secretmsg, msg_user: socket.name});
            }
            else{
                callback('Error! Enter a valid secret friend name from the list in the left/top!');
            }
        }
        else{
            io.sockets.emit('new message', {msg: data, msg_user: socket.name});
        }        
        //socket.broadcast.emit('new message', data);
    });
    
    socket.on('disconnect', function(data){
        if(!socket.name) return;
        delete usernamesobj[socket.name];
        //usernames.splice(usernames.indexOf(socket.name), 1);
        updateusernames();
    });
});

module.exports = app;