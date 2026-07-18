/* AcademeKey — contact.js
   Submits enquiry form to Firestore + optional Cloudinary attachment */

import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const CLOUDINARY_CLOUD  = 'ofwhhxao';           // your Cloudinary cloud name
const CLOUDINARY_PRESET = 'academekey_uploads';  // create this unsigned preset in Cloudinary

(function () {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmit');
  const formMsg   = document.getElementById('formMsg');
  const fileInput = document.getElementById('attachment');
  const fileName  = document.getElementById('fileName');
  const fileArea  = document.getElementById('fileArea');
  const progWrap  = document.getElementById('progressWrap');
  const progFill  = document.getElementById('progressFill');

  if (!form) return;

  /* drag-drop attachment */
  if (fileArea) {
    fileArea.addEventListener('click', () => fileInput && fileInput.click());
    fileArea.addEventListener('dragover', e => { e.preventDefault(); fileArea.classList.add('drag'); });
    fileArea.addEventListener('dragleave', () => fileArea.classList.remove('drag'));
    fileArea.addEventListener('drop', e => {
      e.preventDefault(); fileArea.classList.remove('drag');
      if (e.dataTransfer.files[0] && fileInput) {
        fileInput.files = e.dataTransfer.files;
        if (fileName) fileName.textContent = fileInput.files[0].name;
      }
    });
  }
  if (fileInput) fileInput.addEventListener('change', () => {
    if (fileName && fileInput.files[0]) fileName.textContent = fileInput.files[0].name;
  });

  async function uploadToCloudinary(file, onProgress) {
    return new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`);
      xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        xhr.status === 200 ? resolve(res.secure_url) : reject(new Error(res.error?.message || 'Upload failed'));
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(fd);
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (formMsg) { formMsg.style.display = 'none'; formMsg.className = 'form-msg'; }

    const data = {
      name:      form.name.value.trim(),
      email:     form.email.value.trim(),
      phone:     form.phone ? form.phone.value.trim() : '',
      program:   form.program ? form.program.value : '',
      message:   form.message.value.trim(),
      source:    window.location.pathname,
      status:    'new',
      timestamp: serverTimestamp()
    };

    try {
      if (fileInput && fileInput.files[0]) {
        if (progWrap) { progWrap.style.display = 'block'; progFill.style.width = '0%'; }
        data.attachmentUrl = await uploadToCloudinary(fileInput.files[0], p => {
          if (progFill) progFill.style.width = (p * 100) + '%';
        });
        if (progWrap) progWrap.style.display = 'none';
      }

      await addDoc(collection(db, 'enquiries'), data);

      if (formMsg) {
        formMsg.style.display = 'block';
        formMsg.textContent = 'Thank you! We will get back to you within 24 hours.';
      }
      form.reset();
      if (fileName) fileName.textContent = '';
    } catch (err) {
      console.error(err);
      if (formMsg) {
        formMsg.style.display = 'block';
        formMsg.classList.add('error');
        formMsg.textContent = 'Something went wrong. Please try again or email us directly at info@academekey.com';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    }
  });
})();
