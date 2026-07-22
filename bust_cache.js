const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
const version = Date.now(); // Unique version timestamp

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add cache buster to style.css
    content = content.replace(/href="css\/style\.css(\?v=[0-9]+)?"/g, `href="css/style.css?v=${version}"`);
    
    fs.writeFileSync(file, content, 'utf8');
});

// Also, let's explicitly make the style rules !important in case of specificity issues
const cssPath = path.join(__dirname, 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(/background-color: #ffffff;/g, 'background-color: #ffffff !important;');
cssContent = cssContent.replace(/padding: 6px 12px;/g, 'padding: 6px 12px !important;');
cssContent = cssContent.replace(/border-radius: 6px;/g, 'border-radius: 6px !important;');
cssContent = cssContent.replace(/display: inline-block;/g, 'display: inline-block !important;');
fs.writeFileSync(cssPath, cssContent, 'utf8');

console.log('Cache busted and CSS updated.');
