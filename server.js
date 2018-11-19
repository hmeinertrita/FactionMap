const express = require('express');
const writeSystem = require('./Loaders/jsonSaver');
let system;
require('./Loaders/JsonParser')('./Data/save.json').then((sys) => {
  console.log('Loaded JSON!');
  system = sys;
});

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('systemView', {system: system});
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
