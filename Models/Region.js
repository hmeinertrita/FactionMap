class Region {
  constructor(...locations) {
    this.locations = locations
  }
  getLocations() {
    return this.locations;
  }
}

class CompositeRegion extends Region {
  constructor(...regions) {
    super();
    this.regions = regions;
  }
  getLocations() {
    const locations = [];
    this.regions.forEach(r => {
      locations.push(...r.getLocations());
    })
    return locations;
  }
}

class Location {
  constructor(name) {
    this.name = name ? name : 'NO LOCATION NAME';
  }
}

class RegionAndLocation extends Region {
  constructor(name, ...locations) {
    super(...locations);
    this.name = name;
  }
  getLocations() {
    return [this, ...(this.locations)];
  }
}

module.exports = {
  Region: Region,
  CompositeRegion: CompositeRegion,
  Location: Location,
  RegionAndLocation: RegionAndLocation
};
