var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  console.log("homebridge API version: " + homebridge.version);

  // Accessory must be created from PlatformAccessory Constructor
  Accessory = homebridge.platformAccessory;

  // Service and Characteristic are from hap-nodejs
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  
  // For platform plugin to be considered as dynamic platform plugin,
  // registerPlatform(pluginName, platformName, constructor, dynamic), dynamic must be true
  homebridge.registerPlatform("homebridge-chip-gpio", "ChipPlatform", ChipPlatform, true);
};

// Platform constructor
// config may be null
// api may be null if launched from old homebridge version
class ChipPlatform{
  constructor(log, config, api) {
    log("ChipPlatform Init");
    var platform = this;
    this.log = log;
    this.config = config;
    this.api = api;
  }

  accessories(callback) {
    callback([
      new ChipFanAccessory("Test Fan")
    ]);
  }
}


class ChipFanAccessory {
  constructor(name) {
    this.name = name;
    this.active = true;
  }

  getServices() {
    var fanService = new Service.Fanv2(this.name);
    var activeCharacteristic = fanService.getCharacteristic(Characteristic.Active);
    var rotationSpeedCharacteristic = fanService.addCharacteristic(Characteristic.RotationSpeed);

        // power
   activeCharacteristic
    .on("get", (callback) => {
      console.log("getting active " + this.active);
      callback(null, this.active ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE);
    })
    .on("set", (value, callback) => {
      this.active = !!value;
      console.log("setting active " + this.active);
      callback(null);
    });

        // speed_level natural_level
    rotationSpeedCharacteristic
      .on("get", (callback) => {
        console.log("setting speed " + this.speed);
        callback(null, this.speed);
      })
      .on("set", (value, callback) => {
          this.speed = value;
          console.log("setting speed " + this.speed);
          callback(null);
      });

    return [fanService];
  }
}
