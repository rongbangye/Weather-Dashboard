let cities = [];

//  fetch data from weather API
const fetchWeather = searchCityInput => {
  let API = "45706455bc2c4824123926c813998ea6";
  let API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCityInput}&appid=${API}`;

  fetch(API_URL)
    .then(response => {
      return response.json();
    })
    .then(data => {
      displayWeatherData(searchCityInput, data);
    })
    .catch(() => {
      alert("Incorrect City");
    });
};

const displayWeatherData = (searchCityInput, data) => {
  let currentCityName = document.querySelector("#currentCityName");
  let currentDate = document.querySelector(".currentDate");
  let currentTemperature = document.querySelector(".currentTemperature");
  let currentHumidity = document.querySelector(".currentHumidity");
  let currentWindSpeed = document.querySelector(".currentWindSpeed");
  let currentUVIndex = document.querySelector(".currentUVIndex");

  let current = data.list[0];

  if (searchCityInput) {
    currentCityName.innerHTML = data.city.name;
    currentDate.innerHTML = `(${current["dt_txt"]})`;
    currentTemperature.innerHTML = current.main.temp;
    currentHumidity.innerHTML = current.main.humidity;
    currentWindSpeed.innerHTML = current.wind.speed;
    // currentUVIndex.innerHTML = current.main.temp;
  }

  console.log(data);
  console.log(data.list);
  console.log(data.list[0]["dt_txt"]);
};

const renderMyCities = () => {
  document.querySelector("#searchCityInput").value = "";
  let searchCityList = document.querySelector(".main_searchCityList");
  let myCities = JSON.parse(localStorage.getItem("mySearchCities"));
  searchCityList.innerHTML = myCities
    .map(city => {
      return `<h3>${city}</h3>`;
    })
    .join("");

  let currentCity = myCities.length;
  if (currentCity !== 0) {
    fetchWeather(myCities[currentCity - 1]);
  }
};

const searchWeather = event => {
  event.preventDefault();
  let searchCityInput = document.querySelector("#searchCityInput").value;

  cities.push(searchCityInput);
  localStorage.setItem("mySearchCities", JSON.stringify(cities));

  renderMyCities();
};

// render cities that store at the local storage
renderMyCities();
