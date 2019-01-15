const System = require('./Models/System.js');
const express = require('express');
const bodyParser = require('body-parser')
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
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('systemView', {system: system});
});

app.post('/create', (req, res) => {
  system.newAsset(req.body.name, req.body.callsign, req.body.location, req.body.faction, req.body.maxHp)
  change();
});

app.post('/delete', (req, res) => {
  system.removeAsset(req.body.id);
  change();
});

app.post('/damage', (req, res) => {
  system.assets[req.body.id].currentHp = req.body.hp;
  change();
});

app.post('/move', (req, res) => {
  system.assets[req.body.id].locationName = req.body.location;
  change();
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
  system = new System(sys.name, sys.stars, sys.factions, sys.assets, sys.deepSpaceRegions);
  console.log('system updated');
  change();
}

function change() {
  io.emit('refresh', system);
  json.write(system);
}

// console.log that your server is up and running
http.listen(port, () => console.log(`listening on port ${port}`));
