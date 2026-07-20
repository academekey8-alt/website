const https = require('https');
const fs = require('fs');

https.get('https://website.academekey8.workers.dev/courses', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('downloaded_courses.html', data);
    console.log("Downloaded successfully.");
  });
});
