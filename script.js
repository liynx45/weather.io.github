const btnSeach = document.querySelector(".btn-search");
const inputCity = document.querySelector(".input-value");
const API_KEY = "624a15a757ee4dbc95e75b02cacc09c4";
const currentWeather = document.querySelector(".current-weather");
const weatherPanel = document.querySelector(".weather-menu");
const btnLocation = document.querySelector(".btn-current-location");

function getRenderForecast(forecast, index, nameCity) {
  const week = [`Minggu`, `Senin`, `Selasa`, `Rabu`, `Kamis`, `Jum'at`, `Sabtu`]
  const date = new Date(forecast.dt_txt);
  const datePanel = `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`
  const dateWeek = date.getDay();
  const dateKey = week[dateWeek];
  const temperature = Math.floor(forecast.main.temp - 273.15);
  const time = date.toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit` });
  if (index === 0) {
    return `
    <span>${nameCity}, ${datePanel}</span>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png" alt="weather-icon">
        <span> ${forecast.weather[0].description}</span>
        <span class="main-temp">${temperature}°C</span>
        <div class="bottom-current">
          <div class="detail-blok">
            <i class="uil uil-wind-sun"></i>
            <span>Wind ${forecast.wind.speed} M/s</span>
          </div>
          <div class="detail-blok">
            <i class="uil uil-tear"></i>
            <span>Humidity ${forecast.main.humidity}%</span>
          </div>
        </div>
    `;
  } else {
    return `
    <div class="weather-panel">
        <div class="left-panel">
          <span class="temp">${temperature}°C</span>
          <span class="date-panel">${dateKey}</span>
          <div class="bottom-panel">
            <div class="wind-panel">
              <i class="uil uil-wind-sun"></i>
              <span>Wind ${forecast.wind.speed} M/s</span>
            </div>
            <div class="humidity-panel">
              <i class="uil uil-tear"></i>
              <span>Humidity ${forecast.main.humidity}%</span>
            </div>
          </div>
        </div>
        <div class="right-panel">
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png" alt="weather-icon">
          <span class="description"> ${forecast.weather[0].description}</span>
        </div>
      </div>
    `;
  }
}

function getDetailWeather(nameCity, latitude, longitude) {
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(API_URL).then(response => response.json()).then(data => {

    const forecastGroup = [];
    const weekDate = data.list.filter(forecast => {
      const date = new Date(forecast.dt_txt).getDate();
      if(!forecastGroup.includes(date)) {
        return forecastGroup.push(date);
      }
    });
    
    currentWeather.innerHTML = "";
    weatherPanel.innerHTML = "";
    inputCity.value = "";

    weekDate.forEach((forecast, index) => {
      const panel = getRenderForecast(forecast, index, nameCity);
      if(index === 0) {
        currentWeather.insertAdjacentHTML("beforeend", panel)
      } else {
        weatherPanel.insertAdjacentHTML("beforeend", panel)
      }
    });

  }).catch( () => {
    alert("Sistem or Your Location Not Found.")
  })

}

function getInputCity() {
  const city = inputCity.value.trim();
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  if (city === "") return alert("Please enter location.");
  fetch(API_URL).then(response => response.json()).then(data => {
    const { name, lat, lon } = data[0];
    getDetailWeather(name, lat, lon);
  }).catch(() => {
    alert("Location Not Found.");
  })
}

function currentLocation() {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { longitude, latitude } = position.coords;
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      fetch(API_URL).then(response => response.json()).then(data => {
        const { name } = data.city;
        getDetailWeather(name , latitude, longitude)
      }) 
    }, error => {
      if(error.code === error.PERMISSION_DENIED) {
        alert("")
      } else {
        alert("")
      }
    }
  )
}


btnSeach.addEventListener("click", () => {
  getInputCity();
});
inputCity.addEventListener( "keydown", (e) => {
  if(e.key === "Enter") {
    getInputCity();
  }
});
btnLocation.addEventListener("click", () => {
  currentLocation();
})
