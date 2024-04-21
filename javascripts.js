document.getElementById("searchButton").addEventListener("click", function () {
    var countryName = document.getElementById("searchInput").value;
    fetch(`https://restcountries.com/v3/name/${countryName}`)
        .then((response) => response.json())
        .then((data) => {
            displayCountryData(data);
        })
        .catch((error) => console.log("Error fetching country data:", error));
});

function displayCountryData(data) {
    var countryDataContainer = document.getElementById("countryData");
    countryDataContainer.innerHTML = "";

    data.forEach((country) => {
        var countryCard = document.createElement("div");
        countryCard.classList.add("country-card");
        countryCard.innerHTML = `
                <h2>${country.name.common}</h2>
                <p>Capital: ${country.capital}</p>
                <p>Population: ${country.population}</p>
                <button class="details-button"  data-country="${country.name.common}">More Details</button>
                <div class="additional-details" style="display: none;">
                    <p>Flag: <img src="${country.flags[0]}" alt="${country.name.common}" style="width: 50px;"></p>
                    <p>Region: ${country.region}</p>
                    <p>Subregion: ${country.subregion}</p>
                    <p class="weather-info">Weather: </p>
                    <!-- Add more country data here -->
                </div>
            `;
        countryDataContainer.appendChild(countryCard);
    });

    document.querySelectorAll(".details-button").forEach((button) => {
        button.addEventListener("click", function () {
            var detailsSection = this.nextElementSibling;
            if (detailsSection.style.display === "none") {
                detailsSection.style.display = "block";
                var countryName = this.getAttribute("data-country");
                fetchWeatherData(
                    countryName,
                    detailsSection.querySelector(".weather-info")
                );
            } else {
                detailsSection.style.display = "none";
            }
        });
    });
}

function fetchWeatherData(countryName, weatherInfoElement) {
    var api_key = "b82d344eac4d4818aac125813242803&q";
    fetch(
        `https://api.weatherapi.com/v1/current.json?key=${api_key}=${countryName}`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.current && data.current.temp_c) {
                const temperature = data.current.temp_c;
                const condition = data.current.condition.text;
                weatherInfoElement.innerHTML = `Temperature: ${temperature}°C <br> Condition: ${condition}`;
            } else {
                weatherInfoElement.textContent = "Weather data not available.";
            }
        })
        .catch((error) => {
            console.log("Error fetching weather data:", error);
            weatherInfoElement.textContent = "Weather data not available.";
        });
}