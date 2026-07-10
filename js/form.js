// form.js — Formspree submission with success/error states

(function () {
  'use strict';

  const form = document.getElementById('booking-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.classList.add('hidden');
        success.classList.remove('hidden');
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert("Something went wrong. Please email hello@shotbykissu.com directly.");
    }
  });
})();
