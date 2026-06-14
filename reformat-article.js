const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const sourceHtml = fs.readFileSync('article.txt.txt', 'utf-8');
const dom = new JSDOM(sourceHtml);
const docSource = dom.window.document;

const templateHtml = fs.readFileSync('rent-in-warsaw-guide-2026.html', 'utf-8');

let mainContentHtml = ``;

// 1. Hero
const hero = docSource.querySelector('.hero');
let titleText = '';
if(hero) {
    const badge = hero.querySelector('.badge');
    const h1 = hero.querySelector('h1');
    if (h1) titleText = h1.textContent;
    const lead = hero.querySelector('.lead');
    const statsBoxes = hero.querySelectorAll('.sbox');
    
    let statsHtml = '';
    statsBoxes.forEach(b => {
        const snum = b.querySelector('.snum');
        const slabel = b.querySelector('.slabel');
        const ssrc = b.querySelector('.ssrc');
        statsHtml += `<div class="hero-stat"><div class="hs-n">${snum ? snum.innerHTML : ''}</div><div class="hs-l">${slabel ? slabel.innerHTML : ''}</div></div>`;
    });
    
    mainContentHtml += `
<div class="g-hero">
  <span class="hero-tag">${badge ? badge.innerHTML : ''}</span>
  <h1>${h1 ? h1.innerHTML : ''}</h1>
  <p class="hero-lead">${lead ? lead.innerHTML : ''}</p>
  <div class="hero-stats">
    ${statsHtml}
  </div>
</div>
<hr class="hdiv">
`;
}

mainContentHtml += `<div class="page-wrap">\n`;

// 3. Sidebar
const sidebar = docSource.querySelector('.sidebar');
if(sidebar) {
    const stoc = sidebar.querySelector('.stoc');
    mainContentHtml += `<aside class="sidebar">\n  <h3>Зміст</h3>\n`;
    if(stoc) {
        const links = stoc.querySelectorAll('a');
        links.forEach(a => {
            let text = a.innerHTML;
            let match = text.match(/^(\d+)\s*·\s*(.*)$/);
            if(match) {
                text = `<span class="sn">${match[1]}</span>${match[2]}`;
            }
            mainContentHtml += `  <a href="${a.getAttribute('href')}">${text}</a>\n`;
        });
    }
    mainContentHtml += `</aside>\n`;
}

mainContentHtml += `<main class="main">\n`;

// Add breadcrumb
mainContentHtml += `
  <div class="breadcrumb" style="margin-bottom: 2rem; font-size: 13px;">
    <a href="/index.html">Головна</a><span>&nbsp;›&nbsp;</span>
    <a href="/blog/index.html">Блог</a><span>&nbsp;›&nbsp;</span>
    <span style="color: var(--muted)">${titleText.replace(/<[^>]*>?/gm, '').split('<')[0] || 'Переїзд'}</span>
  </div>
`;

// 4. Main content elements
const article = docSource.querySelector('article');

