const socket = io();
let sys;
let assets;

let assetTemplate;
let factionTemplate;
let starTemplate;
let systemTemplate;
let oribitalTemplate;
let planetTemplate;

socket.on('refresh', refresh);

function init(system) {
  sys = system;

  assetsByFaction = {};
  for (var f in sys.factions) {
    assetsByFaction[sys.factions[f].colour] = [];
  }
  for (var a in sys.assets) {
    assetsByFaction[sys.assets[a].faction.colour].push(sys.assets[a]);
  }

  $('.current-hp').change(function() {
    const id = $(this).attr('data-asset');
    sys.assets[id].currentHp = parseInt($(this).val());
    update();
  });

  assetTemplate = $('.asset#template').clone();
  factionTemplate = $('.faction#template').clone();
  starTemplate = $('.star#template').clone();
  systemTemplate = $('.system#template').clone();
  orbitalTemplate = $('.orbital#template').clone();
  planetTemplate = $('.planet#template').clone();
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

function createStarElement(star) {
  const se = starTemplate.clone();
  se.attr('id', star.name);
  return se;
}

function createOrbitalElement(orbital) {
  const oe = orbitalTemplate.clone();
  oe.attr('id', orbital.name);
  oe.addClass('ring-' + orbital.ring);
  oe.addClass('count-' + orbital.locations.length);
  return oe;
}

function createPlanetElement(planet, satelliteNum) {
  const pe = planetTemplate.clone();
  pe.attr('id', planet.name);
  pe.addClass('num-'+satelliteNum);
  return pe;
}

function render() {
  const systemElement = $('<div class="system"/>');
  systemElement.text(sys.name);

  for (var s in sys.stars) {
    const starElement = createStarElement(sys.stars[s]);

    sys.stars[s].orbitals.forEach((o, i) => {
      const orbitalElement = createOrbitalElement(o);

      o.locations.forEach((p, j) => {
        const planetElement = createPlanetElement(p, j);
        orbitalElement.append(planetElement);
      });

      starElement.append(orbitalElement);
    });

    systemElement.append(starElement);
  }

  const assetsElement = $('<div class="assets"/>');
  assetsElement.text('Assets');
  for (var f in assetsByFaction) {
    const factionElement = createFactionElement(sys.factions[f]);

    assetsByFaction[f].forEach(a => {
      const assetElement = createAssetElement(a);
      factionElement.append(assetElement);
    });

    assetsElement.append(factionElement);
  }

  $('.root').empty();
  $('.root').append(systemElement);
  $('.root').append(assetsElement);
}

function refresh(system) {
  console.log('page refreshed');
  init(system);
  render();
}

function update() {
  socket.emit('update', sys);
}
