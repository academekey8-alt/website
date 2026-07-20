const fs = require('fs');

let html = fs.readFileSync('programs.html', 'utf8');

const pgridStartStr = '<div class="pg-grid" id="pgGrid">';
const pgridEndStr = '</div><!-- /pg-grid -->';
const pgridStart = html.indexOf(pgridStartStr);
const pgridEnd = html.indexOf(pgridEndStr);

if (pgridStart !== -1 && pgridEnd !== -1) {
  const dynamicGrid = `
<div id="dynamic-programs-grid" style="display:flex; justify-content:center; width: 100%;">Loading programs...</div>
<script type="module">
  import { db } from './js/firebase.js';
  import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

  function getCatCode(cat) {
    if (cat.includes('Leadership')) return 'leadership';
    if (cat.includes('Customer')) return 'customer-service';
    if (cat.includes('Communication')) return 'communication';
    if (cat.includes('Sales')) return 'sales';
    if (cat.includes('Project')) return 'project-management';
    if (cat.includes('Human')) return 'hr';
    if (cat.includes('Compliance')) return 'compliance';
    return 'other';
  }

  async function loadPrograms() {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      const container = document.getElementById('dynamic-programs-grid');
      
      const categories = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!categories[data.category]) {
          categories[data.category] = {
            name: data.category,
            img: data.image || 'assets/img/Academekey logo.png'
          };
        }
      });

      if(Object.keys(categories).length === 0) {
         container.innerHTML = "No programs available.";
         return;
      }

      let html = '<div class="pg-grid" id="pgGrid">';
      let i = 0;
      
      for (const [name, catData] of Object.entries(categories)) {
        const catCode = getCatCode(name);
        
        html += \`
      <!-- \${name} -->
      <a class="pg-card" href="courses.html?q=\${encodeURIComponent(name)}" id="\${catCode}" data-pgcard="0">
        <div class="pg-card-img-wrap">
          <img class="pg-card-img" src="\${catData.img}" alt="\${name}" loading="lazy">
          <div class="pg-card-img-overlay"></div>
          <svg class="pg-card-gem" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L26 14L14 26L2 14Z" stroke="rgba(245,166,35,.5)" stroke-width="0.8"/>
            <path d="M9 20L14 8L19 20" stroke="rgba(245,166,35,.6)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="11.2" y1="16.5" x2="16.8" y2="16.5" stroke="rgba(245,166,35,.6)" stroke-width="1.1" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="pg-card-foot">
          <span class="pg-card-title">\${name}</span>
          <span class="pg-card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </a>
        \`;
        i++;
      }
      
      html += '</div>';
      container.outerHTML = html;
      
    } catch (e) {
      console.error(e);
      document.getElementById('dynamic-programs-grid').innerHTML = 'Error loading programs.';
    }
  }
  
  loadPrograms();
</script>
  `;
  html = html.substring(0, pgridStart) + dynamicGrid + "\n" + html.substring(pgridEnd + pgridEndStr.length);
}

fs.writeFileSync('programs.html', html);
console.log('programs.html updated successfully!');
