/* =========================================================
   VYBE — Unified Video Streaming Platform
   HTML + CSS + JavaScript only (no backend, no frameworks)
   ========================================================= */

(function () {
"use strict";


/* =========================================================
   1. DEFAULT DATA
   ========================================================= */

var defaultUsers = [
    { id: 1, name: "Aarav Sharma", email: "aarav@gmail.com",  password: "123456",   role: "user"  },
    { id: 2, name: "Ananya Reddy", email: "ananya@gmail.com", password: "123456",   role: "user"  },
    { id: 3, name: "VYBE Admin",   email: "admin@vybe.com",   password: "admin123", role: "admin" }
];

var defaultContent = [
    {
        id: 1,
        title: "Kalki 2898 AD",
        category: "Movies",
        creator: "Nag Ashwin",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
        description: "A futuristic Indian science-fiction cinematic experience.",
        duration: "2h 58m",
        year: 2024,
        trailer: "https://www.youtube.com/watch?v=dILuezzeAzk"
    },
    {
        id: 2,
        title: "Sita Ramam",
        category: "Movies",
        creator: "Hanu Raghavapudi",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
        description: "A romantic period story filled with letters, memories and emotions.",
        duration: "2h 43m",
        year: 2022,
        trailer: "https://www.youtube.com/watch?v=Ljk6tGZ1l3A"
    },
    {
        id: 3,
        title: "Cricket Match Highlights",
        category: "Sports",
        creator: "VYBE Sports",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
        description: "Catch the biggest moments and highlights from the cricket world.",
        duration: "48m",
        year: 2025,
        trailer: "https://www.youtube.com/watch?v=YqKYpgZ9FWU"
    },
    {
        id: 4,
        title: "F1 Race Highlights",
        category: "Sports",
        creator: "VYBE Racing",
        image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800",
        description: "Fast-paced Formula 1 race highlights and analysis.",
        duration: "36m",
        year: 2025,
        trailer: "https://www.youtube.com/watch?v=IiaVcT3SZv0"
    },
    {
        id: 5,
        title: "Telugu Music Collection",
        category: "Music",
        creator: "VYBE Music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        description: "Explore popular Telugu music, performances and playlists.",
        duration: "1h 12m",
        year: 2025,
        trailer: "https://www.youtube.com/watch?v=AN8-o7ckg6k"
    },
    {
        id: 6,
        title: "Live Concert 2026",
        category: "Music",
        creator: "VYBE Live",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
        description: "Experience an energetic live music performance.",
        duration: "1h 40m",
        year: 2026,
        trailer: "https://www.youtube.com/watch?v=UEqTIwRrWvA"
    },
    {
        id: 7,
        title: "Tech Explained",
        category: "Creators",
        creator: "Rahul Varma",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        description: "Technology explained in a simple and engaging way.",
        duration: "22m",
        year: 2025,
        trailer: "https://www.youtube.com/watch?v=_zfN9wnPvU0"
    },
    {
        id: 8,
        title: "College Life Vlog",
        category: "Creators",
        creator: "Kavya Rao",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
        description: "A creator's journey through college life and experiences.",
        duration: "18m",
        year: 2025,
        trailer: "https://www.youtube.com/watch?v=XjLUkplSWhk"
    },
    {
        id: 9,
        title: "Teliseney naa nuvvey Cover song",
        category: "Creators",
        creator: "Student Stories Co.",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
        description: "A cover performance of \"Teliseney Naa Nuvvey\", shared by our creator community.",
        duration: "4m",
        year: 2024,
        trailer: "https://drive.google.com/file/d/1dpybatArR4fsBcRnLpwIZxt7epXMbnv-/view?usp=drive_link"
    },
    {
        id: 10,
        title: "Football World",
        category: "Sports",
        creator: "VYBE Sports",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
        description: "Football highlights, analysis and memorable moments.",
        duration: "52m",
        year: 2025,
        trailer: "https://youtu.be/Xbizke4zftY?si=8Am46eRs4-tDqYOL"
    }
];

/* Pulls an 11-character YouTube video ID out of any common URL shape
   (watch?v=, youtu.be/, /embed/, with or without extra query params). */
function extractYouTubeId(url) {
    if (!url) return null;
    var match = String(url).match(
        /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return match ? match[1] : null;
}

/* Pulls the file ID out of any common Google Drive share-link shape:
   /file/d/FILE_ID/..., ?id=FILE_ID, or a bare /open?id=FILE_ID. */
function extractDriveFileId(url) {
    if (!url) return null;
    var s = String(url);
    var match = s.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
    if (match) return match[1];
    match = s.match(/[?&]id=([A-Za-z0-9_-]+)/);
    if (match && /drive\.google\.com|docs\.google\.com/.test(s)) return match[1];
    return null;
}

/* Identifies which embeddable source a trailer URL points to.
   Returns { type: "youtube"|"drive", id } or null if neither matches. */
function identifyTrailerSource(url) {
    var ytId = extractYouTubeId(url);
    if (ytId) return { type: "youtube", id: ytId };
    var driveId = extractDriveFileId(url);
    if (driveId) return { type: "drive", id: driveId };
    return null;
}

var FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800";


/* =========================================================
   2. STORAGE LAYER
   Every read is guarded so a corrupted or blocked
   localStorage can never break the app.
   ========================================================= */

var KEYS = {
    users:     "vybeUsers",
    content:   "vybeContent",
    watchlist: "vybeWatchlist",
    likes:     "vybeLikes",
    history:   "vybeHistory",
    session:   "vybeCurrentUser",
    section:   "vybeLastSection",
    seedVer:   "vybeSeedVersion"
};

/* Bump this whenever defaultContent above changes — title edits, new
   trailers, new fields, anything. Every visitor's saved catalogue gets
   re-synced against the current seed once their stored version falls
   behind, so edits here always show up without needing localStorage
   cleared by hand. */
var SEED_VERSION = 3;

var memoryStore = {};          /* fallback when localStorage is unavailable */
var storageWorks = (function () {
    try {
        window.localStorage.setItem("__vybe__", "1");
        window.localStorage.removeItem("__vybe__");
        return true;
    } catch (err) {
        return false;
    }
})();

function readRaw(key) {
    if (!storageWorks) {
        return Object.prototype.hasOwnProperty.call(memoryStore, key)
            ? memoryStore[key]
            : null;
    }
    try {
        return window.localStorage.getItem(key);
    } catch (err) {
        return null;
    }
}

function writeRaw(key, value) {
    if (!storageWorks) {
        memoryStore[key] = value;
        return;
    }
    try {
        window.localStorage.setItem(key, value);
    } catch (err) {
        memoryStore[key] = value;
    }
}

function removeRaw(key) {
    delete memoryStore[key];
    if (!storageWorks) return;
    try {
        window.localStorage.removeItem(key);
    } catch (err) { /* ignore */ }
}

function readJSON(key, fallback) {
    var raw = readRaw(key);
    if (raw === null || raw === undefined) return fallback;
    try {
        var parsed = JSON.parse(raw);
        return parsed === null ? fallback : parsed;
    } catch (err) {
        return fallback;
    }
}

function writeJSON(key, value) {
    writeRaw(key, JSON.stringify(value));
}

function initializeStorage() {
    if (!Array.isArray(readJSON(KEYS.users, null)))     writeJSON(KEYS.users, defaultUsers);
    if (!Array.isArray(readJSON(KEYS.content, null)))   writeJSON(KEYS.content, defaultContent);
    if (!Array.isArray(readJSON(KEYS.watchlist, null))) writeJSON(KEYS.watchlist, []);
    if (!Array.isArray(readJSON(KEYS.likes, null)))     writeJSON(KEYS.likes, []);
    if (!Array.isArray(readJSON(KEYS.history, null)))   writeJSON(KEYS.history, []);
}

initializeStorage();
migrateStoredContent();


/* =========================================================
   3. HELPERS
   ========================================================= */

function getUsers()            { return readJSON(KEYS.users, []); }
function saveUsers(v)          { writeJSON(KEYS.users, v); }

function getContent()          { return readJSON(KEYS.content, []); }
function saveContent(v)        { writeJSON(KEYS.content, v); }

function getWatchlist()        { return readJSON(KEYS.watchlist, []); }
function saveWatchlist(v)      { writeJSON(KEYS.watchlist, v); }

function getLikes()            { return readJSON(KEYS.likes, []); }
function saveLikes(v)          { writeJSON(KEYS.likes, v); }

function getHistory()          { return readJSON(KEYS.history, []); }
function saveHistory(v)        { writeJSON(KEYS.history, v); }

function getCurrentUser()      { return readJSON(KEYS.session, null); }
function setCurrentUser(u)     { writeJSON(KEYS.session, u); }
function clearCurrentUser()    { removeRaw(KEYS.session); }

/* Escapes user/admin supplied text before it goes into innerHTML. */
function esc(value) {
    return String(value === undefined || value === null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function $(id) {
    return document.getElementById(id);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isValidUrl(value) {
    return /^https?:\/\/\S+$/i.test(value);
}

function setMessage(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.className = "message" + (kind ? " " + kind : "");
}

/* Keeps everyone's saved catalogue in sync with the seed data above.
   Whenever SEED_VERSION is bumped (any edit to defaultContent — a
   renamed title, a new trailer, a fixed description), every item whose
   id matches a seed item is fully replaced with the current seed
   version, so the fix shows up for returning visitors automatically.
   Items with no matching id — anything an admin added through the
   dashboard — are left completely untouched. */
function migrateStoredContent() {

    var storedVersion = Number(readRaw(KEYS.seedVer)) || 0;
    if (storedVersion >= SEED_VERSION) return;

    var stored = getContent();

    var seedById = {};
    defaultContent.forEach(function (item) { seedById[item.id] = item; });

    var synced = stored.map(function (item) {
        var seed = seedById[item.id];
        return seed ? Object.assign({}, seed) : item;
    });

    saveContent(synced);
    writeRaw(KEYS.seedVer, String(SEED_VERSION));
}

/* Removes watchlist / like / history rows that point at
   content or users that no longer exist. */
function pruneOrphans() {
    var contentIds = {};
    getContent().forEach(function (item) { contentIds[item.id] = true; });

    var userIds = {};
    getUsers().forEach(function (user) { userIds[user.id] = true; });

    function keep(row) {
        return contentIds[row.contentId] === true && userIds[row.userId] === true;
    }

    saveWatchlist(getWatchlist().filter(keep));
    saveLikes(getLikes().filter(keep));
    saveHistory(getHistory().filter(keep));
}


/* =========================================================
   4. TOASTS
   ========================================================= */

var toastStack = $("toastStack");

function toast(text, kind) {
    if (!toastStack) return;

    var el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = text;
    toastStack.appendChild(el);

    window.setTimeout(function () {
        el.style.opacity = "0";
        window.setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 220);
    }, 2200);
}


/* =========================================================
   5. PAGE ELEMENTS
   ========================================================= */

var authPage    = $("authPage");
var userApp     = $("userApp");
var adminApp    = $("adminApp");

var loginBox    = $("loginBox");
var registerBox = $("registerBox");

var loginForm    = $("loginForm");
var registerForm = $("registerForm");

var loginMessage    = $("loginMessage");
var registerMessage = $("registerMessage");

var navButtons  = Array.prototype.slice.call(document.querySelectorAll(".nav-btn"));
var pageSections = Array.prototype.slice.call(document.querySelectorAll(".page-section"));

var searchPageInput    = $("searchPageInput");
var searchResultsGrid  = $("searchResultsGrid");
var clearSearchBtn     = $("clearSearchBtn");
var searchResultsTitle = $("searchResultsTitle");
var searchResultsCount = $("searchResultsCount");

var contentModal = $("contentModal");
var playerModal  = $("playerModal");
var profileModal = $("profileModal");

var likeBtn      = $("likeBtn");
var modalSaveBtn = $("saveBtn");

var selectedContentId = null;
var activeFilter = "All";


/* =========================================================
   6. AUTH — SWITCHING BETWEEN LOGIN AND REGISTER
   ========================================================= */

$("showRegister").addEventListener("click", function () {
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
    setMessage(loginMessage, "");
    $("registerName").focus();
});

$("showLogin").addEventListener("click", function () {
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
    setMessage(registerMessage, "");
    $("loginEmail").focus();
});


/* =========================================================
   7. REGISTRATION
   ========================================================= */

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var name            = $("registerName").value.trim();
    var email           = $("registerEmail").value.trim().toLowerCase();
    var password        = $("registerPassword").value;
    var confirmPassword = $("confirmPassword").value;

    if (name.length < 2) {
        setMessage(registerMessage, "Enter your full name.", "error");
        return;
    }

    if (!isValidEmail(email)) {
        setMessage(registerMessage, "Enter a valid email address.", "error");
        return;
    }

    if (password.length < 6) {
        setMessage(registerMessage, "Use a password of at least 6 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        setMessage(registerMessage, "The two passwords don't match.", "error");
        return;
    }

    var users = getUsers();

    var exists = users.some(function (user) {
        return String(user.email).toLowerCase() === email;
    });

    if (exists) {
        setMessage(registerMessage, "That email is already registered. Log in instead.", "error");
        return;
    }

    users.push({
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: "user"
    });

    saveUsers(users);

    registerForm.reset();
    setMessage(registerMessage, "");

    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

    $("loginEmail").value = email;
    $("loginPassword").value = "";
    $("loginPassword").focus();

    setMessage(loginMessage, "Account created. Log in to continue.", "ok");
    toast("Account created");
});


/* =========================================================
   8. LOGIN
   ========================================================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var email    = $("loginEmail").value.trim().toLowerCase();
    var password = $("loginPassword").value;

    if (!email || !password) {
        setMessage(loginMessage, "Enter your email and password.", "error");
        return;
    }

    var user = getUsers().find(function (u) {
        return String(u.email).toLowerCase() === email && u.password === password;
    });

    if (!user) {
        setMessage(loginMessage, "That email and password don't match an account.", "error");
        return;
    }

    setCurrentUser(user);
    setMessage(loginMessage, "");
    loginForm.reset();

    if (user.role === "admin") {
        showAdminApp();
        toast("Signed in as admin");
    } else {
        showUserApp();
        toast("Welcome back, " + user.name.split(" ")[0]);
    }
});


/* Admin shortcut — prefills the demo admin email. */
$("adminLoginBtn").addEventListener("click", function (event) {

    event.preventDefault();

    $("loginEmail").value = "admin@vybe.com";
    $("loginPassword").value = "";
    $("loginPassword").focus();

    setMessage(loginMessage, "Enter the admin password to continue.", "info");
});


/* =========================================================
   9. APP SHELL
   ========================================================= */

function showUserApp() {

    authPage.classList.add("hidden");
    adminApp.classList.add("hidden");
    userApp.classList.remove("hidden");

    pruneOrphans();
    renderAllContent();
    renderHero();
    updateProfile();

    var last = readRaw(KEYS.section);
    goToSection(last && $(last) ? last : "homeSection");
}


function showAdminApp() {

    authPage.classList.add("hidden");
    userApp.classList.add("hidden");
    adminApp.classList.remove("hidden");

    pruneOrphans();
    renderAdminDashboard();
}


function logout() {

    clearCurrentUser();
    removeRaw(KEYS.section);
    closeAllModals();

    userApp.classList.add("hidden");
    adminApp.classList.add("hidden");
    authPage.classList.remove("hidden");

    loginForm.reset();
    registerForm.reset();

    setMessage(loginMessage, "");
    setMessage(registerMessage, "");

    loginBox.classList.remove("hidden");
    registerBox.classList.add("hidden");

    toast("Logged out");
}

$("logoutBtn").addEventListener("click", logout);
$("adminLogoutBtn").addEventListener("click", logout);


/* =========================================================
   10. NAVIGATION
   ========================================================= */

function goToSection(target) {

    if (!$(target)) target = "homeSection";

    pageSections.forEach(function (section) {
        section.classList.add("hidden");
    });

    $(target).classList.remove("hidden");

    navButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.section === target);
    });

    writeRaw(KEYS.section, target);
    window.scrollTo({ top: 0, behavior: "auto" });

    if (target === "moviesSection")   renderCategory("Movies",   "moviesGrid");
    if (target === "sportsSection")   renderCategory("Sports",   "sportsGrid");
    if (target === "musicSection")    renderCategory("Music",    "musicGrid");
    if (target === "creatorsSection") renderCategory("Creators", "creatorsGrid");
    if (target === "watchlistSection") renderWatchlist();

    if (target === "searchSection") {
        renderSearchResults(searchPageInput ? searchPageInput.value : "");
        if (searchPageInput) searchPageInput.focus();
    }

    if (target === "homeSection") {
        renderHome();
        renderHero();
    }
}

navButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        goToSection(button.dataset.section);
    });
});


