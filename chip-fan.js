

class ChipFanAccessory {
  constructor(platform, name, speeds) {
    this.platform = platform;
    this.name = name;
    this.speeds = speeds;
    this.lastKnownIsActive = false;
    this.lastKnownSpeed = 50;

    this.Service = this.platform.constructor.Service;
  	this.Characteristic = this.platform.constructor.Characteristic;
  }

  getServices() {
    const fanService = new this.Service.Fanv2(this.name);
    const activeCharacteristic = fanService.getCharacteristic(this.Characteristic.Active);
    const rotationSpeedCharacteristic = fanService.addCharacteristic(this.Characteristic.RotationSpeed);

    // power
    activeCharacteristic
      .on("get", (callback) => {
        callback(null, this.lastKnownIsActive ? this.Characteristic.Active.ACTIVE : this.Characteristic.Active.INACTIVE);
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
    const range = 100 / (this.speeds.length - 1);
    const speedIndex = Math.ceil(speed / range);
    this.platform.decimalWriter.write(this.speeds[speedIndex]);
  }
}

module.exports = ChipFanAccessory;