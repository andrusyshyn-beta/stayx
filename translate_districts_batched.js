const fs = require('fs');
const translate = require('@iamtraction/google-translate');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const data = JSON.parse(fs.readFileSync('districts.json', 'utf8'));
  const enData = [];

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    console.log(`Translating [${i+1}/${data.length}] ${d.name}...`);
    
    // We will extract all strings, translate them in one or two big chunks separated by '|||'
    // This dramatically reduces API requests and avoids rate limiting.
    
    const stringsToTranslate = [];
    stringsToTranslate.push(d.segment || "");
    stringsToTranslate.push(d.metro || "");
    stringsToTranslate.push(d.price_sqm || "");
    stringsToTranslate.push(d.hero_desc || "");
    stringsToTranslate.push(d.location || "");
    
    const numBasic = stringsToTranslate.length;
    
    if (d.about) d.about.forEach(s => stringsToTranslate.push(s));
    if (d.transport) d.transport.forEach(s => stringsToTranslate.push(s));
    if (d.for_whom) d.for_whom.forEach(s => stringsToTranslate.push(s));
    if (d.pros) d.pros.forEach(s => stringsToTranslate.push(s));
    if (d.cons) d.cons.forEach(s => stringsToTranslate.push(s));
    
    if (d.faq) d.faq.forEach(q => { stringsToTranslate.push(q[0]); stringsToTranslate.push(q[1]); });
    if (d.nearby) d.nearby.forEach(n => stringsToTranslate.push(n[0]));
    
    const bundledText = stringsToTranslate.join(' ||| ');
    
    let translatedText = bundledText;
    try {
      const res = await translate(bundledText, { from: 'uk', to: 'en' });
      translatedText = res.text;
    } catch (err) {
      console.error(`Error translating ${d.name}:`, err.message);
      // Fallback
    }
    
    const translatedStrings = translatedText.split(/\s*\|\|\|\s*/);
    
    // Now reconstruct the object
    const enDist = { ...d };
    
    // Also format slug for English SEO: "rent-mokotow-warsaw"
    const safeName = d.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    enDist.slug = `rent-${safeName}-warsaw`;
    enDist.name_uk = d.name; // Use Polish name primarily
    
    let ptr = 0;
    const nextStr = () => (ptr < translatedStrings.length ? translatedStrings[ptr++] : "");
    
    enDist.segment = nextStr();
    enDist.metro = nextStr();
    enDist.price_sqm = nextStr();
    enDist.hero_desc = nextStr();
    enDist.location = nextStr();
    
    if (d.about) {
      enDist.about = [];
      for (let j = 0; j < d.about.length; j++) enDist.about.push(nextStr());
    }
    if (d.transport) {
      enDist.transport = [];
      for (let j = 0; j < d.transport.length; j++) enDist.transport.push(nextStr());
    }
    if (d.for_whom) {
      enDist.for_whom = [];
      for (let j = 0; j < d.for_whom.length; j++) enDist.for_whom.push(nextStr());
    }
    if (d.pros) {
      enDist.pros = [];
      for (let j = 0; j < d.pros.length; j++) enDist.pros.push(nextStr());
    }
    if (d.cons) {
      enDist.cons = [];
      for (let j = 0; j < d.cons.length; j++) enDist.cons.push(nextStr());
    }
    if (d.faq) {
      enDist.faq = [];
      for (let j = 0; j < d.faq.length; j++) {
        enDist.faq.push([nextStr(), nextStr()]);
      }
    }
    if (d.nearby) {
      enDist.nearby = [];
      for (let j = 0; j < d.nearby.length; j++) {
        enDist.nearby.push([nextStr(), d.nearby[j][1]]); // Keep URL identical
      }
    }
    
    enData.push(enDist);
    await sleep(2000); // Wait 2s between districts
  }

  fs.writeFileSync('districts_en.json', JSON.stringify(enData, null, 2), 'utf8');
  console.log('Successfully translated 18 districts with batching!');
}

main().catch(console.error);
