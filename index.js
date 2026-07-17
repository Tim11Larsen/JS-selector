const movieListEl = document.querySelector(".movie__list");
const searchInputEl = document.querySelector("#searchInput");
const searchButtonEl = document.querySelector("#searchButton");
const filterSelectEl = document.querySelector("#filter");

let currentMovies = [];

searchButtonEl.addEventListener("click", handleSearch);
searchInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleSearch();
    }
});

function showLoadingState() {
    movieListEl.innerHTML = `
        <div class="movies__loading">
            <i class="fas fa-spinner movies__loading--spinner"></i>
        </div>
    `;
}

async function handleSearch() {
    const searchTerm = searchInputEl.value.trim();

    if (!searchTerm) {
        movieListEl.innerHTML = "<p>Please enter a movie title.</p>";
        return;
    }

    showLoadingState();

    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=71c4119b`);
        const data = await response.json();
        console.log(data)

        if (data.Response === "False") {
            throw new Error(data.Error || "No results found.");
        }

        currentMovies = data.Search || [];
        renderMovies(currentMovies);
    } catch (error) {
        movieListEl.innerHTML = `<p>${error.message}</p>`;
    }
}

function renderMovies(movies) {
    currentMovies = Array.isArray(movies) ? movies : [];

    if (!currentMovies.length) {
        movieListEl.innerHTML = "<p>No movies found.</p>";
        return;
    }

    const sortValue = filterSelectEl?.value || "";
    const sortedMovies = sortMovies(currentMovies, sortValue);

    movieListEl.innerHTML = sortedMovies.slice(0, 6).map((movie) => movieHTML(movie)).join("");
}

function sortMovies(movies, filter) {
    const sortedMovies = [...movies];

    if (filter === "TITLE") {
        sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    }
    if (filter === "YEAR") {
        sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
    }
    if (filter === "MEDIA") {
        sortedMovies.sort((a, b) => a.Type.localeCompare(b.Type));
    }

    return sortedMovies;
}

function movieHTML(movie) {
    const posterUrl = movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "assets/reel_vert.jpg";

    return `
        <div class="movie__card">
            <div class="movie__card--container">
                <h3>${movie.Title}</h3>
                <h4>Year:</h4> <p>${movie.Year}</p>
                <h4>Type:</h4> <p>${movie.Type}</p>
                <h4>IMDb:</h4> <p><a href="https://imdb.com/title/${movie.imdbID}" target="_blank">${movie.imdbID}</a></p>
                <img src="${posterUrl}" alt="${movie.Title}" class="movie__poster">
            </div>
        </div>
    `;
}

function filterMovies(event) {
    renderMovies(currentMovies, event.target.value);
}