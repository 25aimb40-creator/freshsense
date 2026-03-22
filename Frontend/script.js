// ── Backend URL ───────────────────────────────────────────────
const BACKEND = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3000'
                : 'https://freshsense-backend.onrender.com';

// ── Particle Canvas ───────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];
let mx = 0, my = 0;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * W;
    this.y      = Math.random() * H;
    this.size   = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -Math.random() * 0.4 - 0.1;
    this.maxAge = Math.random() * 200 + 100;
    this.age    = 0;
  }
  update() {
    this.x += this.speedX + (mx / W - 0.5) * 0.3;
    this.y += this.speedY;
    this.age++;
    if (this.age > this.maxAge || this.y < -10) this.reset();
  }
  draw() {
    const alpha = Math.sin(Math.PI * this.age / this.maxAge) * 0.4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,166,35,${alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
})();

// ── 3D Tilt on Cards ─────────────────────────────────────────
function applyTilt(el) {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    const cx = r.width  / 2;
    const cy = r.height / 2;
    const rX =  ((y - cy) / cy) * 8;
    const rY = -((x - cx) / cx) * 8;
    el.style.transform = `perspective(600px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.03)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  });
}

// ── Scroll Reveal ─────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Food Database ─────────────────────────────────────────────
const foods = [
  { emoji:'🥩', name:'Raw Beef',    fridge:'3–5 days',  freezer:'4–12 months', room:'2 hrs',    freshness:70 },
  { emoji:'🐔', name:'Chicken',     fridge:'1–2 days',  freezer:'9 months',    room:'2 hrs',    freshness:60 },
  { emoji:'🥛', name:'Milk',        fridge:'7 days',    freezer:'3 months',    room:'2 hrs',    freshness:75 },
  { emoji:'🥚', name:'Eggs',        fridge:'3–5 weeks', freezer:'1 year',      room:'2 weeks',  freshness:90 },
  { emoji:'🍎', name:'Apple',       fridge:'4–6 weeks', freezer:'8 months',    room:'5–7 days', freshness:88 },
  { emoji:'🍌', name:'Banana',      fridge:'5–7 days',  freezer:'3 months',    room:'2–5 days', freshness:65 },
  { emoji:'🥦', name:'Broccoli',    fridge:'3–5 days',  freezer:'10 months',   room:'1–2 days', freshness:72 },
  { emoji:'🍞', name:'Bread',       fridge:'1–2 weeks', freezer:'3 months',    room:'5–7 days', freshness:80 },
  { emoji:'🧀', name:'Hard Cheese', fridge:'3–4 weeks', freezer:'6 months',    room:'4 hrs',    freshness:85 },
  { emoji:'🍚', name:'Cooked Rice', fridge:'3–5 days',  freezer:'6 months',    room:'2 hrs',    freshness:68 },
  { emoji:'🥬', name:'Lettuce',     fridge:'7–10 days', freezer:'Not rec.',    room:'2 hrs',    freshness:78 },
  { emoji:'🍳', name:'Cooked Eggs', fridge:'3–4 days',  freezer:'Not rec.',    room:'2 hrs',    freshness:70 },
];

const grid = document.getElementById('db-grid');
foods.forEach((f, i) => {
  const card = document.createElement('div');
  card.className = 'food-card reveal';
  card.style.transitionDelay = (i % 4 * 0.1) + 's';
  card.innerHTML = `
    <span class="food-emoji">${f.emoji}</span>
    <div class="food-name">${f.name}</div>
    <div class="food-meta">
      <div class="food-row"><span>🧊 Fridge</span><span>${f.fridge}</span></div>
      <div class="food-row"><span>❄️ Freezer</span><span>${f.freezer}</span></div>
      <div class="food-row"><span>🌡️ Room Temp</span><span>${f.room}</span></div>
    </div>
    <div class="freshness-bar">
      <div class="freshness-fill" style="width:${f.freshness}%"></div>
    </div>
  `;
  grid.appendChild(card);
  observer.observe(card);
  applyTilt(card);
});

document.querySelectorAll('.step').forEach(el => applyTilt(el));

// ── File Upload ───────────────────────────────────────────────
const fileInput  = document.getElementById('file-input');
const previewImg = document.getElementById('preview-img');
const analyzeBtn = document.getElementById('analyze-btn');
const uploadZone = document.getElementById('upload-zone');

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.style.display = 'block';
  analyzeBtn.style.display = 'block';
  resetResults();
});

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    fileInput.files = e.dataTransfer.files;
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = 'block';
    analyzeBtn.style.display = 'block';
    resetResults();
  }
});

function resetResults() {
  document.getElementById('result-placeholder').style.display = 'block';
  document.getElementById('result-loading').style.display     = 'none';
  document.getElementById('result-content').style.display     = 'none';
}

// ── AI Analysis ───────────────────────────────────────────────
async function analyzeFood() {
  const file = fileInput.files[0];
  if (!file) return;

  document.getElementById('result-placeholder').style.display = 'none';
  document.getElementById('result-loading').style.display     = 'block';
  document.getElementById('result-content').style.display     = 'none';

  try {
    const res = await fetch(`${BACKEND}/api/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ test: true })
    });

    const result = await res.json();

    const s   = result.status || 'Unknown';
    const cls = s === 'Fresh' ? 'badge-good' : s === 'Use Soon' ? 'badge-warn' : 'badge-bad';
    document.getElementById('r-status').innerHTML       = `<span class="badge ${cls}">${s}</span>`;
    document.getElementById('r-shelf').textContent      = result.shelf_life  || '—';
    document.getElementById('r-storage').textContent    = result.storage     || '—';
    document.getElementById('r-confidence').textContent = result.confidence  || '—';
    document.getElementById('r-tips').textContent       = '💡 ' + result.tips;

    document.getElementById('result-loading').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';

  } catch (err) {
    document.getElementById('result-loading').style.display     = 'none';
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-placeholder').innerHTML     =
      '<span>⚠️</span>Analysis failed. Make sure your backend server is running on port 3000.';
    console.error(err);
  }
}

// ── Contact Form ──────────────────────────────────────────────
async function submitContact() {
  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  const success = document.getElementById('contact-success');
  const error   = document.getElementById('contact-error');

  success.style.display = 'none';
  error.style.display   = 'none';

  if (!name || !email || !message) {
    error.style.display = 'block';
    error.textContent   = '⚠️ Please fill in all fields before sending.';
    return;
  }

  if (!email.includes('@')) {
    error.style.display = 'block';
    error.textContent   = '⚠️ Please enter a valid email address.';
    return;
  }

  try {
    const res = await fetch(`${BACKEND}/api/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (data.success) {
      success.style.display = 'block';
      document.getElementById('contact-name').value    = '';
      document.getElementById('contact-email').value   = '';
      document.getElementById('contact-message').value = '';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    } else {
      error.style.display = 'block';
      error.textContent   = '⚠️ Could not send message. Please try again.';
    }

  } catch (err) {
    error.style.display = 'block';
    error.textContent   = '⚠️ Could not send message. Please try again.';
    console.error(err);
  }
}