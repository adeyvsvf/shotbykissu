// testimonials.js — Swiper carousel

(function () {
  'use strict';
  if (!window.Swiper) return;

  new Swiper('.testimonials-swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.testimonials-swiper .swiper-pagination',
      clickable: true,
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 700,
  });
})();
