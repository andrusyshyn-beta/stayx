const fs = require('fs');
const path = require('path');

const districts = require('./districts.json');

console.log(`Loaded ${districts.length} districts.`);

const outDir = path.join(__dirname, 'blog');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const template = `<!DOCTYPE html>
<html lang="uk">
<head>
  <link rel="icon" type="image/png" href="/images/favicon.png">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Оренда квартири {{name_uk}}, Варшава — Ціни 2026 | STAYX</title>
  <meta name="description" content="{{hero_desc}}">
  <link rel="canonical" href="https://stayx.estate/blog/{{slug}}.html">
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../blog.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    .article-content { max-width: 800px; margin: 0 auto; padding: 120px 24px; }
    .article-content h1 { font-size: 3rem; margin-bottom: 24px; color: #0a2540; line-height: 1.1; }
    .tldr-box { background: #f8faff; border-radius: 24px; padding: 32px; border: 1px solid #e3e8ee; margin: 40px 0; }
    .tldr-box h4 { margin-top: 0; color: #635bff; margin-bottom: 16px; }
    .article-body { font-size: 1.2rem; line-height: 1.8; color: #425466; }
    .article-body h2 { color: #0a2540; margin: 60px 0 24px; font-size: 2rem; }
    .article-body h3 { color: #0a2540; margin: 40px 0 16px; font-size: 1.5rem; }
    .breadcrumb { margin-bottom: 32px; font-size: 0.9rem; }
    .breadcrumb a { color: #635bff; text-decoration: none; }
    .district-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 40px; }
    .d-stat { background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #e3e8ee; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .d-stat .lbl { font-size: 0.9rem; color: #8898aa; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .d-stat .val { font-size: 1.5rem; font-weight: 700; color: #0a2540; }
    .pill-seg { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: #fff; margin-bottom: 16px; }
    .faq-item { margin-bottom: 24px; border-bottom: 1px solid #e3e8ee; padding-bottom: 16px; }
    .faq-item h4 { margin-bottom: 8px; color: #0a2540; font-size: 1.2rem; }
    ul.check-list { list-style: none; padding-left: 0; }
    ul.check-list li { position: relative; padding-left: 28px; margin-bottom: 12px; }
    ul.check-list li::before { content: '✓'; position: absolute; left: 0; color: #32d583; font-weight: bold; }
  </style>
  <script type="application/ld+json" id="breadcrumb-schema">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Головна","item":"https://stayx.estate/"},{"@type":"ListItem","position":2,"name":"Блог","item":"https://stayx.estate/blog/"},{"@type":"ListItem","position":3,"name":"Оренда квартири {{name_uk}}, Варшава — Ціни 2026","item":"https://stayx.estate/blog/{{slug}}.html"}]}
  </script>
</head>
<body>
  <!-- ===== HEADER ===== -->
  <header class="header header--scrolled" id="header" data-keep-scrolled="true">
    <nav class="nav container container-padding">
      <a href="/index.html" class="nav__logo">
        <span class="logo-text">stay<span class="x-accent">x</span></span>
      </a>
      <div class="nav__left">
        <a href="/#services" class="nav__link">Послуги</a>
        <a href="/how-it-works.html" class="nav__link">Як це працює</a>
        <a href="/rent-calculator-warsaw.html" class="nav__link">Розрахувати витрати</a>
        <a href="/blog/index.html" class="nav__link">Блог</a>
        <a href="/#faq" class="nav__link">FAQ</a>
      </div>
      <div class="nav__right">
        <div class="nav__lang">
          <a href="/blog/{{slug}}.html" class="active">Ua</a>
          <a href="/en/blog/index.html">EN</a>
          <a href="/pl/blog/index.html">PL</a>
        </div>
        <a href="https://t.me/stayX_pl" target="_blank" rel="noopener" class="btn btn--primary btn--sm">Зв'язатись →</a>
      </div>
      <button class="nav__burger" id="burger" aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </header>

  <main class="article-content">
    <div class="breadcrumb">
      <a href="../index.html">Головна</a> / <a href="index.html">Блог</a> / {{name_uk}}
    </div>

    <span class="pill-seg" style="background: {{seg_color}}">{{segment}}</span>
    <h1>Оренда квартири у Варшаві: Район {{name_uk}}</h1>

    <div class="tldr-box">
      <h4>🔑 Коротко про район</h4>
      <p>{{hero_desc}}</p>
    </div>
    
    <div class="district-stats">
      <div class="d-stat">
        <div class="lbl">Середня ціна м²</div>
        <div class="val">{{price_sqm}}</div>
      </div>
      <div class="d-stat">
        <div class="lbl">Метро</div>
        <div class="val">{{metro}}</div>
      </div>
      <div class="d-stat">
        <div class="lbl">Ціна 2-кім.</div>
        <div class="val">{{price_2br}} PLN</div>
      </div>
    </div>

    <div class="article-body">
      <h2>Про район</h2>
      {{about_html}}

      <h2>Транспорт та локація</h2>
      <p>{{location}}</p>
      <ul class="check-list">
        {{transport_html}}
      </ul>

      <h2>Для кого підійде {{name}}?</h2>
      <ul class="check-list">
        {{for_whom_html}}
      </ul>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 40px 0;">
        <div style="background: #f0fdf4; padding: 24px; border-radius: 16px; border: 1px solid #bbf7d0;">
          <h3 style="margin-top:0; color: #166534;">Плюси</h3>
          <ul class="check-list" style="margin-bottom:0;">
            {{pros_html}}
          </ul>
        </div>
        <div style="background: #fef2f2; padding: 24px; border-radius: 16px; border: 1px solid #fecaca;">
          <h3 style="margin-top:0; color: #991b1b;">Мінуси</h3>
          <ul style="padding-left:20px; color:#7f1d1d; margin-bottom:0;">
            {{cons_html}}
          </ul>
        </div>
      </div>

      <h2>Часті питання (FAQ)</h2>
      <div class="faq-section">
        {{faq_html}}
      </div>

      <div class="cta-inline" style="background: #0a2540; color: #fff; padding: 40px; border-radius: 24px; margin: 60px 0;">
        <h4 style="color: #fff; margin-top:0; font-size:1.5rem;">Шукаєте квартиру в {{name}}?</h4>
        <p style="color: #adbdcc; margin-bottom:24px;">Ми знайдемо найкращі варіанти, домовимось про огляд та перевіримо договір.</p>
        <a href="../index.html#contactForm" class="btn btn--primary" style="background: #635bff; border: none;">Залишити заявку →</a>
      </div>
      
      <h2>Читайте також</h2>
      <ul>
        {{nearby_html}}
      </ul>
    </div>
  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="footer">
    <div class="container footer__inner">
      <a href="/" class="footer__logo"><span class="logo-text">stay<span class="x-accent">x</span></span></a>
      <div class="footer__links">
        <a href="/#services">Послуги</a>
        <a href="/how-it-works.html">Як це працює</a>
        <a href="/rent-calculator-warsaw.html">Розрахувати витрати</a>
        <a href="/blog/index.html">Блог</a>
        <a href="/#faq">FAQ</a>
      </div>
      <div class="footer__bottom">
        <p>© 2026 STAYX. All rights reserved</p>
        <a href="/privacy.html">Політика конфіденційності</a>
      </div>
    </div>
  </footer>
  <script src="../script.js"></script>

<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/148599762.js"></script>
<!-- End of HubSpot Embed Code -->
</body>
</html>`;

