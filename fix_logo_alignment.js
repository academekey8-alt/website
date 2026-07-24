const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.html')) {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Change navbar logo height from 90px to 64px so it perfectly fits inside the 88px / 72px navbar pill without breaking out
    content = content.replace(/height:90px; width:auto; margin-right:8px;/g, 'height:64px; width:auto; margin-right:8px;');
    content = content.replace(/height:90px; width:auto;/g, 'height:64px; width:auto;');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated logo height in ${file}`);
  }
});
