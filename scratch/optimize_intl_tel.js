const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'en/index.html',
  'pl/index.html'
];

// Regex patterns
const cssPattern = /\s*<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/intl-tel-input@\d+\.\d+\.\d+\/build\/css\/intlTelInput\.css"[^>]*?>/;
const jsPattern = /\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/intl-tel-input@\d+\.\d+\.\d+\/build\/js\/intlTelInput\.min\.js"><\/script>\s*<script>\s*const input = document\.querySelector\("#phone"\);\s*window\.iti = window\.intlTelInput\([\s\S]*?\}\);\s*/;

const lazyLoadScript = `
  <script>
    // Lazy load intl-tel-input CSS and JS when phone input is focused/clicked
    (function() {
      const phoneInput = document.querySelector("#phone");
      if (!phoneInput) return;
      
      let itiLoaded = false;
      function loadIti() {
        if (itiLoaded) return;
        itiLoaded = true;
        
        phoneInput.removeEventListener('focus', loadIti);
        phoneInput.removeEventListener('click', loadIti);
        
        // 1. Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/css/intlTelInput.css';
        document.head.appendChild(link);
        
        // 2. Load JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/intlTelInput.min.js';
        script.onload = function() {
          window.iti = window.intlTelInput(phoneInput, {
            initialCountry: "pl",
            preferredCountries: ["pl", "ua", "us", "gb"],
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js",
          });
          phoneInput.focus();
        };
        document.body.appendChild(script);
      }
      
      phoneInput.addEventListener('focus', loadIti);
      phoneInput.addEventListener('click', loadIti);
    })();
`;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Remove CSS link from head
  if (cssPattern.test(content)) {
    content = content.replace(cssPattern, '');
    console.log(`Removed intlTelInput CSS link from head in ${file}`);
  }
  
  // 2. Replace JS init script with lazy-loader
  if (jsPattern.test(content)) {
    content = content.replace(jsPattern, lazyLoadScript);
    console.log(`Optimized intlTelInput JS with lazy loading in ${file}`);
  } else {
    console.log(`JS pattern not found in ${file}`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Successfully completed intl-tel-input lazy load optimization!');