/* =========================================================
   11. CONTENT CARD
   ========================================================= */

function createContentCard(item) {

    return '' +
        '<article class="content-card">' +

            '<div class="content-image-wrap">' +
                '<img src="' + esc(item.image) + '"' +
                     ' alt="' + esc(item.title) + '"' +
                     ' class="content-image" loading="lazy"' +
                     ' data-fallback="1">' +
                (item.trailer
                    ? '<span class="trailer-badge">▶ Trailer</span>'
                    : '') +
            '</div>' +

            '<div class="content-info">' +

                '<span class="content-category">' + esc(item.category) + '</span>' +

                '<h3 class="content-title">' + esc(item.title) + '</h3>' +

                '<p class="content-creator">' + esc(item.creator) +
                    (item.duration ? ' · ' + esc(item.duration) : '') +
                '</p>' +

                '<div class="card-buttons">' +

                    '<button class="view-btn" type="button"' +
                            ' data-action="view" data-id="' + esc(item.id) + '">' +
                        'View' +
                    '</button>' +

                    '<button class="save-card-btn" type="button"' +
                            ' data-action="save" data-id="' + esc(item.id) + '"' +
                            ' data-content-id="' + esc(item.id) + '">' +
                        '+ Save' +
                    '</button>' +

                '</div>' +

            '</div>' +

        '</article>';
}


