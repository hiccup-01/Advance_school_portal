/* ==========================================
   1. CUSTOM CURSOR LOGIC
   ========================================== */
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 150, fill: 'forwards' });
});

const addCursorHover = () => {
  document.querySelectorAll('.interactive, button, input, a').forEach(element => {
    element.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });
};
addCursorHover();

/* ==========================================
   2. AUTH SYSTEM & DATABASE
   ========================================== */
let currentRole = 'Admin';
let isRegisterMode = false;

// Single Master Admin Credential
const MASTER_ADMIN = {
  user: 'admin@school.com',
  pass: 'admin123'
};

// Database store with statuses: 'approved' or 'pending'
let usersDB = [
  { role: 'Teacher', user: 'teacher1@school.com', pass: 'teach123', status: 'approved' },
  { role: 'Driver',  user: 'driver1@school.com',  pass: 'drive123', status: 'approved' },
  { role: 'Student', user: 'pending_student@school.com', pass: 'pass123', status: 'pending' }
];

// Switch Role Tabs
function switchRole(role) {
  currentRole = role;
  isRegisterMode = false;

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.innerText.includes(role));
  });

  // Hide admin dashboard when leaving admin tab
  const adminModal = document.getElementById('adminDashboard');
  if (adminModal && role !== 'Admin') {
    adminModal.style.display = 'none';
  }

  updateFormView();
}

// Update form fields based on Role and Mode
function updateFormView() {
  const userLabel = document.getElementById('userLabel');
  const loginBtn = document.getElementById('loginBtn');
  const toggleAuth = document.getElementById('toggleAuth');

  if (currentRole === 'Student') {
    toggleAuth.style.display = 'block';
    if (isRegisterMode) {
      userLabel.innerText = 'Student Signup Email';
      loginBtn.innerText = 'Request Student Registration';
      toggleAuth.innerText = 'Already have an account? Login';
    } else {
      userLabel.innerText = 'Student Username / Email';
      loginBtn.innerText = 'Login as Student';
      toggleAuth.innerText = 'New Student? Register Here';
    }
  } else {
    toggleAuth.style.display = 'none';
    userLabel.innerText = `${currentRole} Username / Email`;
    loginBtn.innerText = `Login as ${currentRole}`;
  }
}

function toggleStudentRegister() {
  isRegisterMode = !isRegisterMode;
  updateFormView();
}

// Global function used in both handleLogin and handleFormSubmit for compatibility
function handleFormSubmit(e) {
  if (e) e.preventDefault();
  const inputUser = document.getElementById('username').value.trim();
  const inputPass = document.getElementById('password').value.trim();

  // 1. Admin Login
  if (currentRole === 'Admin') {
    if (inputUser === MASTER_ADMIN.user && inputPass === MASTER_ADMIN.pass) {
      alert('Access Granted! Opening Admin Management Panel.');
      showAdminDashboard();
    } else {
      alert('Invalid Admin Credentials!\nEmail: admin@school.com\nPassword: admin123');
    }
    return;
  }

  // 2. Student Self-Registration Mode
  if (currentRole === 'Student' && isRegisterMode) {
    const exists = usersDB.some(u => u.user === inputUser);
    if (exists) {
      alert('An account with this email already exists!');
      return;
    }

    usersDB.push({
      role: 'Student',
      user: inputUser,
      pass: inputPass,
      status: 'pending'
    });

    alert('Registration submitted successfully!\nYour account is now PENDING Admin approval.');
    toggleStudentRegister();
    return;
  }

  // 3. User Login Check (Teachers, Drivers, Students)
  const account = usersDB.find(
    u => u.role === currentRole && u.user === inputUser && u.pass === inputPass
  );

  if (!account) {
    alert(`Invalid credentials for ${currentRole}.`);
    return;
  }

  if (account.status === 'pending') {
    alert('Access Denied!\nYour account registration is still pending Admin approval.');
    return;
  }

  alert(`Access Granted! Welcome to ${currentRole} Portal.`);
}

// Fallback alias in case your HTML form calls handleLogin(event)
function handleLogin(e) {
  handleFormSubmit(e);
}

/* ==========================================
   3. ADMIN MANAGEMENT FUNCTIONS
   ========================================== */

function adminCreateStaff(role, email, password) {
  if (!email || !password) {
    alert('Please enter both Email and Password for the staff member.');
    return;
  }

  usersDB.push({ role, user: email, pass: password, status: 'approved' });
  alert(`Account successfully created for ${role}: ${email}`);
  
  document.getElementById('staffEmail').value = '';
  document.getElementById('staffPass').value = '';
  renderPendingStudents();
}

function approveStudent(email) {
  const student = usersDB.find(u => u.role === 'Student' && u.user === email);
  if (student) {
    student.status = 'approved';
    alert(`Student ${email} has been APPROVED!`);
    renderPendingStudents();
  }
}

function showAdminDashboard() {
  const adminModal = document.getElementById('adminDashboard');
  if (adminModal) {
    adminModal.style.display = 'block';
    renderPendingStudents();
  }
}

function renderPendingStudents() {
  const pendingList = document.getElementById('pendingList');
  if (!pendingList) return;

  const pendingStudents = usersDB.filter(u => u.role === 'Student' && u.status === 'pending');

  if (pendingStudents.length === 0) {
    pendingList.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">No pending student registrations.</p>';
    return;
  }

  pendingList.innerHTML = pendingStudents.map(s => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; margin-top:6px;">
      <span style="font-size:0.8rem;">${s.user}</span>
      <button onclick="approveStudent('${s.user}')" class="interactive" style="background:#22c55e; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem;">Approve</button>
    </div>
  `).join('');
  
  addCursorHover();
}

/* ==========================================
   4. STUDENT DIRECTORY SEARCH
   ========================================== */
const studentData = [
  {
    name: "Alex Johnson",
    id: "STU-1001",
    grade: "Class 10-A",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Sarah Williams",
    id: "STU-1002",
    grade: "Class 9-B",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
  }
];

function searchStudent() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const resultContainer = document.getElementById('studentResult');

  if (query === '') {
    resultContainer.innerHTML = '';
    return;
  }

  const found = studentData.find(student => 
    student.name.toLowerCase().includes(query)
  );

  if (found) {
    resultContainer.innerHTML = `
      <div class="student-card interactive">
        <img src="${found.photo}" alt="${found.name}" class="student-photo" />
        <div class="student-info">
          <h4>${found.name}</h4>
          <p>ID: ${found.id}</p>
          <p>Grade: ${found.grade}</p>
        </div>
      </div>
    `;
    addCursorHover();
  } else {
    resultContainer.innerHTML = `
      <div class="not-found">No student found matching "${query}"</div>
    `;
  }
}
