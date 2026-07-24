const fs = require('fs');
const path = require('path');

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                fixFiles(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Fix double wrapping
            const badRegex = /<div style="display: flex; gap: 8px;"><div style="display: flex; gap: 8px;"><a href="\.\.\/contact\.html" class="btn btn-orange btn-sm">Enquire<\/a><a href="\.\.\/checkout\.html" class="btn btn-outline-dark btn-sm">Book<\/a><\/div><a href="\.\.\/checkout\.html" class="btn btn-outline-dark btn-sm">Book<\/a><\/div>/g;
            content = content.replace(badRegex, '<div style="display: flex; gap: 8px;"><a href="../contact.html" class="btn btn-orange btn-sm">Enquire</a><a href="../checkout.html" class="btn btn-outline-dark btn-sm">Book</a></div>');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}
fixFiles(__dirname);
