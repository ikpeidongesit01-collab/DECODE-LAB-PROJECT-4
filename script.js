const REGEX = {
    fullName:  /^[a-zA-Z]+([\s'-][a-zA-Z]+)+$/,
    username:  /^[a-zA-Z0-9_]{3,20}$/,
    email:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone:     /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]{7,14}$/,
    password:  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*\-]).{8,}$/,
  };

  const FIELDS = {
    fullName:        { required:true,  msg:{ empty:'Full name is required.',        invalid:'Enter at least two words (e.g. Isaac Damilola).' }},
    username:        { required:true,  msg:{ empty:'Username is required.',          invalid:'3-20 chars; letters, numbers, underscores only.' }},
    email:           { required:true,  msg:{ empty:'Email address is required.',     invalid:'Invalid email syntax. Check format: user@domain.com' }},
    phone:           { required:false, msg:{ invalid:'Invalid phone number format.' }},
    role:            { required:true,  msg:{ empty:'Please select a developer role.' }},
    password:        { required:true,  msg:{ empty:'Password is required.',          invalid:'Must contain uppercase, lowercase, number, special char (min 8).' }},
    confirmPassword: { required:true,  msg:{ empty:'Please confirm your password.',  invalid:'Passwords do not match.' }},
  };

  function setFieldState(id, state, message='') {
    const input = document.getElementById(id);
    const msgEl = document.getElementById(id+'-msg');
    const icon  = document.getElementById(id+'-icon');
    input.classList.remove('valid','invalid');
    if (state==='valid')   input.classList.add('valid');
    if (state==='invalid') input.classList.add('invalid');
    if (msgEl) {
      msgEl.className = 'field-msg '+(state==='invalid'?'error':state==='valid'?'success':'');
      msgEl.innerHTML = message
        ? (state==='invalid'
            ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${message}`
            : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${message}`)
        : '';
      input.setAttribute('aria-invalid', state==='invalid'?'true':'false');
    }
    if (icon) icon.style.opacity = state==='valid'?'1':'0';
  }

  function validateField(id) {
    const input = document.getElementById(id);
    const val   = input.value.trim();
    const cfg   = FIELDS[id];
    if (id==='confirmPassword') {
      const pw = document.getElementById('password').value;
      if (!val) { setFieldState(id,'invalid',cfg.msg.empty); return false; }
      if (val!==pw) { setFieldState(id,'invalid',cfg.msg.invalid); return false; }
      setFieldState(id,'valid','Passwords match ✓'); return true;
    }
    if (!val) {
      if (cfg.required) { setFieldState(id,'invalid',cfg.msg.empty); return false; }
      setFieldState(id,'',''); return true;
    }
    if (REGEX[id] && !REGEX[id].test(val)) { setFieldState(id,'invalid',cfg.msg.invalid); return false; }
    const ok = {fullName:'Looks good!',username:'Username available ✓',email:'Valid syntax ✓',phone:'Valid number ✓',role:'Role selected ✓',password:'Strong password ✓'};
    setFieldState(id,'valid',ok[id]||'✓'); return true;
  }

  function livePasswordCheck() {
    const val = document.getElementById('password').value;
    const checks = { upper:/[A-Z]/.test(val), lower:/[a-z]/.test(val), number:/[0-9]/.test(val), special:/[#?!@$%^&*\-]/.test(val), length:val.length>=8 };
    const on='#10b981', off='#1e3248';
    ['upper','lower','number','special','length'].forEach(k=>{
      const el=document.getElementById('check-'+k);
      el.style.color=checks[k]?on:'#64748b';
      el.querySelector('span').style.background=checks[k]?on:off;
    });
    const score=Object.values(checks).filter(Boolean).length;
    const bars=[document.getElementById('bar1'),document.getElementById('bar2'),document.getElementById('bar3'),document.getElementById('bar4')];
    const lvls=[{c:'#ef4444',l:'Weak',b:1},{c:'#f97316',l:'Fair',b:2},{c:'#f59e0b',l:'Good',b:3},{c:'#10b981',l:'Strong',b:4}];
    let li=score<=1?0:score===2?1:score<=4?2:3;
    if (!val){bars.forEach(b=>b.style.background=off);document.getElementById('password-strength-label').textContent='';return;}
    const lv=lvls[li];
    bars.forEach((b,i)=>b.style.background=i<lv.b?lv.c:off);
    const lbl=document.getElementById('password-strength-label');
    lbl.textContent=lv.l; lbl.style.color=lv.c;
  }

  function togglePwd(id) {
    const inp=document.getElementById(id);
    const icon=document.getElementById('eye-'+id);
    if (inp.type==='password') {
      inp.type='text';
      icon.innerHTML='<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
      inp.type='password';
      icon.innerHTML='<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
  }

  Object.keys(FIELDS).forEach(id=>{
    const el=document.getElementById(id);
    if (el) el.addEventListener('blur',()=>validateField(id));
  });

  document.getElementById('registrationForm').addEventListener('submit',function(event){
    event.preventDefault(); // ★ PREVENT THE MEMORY WIPE ★
    let isValid=true;
    ['fullName','username','email','phone','role','password','confirmPassword'].forEach(id=>{
      if (!validateField(id)) isValid=false;
    });
    const terms=document.getElementById('termsCheck');
    const termsMsg=document.getElementById('terms-msg');
    if (!terms.checked) {
      termsMsg.className='field-msg ml-7 error';
      termsMsg.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>You must agree to the terms.';
      isValid=false;
    } else { termsMsg.className='field-msg ml-7'; termsMsg.textContent=''; }

    if (!isValid) {
      const err=document.getElementById('formError');
      document.getElementById('formErrorText').textContent='Validation failed — fix the errors above before deploying.';
      err.style.display='flex';
      document.querySelector('.form-input.invalid')?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    document.getElementById('formError').style.display='none';
    deployPayload();
  });

  function deployPayload(){
    const btn=document.getElementById('submitBtn');
    document.getElementById('submitLabel').textContent='Deploying…';
    btn.disabled=true;
    setTimeout(()=>{
      const payload={
        fullName:document.getElementById('fullName').value.trim(),
        username:document.getElementById('username').value.trim(),
        email:document.getElementById('email').value.trim(),
        phone:document.getElementById('phone').value.trim()||null,
        role:document.getElementById('role').value,
        termsAgreed:true,
        ageConfirmed:document.getElementById('ageCheck').checked,
        timestamp:new Date().toISOString(),
        status:'APPROVED'
      };
      document.getElementById('jsonOutput').textContent=JSON.stringify(payload,null,2);
      const overlay=document.getElementById('successOverlay');
      overlay.style.display='flex';
      overlay.style.animation='fade-up 0.5s ease forwards';
      setTimeout(()=>{
        const ic=document.getElementById('checkIcon');
        ic.style.display='flex';
        ic.style.animation='check-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards';
      },100);
      btn.disabled=false;
      document.getElementById('submitLabel').textContent='Deploy Registration';
    },800);
  }

  function resetForm(){
    document.getElementById('registrationForm').reset();
    document.getElementById('successOverlay').style.display='none';
    document.getElementById('checkIcon').style.display='none';
    Object.keys(FIELDS).forEach(id=>{
      const el=document.getElementById(id);
      if (el){el.classList.remove('valid','invalid');el.setAttribute('aria-invalid','false');}
      const msg=document.getElementById(id+'-msg');
      if (msg){msg.textContent='';msg.className='field-msg';}
      const icon=document.getElementById(id+'-icon');
      if (icon) icon.style.opacity='0';
    });
    document.getElementById('terms-msg').textContent='';
    document.getElementById('formError').style.display='none';
    ['bar1','bar2','bar3','bar4'].forEach(id=>document.getElementById(id).style.background='#1e3248');
    document.getElementById('password-strength-label').textContent='';
    ['upper','lower','number','special','length'].forEach(k=>{
      const el=document.getElementById('check-'+k);
      el.style.color='#64748b';
      el.querySelector('span').style.background='#1e3248';
    });
    window.scrollTo({top:0,behavior:'smooth'});
  }