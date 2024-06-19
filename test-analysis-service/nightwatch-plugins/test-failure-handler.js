const axios = require('axios');

module.exports = {
  async onTestFailure(testFailure) {
    try {
      const response = await axios.post('http://localhost:3000/analyze', {
        testFailure: JSON.stringify(testFailure),
      });

      console.log('Analysis:', response.data.analysis);
    } catch (error) {
      console.error('Error sending test failure for analysis:', error);
    }
  },
};
