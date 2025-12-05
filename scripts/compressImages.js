const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function compressImages() {
  // Get all PNG files in public directory
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));
  
  console.log(`Found ${files.length} PNG files to compress...\n`);
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const originalSize = fs.statSync(filePath).size;
    totalOriginal += originalSize;
    
    try {
      // Read and compress the image
      const buffer = await sharp(filePath)
        .png({ 
          quality: 80,
          compressionLevel: 9,
          palette: true,  // Use palette-based PNG for smaller size
          effort: 10      // Maximum compression effort
        })
        .toBuffer();
      
      // Only save if smaller
      if (buffer.length < originalSize) {
        fs.writeFileSync(filePath, buffer);
        const newSize = buffer.length;
        totalCompressed += newSize;
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
        console.log(`✓ ${file}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (${savings}% smaller)`);
      } else {
        totalCompressed += originalSize;
        console.log(`○ ${file}: Already optimized (${(originalSize/1024).toFixed(0)}KB)`);
      }
    } catch (err) {
      totalCompressed += originalSize;
      console.log(`✗ ${file}: Error - ${err.message}`);
    }
  }
  
  // Also compress icons
  const iconsDir = path.join(publicDir, 'icons');
  if (fs.existsSync(iconsDir)) {
    const iconFiles = fs.readdirSync(iconsDir).filter(f => f.endsWith('.png'));
    console.log(`\nCompressing ${iconFiles.length} icon files...`);
    
    for (const file of iconFiles) {
      const filePath = path.join(iconsDir, file);
      const originalSize = fs.statSync(filePath).size;
      totalOriginal += originalSize;
      
      try {
        const buffer = await sharp(filePath)
          .png({ 
            quality: 80,
            compressionLevel: 9,
            effort: 10
          })
          .toBuffer();
        
        if (buffer.length < originalSize) {
          fs.writeFileSync(filePath, buffer);
          const newSize = buffer.length;
          totalCompressed += newSize;
          const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
          console.log(`✓ icons/${file}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (${savings}% smaller)`);
        } else {
          totalCompressed += originalSize;
          console.log(`○ icons/${file}: Already optimized (${(originalSize/1024).toFixed(0)}KB)`);
        }
      } catch (err) {
        totalCompressed += originalSize;
        console.log(`✗ icons/${file}: Error - ${err.message}`);
      }
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${(totalOriginal/1024/1024).toFixed(2)}MB → ${(totalCompressed/1024/1024).toFixed(2)}MB`);
  console.log(`Saved: ${((totalOriginal - totalCompressed)/1024/1024).toFixed(2)}MB (${((1 - totalCompressed/totalOriginal) * 100).toFixed(1)}%)`);
}

compressImages().catch(console.error);
