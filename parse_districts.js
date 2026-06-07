const fs = require('fs');

const content = fs.readFileSync('C:/Users/Dell/Desktop/districts.txt.txt', 'utf8');

let startIdx = content.indexOf('districts = [');
let endIdx = content.indexOf('districts = [');
let actualEndIdx = content.indexOf(']\n\nCSS =', endIdx);
if (actualEndIdx === -1) actualEndIdx = content.indexOf(']\r\n\r\nCSS =', endIdx);
if (actualEndIdx === -1) actualEndIdx = content.lastIndexOf(']');
let pyCode = content.substring(startIdx, actualEndIdx + 1).trim();
pyCode = pyCode.replace(/^districts\s*=\s*/, '');

// Convert to strict JSON
let jsonStr = pyCode
  .replace(/True/g, 'true')
  .replace(/False/g, 'false')
  .replace(/None/g, 'null')
  // replace tuples with arrays
  .replace(/\(\s*"/g, '["')
  .replace(/"\s*\)/g, '"]')
  // remove trailing commas in arrays/objects
  .replace(/,\s*]/g, ']')
  .replace(/,\s*}/g, '}');

try {
  const data = JSON.parse(jsonStr);
  fs.writeFileSync('districts.json', JSON.stringify(data, null, 2));
  console.log("Successfully converted to districts.json!");
} catch (e) {
  console.error("JSON parse error:", e.message);
  
  // print context of the error
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1], 10);
    const start = Math.max(0, pos - 50);
    const end = Math.min(jsonStr.length, pos + 50);
    console.error("Context around error:\n" + jsonStr.substring(start, end));
    console.error(" ".repeat(pos - start) + "^");
  }
}
