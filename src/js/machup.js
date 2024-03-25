"use strict";

document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Förhindra standardformulärinsändning
    let searchTerm = document.getElementById("search-input").value;

    // Hämta loader-elementet
    let loader = document.querySelector(".loader");

    // Visa loader i en sekund
    loader.style.display = "block";

    // Efter en sekund, ändra display tillbaka till "none"
    setTimeout(function () {
        loader.style.display = "none";

        let omdbResults = document.getElementById("omdb-results");
        let watchmodeResults = document.getElementById("watchmode-results");
        let watchmodeTitle = document.getElementById("watchmode-title");

        omdbResults.innerHTML = ""; // Rensa tidigare resultat
        watchmodeTitle.innerHTML = ""; // Rensa tidigare resultat
        watchmodeResults.innerHTML = ""; // Rensa tidigare resultat

        // Efter 2 sekunder, kör sökfunktionerna
        searchWatchmode(searchTerm);
        // searchOMDb(searchTerm);
    }, 1500); // 1500 millisekunder motsvarar 1 sekund
});

document.getElementById("deleteBtn").addEventListener("click", function reset() {
    let omdbResults = document.getElementById("omdb-results");
    let watchmodeResults = document.getElementById("watchmode-results");
    let watchmodeTitle = document.getElementById("watchmode-title");

    omdbResults.innerHTML = ""; // Rensa tidigare resultat
    watchmodeTitle.innerHTML = ""; // Rensa tidigare resultat
    watchmodeResults.innerHTML = ""; // Rensa tidigare resultat
});



function searchWatchmode(searchTerm) {
    let url = `https://api.watchmode.com/v1/search/?apiKey=nBSOd4NMOHJGhsWCrd5aQ1lKCSQJgehofRSszRIC&search_field=name&search_value=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let watchmodeResults = document.getElementById("watchmode-results");
            let watchmodeTitle = document.getElementById("watchmode-title");
            let titleHeading = document.createElement("h1");
            let imdb_id = []; // Skapa en array för att lagra IMDb ID:n
            let moreInfo = document.createElement("h2");

            watchmodeTitle.innerHTML = ""; // Rensa tidigare resultat
            watchmodeResults.innerHTML = ""; // Rensa tidigare resultat
            titleHeading.innerHTML = ""; // Rensa tidigare resultat



            if (data.title_results && data.title_results.length > 0) {
                data.title_results.forEach(title => {
                    const name = searchTerm;
                    titleHeading.textContent = `Alla titlar med ${searchTerm}`;
                    watchmodeTitle.appendChild(titleHeading);


                    moreInfo.textContent = "Klicka på en film för mer information"
                    watchmodeTitle.appendChild(moreInfo);

                    let listItem = document.createElement("li");
                    listItem.classList.add("new-list-item");
                    listItem.textContent = title.name;
                    watchmodeResults.appendChild(listItem);

                    let divItem = document.createElement("div");
                    divItem.classList.add("omdb_results2");
                    listItem.appendChild(divItem);

                    const imdbIds = title.imdb_id;
                    imdb_id.push(imdbIds); // Lägg till IMDb ID till arrayen

                    // Lägg till händelselyssnare för klick på varje li-element
                    listItem.addEventListener('click', function () {
                        // Anropa searchOMDb-funktionen med motsvarande IMDb ID
                        searchOMDb(imdbIds);
                    });
                });

                // // Endast skriv ut IMDb ID för varje film när de är tillgängliga
                // imdb_id.forEach(id => {
                //     console.log(id);
                // });
                
            } else {
                let listItem = document.createElement("li");
                listItem.textContent = "Ingen film hittad";
                watchmodeResults.appendChild(listItem);
            }
        })
        .catch(error => console.error("Något gick fel med fetch:", error));
}


function searchOMDb(imdbIds) {
    let movieUrl = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbIds)}&apikey=a3023c8d`;

    fetch(movieUrl)
        .then(response => response.json())
        .then(data => {
            let omdbResults = document.getElementById("omdb-results");
            omdbResults.innerHTML = ""; // Rensa tidigare resultat

            if (data.Response === "True") {
                let poster = data.Poster;
                let posterImage = document.createElement("img");
                posterImage.classList.add("poster");
                posterImage.src = poster;
                omdbResults.appendChild(posterImage);

                let imdb_review = data.imdbRating;
                let imdbRating = document.createElement("h2");
                imdbRating.textContent = `IMDb rating: ${imdb_review}`;
                imdbRating.classList.add("imdbRating");
                omdbResults.appendChild(imdbRating);

                let description = data.Plot;
                let plot = document.createElement("p");
                plot.textContent = `Beskrivning: ${description}`;
                plot.classList.add("movieDescription");
                omdbResults.appendChild(plot);

            } else {
                let errorMessage = document.createElement("p");
                errorMessage.textContent = "Denna film finns ej på IMDB eller är en bok";
                omdbResults.appendChild(errorMessage);
            }
        })
        .catch(error => console.error("Något gick fel:", error));
}

