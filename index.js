//http://www.omdbapi.com/?i=tt3896198&apikey=71c4119b
// const data = (fetch('http://www.omdbapi.com/?i=tt3896198&apikey=71c4119b'))
// console.log(data)

async function renderMovies() {
    const movies = await fetch('http://www.omdbapi.com/?i=tt3896198&apikey=71c4119b')
    const moviesData = await movies.json();
    const movieListEl = document.querySelector(".movie-list");

    userListEl.innerHTML = moviesData.map((movie) => )
}
console.log(renderMovies())