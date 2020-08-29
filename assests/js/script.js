let cities = [];

const api = {
  key: "45706455bc2c4824123926c813998ea6",
  base: "https://api.openweathermap.org/data/2.5/"
};

const getDateFormat = timeZoneOffSet => {
  // referece on stackoverflow: https://stackoverflow.com/questions/62690963/how-can-i-get-the-current-time-using-timezone-offset-using-moment-js
  // Convert TimeZone to to Current Date in MM/DD/YYYY
  const timezoneInMinutes = timeZoneOffSet / 60;
  const currTime = moment()
    .utcOffset(timezoneInMinutes)
    .format("MM/DD/YYYY");

  return currTime;
};

const convertDttoDate = dt => {
  const currentDT = dt; // unix timestamp in seconds
  const timezone = 3600; // zone in seconds

  // moment.unix - Unix Timestamp (seconds)
  const dateTime = moment
    .unix(currentDT)
    .utc()
    .add(timezone, "s");

  return moment(dateTime).format("MM/DD/YYYY");
};

//  fetch data from weather API
const fetchWeather = searchCityInput => {
  // this URL fetch to get the lat and lon: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  fetch(
    `${api.base}weather?q=${searchCityInput}&units=imperial&appid=${api.key}`
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      // let timezone = data.timezone;
      let lon = data.coord.lon;
      let lat = data.coord.lat;

      // 7 Days Forcast: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}
      fetch(
        `${api.base}onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${api.key}`
      )
        .then(response => {
          return response.json();
        })
        .then(dataDays => {
          console.log(dataDays);
          displayCurrentDateWeather(searchCityInput, dataDays);
          displayDaysForcast(dataDays);
        });
    })
    .catch(() => {
      alert("Please fill in a valid city");
    });
};

// Display Current Date Weather
const displayCurrentDateWeather = (searchCityInput, dataDays) => {
  let currentDate = document.querySelector(".currentDate");
  let currentUVIndex = document.querySelector(".currentUVIndex");

  let currentDayWeather = dataDays.daily[0];
  let currentDayUVI = dataDays.daily[0].uvi;

  let currTime = getDateFormat(dataDays.timezone_offset);

  let currentCityName = document.querySelector("#currentCityName");
  let currentTemperature = document.querySelector(".currentTemperature");
  let currentHumidity = document.querySelector(".currentHumidity");
  let currentWindSpeed = document.querySelector(".currentWindSpeed");

  if (searchCityInput) {
    currentCityName.innerHTML = searchCityInput;
    currentTemperature.innerHTML = currentDayWeather.temp.day;
    currentHumidity.innerHTML = currentDayWeather.humidity;
    currentWindSpeed.innerHTML = currentDayWeather["wind_speed"];
  }

  currentDate.innerHTML = `(${currTime})`;
  if (currentDayUVI >= 8) {
    currentUVIndex.classList.remove("background-yellow");
    currentUVIndex.classList.remove("background-green");
    currentUVIndex.classList.add("background-red");
    currentUVIndex.innerHTML = currentDayUVI;
  } else if (currentDayUVI < 8 && currentDayUVI >= 3) {
    currentUVIndex.classList.remove("background-red");
    currentUVIndex.classList.remove("background-green");
    currentUVIndex.classList.add("background-yellow");
    currentUVIndex.innerHTML = currentDayUVI;
  } else {
    currentUVIndex.classList.remove("background-yellow");
    currentUVIndex.classList.remove("background-red");
    currentUVIndex.classList.add("background-green");
    currentUVIndex.innerHTML = currentDayUVI;
  }
};

// Display future 5 Days Forcast
const displayDaysForcast = dataDays => {
  let dayOneTime = convertDttoDate(dataDays.daily[1].dt);
  let dayTwoTime = convertDttoDate(dataDays.daily[2].dt);
  let dayThreeTime = convertDttoDate(dataDays.daily[3].dt);
  let dayFourTime = convertDttoDate(dataDays.daily[4].dt);
  let dayFiveTime = convertDttoDate(dataDays.daily[5].dt);

  let dayOne = document.querySelector(".dayOne");
  let dayOneTemp = document.querySelector(".dayOneTemp");
  let dayOneHumidity = document.querySelector(".dayOneHumidity");

  let dayTwo = document.querySelector(".dayTwo");
  let dayTwoTemp = document.querySelector(".dayTwoTemp");
  let dayTwoHumidity = document.querySelector(".dayTwoHumidity");

  let dayThree = document.querySelector(".dayThree");
  let dayThreeTemp = document.querySelector(".dayThreeTemp");
  let dayThreeHumidity = document.querySelector(".dayThreeHumidity");

  let dayFour = document.querySelector(".dayFour");
  let dayFourTemp = document.querySelector(".dayFourTemp");
  let dayFourHumidity = document.querySelector(".dayFourHumidity");

  let dayFive = document.querySelector(".dayFive");
  let dayFiveTemp = document.querySelector(".dayFiveTemp");
  let dayFiveHumidity = document.querySelector(".dayFiveHumidity");

  dayOne.innerHTML = dayOneTime;
  dayOneTemp.innerHTML = dataDays.daily[1].temp.day;
  dayOneHumidity.innerHTML = dataDays.daily[1].humidity;

  dayTwo.innerHTML = dayTwoTime;
  dayTwoTemp.innerHTML = dataDays.daily[2].temp.day;
  dayTwoHumidity.innerHTML = dataDays.daily[2].humidity;

  dayThree.innerHTML = dayThreeTime;
  dayThreeTemp.innerHTML = dataDays.daily[3].temp.day;
  dayThreeHumidity.innerHTML = dataDays.daily[3].humidity;

  dayFour.innerHTML = dayFourTime;
  dayFourTemp.innerHTML = dataDays.daily[4].temp.day;
  dayFourHumidity.innerHTML = dataDays.daily[4].humidity;

  dayFive.innerHTML = dayFiveTime;
  dayFiveTemp.innerHTML = dataDays.daily[5].temp.day;
  dayFiveHumidity.innerHTML = dataDays.daily[5].humidity;
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
