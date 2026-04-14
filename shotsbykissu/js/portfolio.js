// portfolio.js — filter tabs + GLightbox init

(function () {
  'use strict';

  // GLightbox
  if (window.GLightbox) {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      closeButton: true,
    });
  }

  // Filter tabs
  const filters = document.querySelectorAll('.portfolio-filter');
  const items = document.querySelectorAll('#portfolio-grid .portfolio-item');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => {
        b.classList.remove('active', 'text-pink-hot', 'border-b-2', 'border-pink-hot', 'font-semibold');
        b.classList.add('text-warmgray');
      });
      btn.classList.add('active', 'text-pink-hot', 'border-b-2', 'border-pink-hot', 'font-semibold');
      btn.classList.remove('text-warmgray');

      const filter = btn.dataset.filter;
      items.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden-filter');
        } else {
          item.classList.add('hidden-filter');
        }
      });
    });
  });
})();
