import {
  clearSkyAm,
  clearSkyPm,
  fewCloudsAm,
  fewCloudsPm,
  scatteredCloudsAmPm,
  brokenCloudsAmPm,
  showerRainAmPm,
  rainAmPm,
  thunderstormAmPm,
  snowAmPm,
  mistAmPm,
} from "../data/icons.js";

const getIcon = (data, width, height) => {
  let iconWeather;
  if (data == "01d") {
    iconWeather = clearSkyAm(width, height);
  } else if (data == "01n") {
    iconWeather = clearSkyPm(width, height);
  } else if (data == "02d") {
    iconWeather = fewCloudsAm(width, height);
  } else if (data == "02n") {
    iconWeather = fewCloudsPm(width, height);
  } else if (data == "03d") {
    iconWeather = scatteredCloudsAmPm(width, height);
  } else if (data == "03n") {
    iconWeather = scatteredCloudsAmPm(width, height);
  } else if (data == "04d") {
    iconWeather = brokenCloudsAmPm(width, height);
  } else if (data == "04n") {
    iconWeather = brokenCloudsAmPm(width, height);
  } else if (data == "09d") {
    iconWeather = showerRainAmPm(width, height);
  } else if (data == "09n") {
    iconWeather = showerRainAmPm(width, height);
  } else if (data == "10d") {
    iconWeather = rainAmPm(width, height);
  } else if (data == "10n") {
    iconWeather = rainAmPm(width, height);
  } else if (data == "11d") {
    iconWeather = thunderstormAmPm(width, height);
  } else if (data == "11n") {
    iconWeather = thunderstormAmPm(width, height);
  } else if (data == "13d") {
    iconWeather = snowAmPm(width, height);
  } else if (data == "13n") {
    iconWeather = snowAmPm(width, height);
  } else if (data == "50d") {
    iconWeather = mistAmPm(width, height);
  } else if (data == "50n") {
    iconWeather = mistAmPm(width, height);
  }
  return iconWeather;
};

export default getIcon;
