const fs = require('fs');

const files = [
  'generate_districts.js',
  'generate_districts_en.js',
  'generate_districts_pl.js'
];

const hubspotCode = `
<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/148599762.js"></script>
<!-- End of HubSpot Embed Code -->
</body>`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('hs-scripts.com/148599762.js')) {
    content = content.replace('</body>', hubspotCode);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
