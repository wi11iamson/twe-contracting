(function () {
  'use strict';

  var API_ENDPOINT = 'https://kq85u6r4u2.execute-api.us-east-1.amazonaws.com/prod/twe-contact-form';

  var form          = document.getElementById('contactForm');
  var submitBtn     = document.getElementById('submitBtn');
  var submitText    = document.getElementById('submitText');
  var submitSpinner = document.getElementById('submitSpinner');
  var successAlert  = document.getElementById('formSuccess');
  var errorAlert    = document.getElementById('formError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Native HTML5 constraint validation
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Hide previous alerts
    successAlert.classList.add('d-none');
    errorAlert.classList.add('d-none');

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending\u2026';
    submitSpinner.classList.remove('d-none');

    var name    = form.name.value.trim();
    var email   = form.email.value.trim();
    var phone   = form.phone.value.trim();
    var subject = 'TWE Contracting Estimate: ' + name + ' — ' + form.subject.value;
    var message = 'NAME: ' + name
                + ' | PHONE: ' + (phone || 'not provided')
                + ' | SERVICE: ' + form.subject.value
                + ' | MESSAGE: ' + form.message.value.trim();

    var payload = { email: email, subject: subject, message: message };

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Server responded with status ' + res.status);
        return res.json();
      })
      .then(function () {
        successAlert.classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      })
      .catch(function () {
        errorAlert.classList.remove('d-none');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        submitSpinner.classList.add('d-none');
      });
  });

  // Clear alerts when user starts typing again
  ['name', 'email', 'phone', 'subject', 'message'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () {
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');
      });
    }
  });
}());
