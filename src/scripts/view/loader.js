const loaderElement = document.querySelector(".background");

const hideLoader = () => {
  setTimeout(() => {
    loaderElement.classList.add("background-hidden");
  }, 1200);
};

export default hideLoader;
