const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Handle programs/*.html Enquire buttons
    const programBtnRegex = /<a href="\.\.\/contact\.html" class="btn btn-orange btn-sm">Enquire<\/a>/g;
    content = content.replace(programBtnRegex, `<div style="display: flex; gap: 8px;"><div style="display: flex; gap: 8px;"><a href="../contact.html" class="btn btn-orange btn-sm">Enquire</a><a href="../checkout.html" class="btn btn-outline-dark btn-sm">Book</a></div><a href="../checkout.html" class="btn btn-outline-dark btn-sm">Book</a></div>`);

    // Handle courses.html and downloaded_courses.html Enquire buttons
    const courseBtnRegex = /<a href="(contact\.html\?course=[^"]+)" class="co-enrol-btn">\s*Enquire\s*<svg[^>]+>.*?<\/svg>\s*<\/a>/gs;
    content = content.replace(courseBtnRegex, (match, url) => {
        const bookUrl = url.replace('contact.html?course=', 'checkout.html?book=');
        return `<div style="display: flex; gap: 8px;">
            ${match}
            <a href="${bookUrl}" class="co-enrol-btn" style="background: var(--text); color: white;">
              Book
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            </div>`;
    });
    
    // Also handle update_courses_html.js template string format (which has \${...})
    const templateCourseBtnRegex = /<a href="contact\.html\?course=\\\$\{([^}]+)\}" class="co-enrol-btn">\s*Enquire\s*<svg[^>]+>.*?<\/svg>\s*<\/a>/gs;
    content = content.replace(templateCourseBtnRegex, (match, encodeStr) => {
        const bookUrl = `checkout.html?book=\\\${${encodeStr}}`;
        return `<div style="display: flex; gap: 8px;">
            ${match}
            <a href="${bookUrl}" class="co-enrol-btn" style="background: var(--text); color: white;">
              Book
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            </div>`;
    });


    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                scanDir(fullPath);
            }
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

scanDir(__dirname);
