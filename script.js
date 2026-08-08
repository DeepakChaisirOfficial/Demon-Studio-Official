// Which device badges to display on each card (search/filter chips still cover all devices)
const CARD_BADGE_DEVICES = ['android','windows'];
const DEVICES = [
  {id:'android', label:'Android'},
  {id:'ios', label:'iOS'},
  {id:'windows', label:'Windows'},
];

const devIcon = {
  android:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 18h6"/>',
  ios:'<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="18" r="1"/>',
  windows:'<rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8M12 17v4"/>'
};

// ---------- Mod catalog ----------
// "link" is the full download URL for that package — host the file wherever
// you like (your own server, GitHub Releases, Google Drive, MediaFire, etc.)
// and paste the direct link here. Replace the placeholder URLs below with
// your real ones.
const MODS = [
  {name:'Obsidian Forge', cat:'mod', desc:'Adds a smithing rework with 40 new alloy tools and armor tiers.', ver:'v3.2.1', size:'4.1 MB', color:'#3a2a26', devices:['android','ios','windows','xbox','playstation','switch'], link:'https://example.com/downloads/obsidian-forge.mcaddon'},
  {name:'Wraith Mobs', cat:'addon', desc:'Six new hostile entities with custom AI for the overworld and nether.', ver:'v1.8.0', size:'6.7 MB', color:'#2a1f33', devices:['android','windows','xbox','switch'], link:'https://example.com/downloads/wraith-mobs.mcaddon'},
  {name:'Ember Shaders', cat:'shader', desc:'Dynamic lighting, soft shadows and volumetric fog tuned for mobile GPUs.', ver:'v2.0.4', size:'2.3 MB', color:'#3a1f1a', devices:['android','ios','windows'], link:'https://example.com/downloads/ember-shaders.mcpack'},
  {name:'Hollowstone Pack', cat:'texture', desc:'A 32x gothic stone-and-iron texture overhaul for survival worlds.', ver:'v1.4.2', size:'9.4 MB', color:'#232326', devices:['android','ios','windows','xbox','playstation','switch'], link:'https://example.com/downloads/hollowstone-pack.mcpack'},
  {name:'Rift Dimension', cat:'addon', desc:'A new explorable dimension with structures, loot and boss fights.', ver:'v0.9.6', size:'11.2 MB', color:'#1f2a33', devices:['windows','xbox','playstation'], link:'https://example.com/downloads/rift-dimension.mcaddon'},
  {name:'Chrono Farming', cat:'mod', desc:'Automates crop cycles with redstone-linked timers and sprinklers.', ver:'v2.1.0', size:'1.8 MB', color:'#1f3327', devices:['android','ios','windows','xbox','switch'], link:'https://example.com/downloads/chrono-farming.mcaddon'},
  {name:'Voidlight Shaders', cat:'shader', desc:'High-contrast night lighting with realistic star and moon phases.', ver:'v1.1.7', size:'3.0 MB', color:'#1a1a2e', devices:['windows','xbox','playstation'], link:'https://example.com/downloads/voidlight-shaders.mcpack'},
  {name:'Runeblade Weapons', cat:'mod', desc:'Twelve enchantable runeblades with unique special attacks.', ver:'v1.0.3', size:'2.9 MB', color:'#332017', devices:['android','ios','windows','xbox','playstation','switch'], link:'https://example.com/downloads/runeblade-weapons.mcaddon'},
  {name:'Frosthollow Pack', cat:'texture', desc:'Cold-biome texture set with icy variants for every block.', ver:'v1.2.0', size:'7.6 MB', color:'#1f2b33', devices:['android','ios','windows','switch'], link:'https://example.com/downloads/frosthollow-pack.mcpack'},
  {name:'Sentinel Golems', cat:'addon', desc:'Craftable defense golems that patrol and guard your base.', ver:'v1.6.1', size:'5.5 MB', color:'#262626', devices:['android','windows','xbox','playstation','switch'], link:'https://example.com/downloads/sentinel-golems.mcaddon'},
  {name:'Duskveil Shaders', cat:'shader', desc:'Warm sunset tones with soft bloom, built for low-end devices.', ver:'v1.3.5', size:'1.9 MB', color:'#33241a', devices:['android','ios'], link:'https://example.com/downloads/duskveil-shaders.mcpack'},
  {name:'Ironwake Pack', cat:'texture', desc:'Industrial steampunk retexture for tools, machines and rails.', ver:'v1.0.9', size:'8.1 MB', color:'#262019', devices:['android','ios','windows','xbox','playstation','switch'], link:'https://example.com/downloads/ironwake-pack.mcpack'},
];

// ---------- State ----------
let activeCat = 'all';
let activeDevices = new Set();
let query = '';

// ---------- Render device filter chips ----------
const deviceFiltersEl = document.getElementById('deviceFilters');
DEVICES.forEach(d=>{
  const chip = document.createElement('button');
  chip.className='chip';
  chip.textContent=d.label;
  chip.dataset.dev=d.id;
  chip.addEventListener('click',()=>{
    if(activeDevices.has(d.id)){ activeDevices.delete(d.id); chip.classList.remove('active'); }
    else{ activeDevices.add(d.id); chip.classList.add('active'); }
    render();
  });
  deviceFiltersEl.appendChild(chip);
});

// ---------- Tabs ----------
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    render();
  });
});

// ---------- Search ----------
document.getElementById('search').addEventListener('input',e=>{
  query = e.target.value.trim().toLowerCase();
  render();
});

// ---------- Render grid ----------
const grid = document.getElementById('grid');
const resultCount = document.getElementById('resultCount');

function render(){
  const filtered = MODS.filter(m=>{
    if(activeCat!=='all' && m.cat!==activeCat) return false;
    if(query && !(m.name.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query))) return false;
    if(activeDevices.size>0){
      for(const d of activeDevices){ if(!m.devices.includes(d)) return false; }
    }
    return true;
  });

  resultCount.innerHTML = `<b>${filtered.length}</b> package${filtered.length===1?'':'s'} found`;

  if(filtered.length===0){
    grid.innerHTML = `<div class="empty-state">No packages match those filters yet. Try clearing a device filter or search term.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(m=>`
    <div class="card chamfer-sm">
      <div class="thumb" style="background:${m.color}">
        <span class="tag-pill">${labelForCat(m.cat)}</span>
        ${initials(m.name)}
      </div>
      <div class="card-body">
        <h3 class="card-title">${m.name}</h3>
        <p class="card-desc">${m.desc}</p>
        <div class="meta-row"><span>${m.ver}</span><span>${m.size}</span></div>
        <div class="devices-row">
          ${m.devices.filter(d=>d==='windows'||d==='android').map(d=>`<div class="dev-badge" title="${d}"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">${devIcon[d]}</svg></div>`).join('')}
        </div>
        <a class="dl-btn" href="${m.link}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
          Download
        </a>
      </div>
    </div>
  `).join('');
}

function labelForCat(c){
  return {mod:'Mod', addon:'Addon', shader:'Shader', texture:'Texture Pack'}[c] || c;
}
function initials(name){
  return name.split(' ').map(w=>w[0]).join('').slice(0,3);
}

render();
