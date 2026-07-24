const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

const baseUrl = 'https://academekey.com';

files.forEach(file => {
  if (file.endsWith('.html')) {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Extract title and description
    let titleMatch = content.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : 'AcademeKey - Professional Training';
    
    let descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    let description = descMatch ? descMatch[1] : 'AcademeKey offers practical, engaging, and industry-relevant professional training programs for individuals and organizations.';

    // Generate SEO Block
    const pageUrl = file === 'index.html' ? `${baseUrl}/` : `${baseUrl}/${file}`;
    const imageUrl = `${baseUrl}/assets/img/logo.png`; // Fallback share image

    const seoBlock = `
  <!-- ==================== HARDCORE SEO TAGS ==================== -->
  <link rel="canonical" href="${pageUrl}" />
  
  <!-- Open Graph / Facebook / LinkedIn -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />

  <!-- Twitter / X -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${pageUrl}" />
  <meta property="twitter:title" content="${title}" />
  <meta property="twitter:description" content="${description}" />
  <meta property="twitter:image" content="${imageUrl}" />

  <!-- Structured Data (Schema.org JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "AcademeKey",
    "url": "${baseUrl}",
    "logo": "${imageUrl}",
    "description": "Practical, engaging, and industry-relevant professional training programs.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-575-284-8789",
      "contactType": "customer service",
      "email": "support@academekey.com"
    }
  }
  </script>
  <!-- ========================================================= -->
</head>`;

    // Remove any previously injected SEO block to avoid duplicates if run multiple times
    content = content.replace(/\s*<!-- ==================== HARDCORE SEO TAGS ==================== -->[\s\S]*?<!-- ========================================================= -->/gi, '');
    
    // Inject just before </head>
    content = content.replace('</head>', seoBlock);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected SEO tags into ${file}`);
  }
});
