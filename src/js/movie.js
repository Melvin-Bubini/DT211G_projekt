"use strict";

window.onload = init;

function init() {
    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Förhindra standardformulärinsändning

        let searchTerm = document.getElementById("search-input").value;
        let movieUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&apikey=a3023c8d`;

        fetch(movieUrl)
            .then(response => response.json())
            .then(data => {
                try {
                    if (data.Response === "True") {
                        console.log(data);
                        let result = data;
                        let title = result.Title;
                        let poster = result.Poster;
                        let genre = result.Genre;

                        // Hämta en iframe
                        let iframe = document.getElementById("factFrame");
                        iframe.setAttribute("src", poster);

                        // Lägg till iframe till div med id "map"
                        let movieDiv = document.getElementById("fact");
                        movieDiv.innerHTML = '';
                        movieDiv.appendChild(iframe);

                        // Skapa och lägg till h1 för titeln
                        let titleHeading = document.createElement("h1");
                        titleHeading.textContent = title;
                        movieDiv.appendChild(titleHeading);

                    } else {
                        console.log("Ingen film hittad");
                    }
                } catch (error) {
                    console.error("Något gick fel:", error);
                }
            })
            .catch(error => {
                console.error("Något gick fel:", error);
            });
    });
}
