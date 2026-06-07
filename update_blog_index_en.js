const fs = require('fs');
const path = require('path');

const districts = require('./districts_en.json');

const indexPath = path.join(__dirname, 'en', 'blog', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// The English blog index probably has a grid that ends with </div></section>
// Let's replace the end of the original grid.

let districtsHtml = `
      </div>
    </div> <!-- close container -->
    </section>

    <section class="blog-preview">
      <div class="container">
        <div class="section-header" style="margin-top: 80px;">
          <p class="section-header__label">Locations</p>
          <h2 class="section-header__title">Warsaw District Guides</h2>
        </div>
        <div class="blog-grid" id="districts-grid">
`;

for (const d of districts) {
  districtsHtml += `
          <a href="${d.slug}.html" class="blog-card" style="border-top: 4px solid ${d.seg_color || '#635bff'};">
            <div class="blog-card__content">
              <div class="blog-card__meta">
                <span class="blog-card__category" style="color: ${d.seg_color || '#635bff'}">${d.segment}</span>
              </div>
              <h3 style="font-size: 1.3rem;">Rent in ${d.name_uk}</h3>
              <p style="font-size: 0.9rem; margin-bottom: 16px;">${d.hero_desc.substring(0, 100)}...</p>
              <div class="blog-card__footer">Read guide →</div>
            </div>
          </a>
  `;
}

districtsHtml += `
        </div>
      </div>
    </section>
`;

if (!content.includes('id="districts-grid"')) {
  // Try to cleanly replace the closing of the section
  content = content.replace(/\s*<\/div>\s*<\/section>/, districtsHtml);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log("Successfully appended districts to en/blog/index.html");
} else {
  console.log("Already appended!");
}
