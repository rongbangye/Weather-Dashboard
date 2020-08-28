let cities = [];

const api = {
  key: "45706455bc2c4824123926c813998ea6",
  base: "https://api.openweathermap.org/data/2.5/"
};

//  fetch data from weather API
const fetchWeather = searchCityInput => {
  let API = "45706455bc2c4824123926c813998ea6";

  // Current Day Weather URL: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  // let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityInput}&units=imperial&appid=${API}`;

  // 5 Day URL:  api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={your api key}
  // let API_URL_FORCAST = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCityInput}&units=imperial&appid=${API}`;

  fetch(
    `${api.base}weather?q=${searchCityInput}&units=imperial&appid=${api.key}`
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      let lon = data.coord.lon;
      let lat = data.coord.lat;
      // UV index: http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
      // let API_URL_CurrentDay = `http://api.openweathermap.org/data/2.5/uvi?appid=${API}&lat=${lat}&lon=${lon}`;

      // Fetch UV index and date
      fetch(`${api.base}uvi?appid=${api.key}&lat=${lat}&lon=${lon}`)
        .then(response => {
          return response.json();
        })
        .then(data => {
          updateUVandDate(data);
        });

      displayCurrentWeather(searchCityInput, data);

      // Fetch 5 Days Forcast
      fetch(
        `${api.base}forecast?q=${searchCityInput}&units=imperial&appid=${api.key}`
      )
        .then(response => {
          return response.json();
        })
        .then(dataDays => {
          displayDaysForcast(dataDays);
        });
    })
    .catch(() => {
      alert("Please fill in a valid city");
    });
};

// Display UV and Current Date
const updateUVandDate = data => {
  let now = moment.utc(data.date_iso).format("MM/DD/YYYY");
  let currentDate = document.querySelector(".currentDate");
  let currentUVIndex = document.querySelector(".currentUVIndex");

  currentDate.innerHTML = `(${now})`;
  currentUVIndex.innerHTML = data.value;
};

// Display 5 Day Forcast
const displayDaysForcast = dataDays => {
  let dataDayOne = dataDays.list[5];
  let dayOne = document.querySelector(".dayOne");
  let dayOneTemp = document.querySelector(".dayOneTemp");
  let dayOneHumidity = document.querySelector(".dayOneHumidity");

  let dataDayTwo = dataDays.list[13];
  let dayTwo = document.querySelector(".dayTwo");
  let dayTwoTemp = document.querySelector(".dayTwoTemp");
  let dayTwoHumidity = document.querySelector(".dayTwoHumidity");

  let dataDayThree = dataDays.list[21];
  let dayThree = document.querySelector(".dayThree");
  let dayThreeTemp = document.querySelector(".dayThreeTemp");
  let dayThreeHumidity = document.querySelector(".dayThreeHumidity");

  let dataDayFour = dataDays.list[29];
  let dayFour = document.querySelector(".dayFour");
  let dayFourTemp = document.querySelector(".dayFourTemp");
  let dayFourHumidity = document.querySelector(".dayFourHumidity");

  let dataDayFive = dataDays.list[37];
  let dayFive = document.querySelector(".dayFive");
  let dayFiveTemp = document.querySelector(".dayFiveTemp");
  let dayFiveHumidity = document.querySelector(".dayFiveHumidity");

  dayOne.innerHTML = moment.utc(dataDayOne["dt_txt"]).format("MM/DD/YYYY");
  dayOneTemp.innerHTML = dataDayOne.main.temp;
  dayOneHumidity.innerHTML = dataDayOne.main.humidity;

  dayTwo.innerHTML = moment.utc(dataDayTwo["dt_txt"]).format("MM/DD/YYYY");
  dayTwoTemp.innerHTML = dataDayTwo.main.temp;
  dayTwoHumidity.innerHTML = dataDayTwo.main.humidity;

  dayThree.innerHTML = moment.utc(dataDayThree["dt_txt"]).format("MM/DD/YYYY");
  dayThreeTemp.innerHTML = dataDayThree.main.temp;
  dayThreeHumidity.innerHTML = dataDayThree.main.humidity;

  dayFour.innerHTML = moment.utc(dataDayFour["dt_txt"]).format("MM/DD/YYYY");
  dayFourTemp.innerHTML = dataDayFour.main.temp;
  dayFourHumidity.innerHTML = dataDayFour.main.humidity;

  dayFive.innerHTML = moment.utc(dataDayFive["dt_txt"]).format("MM/DD/YYYY");
  dayFiveTemp.innerHTML = dataDayFive.main.temp;
  dayFiveHumidity.innerHTML = dataDayFive.main.humidity;
};

// Display the current Weather
const displayCurrentWeather = (searchCityInput, data) => {
  let currentCityName = document.querySelector("#currentCityName");
  let currentTemperature = document.querySelector(".currentTemperature");
  let currentHumidity = document.querySelector(".currentHumidity");
  let currentWindSpeed = document.querySelector(".currentWindSpeed");

  if (searchCityInput) {
    currentCityName.innerHTML = data.name;
    currentTemperature.innerHTML = data.main.temp;
    currentHumidity.innerHTML = data.main.humidity;
    currentWindSpeed.innerHTML = data.wind.speed;
  }
};

// Display Search Cities History
const renderMyCities = () => {
  document.querySelector("#searchCityInput").value = "";
  let searchCityList = document.querySelector(".main_searchCityList");
  let myCities = JSON.parse(localStorage.getItem("mySearchCities"));
  if (myCities !== null) {
    searchCityList.innerHTML = myCities
      .slice(0)
      .reverse()
      .map(city => {
        return `<h3>${city}</h3>`;
      })
      .join("");
  }

  let currentCity = myCities.length;
  if (currentCity > 0) {
    fetchWeather(myCities[currentCity - 1]);
  }
};

// This function fires when click the search button or hit enter
// Save the input into localStorage
const searchWeather = event => {
  event.preventDefault();
  let searchCityInput = document.querySelector("#searchCityInput").value;

  cities.push(searchCityInput);
  localStorage.setItem("mySearchCities", JSON.stringify(cities));

  renderMyCities();
};

// render cities that store at the local storage
renderMyCities();