/* Broken image URLs fall back once, without an inline handler. */
document.addEventListener("error", function (event) {
    var el = event.target;
    if (el && el.tagName === "IMG" && el.dataset.fallback === "1") {
        el.dataset.fallback = "0";
        el.src = FALLBACK_IMAGE;
    }
}, true);


/* Single delegated handler for every generated button. */
document.addEventListener("click", function (event) {

    var btn = event.target.closest("[data-action]");
    if (!btn) return;

    var id = Number(btn.dataset.id);
    if (!id) return;

    if (btn.dataset.action === "view")   openContent(id);
    if (btn.dataset.action === "save")   toggleWatchlist(id);
    if (btn.dataset.action === "delete") deleteContent(id);
});


/* =========================================================
   12. RENDERING
   ========================================================= */

function renderGrid(elementId, items, emptyText) {

    var container = $(elementId);
    if (!container) return;

    if (!items.length) {
        container.innerHTML = "<p>" + esc(emptyText) + "</p>";
        return;
    }

    container.innerHTML = items.map(createContentCard).join("");
    updateSaveButtons();
}


function renderHome() {

    var content = getContent();
    var user    = getCurrentUser();

    /* Continue watching — most recent plays by this user. */
    var history = user
        ? getHistory()
            .filter(function (row) { return row.userId === user.id; })
            .sort(function (a, b) { return b.at - a.at; })
        : [];

    var continueItems = [];
    history.forEach(function (row) {
        var match = content.find(function (item) { return item.id === row.contentId; });
        if (match && continueItems.indexOf(match) === -1) continueItems.push(match);
    });

    var continueSection = $("continueGrid") ? $("continueGrid").closest(".content-section") : null;
    if (continueSection) {
        continueSection.classList.toggle("hidden", continueItems.length === 0);
    }
    if (continueItems.length) {
        renderGrid("continueGrid", continueItems.slice(0, 6), "");
    }

    /* Trending — a stable rotation of the catalogue. */
    renderGrid("trendingGrid", content.slice(0, 6), "Nothing here yet.");

    /* Recommended — same categories as the things you liked or saved. */
    renderGrid("recommendedGrid", recommendFor(user, content), "Nothing here yet.");
}


