
const DecimalWriter = require('./decimal-writer');
const ChipFanAccessory = require('./chip-fan');
const ChipSwitchAccessory = require('./chip-switch');

// Platform constructor
// config may be null
// api may be null if launched from old homebridge version
class ChipPlatform{
  constructor(log, config, api) {
    log("ChipPlatform Init");
    this.log = log;
    this.config = config;
    this.api = api;

		this.Accessory = ChipPlatform.Accessory;
		this.Service = ChipPlatform.Service;
		this.Characteristic = ChipPlatform.Characteristic;
		this.UUIDGen = ChipPlatform.UUIDGen;

    this.decimalWriter = new DecimalWriter(
    	[4, 2, 0], // The GPIO pins that make up the binary write out. Left is most significant
    	6 // GPIO pin to enable the "write"
    );
  }

  accessories(callback) {
    callback([
    	new ChipSwitchAccessory(this, "Light", 1),
      new ChipFanAccessory(this, "Fan", [6, 7, 4, 5]), // The decimal numbers to write
      new ChipFanAccessory(this, "Bedroom Fan", [3, 2, 1, 0]) // The decimal numbers to write
    ]);
  }
}

module.exports = ChipPlatform;
