const {Gpio} = require('chip-gpio');

class ChipSwitchAccessory {
  constructor(platform, name, pin) {
    this.platform = platform;
    this.name = name;
    this.pin = new Gpio(pin, 'out');
    this.lastKnownIsOn = false;

    this.pin.write(1);
    
    this.Service = this.platform.constructor.Service;
  	this.Characteristic = this.platform.constructor.Characteristic;
  }

  getServices() {
    const switchService = new this.Service.Switch(this.name);
    const onCharacteristic = switchService.getCharacteristic(this.Characteristic.On);

    onCharacteristic
            .on('get', (callback) => {
            	callback(null, this.lastKnownIsOn);
            })
            .on('set', (on, callback) => {
	            this.lastKnownIsOn = on
	            this.pin.write(0);
	            setTimeout(function() {
	            	this.pin.write(1);
	            	callback(null);
	            }, 300);
            });

	// We make a toggle switch in case the on/off is reversed due to a reboot
    const toggleService = new this.Service.Switch(this.name + '-Toggle');
    const toggleOnCharacteristic = switchService.getCharacteristic(this.Characteristic.On);

    toggleOnCharacteristic
        .on('get', (callback) => {
        	callback(null, this.lastKnownIsOn);
        })
        .on('set', (on, callback) => {
            this.lastKnownIsOn = on;
        });


    return [switchService, toggleService];
}

module.exports = ChipSwitchAccessory;