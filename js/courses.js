// ---------------------- USER LOAD/SAVE FUNCTIONS ----------------------
function loadCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) users[idx] = user;

    localStorage.setItem('users', JSON.stringify(users));
}

// ---------------------- ELEMENTS ----------------------
const lessonsDiv = document.getElementById('lessons');
const uploadForm = document.getElementById('uploadForm');
const uploadArea = document.getElementById('uploadArea');

const currentUser = loadCurrentUser();

// ---------------------- LOGIN CHECK ----------------------
if (!currentUser) {
    uploadArea.style.display = 'none';
    lessonsDiv.innerHTML = '<p>Please login to view and upload courses.</p>';
} else {
    renderLessons();
}


// ---------------------- RENDER LESSONS ----------------------
function renderLessons() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    lessonsDiv.innerHTML = '';
    let allLessons = [];

    // collect all public + own private lessons
    users.forEach(u => {
        u.lessons?.forEach(ls => {
            if (ls.visibility === 'public' || u.email === currentUser.email) {
                allLessons.push({
                    ...ls,
                    uploader: u.name,
                    uploaderEmail: u.email
                });
            }
        });
    });

    if (allLessons.length === 0) {
        lessonsDiv.innerHTML = '<p>No lessons available.</p>';
        return;
    }

    // reverse = latest first
    allLessons.slice().reverse().forEach((l, i) => {
        const div = document.createElement('div');
        div.className = 'lesson-item';
        div.innerHTML = `
            <div class="lesson-title">${l.title}</div>
            <div class="lesson-desc">${l.description || ''}</div>
            <div class="lesson-meta"><small>By: ${l.uploader}</small></div>

            <div class="lesson-actions">
                ${l.fileURL ? `<a href="${l.fileURL}" target="_blank">Open File</a>` : ''}
                ${l.uploaderEmail === currentUser.email ? `<a href="#" data-index="${i}" class="delete-link">Delete</a>` : ''}
            </div>
        `;
        lessonsDiv.appendChild(div);
    });
}



// ---------------------- UPLOAD LESSON ----------------------
uploadForm.addEventListener('submit', e => {
    e.preventDefault();

    const user = loadCurrentUser();
    if (!user) return;

    const title = document.getElementById('lessonTitle').value.trim();
    const desc = document.getElementById('lessonDesc').value.trim();
    const fileInput = document.getElementById('lessonFile');
    const visibility = document.getElementById('lessonVisibility').value;

    // FIX → fileData replaced with URL.createObjectURL()
    let fileURL = null;

    if (fileInput.files[0]) {
        fileURL = URL.createObjectURL(fileInput.files[0]);
    }

    // save lesson
    user.lessons.push({
        title,
        description: desc,
        fileURL,
        visibility,
        createdAt: new Date().toISOString()
    });

    // reward points +10
    user.points = (user.points || 0) + 10;

    saveCurrentUser(user);

    uploadForm.reset();
    renderLessons();
});



// ---------------------- DELETE LESSON ----------------------
lessonsDiv.addEventListener('click', e => {
    if (e.target.classList.contains('delete-link')) {
        e.preventDefault();

        const idx = parseInt(e.target.dataset.index);
        const user = loadCurrentUser();
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        users.forEach(u => {
            if (u.email === user.email) {
                // lessons reversed while rendering → adjust index
                u.lessons.splice(u.lessons.length - 1 - idx, 1);
            }
        });

        localStorage.setItem('users', JSON.stringify(users));
        renderLessons();
    }
});
