const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'style.css');

const appendCSS = `

/* ============================================================
   OVERRIDES: Logo and Footer Visibility Fixes
   ============================================================ */

/* 1. Fix Logo Visibility (White pill backdrop) */
.nb-logo img, .ft-logo, .mob-header img, img[alt="AcademeKey"] {
  background-color: #ffffff !important;
  padding: 6px 12px !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  display: inline-block !important;
}

/* 2. Fix Footer Text Visibility (Brighter text colors) */
.ft-tagline, .ft-nav-link { color: rgba(255,255,255,0.85) !important; }
.ft-contact-text, .ft-copy, .ft-copy-sep { color: rgba(255,255,255,0.7) !important; }
.ft-soc { color: rgba(255,255,255,0.8) !important; border-color: rgba(255,255,255,0.4) !important; }
.ft-copy a { color: rgba(255,255,255,0.85) !important; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.3); text-underline-offset: 4px; }
.ft-copy a:hover { color: #10B981 !important; text-decoration-color: #10B981; }

`;

fs.appendFileSync(cssPath, appendCSS, 'utf8');
console.log('Appended fixes successfully to style.css');
