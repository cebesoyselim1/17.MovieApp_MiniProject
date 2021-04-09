
let moviesPart = document.querySelector("#movies");
let searchInput = document.querySelector(".input-search");

async function getAllMovies(){
    let movieLists = [];
    for(let i = 1; i < 5; i++){
        let url = `
        https://api.themoviedb.org/3/list/${i}?api_key=297a7b0ef658e52e712dbc19267bb0ee&language=en-US`;
        let data = await fetch(url);
        let dataJson = await data.json();
        dataJson.items.forEach((movie) => {
            movieLists.push(movie);
        })
    }
    return movieLists;
}

function showMovies(){
    getAllMovies()
    .then((movies) => {
        movies.forEach((movie) => {
            getMoviesGenresbyIDs(movie.genre_ids)
            .then((genres) => {
                let genreList = `<div class="movie-categories">`;
                for(genre of genres){
                    genreList += `<div class="movie-category">${genre}</div>`;
                }
                genreList += `</div>`
                
                let voteColor = getVoteColor(movie.vote_average);

                let html = `
                <div class="m-card">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="" class="m-card-img">
                    <div class="m-card-body">
                        <div class="m-title">${movie.original_title}</div>
                        <div class="${voteColor}">${movie.vote_average}</div>
                    </div>
                    <div class="m-card-explanation">
                        <div class="m-card-explanation-inner">
                        ${movie.overview}
                        </div>
                    </div>

                    ${genreList}

                </div>
                `;
                
                moviesPart.innerHTML += html;
            })
        })
        
    })
}

function getVoteColor(voteRate){
    if(voteRate < 6){
        return "m-score score-low";
    }else if(voteRate < 8){
        return "m-score score-average";
    }else{
        return "m-score score-high";
    }
}

function showbyName(val){
    moviesPart.innerHTML = "";
    getAllMovies()
    .then((movies) => {
        movies.filter((movie) => movie.original_title.toLowerCase().includes(val.toLowerCase()))
        .forEach((movie) => {
            let html = `
            <div class="m-card">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="" class="m-card-img">
                <div class="m-card-body">
                    <div class="m-title">${movie.original_title}</div>
                    <div class="m-score score-high">${movie.vote_average}</div>
                </div>
                <div class="m-card-explanation">
                    <div class="m-card-explanation-inner">
                    ${movie.overview}
                    </div>
                </div>
            </div>
            `;
            moviesPart.innerHTML += html;
        })
    })
}

async function getMoviesGenresbyIDs(...genreIDs){
    let list = [];
    let genres = await getGenres();
    
    genres.forEach((genre) => {
        genreIDs[0].forEach((id) => {
            if(genre.id == id){
                list.push(genre.name);
            }
        })
    })

    return list;
    
}

async function getGenres(){
    let url = "https://api.themoviedb.org/3/genre/movie/list?api_key=297a7b0ef658e52e712dbc19267bb0ee&language=en-US";
    let data = await fetch(url);
    let dataJson = await data.json();
    return dataJson.genres;
}

searchInput.addEventListener("keyup", (e) => {
    showbyName(searchInput.value)
})

showMovies();






