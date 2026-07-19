const fs = require('fs');

const html = fs.readFileSync('courses.html', 'utf8');

const startIndex = html.indexOf('<div class="co-catalog-inner">');
const endIndex = html.indexOf('</div><!-- /co-catalog-inner -->');

if (startIndex !== -1 && endIndex !== -1) {
  const before = html.substring(0, startIndex + '<div class="co-catalog-inner">'.length);
  const after = html.substring(endIndex);
  
  const newContent = `
    <div id="coursesLoading" style="text-align: center; padding: 100px 0; color: var(--text-secondary);">
      Loading courses...
    </div>
    <div id="coursesContainer"></div>
  `;
  
  let newHtml = before + newContent + after;
  
  const oldScriptStart = newHtml.indexOf('<script type="module">');
  if (oldScriptStart !== -1) {
    newHtml = newHtml.substring(0, oldScriptStart);
  } else {
    newHtml = newHtml.replace('</body>', '');
  }
  
  const scriptTag = `
  <script type="module">
    import { db } from './js/firebase.js';
    import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

    const getCatCode = (cat) => {
      if (cat.includes('Leadership')) return 'leadership';
      if (cat.includes('Customer')) return 'customer-service';
      if (cat.includes('Communication')) return 'communication';
      if (cat.includes('Sales')) return 'sales';
      if (cat.includes('Project')) return 'project-management';
      if (cat.includes('Human')) return 'hr';
      if (cat.includes('Compliance')) return 'compliance';
      return 'other';
    };

    const getCatTag = (cat) => {
      if (cat.includes('Leadership')) return 'Leadership';
      if (cat.includes('Customer')) return 'Customer Service';
      if (cat.includes('Communication')) return 'Communication';
      if (cat.includes('Sales')) return 'Sales';
      if (cat.includes('Project')) return 'Project Management';
      if (cat.includes('Human')) return 'HR';
      if (cat.includes('Compliance')) return 'Compliance';
      return 'Professional Dev.';
    };

    async function loadCourses() {
      try {
        const snapshot = await getDocs(collection(db, 'courses'));
        const container = document.getElementById('coursesContainer');
        const loading = document.getElementById('coursesLoading');
        
        if (snapshot.empty) {
          loading.innerHTML = 'No courses found. Please seed the database or add courses via the Admin Panel.';
          return;
        }

        loading.style.display = 'none';
        
        // Group by category
        const categories = {};
        snapshot.forEach(doc => {
          const course = doc.data();
          if (!categories[course.category]) categories[course.category] = [];
          categories[course.category].push(course);
        });

        let html = '';
        for (const [category, courses] of Object.entries(categories)) {
          const catCode = getCatCode(category);
          
          html += \`
            <div class="co-category" data-category="\${catCode}" id="\${catCode}">
              <div class="co-cat-header">
                <h2 class="co-cat-title">\${category}</h2>
                <div class="co-cat-count">\${courses.length} \${courses.length === 1 ? 'Course' : 'Courses'}</div>
              </div>
              <div class="co-grid">
          \`;
          
          courses.forEach(course => {
            html += \`
        <div class="co-card" data-cat="\${catCode}" data-title="\${course.title}">
          <div class="co-card-img-wrap">
            <img class="co-card-img" src="\${course.image || 'assets/img/Academekey logo.png'}" alt="\${course.title}" loading="lazy">
            <span class="co-card-tag">\${getCatTag(category)}</span>
            <span class="co-card-format">\${course.format}</span>
          </div>
          <div class="co-card-body">
            <h3 class="co-card-title">\${course.title}</h3>
            <p class="co-card-desc">\${course.description}</p>
          </div>
          <div class="co-card-foot">
            <div class="co-card-meta">
              <span class="co-card-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                \${course.duration}
              </span>
            </div>
            <a href="contact.html?course=\${encodeURIComponent(course.title)}" class="co-enrol-btn">
              Enquire
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
            \`;
          });
          
          html += \`</div></div>\`;
        }
        
        container.innerHTML = html;
        
        // Setup filters (re-init)
        setupFilters();
        
      } catch (err) {
        console.error(err);
        document.getElementById('coursesLoading').innerHTML = 'Error loading courses. Please check your Firebase configuration.';
      }
    }

    function setupFilters() {
      const btns = document.querySelectorAll('.co-filter-btn');
      const cats = document.querySelectorAll('.co-category');
      
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          
          cats.forEach(cat => {
            if (filter === 'all' || cat.dataset.category === filter) {
              cat.style.display = 'block';
            } else {
              cat.style.display = 'none';
            }
          });
        });
      });
    }

    loadCourses();
  </script>
</body>`;

  newHtml = newHtml + scriptTag;
  
  fs.writeFileSync('courses.html', newHtml);
  console.log("courses.html updated with original styles successfully!");
} else {
  console.log("Could not find co-catalog-inner block.");
}
