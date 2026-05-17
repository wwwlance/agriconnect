const axios = require('axios');

async function sendRequest(i) {
  try {
    await axios.post('http://localhost:3000/api/requests', {
      distributorId: 1,
      farmerIds: [1],
      message: `request-${i}`,
    });

    console.log(`Request ${i}: SUCCESS`);
  } catch (err) {
    console.log(`Request ${i}: FAILED`, err.message);
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