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
  constructor(name, group) {
    this.name = name;
    this.group = group;
  }
}

class RegionAndLocation extends Region {
  constructor(name, group, ...locations) {
    super(...locations);
    this.location = new Location(name, group);
    this.name = this.location.name;
    this.group = this.location.group;
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
