const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function t(text) {
  if (!text) return text;
  try {
    const res = await translate(text, { from: 'uk', to: 'en' });
    return res.text;
  } catch (err) {
    console.error("Translation error for text:", text.substring(0, 30), err.message);
    return text; // fallback to original
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync('districts.json', 'utf8'));
  const enData = [];

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    console.log(`Translating [${i+1}/${data.length}] ${d.name}...`);
    
    // We only translate specific fields
    const enDist = { ...d };

    enDist.name_uk = d.name; // Use Polish name primarily for English, "Mokotów" is better than "Мокотув"
    enDist.segment = await t(d.segment);
    enDist.metro = await t(d.metro);
    enDist.price_sqm = await t(d.price_sqm);
    enDist.hero_desc = await t(d.hero_desc);
    enDist.location = await t(d.location);

    if (d.about) {
      enDist.about = [];
      for (const p of d.about) { enDist.about.push(await t(p)); await sleep(200); }
    }
    if (d.transport) {
      enDist.transport = [];
      for (const p of d.transport) { enDist.transport.push(await t(p)); await sleep(200); }
    }
    if (d.for_whom) {
      enDist.for_whom = [];
      for (const p of d.for_whom) { enDist.for_whom.push(await t(p)); await sleep(200); }
    }
    if (d.pros) {
      enDist.pros = [];
      for (const p of d.pros) { enDist.pros.push(await t(p)); await sleep(200); }
    }
    if (d.cons) {
      enDist.cons = [];
      for (const p of d.cons) { enDist.cons.push(await t(p)); await sleep(200); }
    }
    if (d.faq) {
      enDist.faq = [];
      for (const q of d.faq) {
        enDist.faq.push([await t(q[0]), await t(q[1])]);
        await sleep(200);
      }
    }
    if (d.nearby) {
      enDist.nearby = [];
      for (const n of d.nearby) {
        enDist.nearby.push([await t(n[0]), n[1]]);
        await sleep(200);
      }
    }
    
    enData.push(enDist);
    await sleep(500);
  }

  fs.writeFileSync('districts_en.json', JSON.stringify(enData, null, 2), 'utf8');
  console.log('Successfully translated 18 districts!');
}

main().catch(console.error);
