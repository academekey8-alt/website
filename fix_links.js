const fs = require('fs');
let content = fs.readFileSync('learning-formats.html', 'utf8');
content = content.replace(/href="contact\.html"([^>]*>Book)/g, 'href="checkout.html"$1');
fs.writeFileSync('learning-formats.html', content, 'utf8');
console.log('Fixed links in learning-formats.html');
