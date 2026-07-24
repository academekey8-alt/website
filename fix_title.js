const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.html')) {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace any mojibake "â€" followed by another character with a simple hyphen
    content = content.replace(/â€./g, '-');
    
    // Replace any remaining weird dashes
    content = content.replace(/–/g, '-'); // en-dash
    content = content.replace(/—/g, '-'); // em-dash

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned encoding in ${file}`);
  }
});
