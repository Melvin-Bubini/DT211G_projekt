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
        searchOMDb(searchTerm);
    }, 1500); // 1500 millisekunder motsvarar 1 sekund
});

function searchOMDb(searchTerm) {
    let movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&apikey=a3023c8d`;

    fetch(movieUrl)
        .then(response => response.json())
        .then(data => {
            let omdbResults = document.getElementById("omdb-results");
            omdbResults.innerHTML = ""; // Rensa tidigare resultat

            if (data.Response === "True") {
                let title = data.Title;
                let poster = data.Poster;

                // let titleHeading = document.createElement("h3");
                // titleHeading.textContent = title;
                // omdbResults.appendChild(titleHeading);

                let posterImage = document.createElement("img");
                posterImage.classList.add("poster");
                posterImage.src = poster;
                omdbResults.appendChild(posterImage);
            } else {
                let errorMessage = document.createElement("p");
                errorMessage.textContent = "Ingen film hittad";
                omdbResults.appendChild(errorMessage);
            }
        })
        .catch(error => console.error("Något gick fel:", error));
}

function searchWatchmode(searchTerm) {
    let url = `https://api.watchmode.com/v1/search/?apiKey=nBSOd4NMOHJGhsWCrd5aQ1lKCSQJgehofRSszRIC&search_field=name&search_value=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let watchmodeResults = document.getElementById("watchmode-results");
            let watchmodeTitle = document.getElementById("watchmode-title");
            let titleHeading = document.createElement("h1");

            watchmodeTitle.innerHTML = ""; // Rensa tidigare resultat
            watchmodeResults.innerHTML = ""; // Rensa tidigare resultat
            titleHeading.innerHTML = ""; // Rensa tidigare resultat

            titleHeading.textContent = `Alla titlar med ${searchTerm}`;
            watchmodeTitle.appendChild(titleHeading);

            if (data.title_results && data.title_results.length > 0) {
                data.title_results.forEach(title => {
                    let listItem = document.createElement("li");
                    listItem.classList.add("new-list-item");
                    listItem.textContent = title.name;
                    watchmodeResults.appendChild(listItem);
                });
            } else {
                let listItem = document.createElement("li");
                listItem.textContent = "Ingen film hittad";
                watchmodeResults.appendChild(listItem);
            }
        })
        .catch(error => console.error("Något gick fel med fetch:", error));
}