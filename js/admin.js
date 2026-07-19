import { auth, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// DOM Elements
const loginDiv = document.getElementById('adminLogin');
const dashboardDiv = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Tabs
const tabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Course Modal
const addCourseBtn = document.getElementById('addCourseBtn');
const courseModal = document.getElementById('courseModal');
const courseForm = document.getElementById('courseForm');
const cancelCourseBtn = document.getElementById('cancelCourseBtn');
const courseImgPreview = document.getElementById('courseImgPreview');
const courseImageFile = document.getElementById('courseImageFile');
const uploadStatus = document.getElementById('uploadStatus');

// Cloudinary config
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/jzjqgdxt/image/upload';
const CLOUDINARY_PRESET = 'website';

let courses = []; // Cache loaded courses

// --- AUTHENTICATION ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginDiv.style.display = 'none';
    dashboardDiv.style.display = 'block';
    loadEnquiries();
    loadCourses();
  } else {
    loginDiv.style.display = 'block';
    dashboardDiv.style.display = 'none';
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    loginError.style.display = 'none';
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    loginError.textContent = error.message;
    loginError.style.display = 'block';
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// --- TABS ---
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');
    
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).style.display = 'block';
  });
});

// --- ENQUIRIES ---
async function loadEnquiries() {
  const tbody = document.querySelector('#enquiriesTable tbody');
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  
  try {
    const q = query(collection(db, 'enquiries'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="5">No enquiries found.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : 'Unknown';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${date}</td>
        <td><strong>${data.firstName} ${data.lastName}</strong><br><small>${data.organization || ''}</small></td>
        <td><a href="mailto:${data.email}">${data.email}</a></td>
        <td>${data.program || 'N/A'}<br><small>${data.format || ''}</small></td>
        <td style="max-width: 300px;">${data.message || ''}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading enquiries:", err);
    tbody.innerHTML = `<tr><td colspan="5" style="color:red">Error: ${err.message}. Make sure Firestore rules allow read access for authenticated users.</td></tr>`;
  }
}

// --- COURSES ---
async function loadCourses() {
  const tbody = document.querySelector('#coursesTable tbody');
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  
  try {
    const q = query(collection(db, 'courses'), orderBy('category'));
    const snapshot = await getDocs(q);
    
    courses = [];
    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    if (courses.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No courses found.</td></tr>';
      return;
    }

    renderCourses();
  } catch (err) {
    console.error("Error loading courses:", err);
    tbody.innerHTML = `<tr><td colspan="5" style="color:red">Error: ${err.message}</td></tr>`;
  }
}

function renderCourses() {
  const tbody = document.querySelector('#coursesTable tbody');
  tbody.innerHTML = '';
  
  courses.forEach(course => {
    const tr = document.createElement('tr');
    const imgUrl = course.image || '../assets/img/Academekey logo.png'; // fallback
    tr.innerHTML = `
      <td><img src="${imgUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${course.title}</strong></td>
      <td>${course.category}</td>
      <td>${course.duration}<br><small>${course.format}</small></td>
      <td>
        <button class="admin-btn admin-btn-outline edit-btn" data-id="${course.id}" style="padding: 4px 8px; font-size: 12px; margin-right: 6px;">Edit</button>
        <button class="admin-btn admin-btn-outline delete-btn" data-id="${course.id}" style="padding: 4px 8px; font-size: 12px; color: #ef4444; border-color: #fca5a5;">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach event listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => openCourseModal(e.target.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if(confirm('Are you sure you want to delete this course?')) {
        await deleteDoc(doc(db, 'courses', e.target.dataset.id));
        loadCourses();
      }
    });
  });
}

// --- CLOUDINARY UPLOAD ---
courseImageFile.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  uploadStatus.textContent = 'Uploading image...';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) throw new Error('Upload failed');
    
    const data = await res.json();
    document.getElementById('courseImageUrl').value = data.secure_url;
    courseImgPreview.src = data.secure_url;
    courseImgPreview.style.display = 'block';
    uploadStatus.textContent = 'Upload successful!';
    uploadStatus.style.color = '#10B981';
  } catch (err) {
    console.error(err);
    uploadStatus.textContent = 'Upload failed. Try again.';
    uploadStatus.style.color = '#ef4444';
  }
});

// --- MODAL LOGIC ---
addCourseBtn.addEventListener('click', () => openCourseModal());
cancelCourseBtn.addEventListener('click', () => {
  courseModal.style.display = 'none';
});

function openCourseModal(id = null) {
  courseForm.reset();
  courseImgPreview.style.display = 'none';
  uploadStatus.textContent = '';
  document.getElementById('courseImageUrl').value = '';

  if (id) {
    document.getElementById('modalTitle').textContent = 'Edit Course';
    const course = courses.find(c => c.id === id);
    if (course) {
      document.getElementById('courseId').value = course.id;
      document.getElementById('courseTitle').value = course.title;
      document.getElementById('courseCategory').value = course.category;
      document.getElementById('courseDuration').value = course.duration;
      document.getElementById('courseFormat').value = course.format;
      document.getElementById('courseDesc').value = course.description;
      if (course.image) {
        document.getElementById('courseImageUrl').value = course.image;
        courseImgPreview.src = course.image;
        courseImgPreview.style.display = 'block';
      }
    }
  } else {
    document.getElementById('modalTitle').textContent = 'Add New Course';
    document.getElementById('courseId').value = '';
  }
  
  courseModal.style.display = 'flex';
}

courseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('courseId').value;
  const courseData = {
    title: document.getElementById('courseTitle').value,
    category: document.getElementById('courseCategory').value,
    duration: document.getElementById('courseDuration').value,
    format: document.getElementById('courseFormat').value,
    description: document.getElementById('courseDesc').value,
    image: document.getElementById('courseImageUrl').value,
    updatedAt: serverTimestamp()
  };

  const btn = document.getElementById('saveCourseBtn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    if (id) {
      await updateDoc(doc(db, 'courses', id), courseData);
    } else {
      courseData.createdAt = serverTimestamp();
      await addDoc(collection(db, 'courses'), courseData);
    }
    courseModal.style.display = 'none';
    loadCourses(); // reload the list
  } catch (err) {
    console.error("Error saving course:", err);
    alert("Failed to save course. Ensure Firestore rules allow write access for authenticated users.");
  } finally {
    btn.textContent = 'Save Course';
    btn.disabled = false;
  }
});
