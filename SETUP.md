# AcademeKey Website — Setup Guide

## Project Structure
```
academekey/
├── index.html                          ← Homepage
├── programs.html                       ← All programs listing
├── programs/
│   └── leadership-management.html     ← Program detail (template for others)
├── learning-formats.html               ← Learning formats + session types
├── about.html                          ← About page
├── contact.html                        ← Contact page
├── css/
│   └── style.css                       ← All styles
├── js/
│   ├── firebase.js                     ← Firebase config (FILL IN)
│   ├── contact.js                      ← Form → Firestore + Cloudinary
│   └── main.js                         ← Nav, tabs, search
├── assets/img/                         ← Local fallback images (optional)
├── _redirects                          ← Cloudflare Pages redirects
├── _headers                            ← Cloudflare Pages security headers
└── sitemap.xml
```

---

## Step 1 — Firebase Setup

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `academekey`
3. Disable Google Analytics (optional) → **Create project**
4. Click **</> Web** to register a web app → name it `AcademeKey Website`
5. Copy the `firebaseConfig` object shown
6. Open `js/firebase.js` and replace the placeholder values with your config
7. In Firebase console → **Firestore Database** → **Create database** → Start in **production mode**
8. Add this Firestore security rule (allows write-only from anyone):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /enquiries/{doc} {
         allow create: if true;
         allow read, update, delete: if false;
       }
     }
   }
   ```

---

## Step 2 — Cloudinary Setup

1. Log in to your Cloudinary account (cloud name: `ofwhhxao`)
2. Go to **Settings → Upload** → scroll to **Upload presets**
3. Click **Add upload preset**
   - Preset name: `academekey_uploads`
   - Signing mode: **Unsigned**
   - Folder: `academekey`
4. Save the preset
5. Upload your training images to the `academekey` folder with these public IDs:
   - `academekey/hero-training` — hero background photo
   - `academekey/classroom-training` — classroom format photo
   - `academekey/virtual-training` — virtual sessions photo
   - `academekey/onsite-training` — onsite workshop photo
   - `academekey/about-team` — about page team photo

---

## Step 3 — Add Your Real Logo

1. Save your logo file as `assets/img/logo.png` (or `.svg`)
2. In each HTML file, replace the inline SVG logo-mark with:
   ```html
   <img class="logo-mark" src="assets/img/logo.png" alt="AcademeKey logo">
   ```
   Or upload the logo to Cloudinary and use that URL.

---

## Step 4 — Deploy to Cloudflare Pages

1. Push this folder to a GitHub repository
2. Go to https://dash.cloudflare.com → **Pages** → **Create a project**
3. Connect your GitHub repo
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)
5. Click **Save and Deploy**
6. Go to **Custom domains** → add `www.academekey.com`
7. Update your domain's DNS nameservers to Cloudflare

---

## Viewing Enquiries

All contact form submissions go to Firebase Firestore under the `enquiries` collection.
- View them at: https://console.firebase.google.com → your project → Firestore
- Fields stored: `name`, `email`, `phone`, `program`, `format`, `message`, `source`, `status`, `timestamp`

To export to CSV: Firebase console → Firestore → Export, or use the Firebase Admin SDK.
