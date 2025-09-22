(function(){
  const STORAGE_KEY = 'planneriState_v1';
  const el = (sel) => document.querySelector(sel);
  const els = (sel) => Array.from(document.querySelectorAll(sel));

  const state = loadState() || {
    step: 1,
    goal: 'lead_gen',
    audience: 'first_time',
    type: 'ig_post',
    style: 'direct',
    assets: [], // {id, kind:'image', dataUrl}
    copy: null,
    flags: [],
    brandColor: '#0ea5e9',
    logo: null
  };

  // Wire step navigation
  function showStep(n){
    state.step = n;
    els('.step').forEach((li, i)=>{
      li.classList.toggle('active', i === n-1);
    });
    saveState();
    if(n === 6){
      renderCanvas();
      renderCopy();
    }
  }

  // Step 1: goal
  els('input[name="goal"]').forEach(r=>{
    r.addEventListener('change', ()=>{ state.goal = r.value; saveState(); });
    if(r.value === state.goal) r.checked = true;
  });

  // Step 2: audience
  const audienceSel = el('#audience');
  if(audienceSel){
    audienceSel.value = state.audience;
    audienceSel.addEventListener('change', ()=>{ state.audience = audienceSel.value; saveState(); });
  }

  // Step 3: type
  els('input[name="type"]').forEach(r=>{
    r.addEventListener('change', ()=>{ state.type = r.value; saveState(); });
    if(r.value === state.type) r.checked = true;
  });

  // Step 4: style
  const styleSel = el('#style');
  if(styleSel){
    styleSel.value = state.style;
    styleSel.addEventListener('change', ()=>{ state.style = styleSel.value; saveState(); });
  }

  // Step 5: assets
  const assetsInput = el('#assets');
  const thumbs = el('#thumbs');
  if(assetsInput){
    assetsInput.addEventListener('change', async () => {
      const files = Array.from(assetsInput.files || []).slice(0,5);
      state.assets = await Promise.all(files.map(toDataUrl));
      saveState();
      renderThumbs();
    });
    renderThumbs();
  }

  // Navigation buttons
  els('[data-next]').forEach(b=> b.addEventListener('click', ()=> showStep(Math.min(6, state.step+1))));
  els('[data-back]').forEach(b=> b.addEventListener('click', ()=> showStep(Math.max(1, state.step-1))));
  const resetBtn = el('#resetWizard');
  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = window.location.pathname;
    });
  }

  // Step 6: generate copy
  const genBtn = el('#generate');
  const copyOut = el('#copyOut');
  const flagsOut = el('#flags');
  if(genBtn){
    genBtn.addEventListener('click', async ()=>{
      try{
        copyOut.textContent = 'Generating...';
        const body = {
          goal: state.goal,
          audience: state.audience,
          type: state.type,
          style: state.style,
          bullets: deriveBullets()
        };
        const res = await fetch('/.netlify/functions/generateCopy', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        if(!res.ok) throw new Error('Function error ' + res.status);
        const data = await res.json();
        state.copy = { caption: data.caption, hashtags: data.hashtags, cta: data.cta };
        state.flags = data.flags || [];
        saveState();
        renderCopy();
      }catch(err){
        copyOut.textContent = 'Error: ' + err.message;
      }
    });
  }

  // Copy caption button
  const copyButton = el('#copyCaption');
  if(copyButton){
    copyButton.addEventListener('click', async ()=>{
      if(!state.copy){ alert('Generate the caption first.'); return; }
      const caption = state.copy ? composeCaption(state.copy) : '';
      try { await navigator.clipboard.writeText(caption); copyButton.textContent = 'Copied!'; setTimeout(()=>copyButton.textContent='Copy Caption',1200);} catch(e){ alert('Copy failed'); }
    });
  }

  // Export JSON gated by compliance acknowledgements
  const exportBtn = el('#exportJson');
  if(exportBtn){
    exportBtn.addEventListener('click', ()=>{
      const err = el('#err6');
      const a = el('#ackNoPromises');
      const b = el('#ackLicensed');
      const c = el('#ackAccurate');
      if(!state.copy){
        if(err) err.textContent = 'Generate the caption first before exporting.';
        return;
      }
      if(!(a?.checked && b?.checked && c?.checked)){
        if(err) err.textContent = 'Please acknowledge all compliance checklist items before exporting.';
        return;
      }
      if(err) err.textContent = '';
      const record = buildRecord();
      const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'planneri_record.json'; link.click();
      setTimeout(()=> URL.revokeObjectURL(url), 1000);
    });
  }

  // Canvas and download
  const canvas = el('#canvas');
  const colorInput = el('#brandColor');
  const dlBtn = el('#downloadPng');
  if(colorInput){ 
    colorInput.value = state.brandColor || '#0ea5e9';
    colorInput.addEventListener('input', ()=>{ state.brandColor = colorInput.value; saveState(); renderCanvas(); }); 
  }
  const logoInput = el('#logoUpload');
  if(logoInput){
    logoInput.addEventListener('change', async ()=>{
      const f = (logoInput.files||[])[0];
      if(!f) return;
      const logo = await toDataUrl(f);
      state.logo = { dataUrl: logo.dataUrl };
      saveState();
      renderCanvas();
    });
  }
  const removeLogoBtn = el('#removeLogo');
  if(removeLogoBtn){
    removeLogoBtn.addEventListener('click', ()=>{
      state.logo = null;
      saveState();
      // Clear file input for convenience
      const inp = el('#logoUpload');
      if(inp) inp.value = '';
      renderCanvas();
    });
  }
  if(dlBtn){
    dlBtn.addEventListener('click', ()=>{
      if(!canvas) return;
      const a = document.createElement('a');
      a.download = 'preview.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    });
  }

  // Initial render
  showStep(state.step || 1);

  // Helpers
  function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function loadState(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||''); }catch(_){ return null; } }

  function renderThumbs(){
    if(!thumbs) return;
    thumbs.innerHTML = '';
    for(const a of state.assets){
      const img = new Image();
      img.src = a.dataUrl; img.alt = 'asset';
      thumbs.appendChild(img);
    }
  }

  function renderCopy(){
    if(!copyOut || !flagsOut) return;
    if(!state.copy){
      copyOut.textContent = 'Press Generate to get dummy copy...';
      flagsOut.innerHTML = '';
      return;
    }
    const caption = composeCaption(state.copy);
    copyOut.textContent = caption;
    flagsOut.innerHTML = '';
    for(const f of state.flags){
      const span = document.createElement('span');
      span.className = 'flag';
      span.textContent = f;
      flagsOut.appendChild(span);
    }
  }

  function composeCaption(copy){
    return `${copy.caption}\n\n${copy.hashtags.join(' ')}\n\n${copy.cta}`;
  }

  async function toDataUrl(file){
    const dataUrl = await new Promise((resolve, reject)=>{
      const fr = new FileReader();
      fr.onload = ()=> resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
    return { id: crypto.randomUUID(), kind: 'image', dataUrl };
  }

  function deriveBullets(){
    // A tiny heuristic: create bullets based on selections
    const bullets = [];
    if(state.audience === 'first_time') bullets.push('Low maintenance');
    if(state.audience === 'intl_investor') bullets.push('High rental demand');
    if(state.audience === 'luxury') bullets.push('Premium finishes');
    if(state.audience === 'upgrader') bullets.push('Spacious layout');
    if(state.audience === 'family') bullets.push('Near schools');
    if(state.type === 'ig_reel') bullets.push('Perfect for short video tour');
    return bullets.slice(0,3);
  }

  function renderCanvas(){
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    // Background
    ctx.fillStyle = '#0f141b';
    ctx.fillRect(0,0,w,h);

    // If asset, draw first image; else gradient placeholder
    if(state.assets && state.assets[0]){
      const img = new Image();
      img.onload = ()=>{
        // cover
        const ratio = Math.max(w/img.width, h/img.height);
        const iw = img.width*ratio, ih = img.height*ratio;
        const ix = (w - iw)/2, iy = (h - ih)/2;
        ctx.drawImage(img, ix, iy, iw, ih);
        overlay();
      };
      img.src = state.assets[0].dataUrl;
    } else {
      const grad = ctx.createLinearGradient(0,0,w,h);
      const color = (colorInput && colorInput.value) || '#0ea5e9';
      grad.addColorStop(0, shade(color, -30));
      grad.addColorStop(1, shade(color, 20));
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
      overlay();
    }

    function overlay(){
      const color = (colorInput && colorInput.value) || '#0ea5e9';
      // Bottom bar
      ctx.fillStyle = hexToRgba('#000000', 0.35); ctx.fillRect(0, h-90, w, 90);
      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px system-ui';
      ctx.fillText('DreamHomes • Dubai', 16, h-52);
      // Tagline
      ctx.font = '16px system-ui';
      ctx.fillText(titleForPreview(), 16, h-24);
      // Accent
      ctx.fillStyle = color; ctx.fillRect(w-24, 0, 8, h);
      // Logo
      if(state.logo){
        const logo = new Image();
        logo.onload = ()=>{
          const lw = logo.width, lh = logo.height;
          const scale = Math.min(80/lw, 80/lh);
          const lx = w - 16 - logo.width*scale, ly = 16;
          ctx.drawImage(logo, lx, ly, lw*scale, lh*scale);
        };
        logo.src = state.logo.dataUrl;
      }
    }
  }

  function titleForPreview(){
    const typeMap = { ig_post: 'Instagram Post', ig_reel: 'Reel Concept', linkedin_post: 'LinkedIn Post' };
    return `${typeMap[state.type] || 'Post'} • ${label(state.goal)} • ${label(state.audience)}`;
  }

  function label(x){
    return String(x).replace(/_/g,' ');
  }

  function shade(hex, percent){
    // simple hex shade
    const f = parseInt(hex.slice(1),16), t = percent<0?0:255, p = Math.abs(percent)/100;
    const R = f>>16, G = (f>>8)&0x00FF, B = f&0x0000FF;
    const to = (c)=> Math.round((t-c)*p)+c;
    return `#${(0x1000000 + (to(R)<<16) + (to(G)<<8) + to(B)).toString(16).slice(1)}`;
  }

  function hexToRgba(hex, a){
    const f = parseInt(hex.slice(1),16);
    const R = f>>16, G=(f>>8)&0xFF, B=f&0xFF;
    return `rgba(${R}, ${G}, ${B}, ${a})`;
  }

  function buildRecord(){
    return {
      goal: state.goal,
      audience: state.audience,
      type: state.type,
      style: state.style,
      assets: state.assets.map(a=>a.dataUrl),
      copy: state.copy,
      flags: state.flags,
      brandColor: state.brandColor,
      logo: state.logo ? state.logo.dataUrl : null
    };
  }
})();
