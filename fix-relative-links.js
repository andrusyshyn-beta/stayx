const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    let basePath = '/blog/';
    if (filePath.includes('\\pl\\blog\\') || filePath.includes('/pl/blog/')) {
        basePath = '/pl/blog/';
    } else if (filePath.includes('\\en\\blog\\') || filePath.includes('/en/blog/')) {
        basePath = '/en/blog/';
    }

    // Fix relative links like href="wynajem-mokotow-warszawa"
    let newContent = content.replace(/href="(?![\/#]|https?:|mailto:|tel:|javascript:)([^"]+)"/g, (match, p1) => {
        modified = true;
        // if it already has .html, we don't add it (previous script handled .html)
        return `href="${basePath}${p1}"`;
    });

    if (modified) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated relative links in ${filePath}`);
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
            if (fullPath.includes('\\blog\\') || fullPath.includes('/blog/')) {
                processFile(fullPath);
            }
        }
    });
}

walkDir(__dirname);
