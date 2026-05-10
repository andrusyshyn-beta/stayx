const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, budget, rooms, district, date, comments, lang } = req.body;

    const token = '8122501292:AAEY-uetoXadg2aCszu8AyP5_uN2jdJOptA';
    const chatId = '-1003994760098';

    // Simple text for debugging
    const text = `STAYX Lead: ${name} | ${phone} | ${budget} PLN | ${district} | ${lang}`;

    const postData = JSON.stringify({
      chat_id: chatId,
      text: text
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const request = https.request(options, (response) => {
      let responseData = '';
      response.on('data', (chunk) => { responseData += chunk; });
      response.on('end', () => {
        if (response.statusCode === 200) {
          res.status(200).json({ success: true });
        } else {
          // Send back the EXACT error from Telegram to help debugging
          res.status(response.statusCode).json({ 
            error: 'Telegram API Rejected Request', 
            status: response.statusCode,
            details: responseData 
          });
        }
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ error: 'Network Connection Error', details: error.message });
    });

    request.write(postData);
    request.end();

  } catch (err) {
    res.status(500).json({ error: 'Server Crash', details: err.message });
  }
};