function processNode(node) {
    if(node.nodeType === 3) return node.textContent;
    
    const tag = node.tagName.toLowerCase();
    
    if(tag === 'h2') {
        let text = node.innerHTML;
        return `<h2 class="st">${text}</h2>\n`;
    }
    
    if(tag === 'h3') {
        return `<h3>${node.innerHTML}</h3>\n`;
    }
    
    if(tag === 'p') {
        if(node.classList.contains('lead')) return '';
        if(node.querySelector('strong') && node.textContent.includes('Джерела')) {
             return `<p class="ss">${node.innerHTML}</p>\n`;
        }
        return `<p>${node.innerHTML}</p>\n`;
    }
    
    if(tag === 'div' && node.classList.contains('toc')) {
        let grid = `<div class="toc-grid">\n`;
        node.querySelectorAll('a').forEach(a => {
            let text = a.innerHTML;
            let match = text.match(/^(\d+)\s*·\s*(.*)$/);
            if(match) {
                text = `<span class="tn">${match[1]}</span>${match[2]}`;
            }
            grid += `  <a href="${a.getAttribute('href')}">${text}</a>\n`;
        });
        grid += `</div>`;
        return `<div class="toc-card">\n  <h2>Зміст статті</h2>\n${grid}\n</div>\n`;
    }
    
    if(tag === 'section') {
        let content = Array.from(node.childNodes).map(n => processNode(n)).join('');
        return `<section class="section" id="${node.id}">\n${content}\n</section>\n`;
    }
    
    if(tag === 'div' && (node.classList.contains('info') || node.classList.contains('warn') || node.classList.contains('note') || node.classList.contains('yellow'))) {
        let boxClass = 'box blue';
        if(node.classList.contains('warn')) boxClass = 'box orange';
        if(node.classList.contains('note')) boxClass = 'box green';
        if(node.classList.contains('yellow')) boxClass = 'box amber';
        return `<div class="${boxClass}">\n  <p>${node.innerHTML}</p>\n</div>\n`;
    }
    
    if(tag === 'div' && node.classList.contains('checklist')) {
        let items = Array.from(node.querySelectorAll('.cl-item')).map(b => {
            let txt = b.querySelector('.cl-text');
            return `<li><div class="ci">✓</div><div>${txt ? txt.innerHTML : ''}</div></li>`;
        }).join('\n');
        return `<ul class="cl">\n${items}\n</ul>\n`;
    }
    
    if(tag === 'table' || (tag === 'div' && node.classList.contains('ctable'))) {
        let table = tag === 'table' ? node : node.querySelector('table');
        if(!table) return node.outerHTML;
        
        let html = `<div class="dtable-wrap">\n  <table class="dtable">\n`;
        
        const thead = table.querySelector('thead');
        if(thead) {
            html += `    <thead>\n      <tr>\n`;
            thead.querySelectorAll('th').forEach(th => html += `        <th>${th.innerHTML}</th>\n`);
            html += `      </tr>\n    </thead>\n`;
        }
        
        const tbody = table.querySelector('tbody');
        if(tbody) {
            html += `    <tbody>\n`;
            tbody.querySelectorAll('tr').forEach(tr => {
                html += `      <tr>\n`;
                tr.querySelectorAll('td').forEach((td, i) => {
                    let tdClass = i === 1 ? ' class="accent"' : '';
                    html += `        <td${tdClass}>${td.innerHTML}</td>\n`;
                });
                html += `      </tr>\n`;
            });
            html += `    </tbody>\n`;
        }
        html += `  </table>\n</div>\n`;
        return html;
    }

    if(tag === 'div' && node.classList.contains('steps')) {
        let html = `<div class="blog-steps">\n`;
        node.querySelectorAll('.step').forEach(s => {
            let num = s.querySelector('.sn');
            let bd = s.querySelector('div:not(.sn)');
            html += `  <div class="blog-step">\n`;
            html += `    <div class="blog-snum">${num ? num.innerHTML : ''}</div>\n`;
            html += `    <div class="blog-sbody">${bd ? bd.innerHTML : ''}</div>\n`;
            html += `  </div>\n`;
        });
        html += `</div>\n`;
        return html;
    }
    
    if(tag === 'div' && node.classList.contains('faq-list')) {
        let faqHtml = `<div class="faq-list">\n`;
        node.querySelectorAll('.fi').forEach(fi => {
            let q = fi.querySelector('.fq');
            let a = fi.querySelector('.fa');
            let qText = '';
            if (q) {
                let farrow = q.querySelector('.farrow');
                if (farrow) farrow.remove();
                qText = q.innerHTML;
            }
            faqHtml += `  <div class="faq-item">\n`;
            faqHtml += `    <div class="faq-q">${qText}<span class="faq-icon">+</span></div>\n`;
            faqHtml += `    <div class="faq-a">${a ? a.innerHTML : ''}</div>\n`;
            faqHtml += `  </div>\n`;
        });
        faqHtml += `</div>\n`;
        return faqHtml;
    }

    if(tag === 'div' && node.classList.contains('related')) {
        return `      <div class="related">\n        ${node.innerHTML}\n      </div>\n`;
    }
    
    if(tag === 'div' && node.classList.contains('cta')) {
        let h2 = node.querySelector('h2');
        let p = node.querySelector('p');
        let btn = node.querySelector('.cta-btn');
        let perks = node.querySelector('.cta-perks');
        return `      <div class="cta-block">\n        <h2>${h2 ? h2.innerHTML : ''}</h2>\n        <p>${p ? p.innerHTML : ''}</p>\n        ${btn ? `<a href="${btn.getAttribute('href')}" class="cta-btn">${btn.innerHTML}</a>` : ''}\n        ${perks ? `<div class="cta-sub">\n          ${Array.from(perks.querySelectorAll('span')).map(s => `<span>✓ ${s.innerHTML}</span>`).join('\n          ')}\n        </div>` : ''}\n      </div>\n`;
    }
    
    if(tag === 'div' && node.classList.contains('author')) {
        return `      <div class="author">\n        ${node.innerHTML}\n      </div>\n`;
    }
    
    if(tag === 'span' && node.classList.contains('src')) {
        return `<span class="src">${node.innerHTML}</span>`;
    }
    
    if(tag === 'ul' || tag === 'ol' || tag === 'li') {
        let inner = Array.from(node.childNodes).map(n => processNode(n)).join('');
        return `<${tag}>${inner}</${tag}>\n`;
    }
    
    return node.outerHTML || '';
}

