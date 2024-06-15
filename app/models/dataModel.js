const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  deviceId: String,
  gsmSignalStrength: String,
  hardwareVersion: String,
  firmwareVersion: String,
  gpsDate: String,
  gpsTime: String,
  gpsHeading: String,
  latitude: String,
  longitude: String,
  speed: String,
  mileage: String,
  internalBatteryVoltage: String,
  externalBatteryVoltage: String,
  idle: String,
  moving: String,
  parked: String,
  ignitionStatus: String,
  batteryTamper: String,
  harshAcceleration: String,
  harshBraking: String,
  harshCornering: String,
  overSpeeding: String,
  excessIdle: String,
  x: String,
  y: String,
  z: String,
  immobilizerCheck: String,
  sos: String,
});

module.exports = mongoose.model('Data', dataSchema);
