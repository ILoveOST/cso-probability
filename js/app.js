/* 카스온라인 해독기 확률 도감 - 화면 로직 (무기·캐릭터 이미지: images/weapons, images/classes)
   데이터는 js/data.js (LISTS, DECODERS, IMAGES, WIKI_BASE, UPDATED) */
(() => {
'use strict';

/* ===== 설정 ===== */
const GRADES = [
  ['에픽','#ffd23d'],['초월','#ff5f6d'],['유니크','#b67cff'],['레어','#4aa3ff'],
  ['고급','#3fc98a'],['일반','#9aa3b2'],['Top','#ff6fb5'],['ZHC','#ff8a3d'],
  ['클래스','#2fd3a4'],['기타','#7d8597'],
];
const GC = Object.fromEntries(GRADES);
const GORDER = Object.fromEntries(GRADES.map(([g],i)=>[g,i]));
const NAV_BASE = [
  ['PC방',   [9616, 9615]],
  ['무기',   [2599, 8293, 8292, 8309, 8308, 8310, 957, 956]],
  ['클래스', [8312, 8311, 985]],
  ['기타',   [8453, 9330, 9084]],
];
const IMG_DIR = 'images/';

const ICONS = {
  gun:    '<svg viewBox="0 0 24 24"><path d="M3 9h15l2 2v2h-6l-1 2H9l-1 4H5l1-4H3z"/><path d="M14 13v-2"/></svg>',
  person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21v-1.5A5.5 5.5 0 0 1 10.5 14h3a5.5 5.5 0 0 1 5.5 5.5V21"/></svg>',
  zombie: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><path d="M9.5 9h.01M14.5 9h.01M9 13.5l1.5-1 1.5 1 1.5-1 1.5 1"/><path d="M9 20h6"/></svg>',
  shirt:  '<svg viewBox="0 0 24 24"><path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a4 4 0 0 1-8 0Z"/></svg>',
  flag:   '<svg viewBox="0 0 24 24"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>',
  paint:  '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.9 1.2-1.7-.4-1 .3-2.3 1.5-2.3H17a4 4 0 0 0 4-4c0-5-4-10-9-10Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/></svg>',
  box:    '<svg viewBox="0 0 24 24"><path d="M3 8 12 3l9 5v8l-9 5-9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  close:  '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chev:   '<svg viewBox="0 0 24 24" class="chev"><path d="m6 9 6 6 6-6"/></svg>',
};

/* ===== 유틸 ===== */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => s.toLowerCase()
  .replace(/Ⅰ/g,'i').replace(/Ⅱ/g,'ii').replace(/Ⅲ/g,'iii').replace(/Ⅳ/g,'iv').replace(/Ⅴ/g,'v')
  .replace(/[^a-z0-9가-힣]/g,'');
const periodOf = n => (n.match(/\((\d+일)\)\s*$/)||[])[1] || '';
const baseName = n => n.replace(/^\[ZHC\]\s*/,'').replace(/\s*\(\d+일\)\s*$/,'')
  .replace(/\s*-\s*\d+강\s*$/,'').replace(/\([^()]*파츠[^()]*\)/,'').trim();
const pShort = p => { let s = p.toFixed(5).replace(/0+$/,''); if (s.split('.')[1].length < 2) s = p.toFixed(2); return s + '%'; };
const pFull  = p => p.toFixed(5) + '%';
const pSum   = p => (Math.round(p * 100) / 100).toFixed(2) + '%';  /* 합계용 (반올림 오차 제거) */
const oneIn  = p => Math.round(100 / p).toLocaleString('ko-KR');
const chance = (p, n) => 1 - Math.pow(1 - p/100, n);
const triesFor = (p, target) => Math.ceil(Math.log(1 - target) / Math.log(1 - p/100));
const pct = r => r >= 0.99995 ? '≈100%' : (r*100).toFixed(r < 0.01 ? 3 : r < 0.1 ? 2 : 1) + '%';
const store = {
  get(k, d){ try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch {} },
};

/* ===== 데이터 펼치기 ===== */
const DEC = DECODERS;
const DEC_BY_ID = Object.fromEntries(DEC.map(d => [d.id, d]));
/* 자동 업데이트로 새 해독기가 생기면 이름으로 분류해 넣고, 사라진 해독기는 목록에서 뺌 */
const NAV = (() => {
  const nav = NAV_BASE.map(([c, ids]) => [c, ids.filter(id => DEC_BY_ID[id])]);
  const known = new Set(NAV_BASE.flatMap(([, ids]) => ids));
  for (const D of DEC) {
    if (known.has(D.id)) continue;
    const cat = /PC방/.test(D.name) ? 'PC방' : /클래스/.test(D.name) ? '클래스'
      : /에픽|초월|유니크|레어|Top/.test(D.name) ? '무기' : '기타';
    nav.find(([c]) => c === cat)[1].push(D.id);
  }
  return nav.filter(([, ids]) => ids.length);
})();
const DEFAULT_DEC = DEC_BY_ID[9616] ? 9616 : DEC[0].id;
const ITEMS = [];
DEC.forEach(D => {
  D.rows.forEach(([group, p, li, grade, type, weaponCount = 5], gi) => {
    LISTS[li].split('|').forEach((name, i) => {
      const t = type === 'mixed' ? (i < weaponCount ? 'weapon' : 'class') : type;
      const base = baseName(name);
      ITEMS.push({ id: ITEMS.length, dec: D.id, name, base, key: norm(base), period: periodOf(name),
        group, gi, grade, type: t, p: +p, n: norm(name) + ' ' + norm(group) });
    });
  });
});
const decItems = id => ITEMS.filter(it => it.dec === id);

function iconFor(it){
  if (it.type === 'weapon') return ICONS.gun;
  if (it.type === 'class') return ICONS.person;
  if (/도색도안/.test(it.name)) return ICONS.paint;
  if (/대기실 마크/.test(it.name)) return ICONS.flag;
  if (/상자/.test(it.name)) return ICONS.box;
  if (/좀비/.test(it.name + it.group)) return ICONS.zombie;
  return ICONS.shirt;
}
function imgTag(it){
  const im = IMAGES[it.base];
  if (!im) return '';
  return `<img src="${IMG_DIR}${im[0]}" data-fb="${WIKI_BASE}${im[1]}/revision/latest" alt="" loading="lazy" decoding="async">`;
}
function thumbHTML(it, cls='thumb'){
  if (it.type === 'class' && IMAGES[it.base]) cls += ' portrait';
  return `<div class="${cls}">${imgTag(it)}<div class="ph">${iconFor(it)}<span>${esc(it.base)}</span></div></div>`;
}
/* 이미지: 로컬 → 위키 → 아이콘 */
document.addEventListener('load', e => {
  const t = e.target; if (t.tagName === 'IMG' && t.parentElement) t.parentElement.classList.add('has-img');
}, true);
document.addEventListener('error', e => {
  const t = e.target; if (t.tagName !== 'IMG') return;
  if (t.dataset.fb) { const fb = t.dataset.fb; delete t.dataset.fb; t.referrerPolicy = 'no-referrer'; t.src = fb; }
  else t.remove();
}, true);

/* ===== 상태 ===== */
const S = {
  dec: DEFAULT_DEC, q: '', all: false, type: 'all', period: 'all', grade: null,
  sort: 'group', view: store.get('cso.view', 'card'), closed: new Set(),
};
function readHash(){
  const m = location.hash.match(/id=(\d+)/);
  const id = m && DEC_BY_ID[+m[1]] ? +m[1] : null;
  if (id) S.dec = id;
  else S.dec = +store.get('cso.dec', DEFAULT_DEC) in DEC_BY_ID ? +store.get('cso.dec', DEFAULT_DEC) : DEFAULT_DEC;
}
function go(id, keepSearch){
  S.dec = id; S.grade = null; S.closed.clear();
  if (!keepSearch) { S.all = false; $('#allDec').checked = false; }
  store.set('cso.dec', id);
  history.replaceState(null, '', '#id=' + id);
  renderAll();
  window.scrollTo({ top: 0 });
}

/* ===== 사이드바 ===== */
function decColor(D){
  // 해독기의 대표 색 = 확률 합이 가장 큰 상위 등급 중 가장 높은 등급
  const g = D.rows.map(r => r[3]).sort((a,b) => GORDER[a] - GORDER[b])[0];
  return GC[g];
}
function renderNav(){
  const html = NAV.map(([cat, ids]) => `
    <div class="nav-cat"><h3>${cat}</h3>
      ${ids.map(id => { const D = DEC_BY_ID[id]; const n = decItems(id).length;
        return `<button class="nav-item${id===S.dec && !(S.all && S.q)?' on':''}" data-id="${id}" style="--c:${decColor(D)}">
          <span class="dot"></span><span class="nm">${esc(D.name)}</span><span class="ct">${n}</span></button>`; }).join('')}
    </div>`).join('');
  $('#sidebar').innerHTML = html;
  $('#decSelect').innerHTML = NAV.map(([cat, ids]) =>
    `<optgroup label="${cat}">${ids.map(id => `<option value="${id}"${id===S.dec?' selected':''}>${esc(DEC_BY_ID[id].name)} (${decItems(id).length})</option>`).join('')}</optgroup>`).join('');
}

/* ===== 해독기 소개 ===== */
function renderHero(){
  const hero = $('#hero');
  if (S.all && S.q) {
    hero.style.setProperty('--c', '#ffb53d');
    hero.innerHTML = `<div class="hero-top"><div><div class="kicker">전체 해독기 검색</div><h1>“${esc(S.q)}” 검색 결과</h1></div></div>`;
    return;
  }
  const D = DEC_BY_ID[S.dec];
  const items = decItems(D.id);
  const byG = {};
  items.forEach(it => { byG[it.grade] = (byG[it.grade] || 0) + it.p; });
  const gs = Object.keys(byG).sort((a,b) => GORDER[a] - GORDER[b]);
  const total = gs.reduce((a,g) => a + byG[g], 0);
  const top = gs[0];
  const weapons = items.filter(i => i.type === 'weapon').length;
  hero.style.setProperty('--c', decColor(D));
  hero.innerHTML = `
    <div class="hero-top">
      <div>
        <div class="kicker">${esc(NAV.find(([,ids]) => ids.includes(D.id))[0])} 해독기 · <a href="https://csonline.nexon.com/Probability/Index?id=${D.id}" target="_blank" rel="noopener">공식 확률표 ↗</a></div>
        <h1>${esc(D.name)}</h1>
      </div>
      <div class="facts">
        <div class="fact"><div class="k">아이템</div><div class="v">${items.length}종</div></div>
        <div class="fact"><div class="k">${weapons ? '무기' : '캐릭터'}</div><div class="v">${weapons || items.filter(i => i.type === 'class').length}종</div></div>
        <div class="fact"><div class="k">${esc(top)} 등급 합계</div><div class="v" style="color:${GC[top]}">${pSum(byG[top])}</div></div>
      </div>
    </div>
    <div class="dist">
      <div class="dist-bar">${gs.map(g => `<span style="--c:${GC[g]};width:${byG[g]/total*100}%;${S.grade && S.grade!==g?'opacity:.25':''}" title="${g} ${pSum(byG[g])}"></span>`).join('')}</div>
      <div class="dist-legend">${gs.map(g => `<button class="lg${S.grade===g?' on':''}" data-g="${g}" style="--c:${GC[g]}"><i></i>${g} <b>${pSum(byG[g])}</b></button>`).join('')}</div>
      <div class="dist-hint">등급을 누르면 그 등급만 볼 수 있어요.</div>
    </div>
    <div class="jump">${D.rows.map(([g, p, li, grade], gi) => {
      const sum = items.filter(i => i.gi === gi).reduce((a,b) => a + b.p, 0);
      return `<button data-gi="${gi}" style="--c:${GC[grade]}">${esc(g || '(이름 없음)')} <b>${pSum(sum)}</b></button>`; }).join('')}</div>`;
}

/* ===== 결과 ===== */
function filtered(){
  const q = norm(S.q);
  const global = S.all && q;
  return ITEMS.filter(it =>
    (global || it.dec === S.dec) &&
    (S.type === 'all' || it.type === S.type) &&
    (S.period === 'all' || (S.period === 'perm' ? !it.period : !!it.period)) &&
    (!S.grade || global || it.grade === S.grade) &&
    (!q || it.n.includes(q)));
}
function sortItems(list){
  const by = {
    desc: (a,b) => b.p - a.p || a.id - b.id,
    asc:  (a,b) => a.p - b.p || a.id - b.id,
    name: (a,b) => a.name.localeCompare(b.name, 'ko'),
  }[S.sort] || ((a,b) => b.p - a.p || a.id - b.id);
  return [...list].sort(by);
}
function cardHTML(it, opt = {}){
  return `<button class="card" data-item="${it.id}" style="--c:${GC[it.grade]}">
    ${thumbHTML(it).replace('</div></div>', `</div><span class="tag grade">${esc(it.grade)}</span>${it.period ? `<span class="tag period">${it.period}</span>` : ''}</div>`)}
    <div class="cbody">
      ${opt.dec ? `<div class="cdec">${esc(DEC_BY_ID[it.dec].name)}</div>` : ''}
      <div class="cname">${esc(it.name)}</div>
      ${opt.group ? `<div class="cgroup">${esc(it.group)}</div>` : ''}
      <div class="cprob"><b>${pShort(it.p)}</b><small>1/${oneIn(it.p)}회</small></div>
    </div>
  </button>`;
}
function tableHTML(list, opt = {}){
  return `<table class="tbl"><thead><tr>
      <th style="width:100px">이미지</th><th>아이템</th>
      ${opt.dec ? '<th class="hide-sm">해독기</th>' : ''}
      ${opt.group ? '<th class="hide-sm">그룹</th>' : ''}
      <th class="num">확률</th><th class="num hide-sm">기대 횟수</th></tr></thead><tbody>
    ${list.map(it => `<tr data-item="${it.id}" style="--c:${GC[it.grade]}">
      <td>${thumbHTML(it, 'mini')}</td>
      <td><span class="gd">${esc(it.grade)}</span><span class="nm">${esc(it.name.replace(/\s*\(\d+일\)$/, ''))}</span>${it.period ? `<span class="pd">${it.period}</span>` : ''}</td>
      ${opt.dec ? `<td class="sm hide-sm">${esc(DEC_BY_ID[it.dec].name)}</td>` : ''}
      ${opt.group ? `<td class="sm hide-sm">${esc(it.group)}</td>` : ''}
      <td class="num p">${pShort(it.p)}</td>
      <td class="num sm hide-sm">1/${oneIn(it.p)}회</td></tr>`).join('')}
    </tbody></table>`;
}
function renderResults(){
  const list = filtered();
  const global = S.all && norm(S.q);
  const box = $('#results');

  // 적용된 필터 표시
  const chips = [];
  if (S.q) chips.push(['q', `검색: ${S.q}`]);
  if (S.grade && !global) chips.push(['grade', `등급: ${S.grade}`]);
  if (S.type !== 'all') chips.push(['type', {weapon:'무기',class:'클래스',etc:'기타'}[S.type]]);
  if (S.period !== 'all') chips.push(['period', S.period === 'perm' ? '무제한' : '기간제']);
  const sum = list.reduce((a,b) => a + b.p, 0);
  $('#activeFilters').innerHTML = `<span>${list.length.toLocaleString()}개${global ? '' : ` · 합계 ${pSum(sum)}`}</span>` +
    chips.map(([k, t]) => `<span class="af">${esc(t)}<button data-clear="${k}" aria-label="필터 해제">×</button></span>`).join('') +
    (chips.length > 1 ? `<span class="af">모두 해제<button data-clear="all" aria-label="모든 필터 해제">×</button></span>` : '');

  if (!list.length) {
    box.innerHTML = `<div class="empty"><b>조건에 맞는 아이템이 없어요</b>${S.q && !S.all ? '오른쪽 위 “전체 해독기”를 켜면 모든 해독기에서 찾아요.' : '필터를 바꿔 보세요.'}</div>`;
    return;
  }
  if (global || S.sort !== 'group') {
    const sorted = sortItems(list);
    const opt = { dec: !!global, group: true };
    box.innerHTML = S.view === 'list' ? tableHTML(sorted, opt) : `<div class="grid">${sorted.map(it => cardHTML(it, opt)).join('')}</div>`;
    return;
  }
  const D = DEC_BY_ID[S.dec];
  const groups = new Map();
  list.forEach(it => { if (!groups.has(it.gi)) groups.set(it.gi, []); groups.get(it.gi).push(it); });
  box.innerHTML = [...groups].map(([gi, arr]) => {
    const [g, p, , grade] = D.rows[gi];
    const tot = arr.reduce((a,b) => a + b.p, 0);
    return `<section class="group${S.closed.has(gi) ? ' closed' : ''}" id="g${gi}" style="--c:${GC[grade]}">
      <div class="ghead" data-toggle="${gi}" role="button" tabindex="0" aria-expanded="${!S.closed.has(gi)}">
        ${ICONS.chev}<span class="bar"></span><h2>${esc(g || '(이름 없음)')}</h2>
        <span class="meta">${arr.length}종 · 개당 ${pFull(+p)}</span>
        <span class="total">그룹 합계<b>${pSum(tot)}</b></span>
      </div>
      <div class="gbody">${S.view === 'list' ? tableHTML(arr) : `<div class="grid">${arr.map(it => cardHTML(it)).join('')}</div>`}</div>
    </section>`;
  }).join('');
}

function syncControls(){
  for (const [sel, v] of [['#typeSeg', S.type], ['#periodSeg', S.period], ['#viewSeg', S.view]])
    document.querySelectorAll(sel + ' button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $('#sort').value = S.sort;
  document.title = (S.all && S.q ? `“${S.q}” 검색` : DEC_BY_ID[S.dec].name) + ' 확률 | 카스온라인 해독기 확률 도감';
}
function renderAll(){ renderNav(); renderHero(); syncControls(); renderResults(); }

/* ===== 상세 팝업 ===== */
const dlg = $('#detail');
function openDetail(id){
  const it = ITEMS[id];
  const D = DEC_BY_ID[it.dec];
  const others = ITEMS.filter(o => o.key === it.key).sort((a,b) => b.p - a.p);
  const tries = +store.get('cso.tries', 100) || 100;
  dlg.style.setProperty('--c', GC[it.grade]);
  dlg.innerHTML = `
    ${thumbHTML(it, 'd-hero').replace(/<\/div><\/div>$/, `</div><button class="d-close" data-close aria-label="닫기">${ICONS.close}</button></div>`)}
    <div class="d-body">
      <div class="d-title"><span class="tag grade">${esc(it.grade)}</span>${it.period ? `<span class="tag period">${it.period}</span>` : ''}<h2 id="dTitle">${esc(it.name)}</h2></div>
      <div class="d-sub">${esc(D.name)} · ${esc(it.group || '(이름 없음)')}</div>
      <div class="d-stats">
        <div class="d-stat"><div class="k">획득 확률 (공식)</div><div class="v c">${pFull(it.p)}</div></div>
        <div class="d-stat"><div class="k">평균 기대 횟수</div><div class="v">${oneIn(it.p)}회</div></div>
        <div class="d-stat"><div class="k">50% / 90% 확률로 얻으려면</div><div class="v">${triesFor(it.p,.5).toLocaleString()} / ${triesFor(it.p,.9).toLocaleString()}회</div></div>
      </div>
      <div class="d-calc">
        <h3>해독 횟수 계산기</h3>
        <div class="calc-row">
          <input type="number" id="calcN" min="1" max="1000000" value="${tries}" aria-label="해독 횟수"> 회
          ${[10, 50, 100, 500, 1000].map(n => `<button class="pre" data-n="${n}">${n}회</button>`).join('')}
        </div>
        <div class="calc-out">
          <div>1개 이상 얻을 확률<b id="calcP"></b></div>
          <div>평균 획득 개수<b id="calcE"></b></div>
        </div>
        <div class="meter"><i id="calcM"></i></div>
      </div>
      <div class="d-other">
        <h3>이 아이템이 나오는 해독기 (${others.length})</h3>
        ${others.map(o => `<button class="orow${o.id === it.id ? ' cur' : ''}" data-goto="${o.dec}" data-oid="${o.id}" style="--c:${GC[o.grade]}">
            <span class="on">${esc(DEC_BY_ID[o.dec].name)}${o.id === it.id ? ' · 지금 보는 중' : ''}</span>
            <span class="og">${esc(o.name)} · ${esc(o.group || '(이름 없음)')}</span>
            <span class="op">${pShort(o.p)}<small>1/${oneIn(o.p)}회</small></span>
          </button>`).join('')}
      </div>
    </div>`;
  const upd = () => {
    const n = Math.max(1, Math.min(1e6, +$('#calcN').value || 1));
    store.set('cso.tries', n);
    const r = chance(it.p, n);
    $('#calcP').textContent = pct(r);
    $('#calcE').textContent = (n * it.p / 100).toLocaleString('ko-KR', { maximumFractionDigits: 3 }) + '개';
    $('#calcM').style.width = (r * 100).toFixed(2) + '%';
  };
  $('#calcN').addEventListener('input', upd);
  dlg.querySelectorAll('.pre').forEach(b => b.onclick = () => { $('#calcN').value = b.dataset.n; upd(); });
  upd();
  if (!dlg.open) dlg.showModal();
  dlg.scrollTop = 0;
}
dlg.addEventListener('click', e => {
  if (e.target === dlg || e.target.closest('[data-close]')) return dlg.close();
  const row = e.target.closest('.orow:not(.cur)');
  if (row) { dlg.close(); go(+row.dataset.goto, false);
    requestAnimationFrame(() => document.querySelector(`[data-item="${row.dataset.oid}"]`)?.scrollIntoView({ block: 'center' })); }
});

/* ===== 이벤트 ===== */
$('#sidebar').addEventListener('click', e => { const b = e.target.closest('.nav-item'); if (b) go(+b.dataset.id); });
$('#decSelect').addEventListener('change', e => go(+e.target.value));
let qTimer;
$('#q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { S.q = e.target.value.trim(); renderNav(); renderHero(); syncControls(); renderResults(); }, 120); });
$('#allDec').addEventListener('change', e => { S.all = e.target.checked; renderAll(); });
for (const [sel, key] of [['#typeSeg','type'], ['#periodSeg','period'], ['#viewSeg','view']])
  $(sel).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    S[key] = b.dataset.v; if (key === 'view') store.set('cso.view', S.view); syncControls(); renderResults(); });
$('#sort').addEventListener('change', e => { S.sort = e.target.value; renderResults(); });
$('#hero').addEventListener('click', e => {
  const lg = e.target.closest('.lg'); if (lg) { S.grade = S.grade === lg.dataset.g ? null : lg.dataset.g; renderHero(); renderResults(); return; }
  const j = e.target.closest('[data-gi]'); if (j) {
    const gi = +j.dataset.gi;
    if (S.sort !== 'group' || S.grade || S.type !== 'all' || S.period !== 'all' || S.q) { S.sort = 'group'; S.grade = null; S.type = 'all'; S.period = 'all'; S.q = ''; $('#q').value = ''; renderAll(); }
    S.closed.delete(gi); document.getElementById('g' + gi)?.classList.remove('closed');
    document.getElementById('g' + gi)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
$('#activeFilters').addEventListener('click', e => {
  const b = e.target.closest('[data-clear]'); if (!b) return;
  const k = b.dataset.clear;
  if (k === 'q' || k === 'all') { S.q = ''; $('#q').value = ''; }
  if (k === 'grade' || k === 'all') S.grade = null;
  if (k === 'type' || k === 'all') S.type = 'all';
  if (k === 'period' || k === 'all') S.period = 'all';
  renderAll();
});
$('#results').addEventListener('click', e => {
  const h = e.target.closest('[data-toggle]');
  if (h) { const gi = +h.dataset.toggle; S.closed.has(gi) ? S.closed.delete(gi) : S.closed.add(gi);
    h.parentElement.classList.toggle('closed'); h.setAttribute('aria-expanded', !S.closed.has(gi)); return; }
  const c = e.target.closest('[data-item]'); if (c) openDetail(+c.dataset.item);
});
$('#results').addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-toggle]')) { e.preventDefault(); e.target.click(); }
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) && !dlg.open) { e.preventDefault(); $('#q').focus(); }
});
window.addEventListener('hashchange', () => { readHash(); renderAll(); });
document.querySelector('.brand').addEventListener('click', e => { e.preventDefault(); S.q = ''; $('#q').value = ''; go(DEFAULT_DEC); });

/* ===== 시작 ===== */
$('#updated').textContent = UPDATED;
if (typeof LAST_CHANGES !== 'undefined' && LAST_CHANGES && (LAST_CHANGES.changed.length || LAST_CHANGES.removed.length)) {
  const parts = [];
  if (LAST_CHANGES.changed.length) parts.push('변경: ' + LAST_CHANGES.changed.join(', '));
  if (LAST_CHANGES.removed.length) parts.push('삭제: ' + LAST_CHANGES.removed.join(', '));
  $('#lastChanges').textContent = `최근 자동 업데이트 ${LAST_CHANGES.date} — ${parts.join(' / ')}`;
}
readHash();
renderAll();
})();
