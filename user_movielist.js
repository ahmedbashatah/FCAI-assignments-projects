// Load movies
function loadMovies() {
    return JSON.parse(localStorage.getItem("movies")) || [];
}

// Render movie grid
function renderMovies(movies) {
    const container = document.querySelector(".movie-grid");
    container.innerHTML = "";

    const PAGE_MAP = {
        "Interstellar": "Interstellar.html",
        "The Equalizer": "TheEqualizer.html",
        "The Hunger Games": "TheHungerGames.html",
        "Fast And Furious": "Fast&Furious.html",
        "Ride Along": "RideAlong.html",
        "Train To Busan": "TrainToBusan.html",
        "Creed": "Creed.html"
    };

    movies.forEach(movie => {
        const box = document.createElement("div");
        box.classList.add("movie");

        box.innerHTML = `
            <img src="${movie.img}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;

        box.addEventListener("click", () => {
            sessionStorage.setItem("selectedMovie", JSON.stringify(movie));
            const page = PAGE_MAP[movie.title] || "movie_list.html";
            window.location.href = page;
        });

        container.appendChild(box);
    });
}

// MAIN SEARCH FUNCTION
function searchMovies() {
    const title = document.getElementById("search-title").value.toLowerCase();
    const genre = document.getElementById("search-genre").value;
    const year = document.getElementById("search-year").value.trim();
    const director = document.getElementById("search-director").value.toLowerCase();

    let movies = loadMovies();

    const filtered = movies.filter(m => {
        const matchTitle = m.title.toLowerCase().includes(title);
        const matchGenre = genre === "All" || m.genre === genre;
        const matchYear = year === "" || m.year == year;
        const matchDirector = !m.director
            ? true
            : m.director.toLowerCase().includes(director);

        return matchTitle && matchGenre && matchYear && matchDirector;
    });

    renderMovies(filtered);
}

// CLEAR SEARCH
function clearSearch() {
    document.getElementById("search-title").value = "";
    document.getElementById("search-genre").value = "All";
    document.getElementById("search-year").value = "";
    document.getElementById("search-director").value = "";

    renderMovies(loadMovies());
}

// PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    renderMovies(loadMovies());

    document.getElementById("btn-search").addEventListener("click", searchMovies);
    document.getElementById("btn-clear").addEventListener("click", clearSearch);
    // Clear session on logout link click
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a[href$="login.html"]');
        if (a) sessionStorage.removeItem('currentUser');
    });

    // Update navigation for guest/auth users
    function updateNavBar() {
        const navUser = document.querySelector(".nav-user");
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (!navUser) return;
        if (!currentUser) {
            navUser.innerHTML = `
                <a href="../user/login.html">Login</a>
                <a href="../user/register.html">Register</a>
                <a href="../user/movie_list.html">Movies</a>
            `;
            return;
        }
        if (currentUser.isGuest) {
            navUser.innerHTML = `
                <a href="../user/movie_list.html">Movies</a>
                <a href="../user/search.html">Search</a>
                <a href="../user/login.html">Login</a>
            `;
            return;
        }
        if (currentUser.isAdmin === true) {
            navUser.innerHTML = `
                <a href="../admin/admin_home.html">Admin Dashboard</a>
                <a href="../user/movie_list.html">Movies</a>
                <a href="../user/login.html">Logout</a>
            `;
            return;
        }
        navUser.innerHTML = `
            <a href="../user/home.html">Dashboard</a>
            <a href="../user/MyReviews.html">My Reviews</a>
            <a href="../user/search.html">Search</a>
            <a href="../user/movie_list.html">Movies</a>
            <a href="../user/login.html">Logout</a>
        `;
    }

    updateNavBar();
});
