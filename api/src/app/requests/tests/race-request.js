const axios = require('axios');

async function sendRequest(distributorId) {
  try {
    await axios.post('http://localhost:3000/api/requests', {
      distributorId,
      farmerIds: [1],
      message: `distributor-${distributorId}`,
    });

    console.log(`Distributor ${distributorId}: SUCCESS`);
  } catch (err) {
    console.log(`Distributor ${distributorId}: FAILED`, err.message);
  }
}

async function run() {
  await Promise.all([
    sendRequest(1),
    sendRequest(2),
    sendRequest(3),
    sendRequest(4),
    sendRequest(5),
  ]);
}

run();