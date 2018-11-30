const socket = io();
let sys;
let assets;

let assetTemplate;
let factionTemplate;

socket.on('refresh', refresh);

function init() {
  $('.current-hp').change(function() {
    const id = $(this).attr('data-asset');
    sys.assets[id].currentHp = parseInt($(this).val());
    update();
  });

  assetTemplate = $('.asset#template').clone();
}

function refresh(system) {
  sys = system;
  assets = {};
  for (var f in sys.factions) {
    assets[sys.factions[f].colour] = [];
  }
  for (var a in sys.assets) {
    assets[sys.assets[a].faction.colour].push(sys.assets[a]);
  }
  console.log('page refreshed');
  init();
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

  const assetsElement = $('<div class="assets"/>');
  assetsElement.text('Assets');
  for (var f in assets) {
    const factionElement = $('<div class="faction"/>');
    factionElement.text(sys.factions[f].name);

    assets[f].forEach(a => {
      const assetElement = createAssetElement(a);
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

function createAssetElement(asset) {
  const ae = assetTemplate.clone();
  ae.attr('id', asset.id);
  ae.find('.asset__name').text(asset.name);
  ae.find('.asset__id').text(asset.id);
  ae.find('select.asset__location-select').val(asset.location.id);
  ae.find('input.asset__current-hp').val(asset.currentHp);
  ae.find('.asset__max-hp').text(asset.maxHp);
  ae.attr('data-faction', asset.faction.colour);
  return ae;
}

function createFactionElement(faction) {
  const fe = factionTemplate.clone();
  fe.attr('id', faction.colour);
  fe.find('.faction__name').text(faction.name);
  return fe;
}
