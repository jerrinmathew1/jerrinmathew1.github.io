(function(){
  var G='',S='https://script.google.com/macros/s/AKfycby6zrOouthz9latePJt6Bmxbd0Km3EFxFyhDIWyyuytAVvoXswSSL-AhdQA3R0cgnXVuQ/exec';
  window.jmCheck=function(f){
  var e=f.querySelector('[name=email]'),n=f.querySelector('[name=name]');
  var v=(e&&e.value||'').trim().toLowerCase();
  if(n&&n.required&&!/[a-zÀ-ɏ]{2,}/i.test(n.value||''))return 'Please enter your first name.';
  if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(v))return 'Please enter a full email address, like name@gmail.com.';
  var d=v.split('@')[1],u=v.split('@')[0];
  var typo={'gmial.com':'gmail.com','gamil.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com','gnail.com':'gmail.com',
   'yahoo.co':'yahoo.com','yaho.com':'yahoo.com','yahoo.con':'yahoo.com','hotmial.com':'hotmail.com','hotmail.co':'hotmail.com',
   'outlok.com':'outlook.com','outlook.co':'outlook.com','iclod.com':'icloud.com','icloud.co':'icloud.com'};
  if(typo[d])return 'Did you mean '+u+'@'+typo[d]+'?';
  var fake=['example.com','example.org','test.com','test.test','email.test','mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','temp-mail.org','yopmail.com','sharklasers.com','trashmail.com','fakeinbox.com','getnada.com','dispostable.com'];
  if(fake.indexOf(d)>-1||/^(test|asdf|qwerty|fake|none|no|abc|aaa)$/.test(u))return 'Please use an email address you check. The guide is sent there.';
  return '';
};

  if(!window.fetch)return;
  document.querySelectorAll('form[action*="formspree.io"]:not(.notify)').forEach(function(f){
    var b=f.querySelector('button[type=submit]'),m=f.querySelector('.form-status'),label=b?b.textContent:'';
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var er=window.jmCheck(f);
      if(er){if(m){m.className='form-status is-err';m.textContent=er;}return;}
      var v=(f.querySelector('[name=email]')||{}).value.trim();
      if(m){m.className='form-status';m.textContent='';}
      if(b){b.disabled=true;b.textContent='Sending';}
      var sub=(f.querySelector('[name=_subject]')||{}).value||'',toSheet=S&&/signup/i.test(sub);
      var req=toSheet?fetch(S,{method:'POST',mode:'no-cors',body:new URLSearchParams(new FormData(f))})
                     :fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}});
      req.then(function(r){
          if(toSheet||r.ok){f.reset();if(b)b.textContent='Sent';
            if(m){m.className='form-status is-ok';m.textContent='Check your inbox. I just emailed the guide to '+v+'. If it is not there in a few minutes, look in spam or Promotions.';}
            return;}
          return r.json().then(function(d){
            var t=(d&&d.errors&&d.errors.length)?d.errors.map(function(x){return x.message;}).join(', ')
              :'Something went wrong. Please try again in a moment.';
            if(m){m.className='form-status is-err';m.textContent=t;}
            if(b){b.disabled=false;b.textContent=label;}});
        })
        .catch(function(){
          if(m){m.className='form-status is-err';m.textContent='Could not reach the server. Please check your connection and try again.';}
          if(b){b.disabled=false;b.textContent=label;}});
    });
  });
})();
