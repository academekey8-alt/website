const fs = require('fs');
const files = ['index.html', 'about.html', 'courses.html', 'programs.html', 'contact.html'];
files.forEach(f => {
  let h = fs.readFileSync(f, 'utf8');
  if(!h.includes('chatbot.css')) h = h.replace('</head>', '  <link rel="stylesheet" href="css/chatbot.css">\n</head>');
  if(!h.includes('chatbot.js')) h = h.replace('</body>', '  <script src="js/chatbot.js"></script>\n</body>');
  fs.writeFileSync(f, h);
});
console.log('Injected.');
