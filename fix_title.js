const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.html')) {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the mangled or em-dash characters in titles with a simple hyphen
    content = content.replace(/AcademeKey â€“/g, 'AcademeKey -');
    content = content.replace(/AcademeKey –/g, 'AcademeKey -');
    content = content.replace(/AcademeKey \?"/g, 'AcademeKey -');
    content = content.replace(/AcademeKey â€"/g, 'AcademeKey -');
    
    // Also a global replace just in case
    content = content.replace(/â€“/g, '-');
    content = content.replace(/â€"/g, '-');
    content = content.replace(/–/g, '-'); // en-dash
    content = content.replace(/—/g, '-'); // em-dash

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed title in ${file}`);
  }
});
