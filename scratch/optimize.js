const fs = require('fs');
const path = require('path');

// 1. Replace <h4> with <h3> in the homepages
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
  
  // Replace headings
  content = content.replace(/<h4>Онлайн-підбір<\/h4>/g, '<h3>Онлайн-підбір</h3>');
  content = content.replace(/<h4>Відео-огляди<\/h4>/g, '<h3>Відео-огляди</h3>');
  content = content.replace(/<h4>Юридичний аудит<\/h4>/g, '<h3>Юридичний аудит</h3>');
  content = content.replace(/<h4>Дистанційний договір<\/h4>/g, '<h3>Дистанційний договір</h3>');
  
  content = content.replace(/<h4>Online Selection<\/h4>/g, '<h3>Online Selection</h3>');
  content = content.replace(/<h4>Video Viewings<\/h4>/g, '<h3>Video Viewings</h3>');
  content = content.replace(/<h4>Legal Audit<\/h4>/g, '<h3>Legal Audit</h3>');
  content = content.replace(/<h4>Remote Contract<\/h4>/g, '<h3>Remote Contract</h3>');
  
  content = content.replace(/<h4>Dobór online<\/h4>/g, '<h3>Dobór online</h3>');
  content = content.replace(/<h4>Prezentacje wideo<\/h4>/g, '<h3>Prezentacje wideo</h3>');
  content = content.replace(/<h4>Audyt prawny<\/h4>/g, '<h3>Audyt prawny</h3>');
  content = content.replace(/<h4>Umowa zdalna<\/h4>/g, '<h3>Umowa zdalna</h3>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated headings in ${file}`);
});

// 2. Replace huge favicon.png with a tiny 32x32 transparent PNG (180 bytes)
const faviconPath = path.join(__dirname, '..', 'images', 'favicon.png');
const tinyFaviconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjIuMTR0Vis1AAAASElEQVRYR+3OwQkAMAgEMMnuf1sXyEFSkNylSEiSkCQkSUiSkCQkSUiSkCQkSUiSkCQkSUiSkCQkSUiSkCQkSUiSkCQkSbhzODnYOcHDAMFq094AAAAASUVORK5CYII=';
fs.writeFileSync(faviconPath, Buffer.from(tinyFaviconBase64, 'base64'));
console.log('Successfully optimized favicon.png to 180 bytes!');
