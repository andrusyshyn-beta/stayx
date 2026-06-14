const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove .html from internal links: href="/..."
    let newContent = content.replace(/href="(\/[^"]+?)\.html(#.*?)?"/g, (match, p1, p2) => {
        modified = true;
        let p2Str = p2 ? p2 : '';
        if (p1.endsWith('/index')) {
            return `href="${p1.replace(/\/index$/, '/')}${p2Str}"`;
        }
        return `href="${p1}${p2Str}"`;
    });

    // Replace href="something.html" for relative links
    newContent = newContent.replace(/href="(?!http|#|mailto|tel|javascript)([^"]+?)\.html(#.*?)?"/g, (match, p1, p2) => {
        modified = true;
        let p2Str = p2 ? p2 : '';
        if (p1.endsWith('/index') || p1 === 'index') {
            return `href="${p1.replace(/index$/, '')}${p2Str}"`; // index becomes empty string or ends with /
        }
        return `href="${p1}${p2Str}"`;
    });

    if (modified) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated HTML links in ${filePath}`);
    }
}

function processSitemap(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    let newContent = content.replace(/<loc>(https:\/\/stayx\.estate\/[^<]*?)\.html<\/loc>/g, (match, p1) => {
        modified = true;
        if (p1.endsWith('/index')) {
            return `<loc>${p1.replace(/\/index$/, '/')}</loc>`;
        }
        return `<loc>${p1}</loc>`;
    });

    newContent = newContent.replace(/href="(https:\/\/stayx\.estate\/[^"]*?)\.html"/g, (match, p1) => {
        modified = true;
        if (p1.endsWith('/index')) {
            return `href="${p1.replace(/\/index$/, '/')}"`;
        }
        return `href="${p1}"`;
    });

    if (modified) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated Sitemap links in ${filePath}`);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.vercel') {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        } else if (fullPath.endsWith('sitemap.xml')) {
            processSitemap(fullPath);
        }
    });
}

walkDir(__dirname);
