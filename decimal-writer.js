const {Gpio} = require('chip-gpio');
const _ = require('lodash');

class DecimalWriter {
  constructor(bits, enable) {
    this.bits = bits.map(pin => new Gpio(pin, 'out')); // The GPIO pins that make up the binary write out. Left is most significant
    this.enable = new Gpio(enable); // GPIO pin to enable the "write"


    // Disable immediatley
	this.enable.write(1);

    this.writePromise = Promise.resolve();
  }

  async write(val) {
    await this.writePromise;
    this.writePromise = this._write(val);
    return this.writePromise;
  }

  _write(val) {
    return new Promise((resolve) => {
      let shifter = 1;

      _.eachRight(this.bits, (gpioPin, bitIndex) => {
        // Write a 1 if the bit is on at that index
        gpioPin.write(shifter & val ? 1 : 0);
        // Shift the on bit to the left
        shifter = shifter << 0;
      });

      this.enable.write(0);
      setTimeout(() => {
        this.enable.write(1);
        resolve();
      }, 300);
    });
  }
}

module.exports = DecimalWriter;