"use strict";

window.onload = init;


function init() {
    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Förhindra standardformulärinsändning

        let searchTerm = document.getElementById("search-input").value;
        let url = `https://api.watchmode.com/v1/search/?apiKey=nBSOd4NMOHJGhsWCrd5aQ1lKCSQJgehofRSszRIC&search_field=name&search_value=${encodeURIComponent(searchTerm)}`;


        fetch(url)
            .then(response => response.json())
            .then(data => {
                try {
                    // Kontrollera om det finns titelresultat och om det inte är tomt
                    if (data.title_results && data.title_results.length > 0) {

                        let titleList = document.createElement("ul");

                        // Loopa igenom alla titlar och skriv ut namnet på varje titel
                        data.title_results.forEach(title => {

                            let titleListItem = document.createElement("li");
                            titleListItem.textContent = title.name;
                            titleList.appendChild(titleListItem);

                        });

                        // Lägg till listan med titlar till din webbsida
                        let movieDiv = document.getElementById("fact");
                        movieDiv.innerHTML = ''; // Rensa innehållet först
                        movieDiv.appendChild(titleList);

                    } else {
                        console.log("Ingen film hittad");
                    }
                } catch (error) {
                    console.error("Något gick fel:", error);
                }
            })
    });
}