function recommendFor(user, content) {

    if (!user) return content.slice(4, 10);

    var signals = getLikes()
        .concat(getWatchlist())
        .filter(function (row) { return row.userId === user.id; });

    var likedCategories = {};
    signals.forEach(function (row) {
        var match = content.find(function (item) { return item.id === row.contentId; });
        if (match) likedCategories[match.category] = true;
    });

    var savedIds = {};
    signals.forEach(function (row) { savedIds[row.contentId] = true; });

    var picks = content.filter(function (item) {
        return likedCategories[item.category] && !savedIds[item.id];
    });

    if (picks.length < 4) {
        content.forEach(function (item) {
            if (picks.length < 6 && picks.indexOf(item) === -1 && !savedIds[item.id]) {
                picks.push(item);
            }
        });
    }

    return picks.slice(0, 6);
}


function renderHero() {

    var content = getContent();
    if (!content.length) return;

    /* Featured title rotates daily so the home page isn't static. */
    var index = new Date().getDate() % content.length;
    var featured = content[index];

    var hero = $("heroBanner");
    if (hero) {
        hero.style.setProperty("--hero-image", 'url("' + featured.image + '")');
    }

    if ($("heroTag"))   $("heroTag").textContent   = "Featured " + featured.category.toLowerCase();
    if ($("heroTitle")) $("heroTitle").textContent = featured.title;
    if ($("heroText"))  $("heroText").textContent  = featured.description;

    if ($("heroWatchBtn")) $("heroWatchBtn").dataset.id = featured.id;
}


