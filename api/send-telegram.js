const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, budget, rooms, district, date, comments, lang } = req.body;

  const token = '8122501292:AAEY-uetoXadg2aCszu8AyP5_uN2jdJOptA';
  const chatId = '-1003994760098';

  const text = `
🔥 *Нова заявка STAYX (${lang || 'UA'})*
──────────────────
👤 *Ім'я:* ${name}
📧 *Email:* ${email}
📞 *Телефон:* ${phone}
💰 *Бюджет:* ${budget} PLN
🏠 *Кімнат:* ${rooms}
📍 *Район:* ${district}
📅 *Дата заїзду:* ${date}
💬 *Коментар:* ${comments || '—'}
──────────────────
  `;

  const postData = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  });

  // CRITICAL: Use Buffer.byteLength for UTF-8 characters (Cyrillic/Emoji)
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

  return new Promise((resolve) => {
    const request = https.request(options, (response) => {
      let responseData = '';
      response.on('data', (chunk) => { responseData += chunk; });
      response.on('end', () => {
        if (response.statusCode === 200) {
          res.status(200).json({ success: true });
        } else {
          console.error('Telegram API Error:', responseData);
          res.status(500).json({ error: 'Telegram Error', details: responseData });
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      console.error('Connection Error:', error);
      res.status(500).json({ error: 'Connection Error', details: error.message });
      resolve();
    });

    request.write(postData);
    request.end();
  });
};
