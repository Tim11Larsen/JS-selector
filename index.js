const movieListEl = document.querySelector(".movie__list");
const searchInputEl = document.querySelector("#searchInput");
const searchButtonEl = document.querySelector("#searchButton");

searchButtonEl.addEventListener("click", handleSearch);
searchInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

async function handleSearch() {
    const searchTerm = searchInputEl.value.trim();

    if (!searchTerm) {
        movieListEl.innerHTML = "<p>Please enter a movie title.</p>";
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=71c4119b`);
        const data = await response.json();
        console.log(data)

        if (data.Response === "False") {
            throw new Error(data.Error || "No results found.");
        }

        renderMovies(data.Search);
    } catch (error) {
        movieListEl.innerHTML = `<p>${error.message}</p>`;
    }
}

function renderMovies(movies) {
    if (!movies || movies.length === 0) {
        movieListEl.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movieListEl.innerHTML = movies.slice(0,6).map((movie) => movieHTML(movie)).join("");
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
                <h4>Type:</h4> <p>${movie.Rating}</p>
                <img src="${posterUrl}" alt="${movie.Title}" class="movie__poster">
            </div>
        </div>
    `;
}