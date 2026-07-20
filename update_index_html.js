const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update the Search Bar Script
// The search bar data is at `var scData = [` and ends at `];`
// It also has logic `var bar = document.getElementById('scBar');`
// I will replace the script block with a dynamic fetch.

const scriptStartStr = "<!-- LIVE SEARCH LOGIC -->";
const scriptEndStr = "<!-- /LIVE SEARCH LOGIC -->";

const scriptStart = html.indexOf(scriptStartStr);
const scriptEnd = html.indexOf(scriptEndStr);

if (scriptStart !== -1 && scriptEnd !== -1) {
  const dynamicScript = `
<script type="module">
  import { db } from './js/firebase.js';
  import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

  let scData = [];

  async function loadSearchData() {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      snapshot.forEach(doc => {
        const data = doc.data();
        scData.push({
          title: data.title,
          cat: data.category,
          img: data.image || 'assets/img/Academekey logo.png',
          desc: data.description || ''
        });
      });
    } catch (e) {
      console.error('Failed to load courses for search', e);
    }
  }

  var bar      = document.getElementById('scBar');
  var input    = document.getElementById('scInput');
  var panel    = document.getElementById('scPanel');
  var suggs    = document.getElementById('scSuggestions');
  var resWrap  = document.getElementById('scResultsWrap');
  var resBox   = document.getElementById('scResults');
  var clearBtn = document.getElementById('scClear');
  var closeBtn = document.getElementById('scClose');

  function openSearch() {
    bar.classList.add('sc-active');
    panel.style.display = 'block';
    setTimeout(function(){ panel.classList.add('sc-in'); }, 10);
    input.focus();
    if(scData.length === 0) loadSearchData();
  }

  function closeSearch() {
    bar.classList.remove('sc-active');
    panel.classList.remove('sc-in');
    setTimeout(function(){ panel.style.display = 'none'; }, 300);
    input.value = '';
    doSearch('');
  }

  if (bar) {
    bar.addEventListener('click', function(e) {
      if (!bar.classList.contains('sc-active')) openSearch();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeSearch();
  });

  if (clearBtn) clearBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    input.value = '';
    doSearch('');
    input.focus();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && bar.classList.contains('sc-active')) {
      closeSearch();
    }
  });

  document.addEventListener('click', function(e) {
    if (bar && bar.classList.contains('sc-active') && !bar.contains(e.target)) {
      closeSearch();
    }
  });

  if (input) {
    input.addEventListener('input', function(e) {
      doSearch(e.target.value);
    });
  }

  function doSearch(q) {
    var query = q.toLowerCase().trim();
    if (!query) {
      clearBtn.style.opacity = '0';
      clearBtn.style.pointerEvents = 'none';
      suggs.style.display = 'block';
      resWrap.style.display = 'none';
      resBox.innerHTML = '';
      return;
    }

    clearBtn.style.opacity = '1';
    clearBtn.style.pointerEvents = 'auto';
    suggs.style.display = 'none';
    resWrap.style.display = 'block';

    var results = scData.filter(function(c) {
      return c.title.toLowerCase().indexOf(query) > -1 || 
             c.cat.toLowerCase().indexOf(query) > -1 || 
             c.desc.toLowerCase().indexOf(query) > -1;
    });

    if (results.length === 0) {
      resBox.innerHTML = '<div style="padding:40px 24px;text-align:center;color:#6B7A90;">No programs found matching "'+q+'".</div>';
      return;
    }

    var html = '';
    results.forEach(function(c) {
      html += '<a href="courses.html?q=' + encodeURIComponent(c.title) + '" class="sc-res-item">';
      html += '<div class="sc-res-thumb"><img src="' + c.img + '" alt="" loading="lazy"></div>';
      html += '<div class="sc-res-body">';
      html += '<span class="sc-res-title">' + c.title + '</span>';
      html += '<span class="sc-res-desc">' + c.cat + '</span>';
      html += '</div>';
      html += '<div class="sc-res-arr"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>';
      html += '</a>';
    });
    resBox.innerHTML = html;
  }
</script>`;
  html = html.substring(0, scriptStart + scriptStartStr.length) + "\n" + dynamicScript + "\n" + html.substring(scriptEnd);
}

// 2. Update the Programs grid
const pgridStartStr = '<div class="pg-grid">';
const pgridEndStr = '</div><!-- /pg-grid -->';
const pgridStart = html.indexOf(pgridStartStr);
const pgridEnd = html.indexOf(pgridEndStr);

if (pgridStart !== -1 && pgridEnd !== -1) {
  const dynamicGrid = `
<div id="dynamic-popular-courses" style="display:flex; justify-content:center; width: 100%;">Loading popular programs...</div>
<script type="module">
  import { db } from './js/firebase.js';
  import { collection, getDocs, limit, query } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

  async function loadPopular() {
    try {
      const q = query(collection(db, 'courses'), limit(6));
      const snapshot = await getDocs(q);
      const container = document.getElementById('dynamic-popular-courses');
      if(snapshot.empty) {
         container.innerHTML = "No programs available.";
         return;
      }
      let html = '<div class="pg-grid">';
      
      let i = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        const img = data.image || 'assets/img/Academekey logo.png';
        const classes = i === 0 ? "pcard pcard--1" : \`pcard pcard--\${i + 2}\`;
        
        html += \`
      <a href="courses.html?q=\${encodeURIComponent(data.title)}" class="\${classes}" data-pcard="0">
        <div class="pcard-img-wrap" data-sweep>
          <img src="\${img}" alt="\${data.title}" class="pcard-img">
        </div>
        <div class="pcard-overlay"></div>
        <div class="pcard-geo" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><path d="M18 88L50 14L82 88" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="33" y1="66" x2="67" y2="66" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg></div>
        <div class="pcard-content">
          <h3 class="pcard-title">\${data.title}</h3>
          <span class="pcard-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </a>
        \`;
        i++;
      });
      html += '</div>';
      container.outerHTML = html;
      
    } catch (e) {
      console.error(e);
      document.getElementById('dynamic-popular-courses').innerHTML = 'Error loading programs.';
    }
  }
  loadPopular();
</script>
  `;
  html = html.substring(0, pgridStart) + dynamicGrid + "\n" + html.substring(pgridEnd + pgridEndStr.length);
}

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully!');
