// script.js
// Demo data for legal / permissioned mods or indie APKs
const games = [
  {
    id: 'g1',
    title: 'Neon Speed — Demo',
    version: '2.1',
    size: '58 MB',
    category: 'Racing',
    thumb: 'assets/thumb1.svg',
    screenshots: ['assets/screenshot1.svg'],
    downloads: 12345,
    description: 'Demo racing game with community-created tracks. Use only if you have rights.',
    trendingScore: 95
  },
  {
    id: 'g2',
    title: 'Shadow Strike — Practice',
    version: '1.6',
    size: '72 MB',
    category: 'Shooting',
    thumb: 'assets/thumb2.svg',
    screenshots: ['assets/screenshot1.svg'],
    downloads: 8745,
    description: 'Permissioned mod for practice arenas (demo).',
    trendingScore: 79
  },
  {
    id: 'g3',
    title: 'Puzzle Cube — Indie',
    version: '3.0',
    size: '27 MB',
    category: 'Puzzle',
    thumb: 'assets/thumb3.svg',
    screenshots: ['assets/screenshot1.svg'],
    downloads: 4260,
    description: 'Indie puzzle APK — open-source demo.',
    trendingScore: 68
  }
];

const gamesGrid = document.getElementById('gamesGrid');
const trendingList = document.getElementById('trendingList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryButtons = document.querySelectorAll('.cat');
const sortSelect = document.getElementById('sortSelect');

function formatNumber(n){
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderGames(list){
  if(!gamesGrid) return;
  gamesGrid.innerHTML = '';
  list.forEach(g=>{
    const div = document.createElement('div');
    div.className = 'game-card';
    div.innerHTML = `
      <img src="${g.thumb}" alt="${escapeHtml(g.title)}" class="game-thumb" />
      <div>
        <div class="game-title">${escapeHtml(g.title)}</div>
        <div class="game-meta"><span>${g.category}</span><span>v${g.version} • ${g.size}</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="muted">Downloads: ${formatNumber(g.downloads)}</div>
          <div class="game-actions">
            <a class="btn btn-cta" href="details.html?id=${g.id}">Details</a>
            <a class="btn" href="#" onclick="fakeQuickDownload(event,'${g.id}')">Download</a>
          </div>
        </div>
      </div>
    `;
    gamesGrid.appendChild(div);
  });
}

function renderTrending(list){
  if(!trendingList) return;
  const top = list.slice().sort((a,b)=>b.trendingScore-a.trendingScore).slice(0,5);
  trendingList.innerHTML = '';
  top.forEach(g=>{
    const li = document.createElement('li');
    li.innerHTML = `<img src="${g.thumb}" alt=""><div><div class="t-title">${escapeHtml(g.title)}</div><div class="muted">Downloads: ${formatNumber(g.downloads)}</div></div>`;
    trendingList.appendChild(li);
  });
}

function getFilteredGames({query='', category='all', sort='recent'} = {}){
  let list = games.slice();
  if(category && category !== 'all'){
    list = list.filter(g=>g.category.toLowerCase()===category.toLowerCase());
  }
  if(query){
    const q = query.toLowerCase();
    list = list.filter(g=> g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
  }
  if(sort === 'downloads') list.sort((a,b)=>b.downloads-a.downloads);
  else if(sort === 'name') list.sort((a,b)=>a.title.localeCompare(b.title));
  else list.sort((a,b)=>b.trendingScore - a.trendingScore);
  return list;
}

// escape to prevent simple XSS from demo data
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function fakeQuickDownload(ev, id){
  ev.preventDefault();
  alert('Starting demo download — this link is a placeholder. Only distribute files you have rights to.');
  // increment fake download count
  const g = games.find(x=>x.id===id);
  if(g) g.downloads += Math.floor(Math.random()*10+1);
  renderGames(getFilteredGames({category:getActiveCategory(), query:searchInput.value, sort:sortSelect.value}));
  renderTrending(games);
}

function fakeDownload(ev){
  ev.preventDefault();
  alert('Direct download started (demo placeholder). Use real links only for proper content.');
  // optionally increase counter shown on details page
  const el = document.getElementById('downloadCount');
  if(el){
    const current = parseInt((el.dataset.count||'0'),10) || 0;
    el.dataset.count = current + Math.floor(Math.random()*50+5);
    el.textContent = 'Downloads: ' + formatNumber(current + Math.floor(Math.random()*50+5));
  }
}

// category activation
function getActiveCategory(){
  const active = document.querySelector('.cat.active');
  return active ? active.dataset.cat : 'all';
}
categoryButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    categoryButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    renderGames(getFilteredGames({category:cat, query:searchInput.value, sort:sortSelect.value}));
  });
});

// search
if(searchBtn){
  searchBtn.addEventListener('click', ()=> {
    renderGames(getFilteredGames({query:searchInput.value, category:getActiveCategory(), sort:sortSelect.value}));
  });
}
if(searchInput){
  searchInput.addEventListener('keydown', (e)=> {
    if(e.key === 'Enter') renderGames(getFilteredGames({query:searchInput.value, category:getActiveCategory(), sort:sortSelect.value}));
  });
}

if(sortSelect){
  sortSelect.addEventListener('change', ()=> {
    renderGames(getFilteredGames({query:searchInput.value, category:getActiveCategory(), sort:sortSelect.value}));
  });
}

// initial render
renderGames(getFilteredGames({}));
renderTrending(games);

// details page loader
function loadDetails(){
  // check if we are on details.html and there's an id
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  const g = games.find(x=>x.id===id);
  if(!g) return;
  // set DOM elements on details page
  document.getElementById('gameTitle').textContent = g.title;
  document.getElementById('gameVersion').textContent = g.version;
  document.getElementById('gameSize').textContent = g.size;
  document.getElementById('gameDesc').textContent = g.description;
  document.getElementById('detailThumb').src = g.thumb;
  document.getElementById('downloadBtn').href = '#';
  document.getElementById('downloadCount').textContent = 'Downloads: ' + formatNumber(g.downloads);
  document.getElementById('downloadCount').dataset.count = g.downloads;
  const shots = document.getElementById('screenshots');
  shots.innerHTML = '';
  g.screenshots.forEach(s=>{
    const i = document.createElement('img');
    i.src = s; i.alt = g.title + ' shot';
    shots.appendChild(i);
  });
}

// try loading details every time script runs
loadDetails();
