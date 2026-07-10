// faq.js — accordion with one-open-at-a-time behavior

(function () {
  'use strict';

  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((other) => {
        other.classList.remove('open');
        const a = other.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0px';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();
