/* jerrinmathew.com sign-up forms: checks the email, sends sign-ups to the Google Sheet (Apps Script), other forms to Formspree. */
(function () {
  var SCRIPT = 'https://script.google.com/macros/s/AKfycby6zrOouthz9latePJt6Bmxbd0Km3EFxFyhDIWyyuytAVvoXswSSL-AhdQA3R0cgnXVuQ/exec', LAUNCH = false;
  var TYPO = {'gmial.com':'gmail.com','gamil.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com','gnail.com':'gmail.com','yahoo.co':'yahoo.com','yaho.com':'yahoo.com','yahoo.con':'yahoo.com','hotmial.com':'hotmail.com','hotmail.co':'hotmail.com','outlok.com':'outlook.com','outlook.co':'outlook.com','iclod.com':'icloud.com','icloud.co':'icloud.com'};
  var THROWAWAY = ['example.com','example.org','test.com','test.test','email.test','mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','temp-mail.org','yopmail.com','sharklasers.com','trashmail.com','fakeinbox.com','getnada.com','dispostable.com'];
  window.jmCheck = function (form) {
    var em = form.querySelector('[name=email]'), nm = form.querySelector('[name=name]'), v = ((em && em.value) || '').trim().toLowerCase();
    if (nm && nm.required && !/[a-zÀ-ɏ]{2,}/i.test(nm.value || '')) return 'Please enter your first name.';
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(v)) return 'Please enter a full email address, like name@gmail.com.';
    var dom = v.split('@')[1], user = v.split('@')[0];
    if (TYPO[dom]) return 'Did you mean ' + user + '@' + TYPO[dom] + '?';
    if (THROWAWAY.indexOf(dom) > -1 || /^(test|asdf|qwerty|fake|none|no|abc|aaa)$/.test(user)) return 'Please use an email address you check. The guide is sent there.';
    return '';
  };
  if (!window.fetch) return;
  document.querySelectorAll('form[action*="formspree.io"]:not(.notify)').forEach(function (form) {
    var btn = form.querySelector('button[type=submit]'), status = form.querySelector('.form-status'), label = btn ? btn.textContent : '';
    var say = function (cls, html) { if (status) { status.className = 'form-status' + (cls ? ' ' + cls : ''); status.innerHTML = html; } };
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = window.jmCheck(form); if (err) { say('is-err', err); return; }
      var email = form.querySelector('[name=email]').value.trim(), subject = (form.querySelector('[name=_subject]') || {}).value || '';
      var signup = /signup/i.test(subject), offer = form.getAttribute('data-offer'), offerUrl = form.getAttribute('data-offer-url');
      say('', ''); if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
      var req = signup ? fetch(SCRIPT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(form)) })
                       : fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      req.then(function (res) {
        if (!signup && !res.ok) return res.json().then(function (j) { throw new Error(j && j.errors && j.errors.length ? j.errors.map(function (x) { return x.message; }).join(', ') : ''); });
        form.reset(); if (btn) btn.textContent = 'Sent';
        if (signup) {
          try { localStorage.setItem('jm_joined', '1'); } catch (e) {}
          document.dispatchEvent(new Event('jm:joined'));
          if (LAUNCH) say('is-ok', 'Thank you, you’re on the list. <a href="/guide/chicago-care-guide-995f7edf45.pdf" download>Download the guide (PDF)</a>' + (offerUrl ? ' · <a href="' + offerUrl + '" download>Download ' + (offer || '').replace(/ and the guide$/, '') + ' (PDF)</a>' : '') + '. A copy is on its way to your inbox.');
          else say('is-ok', 'Check your inbox. I just emailed ' + (offer || 'the guide') + ' to ' + email.replace(/[<>&]/g, '') + '. If it is not there in a few minutes, look in spam or Promotions.');
        } else say('is-ok', 'Thank you. I will reply within two business days.');
      }).catch(function (e) {
        say('is-err', (e && e.message) || 'Could not reach the server. Please check your connection and try again.');
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  });
})();
