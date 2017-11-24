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
      new ChipFanAccessory("Test Fan", [0,1,2,3])
    ]);
  }
}


class ChipFanAccessory {
  constructor(name, speeds) {
    this.name = name;
    this.active = true;
    this.ACTIVE = 0;
    this.INACTIVE = 1;

    const {Gpio} = requre('chip-gpio');
    this.speeds = speeds
      .map(pin => new Gpio(pin, 'out'))
      .forEach(gpio => gpio.write(this.INACTIVE));

    this.lastKnownIsActive = false;
    this.lastKnownSpeed = 50;
  }

  getServices() {
    var fanService = new Service.Fanv2(this.name);
    var activeCharacteristic = fanService.getCharacteristic(Characteristic.Active);
    var rotationSpeedCharacteristic = fanService.addCharacteristic(Characteristic.RotationSpeed);

    // power
    activeCharacteristic
      .on("get", (callback) => {
        callback(null, this.lastKnownIsActive ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE);
      })
      .on("set", async (value, callback) => {
        this.lastKnownIsActive = !!value;
        await this.setSpeed(this.lastKnownIsActive ? this.lastKnownSpeed : 0);
        callback(null);
      });

    // speed_level natural_level
    rotationSpeedCharacteristic
      .on("get", (callback) => {
        callback(null, this.lastKnownSpeed);
      })
      .on("set", (value, callback) => {
        this.lastKnownSpeed = value;
        callback(null);
      });

    return [fanService];
  }

  setSpeed(speed) {
    return new Promise((resolve) => {
      const range = 100 / this.speeds.length;
      const speedNumber = Math.floor(Math.min(speed, 99) / range); 
      this.speeds.forEach((gpio, index) => {
        if (index === speedNumber) {
          gpio.write(this.ACTIVE);
          // We hold it for 300ms
          setTimeout(() => {
            gpio.write(this.INACTIVE);
            resolve();
          }, 300);
        } else {
          gpio.write(this.INACTIVE);
        }
      });
    });
  }
}
