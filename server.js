const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const json = require('./Loaders/jsonManager');
const port = process.env.PORT || 5000;

let system;
json.read('./Data/save.json').then((sys) => {
  console.log('loaded json');
  system = sys;
});


app.set('view engine', 'pug');
app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
  res.render('systemView', {system: system});
});

io.on('connection', function(socket){
  console.log("user connected");

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('update', sys => {
    update(sys);
  });

  socket.emit('refresh', system);
});

function update(sys) {
  system = sys;
  console.log('system updated');
  io.emit('refresh', system);
  json.write(system);
}


// console.log that your server is up and running
http.listen(port, () => console.log(`listening on port ${port}`));