function renderTemplate(d) {
  let html = template;
  html = html.replace(/{{name}}/g, d.name || "");
  html = html.replace(/{{name_uk}}/g, d.name_uk || "");
  html = html.replace(/{{slug}}/g, d.slug || "");
  html = html.replace(/{{segment}}/g, d.segment || "");
  html = html.replace(/{{seg_color}}/g, d.seg_color || "#635bff");
  html = html.replace(/{{hero_desc}}/g, d.hero_desc || "");
  html = html.replace(/{{price_sqm}}/g, d.price_sqm || "");
  html = html.replace(/{{metro}}/g, d.metro || "");
  html = html.replace(/{{price_2br}}/g, d.price_2br || "");
  html = html.replace(/{{location}}/g, d.location || "");

  const about_html = (d.about || []).map(p => `<p>${p}</p>`).join('');
  const transport_html = (d.transport || []).map(i => `<li>${i}</li>`).join('');
  const for_whom_html = (d.for_whom || []).map(i => `<li>${i}</li>`).join('');
  const pros_html = (d.pros || []).map(i => `<li>${i}</li>`).join('');
  const cons_html = (d.cons || []).map(i => `<li>${i}</li>`).join('');
  
  const faq_html = (d.faq || []).map(q => `<div class="faq-item"><h4>${q[0]}</h4><p>${q[1]}</p></div>`).join('');
  const nearby_html = (d.nearby || []).map(n => `<li><a href="${n[1]}" style="color:#635bff; text-decoration:none;">${n[0]}</a></li>`).join('');

  html = html.replace(/{{about_html}}/g, about_html);
  html = html.replace(/{{transport_html}}/g, transport_html);
  html = html.replace(/{{for_whom_html}}/g, for_whom_html);
  html = html.replace(/{{pros_html}}/g, pros_html);
  html = html.replace(/{{cons_html}}/g, cons_html);
  html = html.replace(/{{faq_html}}/g, faq_html);
  html = html.replace(/{{nearby_html}}/g, nearby_html);

  return html;
}

let count = 0;
for (const d of districts) {
  const html = renderTemplate(d);
  const outPath = path.join(outDir, `${d.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Generated ${d.slug}.html`);
  count++;
}
console.log(`Finished generating ${count} files.`);
