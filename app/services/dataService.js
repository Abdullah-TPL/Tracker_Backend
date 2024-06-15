const DataModel = require('../models/dataModel');

const saveData = async (parsedData) => {
  const dataDocument = new DataModel({
    deviceId: parsedData[0],
    gsmSignalStrength: parsedData[1],
    hardwareVersion: parsedData[2],
    firmwareVersion: parsedData[3],
    gpsDate: parsedData[4],
    gpsTime: parsedData[5],
    gpsHeading: parsedData[6],
    latitude: parsedData[7],
    longitude: parsedData[8],
    speed: parsedData[9],
    mileage: parsedData[10],
    internalBatteryVoltage: parsedData[11],
    externalBatteryVoltage: parsedData[12],
    idle: parsedData[13],
    moving: parsedData[14],
    parked: parsedData[15],
    ignitionStatus: parsedData[16],
    batteryTamper: parsedData[17],
    harshAcceleration: parsedData[18],
    harshBraking: parsedData[19],
    harshCornering: parsedData[20],
    overSpeeding: parsedData[21],
    excessIdle: parsedData[22],
    x: parsedData[23],
    y: parsedData[24],
    z: parsedData[25],
    immobilizerCheck: parsedData[26],
    sos: parsedData[27],
  });

  try {
    await dataDocument.save();
    console.log('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    throw error;
  }
};

module.exports = {
  saveData,
};
