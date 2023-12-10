import axios from "axios";
import formatDtTxtDate from "../configuration/formatDtTxtDate.js";
import formatDtTxtTime from "../configuration/formatDtTxtTime.js";
import { cursor } from "../data/icons.js";
import getIcon from "../data/getIcon.js";
import {
  API_KEY,
  BASE_URL,
  DEFAULT_LAT,
  DEFAULT_LON,
  STORAGE_KEY_LAT,
  STORAGE_KEY_LON,
} from "../data/options.js";

const forecastWeather = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const DATA_RECEIVED_LAT = urlParams.get("lat");
  const DATA_RECEIVED_LON = urlParams.get("lon");
  const DATA_RECEIVED_LAT_SEARCH = urlParams.get("lat_search");
  const DATA_RECEIVED_LON_SEARCH = urlParams.get("lon_search");

  const getLocation = () => {
    let userLat = localStorage.getItem(STORAGE_KEY_LAT);
    let userLon = localStorage.getItem(STORAGE_KEY_LON);

    if (
      DATA_RECEIVED_LAT_SEARCH !== null &&
      DATA_RECEIVED_LON_SEARCH !== null
    ) {
      fetchForecastWeather(DATA_RECEIVED_LAT_SEARCH, DATA_RECEIVED_LON_SEARCH);
    } else if (DATA_RECEIVED_LAT !== null && DATA_RECEIVED_LON !== null) {
      fetchForecastWeather(DATA_RECEIVED_LAT, DATA_RECEIVED_LON);
      localStorage.setItem(STORAGE_KEY_LAT, DATA_RECEIVED_LAT);
      localStorage.setItem(STORAGE_KEY_LON, DATA_RECEIVED_LON);
    } else if (userLat !== null && userLon !== null) {
      fetchForecastWeather(userLat, userLon);
    } else {
      fetchForecastWeather(DEFAULT_LAT, DEFAULT_LON);
    }
  };

  const createForecastWeatherElements = (datas) => {
    const weatherElements = datas.list.map((data) => {
      return `
        <div class="swiper-slide">
          <div class="p-2">
            <div class="p-2">
              <h6 class="fw-normal">${formatDtTxtDate(data.dt_txt)}</h6>
              <h6 class="fw-normal m-0 mb-3">${formatDtTxtTime(
                data.dt_txt
              )}</h6>
              ${getIcon(data.weather[0].icon, 30, 30)}
              <h6 class="fw-normal m-0 mt-3">${Math.ceil(
                data.main.temp - 273.15
              )}&deg;C</h6>
            </div>
          </div>
        </div>
      `;
    });

    return weatherElements.join("");
  };

  const renderForecastWeather = (response) => {
    const creteElement = document.getElementById("today-at-content");
    creteElement.innerHTML = "";
    creteElement.innerHTML += createForecastWeatherElements(response);

    const textTitle = document.getElementById("text-today-at");
    textTitle.innerHTML = "";
    textTitle.innerHTML = `<h4 class="mb-3 text-light">Today At</h4>`;
  };

  const createWindSpeedElements = (datas) => {
    const weatherElements = datas.list.map((data) => {
      return `
        <div class="swiper-slide">
          <div class="p-2">
            <div class="p-2">
              <h6 class="fw-normal">${formatDtTxtDate(data.dt_txt)}</h6>
              <h6 class="fw-normal m-0 mb-3">${formatDtTxtTime(
                data.dt_txt
              )}</h6>
              ${cursor(30, 30, data.wind.deg)}
              <h6 class="fw-normal m-0 mt-3">${data.wind.gust.toFixed(
                1
              )}km/h</h6>
            </div>
          </div>
        </div>
      `;
    });

    return weatherElements.join("");
  };

  const renderWindSpeed = (response) => {
    const creteElement = document.getElementById("wind-speed");
    creteElement.innerHTML = "";
    creteElement.innerHTML += createWindSpeedElements(response);
  };

  const fetchForecastWeather = (LATITUDE, LONGITUDE) => {
    const options = { headers: { accept: "application/json" } };

    axios
      .get(
        `${BASE_URL}forecast?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}`,
        options
      )
      .then((response) => {
        renderForecastWeather(response.data);
        renderWindSpeed(response.data);
        processWeatherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createFiveDaysElements = (datas) => {
    const remainingData = datas.slice(1);
    const fiveDaysElements = remainingData.map((data) => {
      return `
        <div class="box-forecast rounded-1 p-3 col-12 col-md-6 col-lg-12">
          <div class="d-flex justify-content-between align-items-center gap-2">
            <div>
              <h6 class="fw-normal">${formatDtTxtDate(
                data.result.data_txt
              )}</h6>
              <div class="d-flex align-items-center gap-2">
              ${getIcon(data.result.weather.icon, 30, 30)}
                <h6 class="fw-normal">${data.result.weather.description}</h6>
              </div>
            </div>
              <h4 class="fw-normal m-0">${Math.ceil(
                data.result.temp - 273.15
              )}&degC</h4>
          </div>
        </div>
    `;
    });

    return fiveDaysElements.join("");
  };

  const renderFiveDays = (resultData) => {
    const creteElement = document.getElementById("five-days");
    creteElement.innerHTML = "";
    creteElement.innerHTML += createFiveDaysElements(resultData);

    const textTitle = document.getElementById("text-five-day");
    textTitle.innerHTML = "";
    textTitle.innerHTML = `<h4 class="mb-3 text-light">5-Days Forecast</h4>`;
  };

  const processWeatherData = (data) => {
    const groupedForecast = {};

    data.list.forEach((forecast) => {
      const date = forecast.dt_txt.split(" ")[0];
      if (!groupedForecast[date]) {
        groupedForecast[date] = [];
      }
      groupedForecast[date].push(forecast);
    });

    const calculateAverageTemp = (forecasts) => {
      const totalTemp = forecasts.reduce(
        (acc, forecast) => acc + forecast.main.temp,
        0
      );
      return totalTemp / forecasts.length;
    };

    const resultData = [];

    for (const date in groupedForecast) {
      if (Object.hasOwnProperty.call(groupedForecast, date)) {
        const forecasts = groupedForecast[date];
        const averageTemp = calculateAverageTemp(forecasts);

        const weatherCount = {};
        let mostCommonWeather = null;
        forecasts.forEach((forecast) => {
          const description = forecast.weather[0].description;
          if (!weatherCount[description]) {
            weatherCount[description] = 0;
          }
          weatherCount[description]++;
          if (
            !mostCommonWeather ||
            weatherCount[description] > weatherCount[mostCommonWeather]
          ) {
            mostCommonWeather = description;
          }
        });

        const resultObj = {
          result: {
            data_txt: date,
            temp: averageTemp,
            weather: {
              description: mostCommonWeather,
              icon: forecasts[0].weather[0].icon,
            },
          },
        };
        resultData.push(resultObj);
      }
    }
    // console.log(resultData);
    renderFiveDays(resultData);
  };

  getLocation();
};

export default forecastWeather;
