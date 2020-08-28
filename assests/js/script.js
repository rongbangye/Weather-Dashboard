let cities = [];

//  fetch data from weather API
const fetchWeather = searchCityInput => {
  console.log(searchCityInput);
  let API = "45706455bc2c4824123926c813998ea6";
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityInput}&appid=${API}`;
  console.log(API_URL);
  // api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={your api key}
  let API_URL_FORCAST = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCityInput}&appid=${API}`;
  console.log(API_URL_FORCAST);

  fetch(API_URL)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayWeatherData(searchCityInput, data);
      let dataDays = fetch(API_URL_FORCAST)
        .then(response => {
          return response.json();
        })
        .then(dataDays => {
          displayDaysForcast(dataDays);
        });
    })
    .catch(() => {
      console.log("Incorrect City");
    });
};

const displayDaysForcast = dataDays => {
  let dataDayOne = dataDays.list[0];
  let dayOne = document.querySelector(".dayOne");
  let dayOneTemp = document.querySelector(".dayOneTemp");
  let dayOneHumidity = document.querySelector(".dayOneHumidity");

  console.log(dataDayOne);

  dayOne.innerHTML = dataDayOne["dt_txt"];
  dayOneTemp.innerHTML = dataDayOne.main.temp;
  dayOneHumidity.innerHTML = dataDayOne.main.humidity;
};

const displayWeatherData = (searchCityInput, data) => {
  let currentCityName = document.querySelector("#currentCityName");
  let currentDate = document.querySelector(".currentDate");
  let currentTemperature = document.querySelector(".currentTemperature");
  let currentHumidity = document.querySelector(".currentHumidity");
  let currentWindSpeed = document.querySelector(".currentWindSpeed");
  let currentUVIndex = document.querySelector(".currentUVIndex");

  if (searchCityInput) {
    currentCityName.innerHTML = data.name;
    currentDate.innerHTML = "";
    currentTemperature.innerHTML = data.main.temp;
    currentHumidity.innerHTML = data.main.humidity;
    currentWindSpeed.innerHTML = data.wind.speed;
    // currentUVIndex.innerHTML = current.main.temp;
  }

  console.log(data);
};

const renderMyCities = () => {
  document.querySelector("#searchCityInput").value = "";
  let searchCityList = document.querySelector(".main_searchCityList");
  let myCities = JSON.parse(localStorage.getItem("mySearchCities"));
  if (myCities !== null) {
    searchCityList.innerHTML = myCities
      .map(city => {
        return `<h3>${city}</h3>`;
      })
      .join("");
  }

  let currentCity = myCities.length;
  if (currentCity > 0) {
    console.log(myCities[currentCity - 1]);
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
