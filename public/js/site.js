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

  $('.root').empty();
  $('.root').append(systemElement);
}

function update() {
  socket.emit('update', sys);
}
