const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.join(__dirname, '..');
const imagesDir = path.join(rootDir, 'images');

// Configurations for image optimization
const tasks = [
  // Hero collage images
  { src: 'collage-main.png', dest: 'collage-main.webp', width: 500, quality: 75 },
  { src: 'collage-2.png', dest: 'collage-2.webp', width: 300, quality: 75 },
  { src: 'collage-3.png', dest: 'collage-3.webp', width: 300, quality: 75 },
  
  // Hero background
  { src: 'galaxy-bg.png', dest: 'galaxy-bg.webp', width: 1200, quality: 60 },
  
  // Bento grid locations
  { src: 'mokotow.png', dest: 'mokotow.webp', width: 500, quality: 75 },
  { src: 'ochota.png', dest: 'ochota.webp', width: 500, quality: 75 },
  { src: 'srodmiescie.png', dest: 'srodmiescie.webp', width: 500, quality: 75 },
  { src: 'wilanow.png', dest: 'wilanow.webp', width: 500, quality: 75 },
  { src: 'wola.png', dest: 'wola.webp', width: 500, quality: 75 },
  
  // Features / blog images
  { src: 'moving-collage.png', dest: 'moving-collage.webp', width: 500, quality: 75 },
  { src: 'moving-couple.png', dest: 'moving-couple.webp', width: 400, quality: 75 }
];

async function run() {
  console.log('Starting image compression tasks...');
  
  for (const task of tasks) {
    const srcPath = path.join(imagesDir, task.src);
    const destPath = path.join(imagesDir, task.dest);
    
    if (!fs.existsSync(srcPath)) {
      console.log(`Source file not found: ${task.src}`);
      continue;
    }
    
    try {
      const originalSize = fs.statSync(srcPath).size;
      
      // Perform resize and conversion
      await sharp(srcPath)
        .resize({ width: task.width })
        .webp({ quality: task.quality })
        .toFile(destPath);
        
      const newSize = fs.statSync(destPath).size;
      console.log(`Optimized ${task.dest}: Width ${task.width}px, Quality ${task.quality}% | ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB`);
    } catch (error) {
      console.error(`Error processing ${task.src}:`, error);
    }
  }
  
  console.log('All image optimization tasks completed!');
}

run();
