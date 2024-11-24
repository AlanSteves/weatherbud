const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";

document.getElementById("searchBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name!");

  const weatherData = await fetchWeather(city);
  if (weatherData) {
    displayWeather(weatherData.current, city);
    displayForecast(weatherData.daily);
  }
});

async function fetchWeather(city) {
  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const [geoData] = await geoRes.json();

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&exclude=minutely,hourly&appid=${apiKey}`
    );
    return await weatherRes.json();
  } catch (error) {
    console.error(error);
    alert("Failed to fetch weather data. Please try again.");
    return null;
  }
}

function displayWeather(data, city) {
  document.getElementById("cityName").textContent = city;
  document.getElementById("temperature").textContent = `Temperature: ${data.temp}°C`;
  document.getElementById("humidity").textContent = `Humidity: ${data.humidity}%`;
  document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
}

function displayForecast(daily) {
  const labels = daily.map((day, index) => `Day ${index + 1}`);
  const temps = daily.map(day => day.temp.day);

  const ctx = document.getElementById("forecastChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "7-Day Temperature (°C)",
          data: temps,
          borderColor: "#ff5733",
          fill: false,
        },
      ],
    },
  });
}
