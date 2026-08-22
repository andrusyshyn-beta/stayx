const fs = require('fs');

const dataUK = require('./districts.json');
const dataPL = require('./districts_pl.json');
const dataEN = require('./districts_en.json');

function generateHTML(data, title, prefix) {
  let html = `\n\n<section class="districts-footer-section" style="padding: 60px 20px; background: #0a2540; border-top: 1px solid rgba(255,255,255,0.1);">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="color: #fff; font-size: 24px; margin-bottom: 24px; text-align: center;">${title}</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
`;
  data.forEach(d => {
    html += `      <a href="${prefix}${d.slug}" style="color: rgba(255,255,255,0.7); text-decoration: none; padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 30px; font-size: 14px; font-weight: 500; transition: all 0.3s;" onmouseover="this.style.color='#fff'; this.style.borderColor='rgba(255,255,255,0.4)'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.color='rgba(255,255,255,0.7)'; this.style.borderColor='rgba(255,255,255,0.2)'; this.style.background='transparent'">${d.name}</a>\n`;
  });
  html += `    </div>
  </div>
</section>\n\n`;
  return html;
}

const htmlUK = generateHTML(dataUK, "Оренда квартир за районами", "/blog/");
const htmlEN = generateHTML(dataEN, "Rent Apartments by District", "/en/blog/");
const htmlPL = generateHTML(dataPL, "Wynajem mieszkań według dzielnic", "/pl/blog/");

function inject(file, htmlBlock) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('districts-footer-section')) {
    console.log(`Already injected in ${file}. Updating...`);
    content = content.replace(/<section class="districts-footer-section"[\s\S]*?<\/section>/, htmlBlock.trim());
  } else {
    content = content.replace(/<footer/i, htmlBlock + '<footer');
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Injected into ${file}`);
}

inject('index.html', htmlUK);
inject('en/index.html', htmlEN);
inject('pl/index.html', htmlPL);
