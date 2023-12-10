import axios from "axios";
import sunrise from "../../images/sunrise.jpg";
import pagi from "../../images/pagi.jpg";
import siang from "../../images/siang.jpg";
import sore from "../../images/sore.jpg";
import sunset from "../../images/sunset.jpg";
import malam from "../../images/malam.jpg";
import malam2 from "../../images/malam2.jpg";
import {
  clearSkyAm,
  clearSkyPm,
  airQuality,
  humidity,
  pressure,
  visibility,
  feelsLike,
  location,
} from "../data/icons.js";
import getIcon from "../data/getIcon.js";
import {
  API_KEY,
  BASE_URL,
  DEFAULT_LAT,
  DEFAULT_LON,
  STORAGE_KEY_LAT,
  STORAGE_KEY_LON,
} from "../data/options.js";
import formatDtTime from "../configuration/formateDtTime.js";

const currentWeather = () => {
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
      fetchCurrentWeather(DATA_RECEIVED_LAT_SEARCH, DATA_RECEIVED_LON_SEARCH);
    } else if (DATA_RECEIVED_LAT !== null && DATA_RECEIVED_LON !== null) {
      fetchCurrentWeather(DATA_RECEIVED_LAT, DATA_RECEIVED_LON);
      localStorage.setItem(STORAGE_KEY_LAT, DATA_RECEIVED_LAT);
      localStorage.setItem(STORAGE_KEY_LON, DATA_RECEIVED_LON);
    } else if (userLat !== null && userLon !== null) {
      fetchCurrentWeather(userLat, userLon);
    } else {
      fetchCurrentWeather(DEFAULT_LAT, DEFAULT_LON);
    }
  };

  const getBackground = (dt, timezone) => {
    const time = dt * 1000;
    const currentHour = new Date(time).getHours();
    const currentTime = new Date();

    let backgroundUrl = "";
    if (currentHour >= 6 && currentHour < 10) {
      backgroundUrl = pagi;
    } else if (currentHour >= 10 && currentHour < 15) {
      backgroundUrl = siang;
    } else if (currentHour >= 15 && currentHour < 17) {
      backgroundUrl = sore;
    } else if (currentHour >= 17 && currentHour < 18) {
      backgroundUrl = sunset;
    } else if (currentHour >= 18 && currentHour < 24) {
      backgroundUrl = malam;
    } else if (currentHour >= 0 && currentHour < 5) {
      backgroundUrl = malam2;
    } else if (currentHour >= 5 && currentHour < 6) {
      backgroundUrl = sunrise;
    }

    const nextHour = new Date(currentTime);
    nextHour.setHours(currentTime.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    const timeUntilNextHour = nextHour - currentTime;

    setTimeout(() => {
      location.reload();
    }, timeUntilNextHour);

    return backgroundUrl;
  };

  const createCurrentWeatherElement = (data) => {
    return `
      <div class="d-flex align-items-center mb-3">
        ${location(16, 16)}
        <h6 class="m-0 fw-normal">${data.name + ", " + data.sys.country}</h6>
      </div>
      <div
        class="content-temp d-flex flex-column justify-content-center align-items-center"
      >
        <h4 class="mb-3">Now</h4>
        ${getIcon(data.weather[0].icon, 80, 80)}
        <div class="degree-box d-flex align-items-start mb-3">
          <h1 class="text-temp fw-normal m-0">
            ${Math.ceil(data.main.temp - 273.15)}
          </h1>
          <span class="degree">&deg;C</span>
        </div>
        <h5 class="fw-light text-capitalize m-0">
          ${data.weather[0].description} ${Math.ceil(
      data.main.temp_max - 273.15
    )}&deg; / ${Math.ceil(data.main.temp_min - 273.15)}&deg C
        </h5>
      </div>
      `;
  };

  const renderCurrentWeather = (response) => {
    const creteElement = document.getElementById("location");
    creteElement.innerHTML = "";
    creteElement.innerHTML += createCurrentWeatherElement(response);

    document.body.style.backgroundImage = `url(${getBackground(
      response.dt,
      response.timezone
    )})`;
  };

  const createHiglightElement = (dataHighlight, dataCurrent) => {
    return `
    <h4 class="mb-3">Highlight Today's</h4>
    <div class="higlight-1">
      <div id="air-quality-index" class="air-quality-index rounded-1 pt-3 ps-3 pe-3 pb-0">
      <h6 class="fw-normal text-center mb-3">Air Quality Index</h6>
      <div class="d-flex justify-content-between align-items-center">
        ${airQuality(30, 30)}
        <div class="d-flex flex-column justify-content-center align-items-center">
          <h6 class="fw-normal">PM25</h6>
          <h3 class="fw-normal m-0">
            ${dataHighlight.list[0].components.pm2_5.toFixed(1)}
          </h3>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center">
          <h6 class="fw-normal">SO2</h6>
          <h3 class="fw-normal m-0">
            ${dataHighlight.list[0].components.so2.toFixed(1)}
          </h3>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center">
          <h6 class="fw-normal">NO2</h6>
          <h3 class="fw-normal m-0">
            ${dataHighlight.list[0].components.no2.toFixed(1)}
          </h3>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center">
          <h6 class="fw-normal">O3</h6>
          <h3 class="fw-normal m-0">
            ${dataHighlight.list[0].components.o3.toFixed(1)}
          </h3>
        </div>
      </div>
      </div>
      <div class="sunrise-sunset rounded-1 p-3">
        <h6 class="fw-normal text-center mb-3">Sunrise & Sunset</h6>
        <div
          class="d-flex align-items-center justify-content-center gap-4 justify-content-md-between gap-md-1"
        >
          <div class="d-flex justify-content-between align-items-center gap-3">
            ${clearSkyAm(30, 30)}
            <div
              class="d-flex flex-column justify-content-center align-items-center"
            >
              <h6 class="fw-normal">Sunrise</h6>
              <h3 class="fw-normal m-0">${formatDtTime(
                dataCurrent.sys.sunrise
              )}</h3>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center gap-3">
            ${clearSkyPm(30, 30)}
            <div
              class="d-flex flex-column justify-content-center align-items-center"
            >
              <h6 class="fw-normal">Sunset</h6>
              <h3 class="fw-normal m-0">${formatDtTime(
                dataCurrent.sys.sunset
              )}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="higlight-2 gap-0 gap-lg-3">
      <div class="humidity rounded-1 p-3">
        <h6 class="fw-normal mb-3 text-center">Humidity</h6>
        <div class="d-flex justify-content-center gap-1 align-items-center">
          ${humidity(30, 30)}
          <h3 class="fw-normal m-0">
            ${dataCurrent.main.humidity} <span class="fs-6">%</span>
          </h3>
        </div>
      </div>
      <div class="pressure rounded-1 p-3">
        <h6 class="fw-normal text-center mb-3">Pressure</h6>
        <div class="d-flex justify-content-center gap-1 align-items-center">
          ${pressure(30, 30)}
          <h3 class="fw-normal m-0">
            ${dataCurrent.main.pressure} <span class="fs-6">hPa</span>
          </h3>
        </div>
      </div>
      <div class="visibility rounded-1 p-3">
        <h6 class="fw-normal text-center mb-3">Visibility</h6>
        <div class="d-flex justify-content-center gap-1 align-items-center">
          ${visibility(30, 30)}
          <h3 class="fw-normal m-0">
            ${(dataCurrent.visibility / 1000).toFixed(1)}
            <span class="fs-6">Km</span>
          </h3>
        </div>
      </div>
      <div class="feels-like rounded-1 p-3">
        <h6 class="fw-normal text-center mb-3">Fells Like</h6>
        <div class="d-flex justify-content-center gap-1 align-items-center">
          ${feelsLike(30, 30)}
          <h3 class="fw-normal m-0">
            ${Math.ceil(dataCurrent.main.feels_like - 273.15)}
            <span class="fs-6">&degC</span>
          </h3>
        </div>
      </div>
    </div>
    `;
  };

  const renderHiglightToday = (dataHighlight, dataCurrent) => {
    const creteElement = document.getElementById("higlight-today");
    creteElement.innerHTML = "";
    creteElement.innerHTML += createHiglightElement(dataHighlight, dataCurrent);
  };

  const fetchCurrentWeather = (LATITUDE, LONGITUDE) => {
    const options = { headers: { accept: "application/json" } };

    axios
      .get(
        `${BASE_URL}weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}`,
        options
      )
      .then((response) => {
        fetchAirQualityIndex(LATITUDE, LONGITUDE, response.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchAirQualityIndex = (LATITUDE, LONGITUDE, dataCurrent) => {
    const options = { method: "GET", headers: { accept: "application/json" } };
    axios
      .get(
        `${BASE_URL}air_pollution?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}`,
        options
      )
      .then((response) => {
        renderCurrentWeather(dataCurrent);
        renderHiglightToday(response.data, dataCurrent);
      })
      .catch((err) => console.error(err));
  };

  getLocation();
};

export default currentWeather;
