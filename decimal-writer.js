const {Gpio} = require('chip-gpio');
class DecimalWriter {
  constructor(bits, enable) {
    this.bits = bits.map(pin => new Gpio(pin, 'out'));
    this.enable = new Gpio(enable, 'out'); 


    // Disable immediatley
	this.enable.write(1);

    this.writePromise = Promise.resolve();
  }

  async write(val) {
  	console.log('queing write to ' + val);
    await this.writePromise;

    this.writePromise = this._write(val);
    return this.writePromise;
  }

  _write(val) {
  	console.log('starting write to ' + val);
    return new Promise((resolve) => {
      var shifter = 1;

      for (var i = this.bits.length; i > 0; i--) { 
      	const gpioPin = this.bits[i - 1];
      	console.log(`idx: ${i - 1}; ${shifter} & ${val} = ${shifter & val} = .write(${shifter & val ? 1 : 0})`);
        // Write a 1 if the bit is on at that index
        gpioPin.write(val & shifter ? 1 : 0);
        // Shift the on bit to the left
        shifter = shifter << 1;
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