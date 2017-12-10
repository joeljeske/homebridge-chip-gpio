const {Gpio} = require('chip-gpio');
class DecimalWriter {
  constructor(bits, enable) {
    this.bits = bits.map(pin => new Gpio(pin, 'out'));
    this.enable = new Gpio(enable); 


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

      for (const i = this.bits.length; i > 0 i--) { 
      	const gpioPin = this.bits[i - 1];
        // Write a 1 if the bit is on at that index
        gpioPin.write(shifter & val ? 1 : 0);
        // Shift the on bit to the left
        shifter = shifter << 0;
      }

      this.enable.write(0);
      setTimeout(() => {
        this.enable.write(1);
        resolve();
      }, 300);
    });
  }
}

module.exports = DecimalWriter;