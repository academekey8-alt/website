const fs = require('fs');
const path = require('path');

const dir = __dirname;

// Update HTML files for the navbar logo
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.html')) {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Change navbar logo height from 45px to 90px
    content = content.replace(/height:45px; width:auto; margin-right:8px;/g, 'height:90px; width:auto; margin-right:8px;');
    // In case there are variations
    content = content.replace(/height:45px; width:auto;/g, 'height:90px; width:auto;');
    
    // Fix any stray "Academekey logo.png" to "logo.png"
    content = content.replace(/Academekey logo\.png/g, 'logo.png');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

// Update style.css for the footer logo
const cssPath = path.join(dir, 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(/\.ft-logo \{ height: 46px; width: auto; display: block; \}/g, '.ft-logo { height: 90px; width: auto; display: block; }');
cssContent = cssContent.replace(/\.ft-logo \{ height: 40px; \}/g, '.ft-logo { height: 75px; }'); // mobile

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Logo resized successfully.');
