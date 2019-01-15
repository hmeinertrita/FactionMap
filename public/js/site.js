const socket = io();
let sys;
let locations;
let assetsByFaction;
let assetsByLocation;
let locationsByGroup;
let locationOptionsByGroup;
let locationIdsByName;
let groupIdsByName;

let assetTemplate;
let factionTemplate;
let starTemplate;
let systemTemplate;
let sectorTemplate;
let deepSpaceTemplate;
let oribitalTemplate;
let planetTemplate;
let assetDotTemplate;
let locationGroupTemplate;
let locationTemplate;
let assetFormTemplate;

var templatesCloned=false;

socket.on('refresh', refresh);

function hoverHighlight(element, match) {
  element.attr('data-match',match);
  const selector = '[data-'+match+'=true]';
  const hoverIn = function() {
    $(selector).addClass('-hover');
  }
  const hoverOut = function() {
    $(selector).removeClass('-hover');
  }
  element.hover(hoverIn, hoverOut);
}

function setColour(element, hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
  element.css('--colour', rgb.r + ', '+ rgb.g + ', '+ rgb.b);
}

function createSystemAsset() {
  const se = systemTemplate.clone();
  return se;
}

function createAssetElement(asset) {
  const ae = assetTemplate.clone();
  ae.attr('id', asset.id);
  const callsign = ae.find('.asset__callsign');
  callsign.text(asset.callsign);
  hoverHighlight(callsign, 'asset-' + asset.id);
  ae.find('.asset__name').text(asset.name);
  const select = ae.find('select.asset__location-select');
  for (var g in locationOptionsByGroup) {
    select.append(locationOptionsByGroup[g].clone());
  }
  select.attr('data-asset', asset.id);
  select.val(asset.locationName);
  ae.find('input.asset__current-hp').val(asset.currentHp);
  ae.find('input.asset__current-hp').attr('data-asset', asset.id);
  ae.find('button.asset__delete').attr('data-asset', asset.id);
  ae.find('.asset__max-hp').text(asset.maxHp);
  ae.attr('data-faction', asset.faction.colour);
  setColour(ae, asset.faction.colour);
  return ae;
}

function createFactionElement(faction) {
  const fe = factionTemplate.clone();
  fe.attr('id', faction.colour);
  setColour(fe, faction.colour);
  const name = fe.find('.faction__name');
  name.text(faction.name);
  hoverHighlight(name, faction.colour);

  return fe;
}

function createLocationGroupElement(groupName, groupId) {
  const lge = locationGroupTemplate.clone();
  lge.attr('id', groupId);
  const name = lge.find('.location-group__name');
  name.text(groupName);
  hoverHighlight(name, groupId);

  return lge;
}

function createLocationElement(location) {
  const le = locationTemplate.clone();
  le.attr('id', locationIdsByName[location.name]);
  le.text(location.name);
  hoverHighlight(le, locationIdsByName[location.name]);

  return le;
}

function createStarElement(star) {
  const se = starTemplate.clone();
  se.attr('id', star.name);
  return se;
}

function createOrbitalElement(orbital, satelliteCount) {
  const oe = orbitalTemplate.clone();
  oe.attr('data-'+locationIdsByName[orbital.name], true);
  oe.attr('id', orbital.name);
  oe.addClass('ring-' + orbital.ring);
  oe.addClass('count-' + satelliteCount);
  return oe;
}

function createDeepSpaceElement(deepSpace) {
  const dse = deepSpaceTemplate.clone();
  dse.attr('id', deepSpace.name);
  dse.attr('data-'+groupIdsByName[deepSpace.name], true);
  dse.addClass('slices-' + deepSpace.orbitals.length);
  return dse;
}

function createSectorElement(orbital) {
  const se = sectorTemplate.clone();
  se.attr('data-'+locationIdsByName[orbital.name], true);
  se.attr('id', orbital.name);
  se.addClass('line-' + orbital.ring);
  return se;
}

function createPlanetElement(planet, satelliteNum) {
  const pe = planetTemplate.clone();
  if (planet.faction) {
    pe.attr('data-'+planet.faction.colour, true);
    setColour(pe, planet.faction.colour);
  }
  pe.attr('data-'+locationIdsByName[planet.name], true);
  pe.attr('id', planet.name);
  pe.addClass('num-'+satelliteNum);
  return pe;
}

function createAssetDotElement(asset, satelliteNum) {
  const ade = assetDotTemplate.clone();
  ade.attr('data-'+asset.faction.colour, true);
  ade.attr('data-asset-'+asset.id, true);
  ade.attr('id', asset.id);
  ade.addClass('num-'+satelliteNum);
  setColour(ade, asset.faction.colour);
  return ade;
}

function createAssetForm() {
  const af = assetFormTemplate.clone();
  af.attr('id', '');
  const factionSelect = af.find('select.asset-form__faction-select');
  const locationSelect = af.find('select.asset-form__location-select');

  for (var f in sys.factions) {
    const option = $('<option/>');
    option.val(f);
    option.text(sys.factions[f].name);
    factionSelect.append(option);
  }

  for (var g in locationOptionsByGroup) {
    locationSelect.append(locationOptionsByGroup[g].clone());
  }

  af.submit(function(e) {
    e.preventDefault();
    const data = $(this).serializeArray().reduce((acc, cur) => {
      acc[cur.name] = cur.value;
      return acc;
    }, {});

    $.post({
      url: 'create',
      data: JSON.stringify(data),
      contentType: 'application/json'
    });
  });
  return af;
}

