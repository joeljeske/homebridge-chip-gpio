var Accessory, Service, Characteristic, UUIDGen;

const ChipPlatform = require('./chip-platform');

module.exports = function(homebridge) {
  console.log("homebridge API version: " + homebridge.version);

  // Accessory must be created from PlatformAccessory Constructor
  ChipPlatform.Accessory = homebridge.platformAccessory;

  // Service and Characteristic are from hap-nodejs
  ChipPlatform.Service = homebridge.hap.Service;
  ChipPlatform.Characteristic = homebridge.hap.Characteristic;
  ChipPlatform.UUIDGen = homebridge.hap.uuid;

  // For platform plugin to be considered as dynamic platform plugin,
  // registerPlatform(pluginName, platformName, constructor, dynamic), dynamic must be true
  homebridge.registerPlatform("homebridge-chip-gpio", "ChipPlatform", ChipPlatform, true);
};




