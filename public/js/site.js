const socket = io();
let sys;

socket.on('refresh', refresh);

function refresh(system) {
  sys = system;
  console.log('page refreshed');
  render();
}

function render() {
  const systemElement = $('<div class="system"/>');
  systemElement.text(sys.name);

  for (var s in sys.stars) {
    const starElement = $('<div class="star"/>');
    starElement.text(sys.stars[s].name);

    sys.stars[s].orbitals.forEach((o, i) => {
      const orbitalElement = $('<div class="orbital"/>');
      orbitalElement.text(o.name);

      o.planets.forEach((p) => {
        const planetElement = $('<div class="planet"/>');
        planetElement.text(p.name);
        orbitalElement.append(planetElement);
      });

      starElement.append(orbitalElement);
    });

    systemElement.append(starElement);
  }

  const assets = {};
  for (var f in sys.factions) {
    assets[sys.factions[f].colour] = [];
  }
  for (var a in sys.assets) {
    assets[sys.assets[a].faction.colour].push(sys.assets[a]);
  }

  const assetsElement = $('<div class="assets"/>');
  assetsElement.text('Assets');
  for (var f in assets) {
    const factionElement = $('<div class="faction"/>');
    factionElement.text(sys.factions[f].name);

    assets[f].forEach(a => {
      const assetElement = $('<div class="asset"/>');
      assetElement.text(a.id);
      factionElement.append(assetElement);
    });

    assetsElement.append(factionElement);
  }

  $('.root').empty();
  $('.root').append(systemElement);
  $('.root').append(assetsElement);
}

function update() {
  socket.emit('update', sys);
}