function init(system) {
  sys = system;
  locations = system.allLocations;

  locationsByGroup = {};
  locationOptionsByGroup = {};
  groupIdsByName = {};
  locationIdsByName = {};
  var groupCount = 0;
  locations.forEach((l, i) => {
    locationIdsByName[l.name] = 'location-' + i;

    var id = groupIdsByName[l.group];
    if(id) {
      locationsByGroup[id].push(l);

      const option = $('<option/>');
      option.val(l.name);
      option.text(l.name);
      locationOptionsByGroup[id].append(option);
    }
    else {
      id = 'lg-' + groupCount;
      groupIdsByName[l.group] = id;
      groupCount++;

      locationsByGroup[id] = [l];

      const group = $('<optgroup/>');
      const option = $('<option/>');
      group.attr('label', l.group);
      option.val(l.name);
      option.text(l.name);
      group.append(option);
      locationOptionsByGroup[id] = group;
    }
  });

  assetsByFaction = {};
  for (var f in sys.factions) {
    assetsByFaction[sys.factions[f].colour] = [];
  }

  assetsByLocation = {};
  locations.forEach(l => {
    assetsByLocation[l.name] = [];
  });

  for (var a in sys.assets) {
    if (sys.assets[a]) {
      assetsByFaction[sys.assets[a].faction.colour].push(sys.assets[a]);
      assetsByLocation[sys.assets[a].locationName].push(sys.assets[a]);
    }
  }

  if (!templatesCloned) {
    assetTemplate = $('.asset#template').clone();
    factionTemplate = $('.faction#template').clone();
    starTemplate = $('.star#template').clone();
    systemTemplate = $('.system#template').clone();
    orbitalTemplate = $('.orbital#template').clone();
    planetTemplate = $('.planet#template').clone();
    assetDotTemplate = $('.asset-dot#template').clone();
    assetFormTemplate = $('.asset-form#template').clone();
    deepSpaceTemplate = $('.deepspace#template').clone();
    sectorTemplate = $('.sector#template').clone();
    locationTemplate = $('.location#template').clone();
    locationGroupTemplate = $('.location-group#template').clone();

    templatesCloned=true;
  }
}

function render() {
  const systemElement = createSystemAsset();
  systemElement.find('.system__name').text(sys.name);
  sys.stars.forEach(s => {
    const starElement = createStarElement(s);
    s.orbitals.forEach((o, i) => {
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

    systemElement.find('.system__stars').append(starElement);
  });

  sys.deepSpaceRegions.forEach((ds, i) => {
    const deepSpaceElement = createDeepSpaceElement(ds);
    ds.orbitals.forEach((o, j) => {
      const sectorElement = createSectorElement(o);

      var satelliteNum = 0;

      o.locations.forEach(p => {
        const planetElement = createPlanetElement(p, satelliteNum);
        sectorElement.append(planetElement);
        satelliteNum++;
      });

      assetsByLocation[o.name].forEach(a => {
        const assetDotElement = createAssetDotElement(a, satelliteNum);
        sectorElement.append(assetDotElement);
        satelliteNum++;
      });

      deepSpaceElement.append(sectorElement);
    });
    var wrapper = $('<div/>');
    wrapper.addClass('system__sector');
    wrapper.addClass('num-'+i);
    systemElement.find('.system__deep-space').addClass('num-'+sys.deepSpaceRegions.length);
    wrapper.append(deepSpaceElement);
    systemElement.find('.system__deep-space').append(wrapper);
  });

  const locationsElement = $('<div class="locations"/>');
  for (var lg in locationsByGroup) {
    const groupElement = createLocationGroupElement(locationsByGroup[lg][0].group, lg)

    locationsByGroup[lg].forEach((l, i) => {
      const locationElement = createLocationElement(l, lg + '-' + i);
      groupElement.find('.location-group__locations').append(locationElement);
    });

    locationsElement.append(groupElement);
  }

  const assetsElement = $('<div class="assets"/>');
  //assetsElement.text('Assets');
  for (var f in assetsByFaction) {
    const factionElement = createFactionElement(sys.factions[f]);

    assetsByFaction[f].forEach(a => {
      const assetElement = createAssetElement(a);
      factionElement.find('.faction__assets').append(assetElement);
    });

    assetsElement.append(factionElement);
  }

  var sidebar = $('<div/>');
  sidebar.addClass('sidebar')

  sidebar.append(locationsElement);
  sidebar.append(assetsElement);
  sidebar.append(createAssetForm());

  $('.root').empty();
  $('.root').append(systemElement);
  $('.root').append(sidebar);

  $('input.asset__current-hp').change(function() {
    const id = $(this).attr('data-asset');
    sys.assets[id].currentHp = parseInt($(this).val());
    update();
  });

  $('select.asset__location-select').change(function() {
    const id = $(this).attr('data-asset');
    sys.assets[id].locationName = $(this).val();
    update();
  });

  $('button.asset__delete').click(function() {
    const id = $(this).attr('data-asset');
    sys.assets[id] = null;
    update();
  });
}

function refresh(system) {
  init(system);
  render();
  console.log('refresh');
}

function update() {
  socket.emit('update', sys);
}
