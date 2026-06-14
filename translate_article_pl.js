const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const translate = require('@iamtraction/google-translate');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    const html = fs.readFileSync('blog/pereizd-u-varshavu-z-ukrainy.html', 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const mainContent = document.querySelector('#main-content');
    const textNodes = [];
    const walker = document.createTreeWalker(mainContent, dom.window.NodeFilter.SHOW_TEXT, null, false);
    
    let node;
    while(node = walker.nextNode()) {
        const text = node.nodeValue;
        if(text.trim().length > 0 && text.trim() !== '>' && text.trim() !== '<' && text.trim() !== '✓' && text.trim() !== '+') {
            textNodes.push(node);
        }
    }
    
    console.log(`Found ${textNodes.length} text nodes to translate.`);
    
    for(let i = 0; i < textNodes.length; i++) {
        let text = textNodes[i].nodeValue;
        if (/^[\s\d\.\,\:\;\-\+\✓\>\(\)]+$/.test(text)) continue;
        
        try {
            const res = await translate(text, { from: 'uk', to: 'pl' });
            textNodes[i].nodeValue = res.text;
            if (i % 20 === 0) console.log(`Progress: ${i}/${textNodes.length}`);
        } catch (e) {
            console.error("Error at", i, e.message);
            await sleep(2000);
            try {
                const res = await translate(text, { from: 'uk', to: 'pl' });
                textNodes[i].nodeValue = res.text;
            } catch(e2) {
                console.error("Retry failed");
            }
        }
        await sleep(100);
    }
    
    const title = document.querySelector('title');
    if (title) {
        const res = await translate(title.innerHTML, { from: 'uk', to: 'pl' });
        title.innerHTML = res.text;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        const res = await translate(metaDesc.getAttribute('content'), { from: 'uk', to: 'pl' });
        metaDesc.setAttribute('content', res.text);
    }
    
    const plTemplate = fs.readFileSync('pl/blog/ceny-wynajmu-warszawa-2026.html', 'utf8');
    const plHeaderMatch = plTemplate.match(/<!-- ===== HEADER ===== -->[\s\S]*?<\/header>/);
    const plFooterMatch = plTemplate.match(/<footer class="footer">[\s\S]*?<\/footer>/);
    
    const currentHeader = document.querySelector('header');
    if(currentHeader && plHeaderMatch) currentHeader.outerHTML = plHeaderMatch[0];
    
    const currentFooter = document.querySelector('footer');
    if(currentFooter && plFooterMatch) currentFooter.outerHTML = plFooterMatch[0];

    const breadcrumbs = document.querySelectorAll('.breadcrumb a');
    if (breadcrumbs.length >= 2) {
        breadcrumbs[0].href = '/pl/index.html';
        breadcrumbs[0].innerHTML = 'Strona główna';
        breadcrumbs[1].href = '/pl/blog/index.html';
        breadcrumbs[1].innerHTML = 'Blog';
    }

    const links = document.querySelectorAll('#main-content a');
    links.forEach(a => {
        let href = a.getAttribute('href');
        if (!href) return;
        if (href.includes('yak-orenduvaty-kvartiru-inozemntsyu.html')) a.href = 'jak-wynajac-mieszkanie-cudzoziemcowi.html';
        if (href.includes('tsiny-na-orendu-varshava-2026.html')) a.href = 'ceny-wynajmu-warszawa-2026.html';
        if (href.includes('dokumenty-dlya-orendy-polshcha.html')) a.href = 'dokumenty-do-wynajecia-polska.html';
        if (href.includes('rent-in-warsaw-guide-2026.html')) a.href = '../rent-in-warsaw-guide-2026.html';
        if (href === '/rent-calculator-warsaw.html') a.href = '/pl/rent-calculator-warsaw.html';
        if (href === '/how-it-works.html') a.href = '/pl/how-it-works.html';
    });
    
    const head = document.querySelector('head');
    const alternates = head.querySelectorAll('link[rel="alternate"]');
    alternates.forEach(l => l.remove());
    const canonical = head.querySelector('link[rel="canonical"]');
    if(canonical) canonical.href = 'https://stayx.estate/pl/blog/przeprowadzka-do-warszawy-z-ukrainy.html';
    
    head.insertAdjacentHTML('beforeend', `
    <link rel="alternate" hreflang="uk" href="https://stayx.estate/blog/pereizd-u-varshavu-z-ukrainy.html">
    <link rel="alternate" hreflang="pl" href="https://stayx.estate/pl/blog/przeprowadzka-do-warszawy-z-ukrainy.html">
    <link rel="alternate" hreflang="x-default" href="https://stayx.estate/blog/pereizd-u-varshavu-z-ukrainy.html">
    `);

    document.documentElement.lang = "pl";

    fs.writeFileSync('pl/blog/przeprowadzka-do-warszawy-z-ukrainy.html', dom.serialize(), 'utf8');
    console.log('Done translating to Polish!');
}

main().catch(console.error);