$("heroWatchBtn").addEventListener("click", function () {
    var id = Number(this.dataset.id);
    if (id) openContent(id);
});

$("heroExploreBtn").addEventListener("click", function () {
    goToSection("searchSection");
});


function renderAllContent() {

    renderHome();

    renderCategory("Movies",   "moviesGrid");
    renderCategory("Sports",   "sportsGrid");
    renderCategory("Music",    "musicGrid");
    renderCategory("Creators", "creatorsGrid");

    renderWatchlist();

    if (searchResultsGrid && !$("searchSection").classList.contains("hidden")) {
        renderSearchResults(searchPageInput ? searchPageInput.value : "");
    }

    updateSaveButtons();
}


function renderCategory(category, elementId) {

    var items = getContent().filter(function (item) {
        return item.category === category;
    });

    renderGrid(elementId, items, "Nothing in " + category.toLowerCase() + " yet.");
}


/* =========================================================
   13. SEARCH
   ========================================================= */

function renderSearchResults(searchTerm) {

    if (!searchResultsGrid) return;

    var term = String(searchTerm || "").trim().toLowerCase();
    var results = getContent();

    if (activeFilter !== "All") {
        results = results.filter(function (item) {
            return item.category === activeFilter;
        });
    }

    if (term !== "") {
        results = results.filter(function (item) {
            return (
                String(item.title).toLowerCase().indexOf(term) !== -1 ||
                String(item.category).toLowerCase().indexOf(term) !== -1 ||
                String(item.creator).toLowerCase().indexOf(term) !== -1 ||
                String(item.description).toLowerCase().indexOf(term) !== -1
            );
        });
    }

    results.sort(function (a, b) {
        return String(a.title).localeCompare(String(b.title), undefined, { sensitivity: "base" });
    });

    if (searchResultsTitle) {
        searchResultsTitle.textContent = term === ""
            ? (activeFilter === "All" ? "Explore VYBE" : activeFilter)
            : 'Results for "' + searchTerm.trim() + '"';
    }

    if (searchResultsCount) {
        searchResultsCount.textContent = results.length === 1
            ? "1 title"
            : results.length + " titles";
    }

    if (!results.length) {
        searchResultsGrid.innerHTML =
            '<div class="no-search-results">' +
                '<div class="no-search-icon">⌕</div>' +
                '<h3>No matches</h3>' +
                '<p>Try a different title, creator or category.</p>' +
            '</div>';
        return;
    }

    searchResultsGrid.innerHTML = results.map(createContentCard).join("");
    updateSaveButtons();
}


if (searchPageInput) {
    searchPageInput.addEventListener("input", function () {
        renderSearchResults(searchPageInput.value);
    });
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", function () {
        searchPageInput.value = "";
        renderSearchResults("");
        searchPageInput.focus();
    });
}

var searchFilters = $("searchFilters");
if (searchFilters) {
    searchFilters.addEventListener("click", function (event) {

        var chip = event.target.closest(".filter-chip");
        if (!chip) return;

        activeFilter = chip.dataset.filter;

        Array.prototype.forEach.call(searchFilters.children, function (el) {
            el.classList.toggle("active", el === chip);
        });

        renderSearchResults(searchPageInput ? searchPageInput.value : "");
    });
}


/* =========================================================
   14. MODALS
   ========================================================= */

function openModal(modal) {
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.classList.add("no-scroll");
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.add("hidden");
    if (modal === playerModal) {
        stopTrailer();
        var stage = $("playerStage");
        if (stage) stage.innerHTML = "";
    }
    if (!document.querySelector(".modal:not(.hidden)")) {
        document.body.classList.remove("no-scroll");
    }
}

function closeAllModals() {
    [contentModal, playerModal, profileModal].forEach(function (m) {
        if (m) m.classList.add("hidden");
    });
    stopTrailer();
    var stage = $("playerStage");
    if (stage) stage.innerHTML = "";
    document.body.classList.remove("no-scroll");
}

/* Click the dim backdrop to dismiss. */
[contentModal, playerModal, profileModal].forEach(function (modal) {
    if (!modal) return;
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModal(modal);
    });
});

/* Escape closes the topmost modal. */
document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var open = document.querySelector(".modal:not(.hidden)");
    if (open) closeModal(open);
});

$("closeModal").addEventListener("click", function () { closeModal(contentModal); });
$("closePlayer").addEventListener("click", function () { closeModal(playerModal); });
$("closeProfile").addEventListener("click", function () { closeModal(profileModal); });


