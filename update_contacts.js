const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.html') && file !== 'checkout.html') {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace contact page main email
    content = content.replace(/hello@academkey\.com/g, 'corporate@academekey.com');
    // Replace footer email
    content = content.replace(/hello@academekey\.com/g, 'support@academekey.com');
    // Replace phone number
    content = content.replace(/\+1 \(000\) 000-0000/g, '+ 1 (575) 284-8789');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
