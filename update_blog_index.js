const fs = require('fs');
const path = require('path');

const districts = require('./districts.json');

const indexPath = path.join(__dirname, 'blog', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Generate the HTML for the 18 districts
let districtsHtml = `
        <div class="section-header" style="margin-top: 80px;">
          <p class="section-header__label">Локації</p>
          <h2 class="section-header__title">Гіди по районах Варшави</h2>
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
              <h3 style="font-size: 1.3rem;">Оренда в ${d.name_uk} (${d.name})</h3>
              <p style="font-size: 0.9rem; margin-bottom: 16px;">${d.hero_desc.substring(0, 100)}...</p>
              <div class="blog-card__footer">Читати гід →</div>
            </div>
          </a>
  `;
}

districtsHtml += `        </div>\n`;

// Insert it before </section>
if (!content.includes('id="districts-grid"')) {
  content = content.replace('      </div>\n    </section>', '      </div>\n' + districtsHtml + '      </div>\n    </section>');
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log("Updated blog/index.html with districts grid.");
} else {
  console.log("districts grid already exists in blog/index.html");
}
