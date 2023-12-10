import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "swiper/css/bundle";
import "./style/style.css";
import "./scripts/components/navBar.js";
import "./scripts/components/endBar.js";
import "./scripts/components/loader.js";
import currentWeather from "./scripts/view/currentWeather.js";
import forecastWeather from "./scripts/view/forecastWeather.js";
import swiperConfiguration from "./scripts/configuration/swiperConfiguration.js";
import hideLoader from "./scripts/view/loader.js";
import iconTab from "./images/logo-1.png";

document.addEventListener("DOMContentLoaded", () => {
  const headElement = document.head;
  headElement.innerHTML += `<link rel="shortcut icon" href="${iconTab}" />`;

  currentWeather();
  forecastWeather();
  hideLoader();
  swiperConfiguration();
});
