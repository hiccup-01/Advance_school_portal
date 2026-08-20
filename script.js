/* Custom Cursor Logic */
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

/* Role Switching */
let currentRole = 'Admin';

function switchRole(role) {
  currentRole = role;
  
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.innerText.includes(role));
  });

  document.getElementById('userLabel').innerText = `${role} Username / Email`;
  document.getElementById('loginBtn').innerText = `Login as ${role}`;
}

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  alert(`Logging in as ${currentRole}: ${user}`);
}

/* Student Directory Search */
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
