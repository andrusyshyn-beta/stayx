const fs = require('fs');
const translate = require('@iamtraction/google-translate');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const data = JSON.parse(fs.readFileSync('districts.json', 'utf8'));
  const plData = [];

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    console.log(`Translating [${i+1}/${data.length}] ${d.name} to Polish...`);
    
    const stringsToTranslate = [];
    stringsToTranslate.push(d.segment || "");
    stringsToTranslate.push(d.metro || "");
    stringsToTranslate.push(d.price_sqm || "");
    stringsToTranslate.push(d.hero_desc || "");
    stringsToTranslate.push(d.location || "");
    
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
      const res = await translate(bundledText, { from: 'uk', to: 'pl' });
      translatedText = res.text;
    } catch (err) {
      console.error(`Error translating ${d.name}:`, err.message);
    }
    
    const translatedStrings = translatedText.split(/\s*\|\|\|\s*/);
    
    const plDist = { ...d };
    
    // Format slug for Polish SEO: "wynajem-mokotow-warszawa"
    // Remove polish special characters for URL safety if we want, or keep them. 
    // Usually it's better to remove them. Mokotów -> mokotow
    const noDiacritics = d.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L");
    const safeName = noDiacritics.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    plDist.slug = `wynajem-${safeName}-warszawa`;
    plDist.name_uk = d.name; // Keep name_uk as the visual Polish name "Mokotów"
    
    let ptr = 0;
    const nextStr = () => (ptr < translatedStrings.length ? translatedStrings[ptr++] : "");
    
    plDist.segment = nextStr();
    plDist.metro = nextStr();
    plDist.price_sqm = nextStr();
    plDist.hero_desc = nextStr();
    plDist.location = nextStr();
    
    if (d.about) {
      plDist.about = [];
      for (let j = 0; j < d.about.length; j++) plDist.about.push(nextStr());
    }
    if (d.transport) {
      plDist.transport = [];
      for (let j = 0; j < d.transport.length; j++) plDist.transport.push(nextStr());
    }
    if (d.for_whom) {
      plDist.for_whom = [];
      for (let j = 0; j < d.for_whom.length; j++) plDist.for_whom.push(nextStr());
    }
    if (d.pros) {
      plDist.pros = [];
      for (let j = 0; j < d.pros.length; j++) plDist.pros.push(nextStr());
    }
    if (d.cons) {
      plDist.cons = [];
      for (let j = 0; j < d.cons.length; j++) plDist.cons.push(nextStr());
    }
    if (d.faq) {
      plDist.faq = [];
      for (let j = 0; j < d.faq.length; j++) {
        plDist.faq.push([nextStr(), nextStr()]);
      }
    }
    if (d.nearby) {
      plDist.nearby = [];
      for (let j = 0; j < d.nearby.length; j++) {
        plDist.nearby.push([nextStr(), d.nearby[j][1]]); 
      }
    }
    
    plData.push(plDist);
    await sleep(2000); // Wait 2s between districts
  }

  fs.writeFileSync('districts_pl.json', JSON.stringify(plData, null, 2), 'utf8');
  console.log('Successfully translated 18 districts to Polish!');
}

main().catch(console.error);
