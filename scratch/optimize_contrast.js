const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'en/index.html',
  'pl/index.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the low-contrast gray color in the budget range labels
  content = content.replace(/#6b7c93/g, '#4b5563');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Optimized text contrast in ${file}`);
});