function openContent(id) {

    var content = getContent().find(function (item) { return item.id === id; });
    if (!content) {
        toast("That title is no longer available", "warn");
        return;
    }

    selectedContentId = id;

    var img = $("modalImage");
    img.dataset.fallback = "1";
    img.src = content.image;
    img.alt = content.title;

    $("modalCategory").textContent    = content.category;
    $("modalTitle").textContent       = content.title;
    $("modalCreator").textContent     = "By " + content.creator;
    $("modalDescription").textContent = content.description;

    var meta = [];
    if (content.year)     meta.push(content.year);
    if (content.duration) meta.push(content.duration);
    meta.push(likeCountFor(id) + (likeCountFor(id) === 1 ? " like" : " likes"));

    $("modalMeta").innerHTML = meta.map(function (bit) {
        return "<span>" + esc(bit) + "</span>";
    }).join("");

    var trailerRow = $("modalTrailerLink");
    if (content.trailer) {
        trailerRow.innerHTML =
            '<a href="' + esc(content.trailer) + '" target="_blank" rel="noopener noreferrer">' +
                '▶ Watch trailer on YouTube — ' + esc(content.trailer) +
            '</a>';
        trailerRow.classList.remove("hidden");
    } else {
        trailerRow.innerHTML = "";
        trailerRow.classList.add("hidden");
    }

    updateLikeButton();
    updateModalSaveButton();

    openModal(contentModal);
    $("closeModal").focus();
}


/* =========================================================
   15. WATCHLIST
   ========================================================= */

function toggleWatchlist(id) {

    var user = getCurrentUser();
    if (!user) {
        toast("Log in to save titles", "warn");
        return;
    }

    var watchlist = getWatchlist();

    var index = watchlist.findIndex(function (row) {
        return row.userId === user.id && row.contentId === id;
    });

    var added;

    if (index !== -1) {
        watchlist.splice(index, 1);
        added = false;
    } else {
        watchlist.push({ userId: user.id, contentId: id });
        added = true;
    }

    saveWatchlist(watchlist);

    updateSaveButtons();
    updateModalSaveButton();
    renderWatchlist();
    renderHome();
    updateProfile();

    toast(added ? "Saved to your watchlist" : "Removed from your watchlist");
}


function updateSaveButtons() {

    var user = getCurrentUser();
    var watchlist = user ? getWatchlist() : [];

    document.querySelectorAll(".save-card-btn").forEach(function (button) {

        var contentId = Number(button.dataset.contentId);

        var isSaved = user && watchlist.some(function (row) {
            return row.userId === user.id && row.contentId === contentId;
        });

        button.textContent = isSaved ? "✓ Saved" : "+ Save";
        button.classList.toggle("saved", !!isSaved);
    });
}


function renderWatchlist() {

    var user = getCurrentUser();
    var container = $("watchlistGrid");
    if (!container) return;

    if (!user) {
        container.innerHTML = "<p>Log in to see your watchlist.</p>";
        return;
    }

    var savedIds = getWatchlist()
        .filter(function (row) { return row.userId === user.id; })
        .map(function (row) { return row.contentId; });

    var items = getContent().filter(function (item) {
        return savedIds.indexOf(item.id) !== -1;
    });

    renderGrid("watchlistGrid", items,
        "Your watchlist is empty. Tap Save on anything to keep it here.");
}


/* =========================================================
   16. LIKES
   ========================================================= */

function likeCountFor(id) {
    return getLikes().filter(function (row) { return row.contentId === id; }).length;
}


function updateLikeButton() {

    var user = getCurrentUser();

    if (!user || !selectedContentId) {
        likeBtn.innerHTML = '<span class="heart-icon">♡</span> Like';
        likeBtn.classList.remove("liked");
        return;
    }

    var isLiked = getLikes().some(function (row) {
        return row.userId === user.id && row.contentId === selectedContentId;
    });

    likeBtn.innerHTML = isLiked
        ? '<span class="heart-icon">♥</span> Liked'
        : '<span class="heart-icon">♡</span> Like';

    likeBtn.classList.toggle("liked", isLiked);
}


likeBtn.addEventListener("click", function () {

    var user = getCurrentUser();
    if (!user || !selectedContentId) {
        toast("Log in to like titles", "warn");
        return;
    }

    var likes = getLikes();

    var index = likes.findIndex(function (row) {
        return row.userId === user.id && row.contentId === selectedContentId;
    });

    if (index !== -1) {
        likes.splice(index, 1);
    } else {
        likes.push({ userId: user.id, contentId: selectedContentId });
    }

    saveLikes(likes);

    updateLikeButton();
    renderHome();
    updateProfile();
});


/* =========================================================
   17. MODAL SAVE BUTTON
   ========================================================= */

function updateModalSaveButton() {

    var user = getCurrentUser();

    if (!user || !selectedContentId) {
        modalSaveBtn.textContent = "+ Save";
        modalSaveBtn.classList.remove("saved");
        return;
    }

    var isSaved = getWatchlist().some(function (row) {
        return row.userId === user.id && row.contentId === selectedContentId;
    });

    modalSaveBtn.textContent = isSaved ? "✓ Saved" : "+ Save";
    modalSaveBtn.classList.toggle("saved", isSaved);
}


modalSaveBtn.addEventListener("click", function () {
    if (!selectedContentId) return;
    toggleWatchlist(selectedContentId);
});


/* =========================================================
   17b. YOUTUBE IFRAME API
   Loaded once, lazily, the first time a trailer is played.
   Resolves once YT.Player is usable; rejects if the script
   never loads (blocked network, sandboxed preview, etc.)
   within a few seconds, so the UI never sits on a blank box.
   ========================================================= */

var ytApiPromise = null;

