'use strict';

const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=9864eabc';

class HttpError extends Error {
    constructor(msg, status) {
        super(msg);
        this.status = status;
    }
}

const MOVIE = (function(){
    let searchById = (id) => {
        let MOVIE_URL = `${OMDB_API_URL}&i=${id}`;
        return customFetch(MOVIE_URL);
    }
    let searchByString = (string) => {
        let SEARCH_URL = `${OMDB_API_URL}&s=${string}`;
        return customFetch(SEARCH_URL);
    }
    let customFetch = function(URL) {
        return new Promise((resolve, reject) => {
            let XHR = new XMLHttpRequest();
            XHR.open('GET', URL, true);
            XHR.onreadystatechange = () => {
                if(XHR.readyState === 4) {
                    if(XHR.status === 200) {
                        resolve(JSON.parse(XHR.responseText));
                    } else {
                        reject(new HttpError('Could not get the data', XHR.status));
                    }
                }
            }
            XHR.send();
        });
    }
    return {
        searchByString: searchByString,
        searchById: searchById,
    }
})();

$('#search-btn').addEventListener('click', () => {
    console.log('here');
    if($('#search-string').value) {
        let movieData = MOVIE
            .searchByString($('#search-string').value)
            .then(response => {
                renderSearchResults(response.Search);
            });

    }
});

function renderSearchResults(searchData) {
    $('#movies .container-fluid').innerHTML = '<div class="row justify-content-start gx-3 gy-5"></div>';
    searchData.forEach(movie => {
        let template = `<div class="col col-xxl-3 col-xl-3 col-lg-4 col-sm-6 col-12">
                            <div class="card w-100 text-center">
                                <div class="card-movie-poster" style="background-image: url('${movie.Poster}')"></div>
                                <div class="card-body p-0 w-100">
                                    <h5 class="card-movie-title m-0 fs-4 px-1">${movie.Title}</h5>
                                    <div class="card-movie-type m-0 fs-5">${movie.Type}</div>
                                    <div class="card-movie-release-date m-0 fs-5">${movie.Year}</div>
                                    <button type="button" class="card-movie-details btn btn-success w-100 m-0 fs-5" data-imdbid="${movie.imdbID}">More details</button>
                                </div>
                            </div>
                        </div>`;
        $('#movies .container-fluid .row').insertAdjacentHTML('beforeend', template);
        $('#movies .col:last-of-type .card-movie-details').onclick = showMovieDetails;
    });
}

function renderMovieDetails(data) {
    console.log(data);
    let makeListOfRatings = function(ratings){
        let out = '';
        ratings.forEach(rating => {
            out += `<li>${rating.Source} ${rating.Value}</li>`;
        });
        return out;
    }
    console.log(data.Poster);
    let template = `<div class="container">
                        <div class="row gx-1 flex-lg-row flex-column flex-nowrap" style="height: 80vh">
                            <div id="picture" class="col-12 col-lg-5 border h-100 p-lg-3 p-2">
                                <div class="movie-poster h-100" style="background-image: url('${data.Poster}')"></div>
                            </div>
                            <div id="info" class="col-12 col-lg-7 border p-lg-3 p-2 h-100">
                                <h3 class="movie-title text-center">${data.Title}</h3>
                                <div class="movie-genre">
                                    <span class="rated">${data.Rated}</span>
                                    <span class="genre">${data.Genre}</span>
                                </div>
                                <p class="movie-plot">${data.Plot}</p>
                                <p class="movie-written-by">
                                    <span class="fw-bold">Written by: </span>
                                    <span>${data.Writer}</span>
                                </p>
                                <p class="movie-directed-by">
                                    <span class="fw-bold">Directed by: </span>
                                    <span>${data.Director}</span>
                                </p>
                                <p class="movie-starring">
                                    <span class="fw-bold">Starring: </span>
                                    <span>${data.Actors}</span>
                                </p>
                                <p class="movie-boxoffice">
                                    <span class="fw-bold">BoxOffice: </span>
                                    <span>${data.BoxOffice}</span>
                                </p>
                                <p class="movie-awards">
                                    <span class="fw-bold">Awards: </span>
                                    <span>${data.Awards}</span>
                                </p>
                                <div class="movie-ratings">
                                    <span class="fw-bold">Ratings: </span>
                                    <ul class="list-unstyled ms-4">${makeListOfRatings(data.Ratings)}</ul>
                                </div>
                                        Lorem facilis dolore delectus quaerat ipsum dignissimos Praesentium qui excepturi ratione enim inventore Deleniti similique nisi vero saepe ab Praesentium sed vel officia quaerat modi Magni error quae rerum in qui in obcaecati Architecto labore ab sunt incidunt ducimus? Maiores sit quod dolores quam error perspiciatis? Rem excepturi recusandae omnis unde quas ipsam fuga Repellat optio provident architecto delectus maiores Nulla incidunt veniam laudantium tenetur aliquam, dolores. Eveniet molestias explicabo at explicabo consequuntur Assumenda pariatur mollitia fugiat voluptatem laborum Autem nihil libero aut iusto explicabo, temporibus Officiis optio molestiae recusandae voluptate veritatis Placeat eos quod consectetur ipsam dolorum. Dicta beatae explicabo magni fugit iure rem. Rerum atque commodi repudiandae rerum quasi illum ipsum. Voluptatibus tenetur minima aperiam veritatis saepe. Quas obcaecati ea magnam vitae quae, maxime exercitationem. Consequatur beatae deleniti velit deserunt repellat Sequi amet exercitationem repellendus dolore amet dolorum Excepturi voluptate explicabo ipsam ex iure. Eligendi corporis enim quae sit ab? Soluta voluptatum sunt repellendus dicta temporibus ratione. Corporis ipsa sapiente incidunt reprehenderit blanditiis Odit id voluptas quam delectus illo amet. Saepe odio adipisci earum quos voluptate. Tempora reiciendis eius nihil natus enim. Veniam illo ipsa id corporis delectus officiis Eos quis necessitatibus consequatur odit doloribus nobis Distinctio facere?

                            </div>
                        </div>
                    </div>`;
    $('#movieDetails .modal-body').innerHTML = template;
}

function showMovieDetails(event) {
    const MODAL = new bootstrap.Modal($('#movieDetails'));
    console.log(MODAL);
    MODAL.show();
    MOVIE.searchById(event.target.dataset.imdbid)
        .then(response => {
            renderMovieDetails(response);
        });
}

function $(selector) {
    return document.querySelector(selector);
}

$('#search-btn').dispatchEvent(new MouseEvent('click'));
setTimeout(() => {
    $('.card-movie-details').dispatchEvent(new MouseEvent('click'));
}, 1000);
