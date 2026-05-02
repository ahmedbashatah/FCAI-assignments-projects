document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('my-reviews');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Update navigation for guest/auth users
    (function updateNavBar() {
        const navUser = document.querySelector(".nav-user");
        const cu = currentUser || JSON.parse(sessionStorage.getItem('currentUser'));
        if (!navUser) return;
        if (!cu) {
            navUser.innerHTML = `
                <a href="../user/login.html">Login</a>
                <a href="../user/register.html">Register</a>
                <a href="../user/movie_list.html">Movies</a>
            `;
            return;
        }
        if (cu.isGuest) {
            navUser.innerHTML = `
                <a href="../user/movie_list.html">Movies</a>
                <a href="../user/search.html">Search</a>
                <a href="../user/login.html">Login</a>
            `;
            return;
        }
        if (cu.isAdmin === true) {
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
    })();

    if (!currentUser || currentUser.isGuest) {
        container.innerHTML = `<p>Please <a href="../user/login.html">log in</a> to see your reviews.</p>`;
        return;
    }

    function loadMovies() {
        try { return JSON.parse(localStorage.getItem('movies') || '[]'); } catch (e) { return []; }
    }

    function loadReviews() {
        try { return JSON.parse(localStorage.getItem('reviews') || '[]'); } catch (e) { return []; }
    }

    function getMovieTitle(movieId) {
        const movies = loadMovies();
        const byId = movies.find(m => String(m.id) === String(movieId));
        if (byId) return byId.title;
        const byTitle = movies.find(m => m.title === movieId);
        if (byTitle) return byTitle.title;
        return movieId || 'Unknown Movie';
    }

    function render() {
        const all = loadReviews();
        const mine = all.filter(r => r.username === currentUser.username);
        if (!mine.length) {
            container.innerHTML = '<p>You have not written any reviews yet.</p>';
            return;
        }

        container.innerHTML = '';
        mine.forEach(r => {
            const div = document.createElement('div');
            div.className = 'my-review';
            div.dataset.id = r.id;
            div.innerHTML = `
                <h3>${getMovieTitle(r.movieId)}</h3>
                <div class="review-meta">${'⭐'.repeat(r.rating)} — <strong>${r.status}</strong></div>
                <p>${r.text}</p>
                <div class="review-actions">
                    <button class="btn btn-small" data-action="delete">Delete</button>
                </div>
                <hr>
            `;
            container.appendChild(div);
        });
    }

    // Delete handler
    container.addEventListener('click', function (e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const reviewDiv = btn.closest('.my-review');
        if (!reviewDiv) return;
        const id = reviewDiv.dataset.id;
        if (action === 'delete') {
            if (!confirm('Delete this review?')) return;
            const all = loadReviews();
            const filtered = all.filter(r => r.id !== id);
            localStorage.setItem('reviews', JSON.stringify(filtered));
            render();
            alert('Review deleted');
        }
    });

    render();

    // Keep view updated when storage changes
    window.addEventListener('storage', function (e) {
        if (e.key === 'reviews') render();
    });

    // Clear session on logout link click
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a[href$="login.html"]');
        if (a) sessionStorage.removeItem('currentUser');
    });
});