function loadYouTubeApi() {

    if (ytApiPromise) return ytApiPromise;

    ytApiPromise = new Promise(function (resolve, reject) {

        if (window.YT && window.YT.Player) {
            resolve();
            return;
        }

        var settled = false;

        var timer = window.setTimeout(function () {
            if (settled) return;
            settled = true;
            reject(new Error("timeout"));
        }, 6000);

        var previous = window.onYouTubeIframeAPIReady;

        window.onYouTubeIframeAPIReady = function () {
            if (typeof previous === "function") previous();
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            resolve();
        };

        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";

        tag.onerror = function () {
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            reject(new Error("blocked"));
        };

        document.head.appendChild(tag);
    });

    return ytApiPromise;
}


var activePlayer = null;

function stopTrailer() {
    if (activePlayer && typeof activePlayer.destroy === "function") {
        try { activePlayer.destroy(); } catch (err) { /* ignore */ }
    }
    activePlayer = null;
}

function showPlayerFallback(content, reason) {

    var stage = $("playerStage");
    if (!stage) return;

    stage.innerHTML =
        '<img src="' + esc(content.image) + '" alt="" data-fallback="1">' +
        '<div class="player-overlay">' +
            '<div class="player-pulse" aria-hidden="true">▶</div>' +
            '<h3>' + esc(content.title) + '</h3>' +
            '<p>' + esc(reason) + '</p>' +
        '</div>';
}

function playTrailer(content) {

    var source = identifyTrailerSource(content.trailer);
    var stage = $("playerStage");

    stopTrailer();

    if (!source) {
        showPlayerFallback(content, "No trailer on file for this title yet.");
        $("playerLinkRow").innerHTML = "";
        $("playerLinkRow").classList.add("hidden");
        return;
    }

    var openLabel = source.type === "drive" ? "Open in Google Drive ↗" : "Open on YouTube ↗";
    $("playerLinkRow").innerHTML =
        '<a href="' + esc(content.trailer) + '" target="_blank" rel="noopener noreferrer">' +
            openLabel +
        '</a>';
    $("playerLinkRow").classList.remove("hidden");

    if (source.type === "drive") {
        playDriveTrailer(content, source.id, stage);
    } else {
        playYouTubeTrailer(content, source.id, stage);
    }
}

/* Google Drive has no playback JS API to hook into cross-origin, so this
   embeds Drive's own preview player directly. It plays right here in the
   page — Drive just doesn't tell us if the owner forgot to share the file,
   so the "Open in Google Drive" link stays visible as a manual fallback. */
function playDriveTrailer(content, fileId, stage) {

    stage.innerHTML =
        '<div class="player-loading">' +
            '<div class="player-pulse" aria-hidden="true">▶</div>' +
            '<p>Loading trailer…</p>' +
        '</div>' +
        '<iframe' +
            ' src="https://drive.google.com/file/d/' + esc(fileId) + '/preview"' +
            ' title="' + esc(content.title) + ' trailer"' +
            ' allow="autoplay"' +
            ' allowfullscreen' +
            ' loading="lazy">' +
        '</iframe>';

    var frame = stage.querySelector("iframe");
    if (frame) {
        frame.addEventListener("load", function () {
            var loading = stage.querySelector(".player-loading");
            if (loading) loading.remove();
        });
    }
}

function playYouTubeTrailer(content, videoId, stage) {

    stage.innerHTML =
        '<div class="player-loading">' +
            '<div class="player-pulse" aria-hidden="true">▶</div>' +
            '<p>Loading trailer…</p>' +
        '</div>' +
        '<div id="ytMount"></div>';

    loadYouTubeApi().then(function () {

        /* The modal may have been closed while the API was loading. */
        if (!$("ytMount")) return;

        activePlayer = new YT.Player("ytMount", {
            videoId: videoId,
            playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
            events: {
                onReady: function (event) {
                    event.target.playVideo();
                    var loading = stage.querySelector(".player-loading");
                    if (loading) loading.remove();
                },
                onError: function () {
                    /* Error 101 / 150 = embedding disabled by the owner.
                       Others = removed, private, or region-blocked. */
                    showPlayerFallback(content,
                        "This trailer can't play here — the owner has disabled " +
                        "embedding, or the video is unavailable. Use the link below.");
                }
            }
        });

    }).catch(function () {
        showPlayerFallback(content,
            "Couldn't reach YouTube from this page. Use the link below to watch it there.");
    });
}


/* =========================================================
   18. PLAYER
   ========================================================= */

$("watchBtn").addEventListener("click", function () {

    if (!selectedContentId) return;

    var content = getContent().find(function (item) {
        return item.id === selectedContentId;
    });

    if (!content) return;

    var user = getCurrentUser();

    if (user) {
        var history = getHistory().filter(function (row) {
            return !(row.userId === user.id && row.contentId === content.id);
        });
        history.push({ userId: user.id, contentId: content.id, at: Date.now() });
        saveHistory(history);
    }

    closeModal(contentModal);

    $("playerTitle").textContent = content.title;
    $("playerMeta").textContent =
        content.category + " · " + content.creator +
        (content.duration ? " · " + content.duration : "");

    openModal(playerModal);
    $("closePlayer").focus();

    playTrailer(content);

    renderHome();
    updateProfile();
});


/* =========================================================
   19. PROFILE
   ========================================================= */

$("profileBtn").addEventListener("click", function () {
    updateProfile();
    openModal(profileModal);
    $("closeProfile").focus();
});


