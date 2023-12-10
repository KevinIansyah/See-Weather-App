import Swiper from "swiper";

const swiperConfiguration = () => {
  const swiper = new Swiper(".mySwiper", {
    breakpoints: {
      1400: {
        slidesPerView: 6.2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 5.2,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 4.5,
        spaceBetween: 10,
      },
      390: {
        slidesPerView: 3.3,
        spaceBetween: 10,
      },
      350: {
        slidesPerView: 2.9,
        spaceBetween: 10,
      },
      250: {
        slidesPerView: 2.5,
        spaceBetween: 10,
      },
    },
  });
};

export default swiperConfiguration;
