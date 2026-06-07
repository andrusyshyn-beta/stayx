const fs = require('fs');
let c = fs.readFileSync('c:/Users/Dell/My project/e-estate/blog/index.html', 'utf8');

// Replace "Оренда в Вавер (Wawer) (Wawer)" with "Оренда в Вавер (Wawer)"
// Since we don't know exactly what the regex engine will see with Cyrillic, we'll just do a general regex
// Look for (Word) (Word) at the end of the h3
c = c.replace(/<h3 style="font-size: 1.3rem;">Оренда в (.*?) \((.*?)\) \(\2\)<\/h3>/g, '<h3 style="font-size: 1.3rem;">Оренда в $1 ($2)</h3>');

fs.writeFileSync('c:/Users/Dell/My project/e-estate/blog/index.html', c);
console.log("Fixed blog/index.html titles");
