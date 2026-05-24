const axios = require('axios');
const config = require('./config');

async function testToken() {
  try {
    const resp = await axios.get(config.publish.endpoints.token, {
      params: {
        grant_type: 'client_credential',
        appid: config.publish.appId,
        secret: config.publish.appSecret
      },
      timeout: 10000
    });
    console.log('Token response:', JSON.stringify(resp.data));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

testToken();
