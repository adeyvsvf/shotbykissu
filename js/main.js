// main.js — preloader, nav scroll, mobile menu, hero clip-path, AOS

(function () {
  'use strict';

  // ---------- AOS init ----------
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, offset: 80, easing: 'ease-out-cubic' });
  }

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const start = () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 300);
      }, 1100);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
  }

  // ---------- Nav scroll + hero clip-path ----------
  const navbar = document.getElementById('navbar');
  const heroVideoWrap = document.getElementById('hero-video-wrap');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    if (heroVideoWrap) heroVideoWrap.classList.toggle('expanded', y > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Current year in footer ----------
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
