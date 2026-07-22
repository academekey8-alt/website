const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace any broken encoding separators with a simple HTML bullet entity
    content = content.replace(/<span class="ft-copy-sep" aria-hidden="true">.*?<\/span>/g, '<span class="ft-copy-sep" aria-hidden="true">&bull;</span>');
    
    // Inject the refund policy link next to the tagline
    if (!content.includes('7-Day Refund Policy')) {
        const target = '<p class="ft-copy">The Key to Success</p>';
        const replacement = target + '\n        <span class="ft-copy-sep" aria-hidden="true">&bull;</span>\n        <a href="contact.html" class="ft-copy">7-Day Refund Policy</a>';
        content = content.replace(target, replacement);
    }
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Updated all footers successfully.');
