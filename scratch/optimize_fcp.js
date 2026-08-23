const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Optimize index.html (UA)
const indexUA = path.join(rootDir, 'index.html');
if (fs.existsSync(indexUA)) {
  let content = fs.readFileSync(indexUA, 'utf8');
  
  const searchUA = `  <!-- Optimization: Preload Critical Assets -->
  <link rel="preload" href="styles.css" as="style">

  <link rel="stylesheet" href="styles.css">`;
  
  const replaceUA = `  <!-- Optimization: Preload Critical Assets (Asynchronous Load) -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>`;
  
  if (content.includes(searchUA)) {
    content = content.replace(searchUA, replaceUA);
    fs.writeFileSync(indexUA, content, 'utf8');
    console.log('Optimized FCP in index.html');
  } else {
    // Attempt fallback search without exact spaces
    const searchUAFallback = /<link rel="preload" href="styles\.css" as="style">[\s\S]*?<link rel="stylesheet" href="styles\.css">/;
    if (searchUAFallback.test(content)) {
      content = content.replace(searchUAFallback, `<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="styles.css"></noscript>`);
      fs.writeFileSync(indexUA, content, 'utf8');
      console.log('Optimized FCP in index.html (Fallback)');
    } else {
      console.log('FCP pattern not found in index.html');
    }
  }
}

// 2. Optimize en/index.html (EN)
const indexEN = path.join(rootDir, 'en', 'index.html');
if (fs.existsSync(indexEN)) {
  let content = fs.readFileSync(indexEN, 'utf8');
  
  const searchEN = `  <!-- Optimization: Preload Critical Assets -->
  <link rel="preload" href="../styles.css" as="style">

  <link rel="stylesheet" href="/styles.css">`;
  
  const replaceEN = `  <!-- Optimization: Preload Critical Assets (Asynchronous Load) -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>`;
  
  if (content.includes(searchEN)) {
    content = content.replace(searchEN, replaceEN);
    fs.writeFileSync(indexEN, content, 'utf8');
    console.log('Optimized FCP in en/index.html');
  } else {
    // Attempt fallback
    const searchENFallback = /<link rel="preload" href="\.\.\/styles\.css" as="style">[\s\S]*?<link rel="stylesheet" href="\/styles\.css">/;
    if (searchENFallback.test(content)) {
      content = content.replace(searchENFallback, `<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="/styles.css"></noscript>`);
      fs.writeFileSync(indexEN, content, 'utf8');
      console.log('Optimized FCP in en/index.html (Fallback)');
    } else {
      console.log('FCP pattern not found in en/index.html');
    }
  }
}

// 3. Optimize pl/index.html (PL)
const indexPL = path.join(rootDir, 'pl', 'index.html');
if (fs.existsSync(indexPL)) {
  let content = fs.readFileSync(indexPL, 'utf8');
  
  const searchPL = `  <!-- Optimization: Preload Critical Assets -->
  <link rel="preload" href="../styles.css" as="style">

  <link rel="stylesheet" href="/styles.css">`;
  
  const replacePL = `  <!-- Optimization: Preload Critical Assets (Asynchronous Load) -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>`;
  
  if (content.includes(searchPL)) {
    content = content.replace(searchPL, replacePL);
    fs.writeFileSync(indexPL, content, 'utf8');
    console.log('Optimized FCP in pl/index.html');
  } else {
    // Attempt fallback
    const searchPLFallback = /<link rel="preload" href="\.\.\/styles\.css" as="style">[\s\S]*?<link rel="stylesheet" href="\/styles\.css">/;
    if (searchPLFallback.test(content)) {
      content = content.replace(searchPLFallback, `<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="/styles.css"></noscript>`);
      fs.writeFileSync(indexPL, content, 'utf8');
      console.log('Optimized FCP in pl/index.html (Fallback)');
    } else {
      console.log('FCP pattern not found in pl/index.html');
    }
  }
}
