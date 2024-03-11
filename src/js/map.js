"use strict"

window.onload = init;

function init() {
    try {
        // Kontrollera om webbläsaren stödjer geolokalisering
        if ("geolocation" in navigator) {
            // Geolokaliering är tillgängligt
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik`;

                // Skapa en iframe med latitud och longitud
                let iframe = document.getElementById("mapFrame");
                iframe.setAttribute("src", iframeSrc);

                // Lägg till iframe till div med id "map"
                let mapDiv = document.getElementById("map");
                mapDiv.innerHTML = ''; // Ta bort eventuell tidigare innehåll
                mapDiv.appendChild(iframe);
            }, function (error) {
                console.error("Det gick inte att hämta din position: ", error.message);
            });
        }
        else {
            console.error("Geolokalisering stöds inte av din webbläsare");
        }

        document.getElementById("search-form").addEventListener("submit", function (event) {
            event.preventDefault(); // Förhindra standardformulärinsändning

            let searchTerm = document.getElementById("search-input").value
            let mapUrl = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${encodeURIComponent(searchTerm)}&format=jsonv2&limit=1`;

            fetch(mapUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        let result = data[0];
                        let latitude = result.lat;
                        let longitude = result.lon;
                        let iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

                        // Skapa en iframe med latitud och longitud
                        let iframe = document.getElementById("mapFrame");
                        iframe.setAttribute("src", iframeSrc);

                        // Lägg till iframe till div med id "map"
                        let mapDiv = document.getElementById("map");
                        mapDiv.innerHTML = ''; // Ta bort eventuell tidigare innehåll
                        mapDiv.appendChild(iframe);

                    } else {
                        console.log("Ingen plats hittad");
                    }
                })
                .catch(error => {
                    console.error("Något gick fel:", error);
                });
        });
    }
    catch {
        document.getElementById("error").innerHTML = "<p>Något gick fel</p>";
    }
}