// Toggle forms
const signupSection = document.getElementById('signupSection');
const loginSection = document.getElementById('loginSection');

document.getElementById('showLogin').addEventListener('click', ()=>{
  signupSection.style.display='none';
  loginSection.style.display='block';
});

document.getElementById('showSignup').addEventListener('click', ()=>{
  signupSection.style.display='block';
  loginSection.style.display='none';
});

function loadUsers(){ return JSON.parse(localStorage.getItem('users')||'[]'); }
function saveUsers(users){ localStorage.setItem('users', JSON.stringify(users)); }

// Sign Up
document.getElementById('signupForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const users = loadUsers();

  if(users.find(u=>u.email===email)){ alert('Email already registered'); return; }
  users.push({name,email,password,lessons:[],points:0});
  saveUsers(users);
  alert('Registration successful!'); signupSection.style.display='none';
  loginSection.style.display='block';
});

// Sign In
document.getElementById('signinForm').addEventListener('submit', e=>{
  e.preventDefault();
  const email=document.getElementById('signinEmail').value.trim();
  const password=document.getElementById('signinPassword').value.trim();
  const users=loadUsers();
  const user=users.find(u=>u.email===email&&u.password===password);

  if(user){
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href='courses.html';
  } else alert('Invalid credentials');
});
