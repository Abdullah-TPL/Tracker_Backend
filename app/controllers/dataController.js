const dataService = require('../services/dataService');

const processData = async (hexData) => {
  const textData = Buffer.from(hexData, 'hex').toString('utf8');
  const parsedData = textData.split('|');

  if (parsedData.length >= 28) {
    try {
      await dataService.saveData(parsedData);
      return 'Data received and saved';
    } catch (error) {
      return 'Error saving data to MongoDB';
    }
  } else {
    return 'Invalid data format';
  }
};

module.exports = {
  processData,
};