if(article) {
    Array.from(article.childNodes).forEach(node => {
        if(node.nodeType === 1 && node.classList.contains('hero')) return;
        if(node.nodeType === 1 && node.classList.contains('hmeta')) return;
        if(node.nodeType === 1) {
            mainContentHtml += processNode(node);
        }
    });
}

mainContentHtml += `\n    </main>\n  </div>\n</div>\n`;

const headerMatch = templateHtml.match(/<!-- ===== HEADER ===== -->[\s\S]*?<\/header>/);
const footerMatch = templateHtml.match(/<footer class="footer">[\s\S]*?<\/footer>/);

let headBase = templateHtml.substring(0, templateHtml.indexOf('</head>'));
headBase = headBase.replace(/<title>.*?<\/title>/, `<title>${docSource.querySelector('title').innerHTML}</title>`);
headBase = headBase.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${docSource.querySelector('meta[name="description"]').getAttribute('content')}">`);
headBase = headBase.replace(/href="styles\.css"/g, 'href="../styles.css"');
headBase = headBase.replace(/href="blog\.css"/g, 'href="../blog.css"');

// Fix broken links
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/blog\/dokumenty-dlya-orendy-polshcha\//g, 'dokumenty-dlya-orendy-polshcha.html');
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/blog\/yak-orenduvaty-kvartiru-inozemntsyu\//g, 'yak-orenduvaty-kvartiru-inozemntsyu.html');
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/tools\/calculator\//g, '../rent-calculator-warsaw.html');
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/blog\/orenda-kvartir-u-varshavi\//g, '../rent-in-warsaw-guide-2026.html');
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/blog\/tsiny-na-orendu-varshava-2026\//g, 'tsiny-na-orendu-varshava-2026.html');
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/blog\/najem-okazjonalny-polshcha\//g, 'rental-contracts-legal.html');
mainContentHtml = mainContentHtml.replace(/https:\/\/stayx\.pl\/about\//g, '../how-it-works.html');

let finalHtml = `${headBase}
</head>
<body>

  <!-- ===== Progress bar ===== -->
  <div id="pb"></div>

  ${headerMatch ? headerMatch[0] : ''}

<div id="main-content">
${mainContentHtml}

  ${footerMatch ? footerMatch[0] : ''}
  
  <script src="../script.js"></script>

</body>
</html>`;

finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/blog\/orenda-kvartir-u-varshavi\/?/g, '/rent-in-warsaw-guide-2026.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/blog\/yak-orenduvaty-kvartiru-inozemntsyu\/?/g, 'yak-orenduvaty-kvartiru-inozemntsyu.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/blog\/dokumenty-dlya-orendy-polshcha\/?/g, 'dokumenty-dlya-orendy-polshcha.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/blog\/tsiny-na-orendu-varshava-2026\/?/g, 'tsiny-na-orendu-varshava-2026.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/blog\/najem-okazjonalny-polshcha\/?/g, 'najem-okazjonalny-polshcha.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/tools\/calculator\/?/g, '/rent-calculator-warsaw.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/about\/?/g, '/how-it-works.html');
finalHtml = finalHtml.replace(/https:\/\/stayx\.pl\/?/g, '/');

fs.writeFileSync('blog/pereizd-u-varshavu-z-ukrainy.html', finalHtml, 'utf-8');
console.log('Successfully re-generated blog/pereizd-u-varshavu-z-ukrainy.html with main template classes!');
