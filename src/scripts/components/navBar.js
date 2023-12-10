import logo from "../../images/logo.png";
import axios from "axios";
import {
  API_KEY,
  BASE_URL,
  DEFAULT_LAT,
  DEFAULT_LON,
  STORAGE_KEY_LAT,
  STORAGE_KEY_LON,
} from "../data/options.js";
import { gps } from "../data/icons.js";
import getIcon from "../data/getIcon.js";

class NavBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg bg-transparent sticky-top" data-bs-theme="dark">
        <div class="container">
          <a class="navbar-brand" href="index.html">
            <img src="${logo}" alt="" style="width: 8rem" />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
          <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse mt-2 mt-lg-0"
            id="navbarSupportedContent"
            data-bs-theme="light"
          >
            <div class="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
              <form class="search d-flex" role="search">
                <input
                  id="search"
                  class="form-control me-2 w-100"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  id="button-search"
                  class="btn btn-outline-light"
                  type="submit"
                >
                  Search
                </button>
                <div id="overlay-search" class="overlay-search rounded"></div>
              </form>
            </div>
            <button
              id="button-location"
              type="button"
              class="button-location btn btn-light d-flex align-items-center justify-content-center"
            >
              <p class="button-location-p m-0 pe-2">Location</p>
              ${gps(18, 18)}
            </button>
          </div>
        </div>
      </nav>
    `;

    const creteElement = document.getElementById("overlay-search");
    const buttonSearch = document.getElementById("button-search");
    const overlaySearch = document.getElementById("overlay-search");
    const buttonLocation = document.getElementById("button-location");

    const createSearchElement = (data) => {
      return `
        <button
          id="button-submit"
          class="border-0 p-3 d-flex justify-content-between align-items-center w-100 bg-transparent text-dark"
          type="submit"
        >
          <h6 class="fw-normal m-0">${data.name}, ${data.sys.country}</h6>
          <h6 class="fw-normal m-0">${Math.ceil(
            data.main.temp - 273.15
          )}&degC</h6>
          ${getIcon(data.weather[0].icon, 30, 30)}
          <h6 class="fw-normal m-0">${data.coord.lat}, ${data.coord.lon}</h6>
        </button>
      `;
    };

    const clickSubmit = (data) => {
      const buttonSubmit = document.getElementById("button-submit");
      buttonSubmit.addEventListener("click", (event) => {
        event.preventDefault();
        const url = `index.html?lat_search=${data.coord.lat}&lon_search=${data.coord.lon}`;
        window.location.href = url;
      });
    };

    const renderSearch = (response) => {
      creteElement.innerHTML = "";
      creteElement.innerHTML += createSearchElement(response);

      clickSubmit(response);
    };

    const renderError = () => {
      creteElement.innerHTML = "";
      creteElement.innerHTML += `
        <div class="p-3">
          <h6 class="fw-normal m-0">City not found. Please try again.</h6>
        </div>
      `;
    };

    const fetchSearch = (keyword) => {
      axios
        .get(`${BASE_URL}weather?q=${keyword}&appid=${API_KEY}`)
        .then((response) => {
          renderSearch(response.data);
        })
        .catch(() => {
          renderError();
        });
    };

    buttonSearch.addEventListener("click", (event) => {
      event.preventDefault();
      creteElement.innerHTML = "";
      overlaySearch.style.display = "block";
    });

    document.addEventListener("click", (event) => {
      if (
        overlaySearch.style.display === "block" &&
        !overlaySearch.contains(event.target) &&
        event.target !== buttonSearch
      ) {
        overlaySearch.style.display = "none";
      }
    });

    buttonSearch.addEventListener("click", (event) => {
      event.preventDefault();
      const keyword = document.getElementById("search").value;
      if (keyword.length > 0) {
        fetchSearch(keyword);
      } else {
        alert("Harap isi kolom pencarian.");
      }
    });

    buttonLocation.addEventListener("click", (event) => {
      event.preventDefault();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const USER_LAT = position.coords.latitude;
          const USER_LON = position.coords.longitude;

          localStorage.setItem(STORAGE_KEY_LAT, USER_LAT);
          localStorage.setItem(STORAGE_KEY_LON, USER_LON);

          const url = `index.html?lat=${USER_LAT}&lon=${USER_LON}`;
          window.location.href = url;
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            const LATITUDE = DEFAULT_LAT;
            const LONGITUDE = DEFAULT_LON;

            const url = `index.html?lat=${LATITUDE}&lon=${LONGITUDE}`;
            window.location.href = url;
          }
        }
      );
    });
  }
}

customElements.define("nav-bar", NavBar);
