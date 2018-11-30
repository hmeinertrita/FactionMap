const socket = io();
let sys;
let locations;
let assetsByFaction;
let assetsByLocation;

let assetTemplate;
let factionTemplate;
let starTemplate;
let systemTemplate;
let oribitalTemplate;
let planetTemplate;
let assetDotTemplate;

socket.on('refresh', refresh);

function init(system) {
  sys = system;
  locations = system.allLocations;

  assetsByFaction = {};
  for (var f in sys.factions) {
    assetsByFaction[sys.factions[f].colour] = [];
  }
  for (var a in sys.assets) {
    assetsByFaction[sys.assets[a].faction.colour].push(sys.assets[a]);
  }

  assetsByLocation = {};
  locations.forEach(l => {
    assetsByLocation[l.name] = [];
  });
  for (var a in sys.assets) {
    assetsByLocation[sys.assets[a].locationName].push(sys.assets[a]);
  }
  assetTemplate = $('.asset#template').clone();
  factionTemplate = $('.faction#template').clone();
  starTemplate = $('.star#template').clone();
  systemTemplate = $('.system#template').clone();
  orbitalTemplate = $('.orbital#template').clone();
  planetTemplate = $('.planet#template').clone();
  assetDotTemplate = $('.asset-dot#template').clone();
}

function createAssetElement(asset) {
  const ae = assetTemplate.clone();
  ae.attr('id', asset.id);
  ae.find('.asset__name').text(asset.name);
  ae.find('.asset__id').text(asset.id);
  const select = ae.find('select.asset__location-select');
  locations.forEach(l => {
    const option = $('<option/>');
    option.val(l.name);
    option.text(l.name);
    select.append(option);
  });
  select.attr('data-asset', asset.id);
  select.val(asset.locationName);
  ae.find('input.asset__current-hp').val(asset.currentHp);
  ae.find('input.asset__current-hp').attr('data-asset', asset.id);
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

function createOrbitalElement(orbital, satelliteCount) {
  const oe = orbitalTemplate.clone();
  oe.attr('id', orbital.name);
  oe.addClass('ring-' + orbital.ring);
  oe.addClass('count-' + satelliteCount);
  return oe;
}

function createPlanetElement(planet, satelliteNum) {
  const pe = planetTemplate.clone();
  pe.attr('id', planet.name);
  pe.addClass('num-'+satelliteNum);
  return pe;
}

function createAssetDotElement(asset, satelliteNum) {
  const ade = assetDotTemplate.clone();
  ade.attr('id', asset.id);
  ade.addClass('num-'+satelliteNum);
  return ade;
}

function render() {
  const systemElement = $('<div class="system"/>');
  systemElement.text(sys.name);

  for (var s in sys.stars) {
    const starElement = createStarElement(sys.stars[s]);

    sys.stars[s].orbitals.forEach((o, i) => {
      const orbitalElement = createOrbitalElement(o, assetsByLocation[o.name].length + o.locations.length);

      var satelliteNum = 0;

      o.locations.forEach(p => {
        const planetElement = createPlanetElement(p, satelliteNum);
        orbitalElement.append(planetElement);
        satelliteNum++;
      });

      assetsByLocation[o.name].forEach(a => {
        const assetDotElement = createAssetDotElement(a, satelliteNum);
        orbitalElement.append(assetDotElement);
        satelliteNum++;
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
  $('input.asset__current-hp').change(function() {
    const id = $(this).attr('data-asset');
    sys.assets[id].currentHp = parseInt($(this).val());
    update();
  });
}

function refresh(system) {
  console.log('page refreshed');
  init(system);
  render();
}

function update() {
  socket.emit('update', sys);
}
