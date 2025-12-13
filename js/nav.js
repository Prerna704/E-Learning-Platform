const navbar = document.getElementById('navbar');
function renderNavbar(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if(currentUser){
        navbar.innerHTML = `
            <nav>
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="courses.html">Courses</a>
                <a href="dashboard.html">Dashboard</a>
                <a href="#" id="logoutNav">Logout</a>
            </nav>
        `;
        document.getElementById('logoutNav').addEventListener('click', ()=>{
            localStorage.removeItem('currentUser');
            window.location.href='index.html';
        });
    } else {
        navbar.innerHTML = `
            <nav>
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="index.html">Login</a>
            </nav>
        `;
    }
}

renderNavbar();
