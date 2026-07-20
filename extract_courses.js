const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('downloaded_courses.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const courses = [];
const categories = document.querySelectorAll('.co-category');

categories.forEach(cat => {
  const catName = cat.querySelector('.co-cat-name').textContent.trim();
  const cards = cat.querySelectorAll('.co-card');
  
  cards.forEach(card => {
    if (card.classList.contains('co-card--placeholder') || card.classList.contains('co-coming-soon-card')) {
      return;
    }
    const title = card.querySelector('.co-card-title').textContent.trim();
    const image = card.querySelector('.co-card-img').getAttribute('src');
    const desc = card.querySelector('.co-card-desc').textContent.trim();
    const duration = card.querySelector('.co-card-meta-item').textContent.trim();
    const format = card.querySelector('.co-card-format').textContent.trim();
    
    courses.push({
      title: title,
      category: catName,
      image: image,
      description: desc,
      duration: duration,
      format: format
    });
  });
});

fs.writeFileSync('extracted_courses.json', JSON.stringify(courses, null, 2));
console.log("Extracted " + courses.length + " courses.");