function updateProfile() {

    var user = getCurrentUser();
    if (!user) return;

    $("profileName").textContent  = user.name;
    $("profileEmail").textContent = user.email;
    $("profileAvatar").textContent =
        String(user.name).trim().charAt(0).toUpperCase() || "V";

    function countFor(rows) {
        return rows.filter(function (row) { return row.userId === user.id; }).length;
    }

    $("profileSaved").textContent   = countFor(getWatchlist());
    $("profileLiked").textContent   = countFor(getLikes());
    $("profileWatched").textContent = countFor(getHistory());
}


/* =========================================================
   20. ADMIN DASHBOARD
   ========================================================= */

function renderAdminDashboard() {

    var users   = getUsers();
    var content = getContent();

    $("totalUsers").textContent = users.filter(function (u) {
        return u.role === "user";
    }).length;

    $("totalContent").textContent = content.length;

    $("totalMovies").textContent = content.filter(function (item) {
        return item.category === "Movies";
    }).length;

    $("totalSports").textContent = content.filter(function (item) {
        return item.category === "Sports";
    }).length;

    renderAdminContent();
    renderAdminUsers();
}


$("contentForm").addEventListener("submit", function (event) {

    event.preventDefault();

    var adminMessage = $("adminMessage");

    var title       = $("contentTitle").value.trim();
    var category    = $("contentCategory").value;
    var creator     = $("contentCreator").value.trim();
    var image       = $("contentImage").value.trim();
    var trailer     = $("contentTrailer").value.trim();
    var description = $("contentDescription").value.trim();

    if (!title || !creator || !description) {
        setMessage(adminMessage, "Fill in the title, creator and description.", "error");
        return;
    }

    if (!category) {
        setMessage(adminMessage, "Choose a category.", "error");
        return;
    }

    if (!isValidUrl(image)) {
        setMessage(adminMessage, "The image URL must start with http:// or https://", "error");
        return;
    }

    if (trailer && !identifyTrailerSource(trailer)) {
        setMessage(adminMessage, "The trailer URL should be a YouTube link (watch, youtu.be, embed) or a Google Drive share link.", "error");
        return;
    }

    var content = getContent();

    var duplicate = content.some(function (item) {
        return String(item.title).toLowerCase() === title.toLowerCase();
    });

    if (duplicate) {
        setMessage(adminMessage, "A title with that name already exists.", "error");
        return;
    }

    content.push({
        id: Date.now(),
        title: title,
        category: category,
        creator: creator,
        image: image,
        description: description,
        trailer: trailer || null,
        year: new Date().getFullYear()
    });

    saveContent(content);

    this.reset();
    setMessage(adminMessage, "Added “" + title + "” to " + category + ".", "ok");
    toast("Content added");

    renderAdminDashboard();
});


function renderAdminContent() {

    var container = $("adminContentList");
    var content = getContent();

    if (!content.length) {
        container.innerHTML = "<p>No content yet. Add your first title above.</p>";
        return;
    }

    container.innerHTML = content.map(function (item) {
        return '' +
            '<div class="admin-item">' +
                '<img src="' + esc(item.image) + '" alt="" data-fallback="1">' +
                '<div class="admin-item-info">' +
                    '<h3>' + esc(item.title) + '</h3>' +
                    '<p>' + esc(item.category) + ' · ' + esc(item.creator) +
                        (item.trailer ? ' · has trailer' : ' · no trailer') + '</p>' +
                '</div>' +
                '<button class="delete-btn" type="button"' +
                        ' data-action="delete" data-id="' + esc(item.id) + '">' +
                    'Delete' +
                '</button>' +
            '</div>';
    }).join("");
}


function deleteContent(id) {

    var content = getContent();
    var item = content.find(function (row) { return row.id === id; });
    if (!item) return;

    if (!window.confirm('Delete "' + item.title + '"? This also clears it from every watchlist.')) {
        return;
    }

    saveContent(content.filter(function (row) { return row.id !== id; }));

    pruneOrphans();
    renderAdminDashboard();

    setMessage($("adminMessage"), "");
    toast("Deleted “" + item.title + "”");
}


function renderAdminUsers() {

    var container = $("adminUserList");

    var users = getUsers().filter(function (user) {
        return user.role === "user";
    });

    if (!users.length) {
        container.innerHTML = "<p>No registered users yet.</p>";
        return;
    }

    container.innerHTML = users.map(function (user) {
        return '' +
            '<div class="admin-item">' +
                '<div class="admin-item-info">' +
                    '<h3>' + esc(user.name) + '</h3>' +
                    '<p>' + esc(user.email) + '</p>' +
                '</div>' +
                '<span>USER</span>' +
            '</div>';
    }).join("");
}


/* =========================================================
   21. SESSION CHECK + START
   ========================================================= */

function checkExistingSession() {

    var session = getCurrentUser();

    if (!session) {
        authPage.classList.remove("hidden");
        userApp.classList.add("hidden");
        adminApp.classList.add("hidden");
        return;
    }

    /* Re-validate against the user list — the account may have been removed. */
    var user = getUsers().find(function (u) { return u.id === session.id; });

    if (!user) {
        clearCurrentUser();
        authPage.classList.remove("hidden");
        return;
    }

    setCurrentUser(user);

    if (user.role === "admin") {
        showAdminApp();
    } else {
        showUserApp();
    }
}

checkExistingSession();

})();
