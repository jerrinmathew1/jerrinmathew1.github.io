(function(){
  var G='/guide/professionals-guide-psychiatric-care-chicago.pdf',S='https://script.google.com/macros/s/AKfycby6zrOouthz9latePJt6Bmxbd0Km3EFxFyhDIWyyuytAVvoXswSSL-AhdQA3R0cgnXVuQ/exec';
  if(!window.fetch)return;
  document.querySelectorAll('form[action*="formspree.io"]').forEach(function(f){
    var b=f.querySelector('button[type=submit]'),m=f.querySelector('.form-status'),label=b?b.textContent:'';
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(m){m.className='form-status';m.textContent='';}
      if(b){b.disabled=true;b.textContent='Sending';}
      var sub=(f.querySelector('[name=_subject]')||{}).value||'',toSheet=S&&/signup/i.test(sub);
      var req=toSheet?fetch(S,{method:'POST',mode:'no-cors',body:new URLSearchParams(new FormData(f))})
                     :fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}});
      req.then(function(r){
          if(toSheet||r.ok){f.reset();if(b)b.textContent='Sent';
            if(m){m.className='form-status is-ok';
              m.innerHTML='Thank you, you\u2019re on the list. <a href="'+G+'" download>Download your free guide (PDF)</a>';}
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
