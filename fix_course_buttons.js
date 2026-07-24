const fs = require('fs');

const filesToFix = ['courses.html', 'update_courses_html.js', 'downloaded_courses.html'];

for (const file of filesToFix) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Fix duplicated Book buttons for the template literal string
        const regex1 = /<a href="checkout\.html\?book=\\\$\{([^}]+)\}" class="co-enrol-btn" style="background: var\(--text\); color: white;">\s*Book\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<\/div>\s*<a href="checkout\.html\?book=\\\$\{[^}]+\}" class="co-enrol-btn" style="background: var\(--text\); color: white;">\s*Book\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<\/div>/g;
        content = content.replace(regex1, `<a href="checkout.html?book=\\\${$1}" class="co-enrol-btn" style="background: var(--text); color: white;">
              Book
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            </div>`);

        // Fix duplicated Book buttons for the normal template string (courses.html)
        const regex2 = /<a href="checkout\.html\?book=\$\{([^}]+)\}" class="co-enrol-btn" style="background: var\(--text\); color: white;">\s*Book\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<a href="checkout\.html\?book=\$\{[^}]+\}" class="co-enrol-btn" style="background: var\(--text\); color: white;">\s*Book\s*<svg[^>]+>.*?<\/svg>\s*<\/a>/g;
        content = content.replace(regex2, `<a href="checkout.html?book=\${$1}" class="co-enrol-btn" style="background: var(--text); color: white;">
              Book
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>`);

        // Fix downloaded_courses.html static string duplicates
        const regex3 = /<a href="checkout\.html\?book=([^"]+)" class="co-enrol-btn" style="background: var\(--text\); color: white;">\s*Book\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<\/div>\s*<a href="checkout\.html\?book=[^"]+" class="co-enrol-btn" style="background: var\(--text\); color: white;">\s*Book\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<\/div>/g;
        content = content.replace(regex3, `<a href="checkout.html?book=$1" class="co-enrol-btn" style="background: var(--text); color: white;">
              Book
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            </div>`);


        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Fixed', file);
        }
    }
}
