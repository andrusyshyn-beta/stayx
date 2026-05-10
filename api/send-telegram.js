export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, budget, rooms, district, date, comments, lang } = req.body;

  // Use environment variables or hardcoded (for immediate test)
  const token = '8122501292:AAEY-uetoXadg2aCszu8AyP5_uN2jdJOptA';
  const chatId = '-1003792821849';

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

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      return res.status(500).json({ error: 'Telegram API error', details: errorData });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
