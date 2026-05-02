// Admin app: movie & review management using localStorage + sessionStorage
(function () {
    'use strict';

    // ----- Storage helpers -----
    function getUsers() {
        try { return JSON.parse(localStorage.getItem('users') || '[]'); } catch (e) { return []; }
    }
    function getMovies() {
        try { return JSON.parse(localStorage.getItem('movies') || '[]'); } catch (e) { return []; }
    }
    function setMovies(m) { localStorage.setItem('movies', JSON.stringify(m)); }
    function getReviews() {
        try { return JSON.parse(localStorage.getItem('reviews') || '[]'); } catch (e) { return []; }
    }
    function setReviews(r) { localStorage.setItem('reviews', JSON.stringify(r)); }

    function getCurrentUser() {
        try { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
    }

    // Ensure admin-only access: if not logged in or not admin, redirect to login
    function ensureAdmin() {
        const u = getCurrentUser();
        if (!u || !u.isAdmin) {
            // Clear any session and redirect
            sessionStorage.removeItem('currentUser');
            window.location.href = '../user/login.html';
            return false;
        }
        return true;
    }

    // Simple validators
    function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }
    function isValidYear(y) { const n = Number(y); const now = new Date().getFullYear(); return Number.isInteger(n) && n >= 1900 && n <= now + 1; }

    // Utility: generate stable unique id
    function generateId(prefix) {
        return (prefix || '') + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
    }

    // ----- Movies CRUD -----
    function addMovieFromForm(form) {
        const title = form.querySelector('#movie-title').value.trim();
        const genre = form.querySelector('#movie-genre').value;
        const year = Number(form.querySelector('#movie-year').value);
        const director = form.querySelector('#movie-director').value.trim();
        const description = form.querySelector('#movie-description').value.trim();

        // validations
        if (!isNonEmptyString(title)) { alert('Title is required'); return; }
        if (!isNonEmptyString(genre)) { alert('Genre is required'); return; }
        if (!isValidYear(year)) { alert('Please provide a valid release year'); return; }
        if (!isNonEmptyString(director)) { alert('Director is required'); return; }

        const movies = getMovies();
        const id = generateId('m_');
        const newMovie = { id, title, genre, release_year: year, director, description, createdAt: new Date().toISOString() };
        movies.push(newMovie);
        setMovies(movies);
        populateMoviesTable();
        populateMovieGrid();
        form.reset();
        alert('Movie added successfully');
    }

    function populateMoviesTable() {
        const tbody = document.querySelector('main table tbody');
        if (!tbody) return;
        const movies = getMovies();
        tbody.innerHTML = '';
        movies.forEach((m) => {
            const tr = document.createElement('tr');
            tr.dataset.id = m.id;
            tr.innerHTML = `
                <td>${m.id}</td>
                <td>${escapeHtml(m.title)}</td>
                <td>${escapeHtml(m.genre)}</td>
                <td>${m.release_year}</td>
                <td>${escapeHtml(m.director)}</td>
                <td>
                    <a href="#edit-${m.id}" class="btn btn-small" data-action="edit">Edit</a>
                    <a href="#delete-${m.id}" class="btn btn-small btn-danger" data-action="delete">Delete</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function populateMovieGrid() {
        const grid = document.querySelector('.movie-grid');
        if (!grid) return;
        const movies = getMovies();
        grid.innerHTML = '';
        // map movie titles to user detail pages
        const PAGE_MAP = {
            "Interstellar": "Interstellar.html",
            "The Equalizer": "TheEqualizer.html",
            "The Hunger Games": "TheHungerGames.html",
            "Fast And Furious": "Fast&Furious.html",
            "Ride Along": "RideAlong.html",
            "Train To Busan": "TrainToBusan.html",
            "Creed": "Creed.html"
        };

        movies.forEach(m => {
            const d = document.createElement('div'); d.className = 'movie';
            const img = document.createElement('img');
            // prefer `img` property but fall back to `poster` for compatibility
            img.src = m.img || m.poster || 'https://via.placeholder.com/180x270?text=No+Image';
            img.alt = m.title;
            const h3 = document.createElement('h3'); h3.textContent = m.title;
            d.appendChild(img); d.appendChild(h3);

            // Make the whole movie item clickable (no anchor element) to preview the movie detail page
            d.style.cursor = 'pointer';
            d.addEventListener('click', function () {
                try { sessionStorage.setItem('selectedMovie', JSON.stringify(m)); } catch (e) { /* ignore */ }
                const page = PAGE_MAP[m.title] ? ('../user/' + PAGE_MAP[m.title]) : '../user/movie_list.html';
                window.location.href = page;
            });

            grid.appendChild(d);
        });
    }

    function handleMoviesTableClick(e) {
        const a = e.target.closest('a[data-action]');
        if (!a) return;
        e.preventDefault();
        const action = a.dataset.action;
        const tr = a.closest('tr');
        const id = tr && tr.dataset.id;
        if (!id) return;
        if (action === 'edit') openEditMovie(id);
        if (action === 'delete') deleteMovie(id);
    }

    function openEditMovie(id) {
        const movies = getMovies();
            const m = movies.find(x => String(x.id) === String(id));
        if (!m) return alert('Movie not found');
        const editDiv = document.getElementById('edit-movie');
        if (!editDiv) return;
        editDiv.style.display = 'block';
        editDiv.querySelector('input[name="movie_id"]').value = m.id;
        editDiv.querySelector('#edit-title').value = m.title;
        editDiv.querySelector('#edit-genre').value = m.genre;
        editDiv.querySelector('#edit-year').value = m.release_year;
        editDiv.querySelector('#edit-director').value = m.director;
        editDiv.querySelector('#edit-description').value = m.description;
    }

    function deleteMovie(id) {
        if (!confirm('Delete this movie? This cannot be undone.')) return;
        let movies = getMovies();
        movies = movies.filter(m => String(m.id) !== String(id));
        setMovies(movies);
        populateMoviesTable();
        populateMovieGrid();
        alert('Movie deleted');
    }

    function handleEditFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('input[name="movie_id"]').value;
        const title = form.querySelector('#edit-title').value.trim();
        const genre = form.querySelector('#edit-genre').value;
        const year = Number(form.querySelector('#edit-year').value);
        const director = form.querySelector('#edit-director').value.trim();
        const description = form.querySelector('#edit-description').value.trim();

        if (!isNonEmptyString(title) || !isNonEmptyString(genre) || !isValidYear(year) || !isNonEmptyString(director)) {
            alert('Please complete all required fields with valid values');
            return;
        }

        const movies = getMovies();
            const idx = movies.findIndex(x => String(x.id) === String(id));
        if (idx === -1) return alert('Movie not found');
        movies[idx] = Object.assign({}, movies[idx], { title, genre, release_year: year, director, description, updatedAt: new Date().toISOString() });
        setMovies(movies);
        populateMoviesTable();
        populateMovieGrid();
        document.getElementById('edit-movie').style.display = 'none';
        alert('Movie updated');
    }

    // ----- Reviews management -----
    // populate reviews table. optional `statusFilter` can be 'pending'|'approved'|'rejected' or falsy for all
    function populateReviewsTable(statusFilter) {
        const tbody = document.querySelector('main table tbody');
        if (!tbody) return;
        let reviews = getReviews();
        if (statusFilter) {
            reviews = reviews.filter(r => String(r.status).toLowerCase() === String(statusFilter).toLowerCase());
        }
        tbody.innerHTML = '';
        reviews.forEach(rv => {
            const tr = document.createElement('tr');
            tr.dataset.id = rv.id;
            const movie = rv.movieId || (getMovies().find(m => String(m.id) === String(rv.movieId)) || {}).title || 'Unknown';
            tr.className = rv.status === 'pending' ? 'review-pending' : (rv.status === 'approved' ? 'review-approved' : 'review-rejected');
            tr.innerHTML = `
                <td>${rv.id}</td>
                <td>${escapeHtml(movie)}</td>
                <td>${escapeHtml(rv.username || rv.user || 'unknown')}</td>
                <td>${'⭐'.repeat(rv.rating || 0)}</td>
                <td>${escapeHtml(shorten(rv.text || ''))}</td>
                <td><span class="status ${rv.status}">${capitalize(rv.status)}</span></td>
                <td>${rv.status === 'pending' ? '<a href="#approve-'+rv.id+'" class="btn btn-small btn-success" data-action="approve">Approve</a> <a href="#reject-'+rv.id+'" class="btn btn-small btn-danger" data-action="reject">Reject</a>' : '<a href="#view-'+rv.id+'" class="btn btn-small" data-action="view">View</a>'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function handleReviewsClick(e) {
        const a = e.target.closest('a[data-action]');
        if (!a) return;
        e.preventDefault();
        const action = a.dataset.action;
        const tr = a.closest('tr');
        const id = tr && tr.dataset.id;
        if (!id) return;
        if (action === 'approve') approveReview(id);
        if (action === 'reject') openRejectModal(id);
        if (action === 'view') openReviewDetails(id);
    }

    function approveReview(id) {
        const reviews = getReviews();
        const idx = reviews.findIndex(r => r.id === id);
        if (idx === -1) return alert('Review not found');
        reviews[idx].status = 'approved';
        reviews[idx].moderatedAt = new Date().toISOString();
        reviews[idx].moderatedBy = getCurrentUser().username;
        setReviews(reviews);
        populateReviewsTable();
        updateStats();
        alert('Review approved');
    }

    function openRejectModal(id) {
        const modal = document.getElementById('reject-modal');
        if (!modal) return;
        modal.style.display = 'block';
        modal.querySelector('input[name="review_id"]').value = id;
    }

    function handleRejectForm(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('input[name="review_id"]').value;
        const reason = form.querySelector('#reject-reason').value.trim();
        if (!reason) { alert('Please provide a reason'); return; }
        const reviews = getReviews();
        const idx = reviews.findIndex(r => r.id === id);
        if (idx === -1) return alert('Review not found');
        reviews[idx].status = 'rejected';
        reviews[idx].rejectReason = reason;
        reviews[idx].moderatedAt = new Date().toISOString();
        reviews[idx].moderatedBy = getCurrentUser().username;
        setReviews(reviews);
        document.getElementById('reject-modal').style.display = 'none';
        populateReviewsTable();
        updateStats();
        alert('Review rejected');
    }

    function openReviewDetails(id) {
        const rv = getReviews().find(r => r.id === id);
        if (!rv) return alert('Review not found');
        const d = document.getElementById('review-details');
        if (!d) return;
        d.style.display = 'block';
            d.querySelector('#detail-movie').textContent = (getMovies().find(m => String(m.id) === String(rv.movieId)) || {}).title || rv.movie || 'Unknown';
        d.querySelector('#detail-user').textContent = rv.username || rv.user || 'unknown';
        d.querySelector('#detail-rating').textContent = (rv.rating || 0) + ' / 5';
        d.querySelector('#detail-review').textContent = rv.text || '';
        d.querySelector('#detail-status').textContent = capitalize(rv.status || '');
        d.querySelector('#detail-date').textContent = rv.createdAt || '';
    }

    // ----- Stats -----
    function updateStats() {
        const movies = getMovies();
        const reviews = getReviews();
        // assume .stats .stat ordering like admin_home.html
        const statEls = document.querySelectorAll('.stats .stat .number');
        if (statEls && statEls.length >= 4) {
            statEls[0].textContent = movies.length;
            statEls[1].textContent = reviews.filter(r => r.status === 'pending').length;
            statEls[2].textContent = reviews.filter(r => r.status === 'approved').length;
            statEls[3].textContent = reviews.filter(r => r.status === 'rejected').length;
        }
    }

    // ----- Helpers -----
    function escapeHtml(str) { return String(str).replace(/[&<>\\\"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
    function shorten(s, n = 120) { return s.length > n ? s.slice(0, n) + '...' : s; }
    function capitalize(s) { return s && s[0]?.toUpperCase() + s.slice(1); }

    // Attach listeners per page
    document.addEventListener('DOMContentLoaded', function () {
        // protect admin pages
        ensureAdmin();
        // wire logout links to clear session
        document.querySelectorAll('a[href$="login.html"]').forEach(a => {
            a.addEventListener('click', function () { sessionStorage.removeItem('currentUser'); });
        });

        // Page-specific initializations
        if (document.querySelector('#add-movie')) {
            const addForm = document.querySelector('#add-movie form');
            addForm.addEventListener('submit', function (e) { e.preventDefault(); addMovieFromForm(addForm); });
            document.querySelector('main table') && document.querySelector('main table').addEventListener('click', handleMoviesTableClick);
            const editForm = document.querySelector('#edit-movie form'); if (editForm) editForm.addEventListener('submit', handleEditFormSubmit);
            populateMoviesTable(); populateMovieGrid(); updateStats();
        }

        if (document.querySelector('.movie-grid')) {
            populateMovieGrid();
            // if page shows a table (admin_movie_list uses grid only) nothing else to do
        }

        if (document.querySelector('main .filter-tabs') || document.querySelector('main table') && document.querySelector('main table thead th').textContent.includes('Review')) {
            // reviews page
            const tbl = document.querySelector('main table'); if (tbl) tbl.addEventListener('click', handleReviewsClick);
            const rejectForm = document.querySelector('#reject-modal form'); if (rejectForm) rejectForm.addEventListener('submit', handleRejectForm);

            // wire filter tabs (they may include ?status=approved etc.)
            const tabs = document.querySelectorAll('.filter-tabs .filter-tab');
            function getStatusFromLink(a) {
                try {
                    const u = new URL(a.href, window.location.href);
                    return u.searchParams.get('status');
                } catch (e) { return null; }
            }
            tabs.forEach(t => {
                t.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    tabs.forEach(x => x.classList.remove('active'));
                    this.classList.add('active');
                    const status = getStatusFromLink(this);
                    populateReviewsTable(status);
                    updateStats();
                });
            });

            // On load, apply status from URL if present
            const params = new URL(window.location.href).searchParams;
            const initialStatus = params.get('status');
            if (initialStatus) {
                // mark matching tab active if any
                tabs.forEach(t => {
                    if (getStatusFromLink(t) === initialStatus) {
                        tabs.forEach(x => x.classList.remove('active'));
                        t.classList.add('active');
                    }
                });
            }

            populateReviewsTable(initialStatus);
            updateStats();
        }

        // For admin_home stats
        if (document.querySelector('.stats')) updateStats();

        // ensure some sample data exists so admin and user pages show the same movie set
        (function ensureSampleData() {
            // default movie set (matches project files)
            function getDefaultMovies() {
                return [
                    { id: 'm_interstellar', title: 'Interstellar', genre: 'Drama', release_year: 2014, director: 'Christopher Nolan', description: 'Space epic', img: '../Images/Interstellar.png', createdAt: new Date().toISOString() },
                    { id: 'm_equalizer', title: 'The Equalizer', genre: 'Action', release_year: 2014, director: 'Antoine Fuqua', description: 'Vigilante action', img: '../Images/TheEqualizer.png', createdAt: new Date().toISOString() },
                    { id: 'm_hungergames', title: 'The Hunger Games', genre: 'Action', release_year: 2014, director: 'Gary Ross', description: 'Dystopian action', img: '../Images/TheHungerGames.png', createdAt: new Date().toISOString() },
                    { id: 'm_fast', title: 'Fast And Furious', genre: 'Action', release_year: 2017, director: 'Justin Lin', description: 'Car action', img: '../Images/Fast&Furious.png', createdAt: new Date().toISOString() },
                    { id: 'm_creed', title: 'Creed', genre: 'Drama', release_year: 2016, director: 'Ryan Coogler', description: 'Boxing drama', img: '../Images/Creed.png', createdAt: new Date().toISOString() },
                    { id: 'm_ride', title: 'Ride Along', genre: 'Comedy', release_year: 2014, director: 'Tim Story', description: 'Buddy cop comedy', img: '../Images/RideAlong.png', createdAt: new Date().toISOString() },
                    { id: 'm_train', title: 'Train To Busan', genre: 'Action', release_year: 2016, director: 'Yeon Sang-ho', description: 'Zombie thriller', img: '../Images/TrainToBusan.png', createdAt: new Date().toISOString() }
                ];
            }

            const defaults = getDefaultMovies();
            let existing = getMovies();
            // merge defaults (add missing by title)
            let added = false;
            defaults.forEach(d => {
                if (!existing.some(m => (m.title || '').toLowerCase() === (d.title || '').toLowerCase())) {
                    existing.push(d);
                    added = true;
                }
            });
            if (added) setMovies(existing);

            if (getReviews().length === 0) {
                const sampleR = [
                    { id: 'r1', movieId: 'm_train', username: 'john_doe', rating: 5, text: 'Amazing zombie movie!', status: 'pending', createdAt: new Date().toISOString() },
                    { id: 'r2', movieId: 'm_creed', username: 'movie_fan_23', rating: 4, text: 'Great continuation of the Rocky franchise.', status: 'pending', createdAt: new Date().toISOString() }
                ];
                setReviews(sampleR);
            }

            // Populate only the relevant tables for the current page so one page doesn't overwrite another
            if (document.querySelector('#add-movie')) {
                populateMoviesTable();
                populateMovieGrid();
            }

            if (document.getElementById('reject-modal') || document.getElementById('review-details')) {
                populateReviewsTable();
            }

            updateStats();
        })();
    });

})();
