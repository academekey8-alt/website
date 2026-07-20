const fs = require('fs');
const files = ['index.html', 'about.html', 'courses.html', 'programs.html', 'contact.html'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let h = fs.readFileSync(f, 'utf8');
    
    // Replace desktop nav logo
    h = h.replace(
      /<div class="nav-logo-mark">[\s\S]*?<div class="nav-logo-text">[\s\S]*?<\/div>/g, 
      '<img src="assets/img/logo.png" alt="AcademeKey" style="height:45px; width:auto; margin-right:8px;">'
    );
    
    // Replace mobile nav logo
    h = h.replace(
      /<div class="nav-logo-mark">[\s\S]*?<\/svg>\s*<\/div>/g, 
      '<img src="assets/img/logo.png" alt="AcademeKey" style="height:35px; width:auto;">'
    );
    
    fs.writeFileSync(f, h);
    console.log('Fixed ' + f);
  }
});
