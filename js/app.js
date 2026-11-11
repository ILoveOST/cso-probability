/* 카스온라인 해독기 확률 도감 - 화면 로직 (무기·캐릭터 이미지: images/weapons, images/classes)
   데이터는 js/data.js (LISTS, DECODERS, IMAGES, WIKI_BASE, UPDATED), 변동 이력은 js/history.js (HISTORY) */
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
  clock:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  star:   '<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9Z"/></svg>',
};

/* ===== 검색 별명 =====
   영어 이름을 한글로 쳐도 찾을 수 있게 하는 표. 왼쪽(영어 단어, 대문자) → 오른쪽(한글 읽기, 띄어쓰기로 여러 개)
   예) 'SKULL-7' 은 '스컬7', 'ㅅㅋ7' 로도 검색됩니다. 새 별명은 여기에 한 줄 추가하면 됩니다. */
const ALIASES = {
  SKULL:'스컬', JANUS:'야누스', BALROG:'발록', VULCANUS:'불카누스', THANATOS:'타나토스', TURBULENT:'터뷸런트',
  CROW:'크로우', VICTORY:'빅토리', HECATE:'헤카테', ULTIMAX:'울티맥스', BIZON:'비존 바이존', NEGEV:'네게브',
  CHARGER:'차저', SPAS:'스파스', UZI:'우지', GROZA:'그로자', CLAYMORE:'클레이모어', STERLING:'스털링',
  TRACKER:'트래커', FALCON:'팔콘', DESTROYER:'디스트로이어', BOUNCER:'바운서', BUSTER:'버스터', BUNKER:'벙커',
  NORINCO:'노린코', 'D.EAGLE':'데저트이글 데글', AWP:'에땁', MINE:'마인', BAYONET:'바요넷', SPECIAL:'스페셜',
};
/* 아이템 하나에 별명을 따로 붙이고 싶을 때: '기본 이름': '별명1 별명2' */
const NICKNAMES = {
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
const qnorm = s => s.toLowerCase().replace(/[^a-z0-9가-힣ㄱ-ㅎ]/g,'');   /* 검색용 (초성 자음 유지) */
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const chosung = s => [...s].map(c => { const k = c.charCodeAt(0) - 0xAC00; return k >= 0 && k < 11172 ? CHO[Math.floor(k / 588)] : c; }).join('');
const ROMAN = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10, XI:11, XII:12,
  'Ⅰ':1, 'Ⅱ':2, 'Ⅲ':3, 'Ⅳ':4, 'Ⅴ':5, 'Ⅵ':6, 'Ⅶ':7, 'Ⅷ':8, 'Ⅸ':9, 'Ⅹ':10 };
/* 'BALROG-VII' → '발록-7', '썬더 플래시 Ⅱ' → '썬더 플래시 2' */
const altName = name => name
  .replace(/(^|[\s\-])(XII|XI|IX|X|VIII|VII|VI|IV|V|III|II|I|[Ⅰ-Ⅹ])(?=$|[\s()\-])/g, (m, a, r) => a + ROMAN[r])
  .replace(/[A-Za-z][A-Za-z.]*[A-Za-z]|[A-Za-z]/g, w => ALIASES[w.toUpperCase()] || w);
function searchText(name, base, group){
  const alt = altName(name), nick = NICKNAMES[base] || '';
  return [norm(name), qnorm(alt), chosung(qnorm(name)), chosung(qnorm(alt)), qnorm(nick), chosung(qnorm(nick)),
          norm(group), chosung(qnorm(group))].join(' ');
}
const pct = r => r >= 0.99995 ? '≈100%' : (r*100).toFixed(r < 0.01 ? 3 : r < 0.1 ? 2 : 1) + '%';
const store = {
  get(k, d){ try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch {} },
  json(k, d){ try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
};
/* 금액 표시: 12,000원 / 3.5만원 / 1.25억원 */
const won = v => !isFinite(v) ? '-'
  : v >= 1e8 ? (v / 1e8).toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '억원'
  : v >= 1e4 ? (v / 1e4).toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + '만원'
  : Math.round(v).toLocaleString('ko-KR') + '원';

/* ===== 해독 1회 비용 (해독기마다 직접 입력, 이 브라우저에만 저장) ===== */
const prices = store.json('cso.price', {});
const priceOf = id => +prices[id] || 0;
function setPrice(id, v){
  v = Math.max(0, Math.round(+v || 0));
  if (v) prices[id] = v; else delete prices[id];
  store.set('cso.price', JSON.stringify(prices));
}
const avgCost = it => priceOf(it.dec) * 100 / it.p;   /* 평균 기대 비용 = 1회 비용 × 기대 횟수 */

/* ===== 찜 목록 (기본 이름 기준: 기간제·무제한 등 같은 무기는 하나로) ===== */
const wish = store.json('cso.wish', {});   /* { key: 표시 이름 } */
const isWish = k => Object.prototype.hasOwnProperty.call(wish, k);
const wishCount = () => Object.keys(wish).length;

/* ===== 데이터 펼치기 ===== */
const DEC = DECODERS;
const DEC_BY_ID = Object.fromEntries(DEC.map(d => [d.id, d]));
const DEFAULT_DEC = DEC_BY_ID[9616] ? 9616 : DEC[0].id;
const ITEMS = [];
function addItems(D){
  D.rows.forEach(([group, p, li, grade, type, weaponCount = 5], gi) => {
    LISTS[li].split('|').forEach((name, i) => {
      const t = type === 'mixed' ? (i < weaponCount ? 'weapon' : 'class') : type;
      const base = baseName(name);
      ITEMS.push({ id: ITEMS.length, dec: D.id, name, base, key: norm(base), period: periodOf(name),
        group, gi, grade, type: t, p: +p, n: searchText(name, base, group) });
    });
  });
}
DEC.forEach(addItems);

/* ===== 넥슨 NOW (직접 저장해서 올린 페이지, js/nexonnow.js) =====
   - 공식 확률 페이지에 없는 해독기 → 해독기 목록에 추가 (카드·계산기·찜 그대로 사용)
   - 강화·상자 등 → 표 화면
   - 공식 페이지에도 있는 해독기 → 교차검증 + 실제 결과 표시 */
const NOW_URL = 'https://now.nexon.com/service/csonline';
const NOW = typeof NEXON_NOW !== 'undefined' && NEXON_NOW && NEXON_NOW.pages ? NEXON_NOW : null;
const NOW_BY_TITLE = new Map();     /* 해독기 이름 → 넥슨 NOW 페이지 */
const NOW_REAL = new Map();         /* '해독기|아이템' → 실제 결과(%) */
const NOW_DEC = [];                 /* 넥슨 NOW에만 있는 해독기 id */
const PAGES = [];                   /* 표로 보여줄 페이지 (강화·상자 등) */
const PAGE_BY_ID = {};
if (NOW) {
  for (const k in NOW.images || {}) if (!IMAGES[k]) IMAGES[k] = NOW.images[k];
  const info = new Map();
  ITEMS.forEach(it => { if (!info.has(it.base)) info.set(it.base, it); });
  NOW.pages.forEach(pg => {
    NOW_BY_TITLE.set(pg.title, pg);
    if (!pg.items) { PAGES.push(pg); PAGE_BY_ID[pg.id] = pg; return; }
    pg.items.forEach(([n, , r]) => { if (r !== '') NOW_REAL.set(pg.title + '|' + norm(n), +r); });
    if (pg.official || DEC.some(D => D.name === pg.title)) return;
    const rows = []; let cur = null;
    pg.items.forEach(([n, p]) => {
      const base = baseName(n), k = info.get(base), im = IMAGES[base];
      const grade = k ? k.grade : '기타';
      const type = k ? k.type : im && /^classes\//.test(im[0]) ? 'class' : im && /^weapons\//.test(im[0]) ? 'weapon' : 'etc';
      const per = periodOf(n) || '무제한';
      if (cur && cur.p === p && cur.grade === grade && cur.type === type && cur.per === per) cur.names.push(n);
      else rows.push(cur = { p, grade, type, per, names: [n] });
    });
    const D = { id: pg.id, name: pg.title, now: pg,
      rows: rows.map(r => { LISTS.push(r.names.join('|')); return [`개당 ${(+r.p).toFixed(5)}% · ${r.per}`, r.p, LISTS.length - 1, r.grade, r.type]; }) };
    DEC.push(D); DEC_BY_ID[D.id] = D; NOW_DEC.push(D.id); addItems(D);
  });
}
/* ===== 위쪽 탭 = 넥슨 NOW 메뉴 구조 (아직 안 올린 메뉴도 모두 보여줌) ===== */
const DEFAULT_MENU = [
  ['해독기', ['에픽 해독기','초월 해독기','초월 프리미엄 해독기','유니크 해독기','유니크 프리미엄 해독기','클래스 해독기','클래스 프리미엄 해독기','이벤트 해독기','레어 해독기','드라카르 해독기','도색도안 해독기','트레이스 해독기','올인원 해독기','[ZHC] 고급 암호 해독기','눈꽃 해독기','레전드 해독기','올스타 해독기']],
  ['무기 강화', ['강화 성공 확률','강화 속성 확률','랜덤 -1 안티 강화 재료']],
  ['무기 개조', ['개조 재료 경험치 획득량','레전드 등급 옵션']],
  ['상자', ['에픽 해독기 조각 상자','올인원 상자','희망의 궤','안티 강화재료 부품 확률 상자','특수 작전 보급함','각성 기어 상자','데일리 찬스 상자','시즌 데일리 찬스 상자','개조 재료 랜덤 상자','구슬 바구니']],
  ['파츠 조합', ['파츠 조합 결과']],
  ['클래스 각성', ['클래스 각성 능력치']],
];
const MENU = (NOW && NOW.menu && NOW.menu.length ? NOW.menu : DEFAULT_MENU).map(([c, t]) => [c, [...t]]);
/* 넥슨 NOW 메뉴에는 없지만 올린 페이지가 있으면 그 분류에 추가 */
PAGES.forEach(pg => { let m = MENU.find(([c]) => c === pg.category); if (!m) MENU.push(m = [pg.category, []]); if (!m[1].includes(pg.title)) m[1].push(pg.title); });
const SECTIONS = ['해독기', ...MENU.map(([c]) => c).filter(c => c !== '해독기')];
const SEC_DESC = {
  '해독기': '해독기를 열었을 때 나오는 아이템과 확률',
  '무기 강화': '무기를 강화할 때 적용되는 성공·속성 확률',
  '무기 개조': '무기를 개조할 때 적용되는 경험치·옵션 확률',
  '상자': '상자를 열었을 때 나오는 구성품과 확률',
  '파츠 조합': '파츠를 조합했을 때 나오는 결과 확률',
  '클래스 각성': '클래스를 각성할 때 붙는 능력치 확률',
};
const SEC_ICON = {
  '해독기': '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.5"/></svg>',
  '무기 강화': '<svg viewBox="0 0 24 24"><path d="M12 3v14M6 9l6-6 6 6"/><path d="M5 21h14"/></svg>',
  '무기 개조': '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4Z"/></svg>',
  '상자': ICONS.box,
  '파츠 조합': '<svg viewBox="0 0 24 24"><path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3h7Z"/></svg>',
  '클래스 각성': '<svg viewBox="0 0 24 24"><path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4Z"/></svg>',
};
const UPLOAD_URL = 'https://github.com/ILoveOST/cso-probability/upload/main/nexon-now';
const secOf = title => (MENU.find(([, t]) => t.includes(title)) || ['해독기'])[0];
/* 메뉴 항목 하나의 상태: 공식 해독기 / 넥슨 NOW 해독기 / 표 페이지 / 아직 안 올림 */
function entryOf(title){
  const D = DEC.find(d => d.name === title);
  if (D && !D.now) return { kind: 'official', id: D.id, title };
  if (D) return { kind: 'dec', id: D.id, title, pg: D.now };
  const pg = PAGES.find(p => p.title === title);
  if (pg) return { kind: 'page', id: pg.id, title, pg };
  return { kind: 'pending', title };
}
const NOW_ONLY_DECS = () => (MENU.find(([c]) => c === '해독기') || ['', []])[1].map(entryOf).filter(e => e.kind !== 'official');

const realOf = it => NOW_REAL.get(DEC_BY_ID[it.dec].name + '|' + norm(it.name));

/* 공식 확률 페이지 ↔ 넥슨 NOW 교차검증 (같은 이름의 해독기끼리 아이템·확률 비교) */
function crossCheck(D){
  const pg = NOW_BY_TITLE.get(D.name);
  if (!pg || !pg.items || D.now) return null;
  const label = new Map(), cnt = (m, name, p) => {
    const k = norm(name) + '@' + (+p).toFixed(5); label.set(k, `${name} ${(+p).toFixed(5)}%`); m.set(k, (m.get(k) || 0) + 1); };
  const a = new Map(), b = new Map();
  ITEMS.forEach(it => { if (it.dec === D.id) cnt(a, it.name, it.p); });
  pg.items.forEach(([n, p]) => cnt(b, n, p));
  let match = 0; const onlyNow = [], onlyOff = [];
  for (const [k, c] of b) { const m = Math.min(c, a.get(k) || 0); match += m; for (let i = m; i < c; i++) onlyNow.push(label.get(k)); }
  for (const [k, c] of a) { const m = Math.min(c, b.get(k) || 0); for (let i = m; i < c; i++) onlyOff.push(label.get(k)); }
  return { pg, match, ok: !onlyNow.length && !onlyOff.length, onlyNow, onlyOff };
}

/* 자동 업데이트로 새 해독기가 생기면 이름으로 분류해 넣고, 사라진 해독기는 목록에서 뺌 */
const NAV = (() => {
  const nav = NAV_BASE.map(([c, ids]) => [c, ids.filter(id => DEC_BY_ID[id])]);
  const known = new Set(NAV_BASE.flatMap(([, ids]) => ids));
  for (const D of DEC) {
    if (known.has(D.id) || D.now) continue;
    const cat = /PC방/.test(D.name) ? 'PC방' : /클래스/.test(D.name) ? '클래스'
      : /에픽|초월|유니크|레어|Top/.test(D.name) ? '무기' : '기타';
    nav.find(([c]) => c === cat)[1].push(D.id);
  }
  nav.push(['넥슨 NOW 해독기', NOW_DEC]);
  return nav.filter(([, ids]) => ids.length);
})();
const decItems = id => ITEMS.filter(it => it.dec === id);

/* ===== 확률 변동 이력 ===== */
const HIST = typeof HISTORY !== 'undefined' ? HISTORY : [];
const HSTART = typeof HISTORY_START !== 'undefined' ? HISTORY_START : '';
const BADGE_DAYS = 14;                         /* 최근 14일 안의 변동만 카드에 표시 */
const RECENT = new Map();                      /* '해독기|아이템' → 가장 최근 변동 */
const RECENT_DEC = new Map();                  /* 해독기 → 가장 최근 변동 날짜 */
(() => {
  const cut = Date.now() - BADGE_DAYS * 864e5;
  HIST.forEach(e => {                           /* HISTORY 는 최신이 맨 앞 */
    if (new Date(e.date + 'T23:59:59+09:00') < cut) return;
    e.changes.forEach(c => {
      const k = c.dec + '|' + c.item;
      if (c.item && !RECENT.has(k)) RECENT.set(k, { ...c, date: e.date });
      if (!RECENT_DEC.has(c.dec)) RECENT_DEC.set(c.dec, e.date);
    });
  });
})();
const histOf = it => RECENT.get(it.dec + '|' + it.name);
const HB = { new: ['new', 'NEW'], up: ['up', '▲ 확률 상승'], down: ['down', '▼ 확률 하락'] };
function histBadge(it){
  const h = histOf(it); if (!h || !HB[h.type]) return '';
  const [c, t] = HB[h.type];
  const tip = h.type === 'new' ? `${h.date} 추가` : `${h.date} ${pShort(+h.from)} → ${pShort(+h.to)}`;
  return `<span class="hb ${c}" title="${tip}">${t}</span>`;
}
function changeText(c){
  switch (c.type) {
    case 'new': return `<span class="hb new">NEW</span> ${esc(c.item)} <span class="hv">${pShort(+c.to)}</span>`;
    case 'removed': return `<span class="hb gone">제외</span> ${esc(c.item)} <span class="hv">이전 ${pShort(+c.from)}</span>`;
    case 'up': case 'down':
      return `<span class="hb ${c.type}">${c.type === 'up' ? '▲' : '▼'}</span> ${esc(c.item)} <span class="hv">${pShort(+c.from)} → <b>${pShort(+c.to)}</b></span>`;
    case 'page_update': return `<span class="hb up">갱신</span> 확률표가 새로 바뀌었어요 <span class="hv">${esc(c.from || '-')} → <b>${esc(c.to || '')}</b></span>`;
    case 'decoder_new': return '<span class="hb new">NEW</span> 해독기가 새로 추가됐어요';
    case 'decoder_removed': return '<span class="hb gone">삭제</span> 해독기가 목록에서 빠졌어요';
  }
  return '';
}

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
  dec: DEFAULT_DEC, sec: '해독기', pend: null, wish: false, page: null, q: '', all: false, type: 'all', period: 'all', grade: null,
  sort: 'group', view: store.get('cso.view', 'card'), closed: new Set(),
};
function readHash(){
  const h = decodeURIComponent(location.hash);
  S.wish = h === '#wish';
  const pm = h.match(/now=(\d+)/), sm = h.match(/^#sec=(.+)$/), qm = h.match(/^#pending=(.+)$/);
  S.page = pm && PAGE_BY_ID[+pm[1]] ? +pm[1] : null;
  S.pend = qm ? qm[1] : null;
  S.sec = S.page ? PAGE_BY_ID[S.page].category : S.pend ? secOf(S.pend) : sm && SECTIONS.includes(sm[1]) ? sm[1] : '해독기';
  if (S.wish || S.page || S.pend || S.sec !== '해독기') return;
  const m = location.hash.match(/id=(\d+)/);
  const id = m && DEC_BY_ID[+m[1]] ? +m[1] : null;
  if (id) S.dec = id;
  else S.dec = +store.get('cso.dec', DEFAULT_DEC) in DEC_BY_ID ? +store.get('cso.dec', DEFAULT_DEC) : DEFAULT_DEC;
}
function resetView(){ S.page = null; S.pend = null; S.wish = false; S.q = ''; $('#q').value = ''; S.all = false; $('#allDec').checked = false; }
function show(hash){ history.replaceState(null, '', hash); renderAll(); window.scrollTo({ top: 0 }); }
function goPage(id){ resetView(); S.page = id; S.sec = PAGE_BY_ID[id].category; show('#now=' + id); }
function goPend(title){ resetView(); S.pend = title; S.sec = secOf(title); show('#pending=' + encodeURIComponent(title)); }
function goSec(sec){
  if (sec === '해독기') return go(S.dec);
  resetView(); S.sec = sec; show('#sec=' + encodeURIComponent(sec));
}
function goEntry(e){ e.kind === 'page' ? goPage(e.id) : e.kind === 'pending' ? goPend(e.title) : go(e.id); }
function goWish(){
  S.page = null; S.pend = null; S.sec = '해독기'; S.wish = true; S.q = ''; $('#q').value = ''; S.all = false; $('#allDec').checked = false;
  history.replaceState(null, '', '#wish');
  renderAll();
  window.scrollTo({ top: 0 });
}
function go(id, keepSearch){
  S.wish = false; S.page = null; S.pend = null; S.sec = '해독기'; S.dec = id; S.grade = null; S.closed.clear();
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
const isSpecial = () => S.wish || S.page || S.pend || S.sec !== '해독기';
function renderTabs(){
  $('#secbar').innerHTML = `<div class="secbar-in">${SECTIONS.map(sec => {
    const total = sec === '해독기' ? 0 : (MENU.find(([c]) => c === sec) || ['', []])[1].length;
    const done = sec === '해독기' ? 0 : (MENU.find(([c]) => c === sec) || ['', []])[1].filter(t => entryOf(t).kind !== 'pending').length;
    return `<button class="sec${S.sec === sec ? ' on' : ''}" data-sec="${esc(sec)}">${SEC_ICON[sec] || ICONS.box}<span>${esc(sec)}</span>${total ? `<small>${done}/${total}</small>` : ''}</button>`;
  }).join('')}</div>`;
}
function navItem(e, on){
  const st = e.kind === 'pending' ? ' pending' : '';
  const attr = e.kind === 'pending' ? `data-pend="${esc(e.title)}"` : e.kind === 'page' ? `data-page="${e.id}"` : `data-id="${e.id}"`;
  const c = e.kind === 'dec' || e.kind === 'official' ? decColor(DEC_BY_ID[e.id]) : e.kind === 'page' ? '#2fd3a4' : '#4a5269';
  const right = e.kind === 'pending' ? '<span class="ct">미반영</span>' : e.kind === 'dec' ? `<span class="ct">${decItems(e.id).length}</span>`
    : e.kind === 'page' ? `<span class="ct">${e.pg.tables.reduce((a, t) => a + t.rows.length, 0)}행</span>` : '';
  return `<button class="nav-item${on ? ' on' : ''}${st}" ${attr} style="--c:${c}"><span class="dot"></span><span class="nm">${esc(e.title)}</span>${right}</button>`;
}
function renderNav(){
  renderTabs();
  const searching = S.all && S.q;
  let html = '', opts = '';
  if (S.sec === '해독기') {
    const wishOn = S.wish && !searching;
    html = `<div class="nav-cat"><h3>내 목록</h3>
      <button class="nav-item wish-nav${wishOn ? ' on' : ''}" data-wishnav style="--c:var(--accent)">
        <span class="star-i">${ICONS.star}</span><span class="nm">찜 목록</span><span class="ct">${wishCount()}</span></button>
      <button class="nav-item" data-hist style="--c:#7d8597">
        <span class="star-i">${ICONS.clock}</span><span class="nm">확률 변경 기록</span><span class="ct">${HIST.length ? HIST[0].date.slice(5) : ''}</span></button>
    </div>`;
    const cats = NAV.filter(([c]) => c !== '넥슨 NOW 해독기');
    html += cats.map(([cat, ids]) => `<div class="nav-cat"><h3>${cat}</h3>
      ${ids.map(id => { const D = DEC_BY_ID[id], ck = crossCheck(D);
        return `<button class="nav-item${id === S.dec && !isSpecial() && !searching ? ' on' : ''}" data-id="${id}" style="--c:${decColor(D)}">
          <span class="dot"></span><span class="nm">${esc(D.name)}</span>${ck ? `<span class="ck ${ck.ok ? 'ok' : 'bad'}" title="넥슨 NOW 교차검증 ${ck.ok ? '일치' : '다름'}">${ck.ok ? '✓' : '!'}</span>` : ''}<span class="ct">${decItems(id).length}</span></button>`; }).join('')}
      </div>`).join('');
    const extra = NOW_ONLY_DECS();
    if (extra.length) html += `<div class="nav-cat"><h3>넥슨 NOW 해독기 <span class="now-tag">NOW</span></h3>
      ${extra.map(e => navItem(e, (e.kind === 'dec' && e.id === S.dec && !isSpecial() && !searching) || S.pend === e.title)).join('')}</div>`;
    opts = `<option value="wish"${S.wish ? ' selected' : ''}>★ 찜 목록 (${wishCount()})</option>` + cats.map(([cat, ids]) =>
      `<optgroup label="${cat}">${ids.map(id => `<option value="${id}"${id === S.dec && !isSpecial() ? ' selected' : ''}>${esc(DEC_BY_ID[id].name)} (${decItems(id).length})</option>`).join('')}</optgroup>`).join('')
      + (extra.length ? `<optgroup label="넥슨 NOW 해독기">${extra.map(e => `<option value="${e.kind === 'pending' ? 'pend:' + esc(e.title) : e.id}"${(e.kind === 'dec' && e.id === S.dec && !isSpecial()) || S.pend === e.title ? ' selected' : ''}>${esc(e.title)}${e.kind === 'pending' ? ' (미반영)' : ''}</option>`).join('')}</optgroup>` : '');
  } else {
    const list = (MENU.find(([c]) => c === S.sec) || ['', []])[1].map(entryOf);
    html = `<div class="nav-cat"><h3>${esc(S.sec)} <span class="now-tag">NOW</span></h3>
      <button class="nav-item${!S.page && !S.pend ? ' on' : ''}" data-secall style="--c:var(--accent)"><span class="star-i">${SEC_ICON[S.sec] || ICONS.box}</span><span class="nm">한눈에 보기</span><span class="ct">${list.length}</span></button>
      ${list.map(e => navItem(e, (e.kind === 'page' && S.page === e.id) || S.pend === e.title)).join('')}</div>`;
    opts = `<option value="sec"${!S.page && !S.pend ? ' selected' : ''}>${esc(S.sec)} 한눈에 보기</option>` + list.map(e =>
      `<option value="${e.kind === 'pending' ? 'pend:' + esc(e.title) : 'now' + e.id}"${(e.kind === 'page' && S.page === e.id) || S.pend === e.title ? ' selected' : ''}>${esc(e.title)}${e.kind === 'pending' ? ' (미반영)' : ''}</option>`).join('');
  }
  $('#sidebar').innerHTML = html;
  $('#decSelect').innerHTML = opts;
  $('.mobile-picker label').textContent = S.sec === '해독기' ? '해독기' : S.sec;
}

/* ===== 해독기 소개 ===== */
function nowMeta(pg){
  return `<div class="now-meta">
      <span>넥슨 NOW · ${esc(pg.version || '버전 정보 없음')}</span>
      ${pg.period ? `<span>집계 ${esc(pg.period)}</span>` : ''}
      <span>저장 ${esc(pg.saved)}</span>
      <a href="${NOW_URL}" target="_blank" rel="noopener">넥슨 NOW ↗</a>
    </div>`;
}
function checkLine(D){
  const c = crossCheck(D); if (!c) return '';
  return `<button class="check ${c.ok ? 'ok' : 'bad'}" data-check="${D.id}">${c.ok
    ? `✓ 넥슨 NOW와 교차검증 일치 (${c.match}개)` : `⚠ 넥슨 NOW와 ${c.onlyNow.length + c.onlyOff.length}곳 다름 · 자세히`}</button>`;
}
function renderHero(){
  const hero = $('#hero');
  $('#toolbar').hidden = isSpecial() && !(S.all && S.q);
  if (S.pend) {
    hero.style.setProperty('--c', '#4a5269');
    hero.innerHTML = `
      <div class="hero-top"><div><div class="kicker">${esc(S.sec)} · 넥슨 NOW</div><h1>${esc(S.pend)}</h1>
        <span class="check bad">아직 반영 안 됨</span></div></div>
      <p class="pend-desc">넥슨 NOW에는 있지만 아직 이 사이트에 올라오지 않은 메뉴예요.</p>
      <ol class="pend-steps">
        <li><a href="now-helper.html">넥슨 NOW 전체 저장 버튼</a>으로 모든 메뉴를 파일 하나로 저장 (또는 이 메뉴만 열고 <kbd>Ctrl</kbd>+<kbd>S</kbd>)</li>
        <li><a href="${UPLOAD_URL}" target="_blank" rel="noopener">GitHub nexon-now 폴더에 올리기 ↗</a> (저장소 관리자만 가능)</li>
        <li>1~2분 뒤 자동으로 반영돼요</li>
      </ol>`;
    return;
  }
  if (S.sec !== '해독기' && !S.page) {
    const list = (MENU.find(([c]) => c === S.sec) || ['', []])[1].map(entryOf);
    const done = list.filter(e => e.kind !== 'pending').length;
    hero.style.setProperty('--c', '#2fd3a4');
    hero.innerHTML = `
      <div class="hero-top">
        <div><div class="kicker">넥슨 NOW에서 가져온 확률</div><h1>${esc(S.sec)}</h1></div>
        <div class="facts">
          <div class="fact"><div class="k">메뉴</div><div class="v">${list.length}개</div></div>
          <div class="fact"><div class="k">반영됨</div><div class="v">${done}개</div></div>
        </div>
      </div>
      <p class="pend-desc">${esc(SEC_DESC[S.sec] || '')}을 메뉴별로 정리했어요. 넥슨 NOW 화면을 저장해서 올리면 반영돼요 (자동 업데이트 대상 아님) · <a href="now-helper.html">전체 저장 버튼 사용법</a></p>`;
    return;
  }
  if (S.page && !(S.all && S.q)) {
    const pg = PAGE_BY_ID[S.page];
    hero.style.setProperty('--c', '#7d8597');
    hero.innerHTML = `
      <div class="hero-top"><div><div class="kicker">${esc(pg.category)} · 넥슨 NOW에서 가져온 확률</div><h1>${esc(pg.title)}</h1></div></div>
      ${nowMeta(pg)}
      ${pg.notes.length ? `<ul class="now-notes">${pg.notes.filter(n => !/^※/.test(n)).map(n => `<li>${esc(n.replace(/^-\s*/, ''))}</li>`).join('')}</ul>` : ''}`;
    return;
  }
  if (S.wish && !(S.all && S.q)) {
    const keys = Object.keys(wish);
    const decs = new Set(ITEMS.filter(it => isWish(it.key)).map(it => it.dec));
    hero.style.setProperty('--c', '#ffb53d');
    hero.innerHTML = `
      <div class="hero-top">
        <div><div class="kicker">내 목록 · 이 브라우저에만 저장돼요</div><h1>★ 찜 목록</h1></div>
        <div class="facts">
          <div class="fact"><div class="k">찜한 아이템</div><div class="v">${keys.length}개</div></div>
          <div class="fact"><div class="k">나오는 해독기</div><div class="v">${decs.size}종</div></div>
        </div>
      </div>
      <div class="wish-tools">
        <div class="seg" role="group" aria-label="기간">${[['all','모든 기간'],['perm','무제한만'],['temp','기간제만']].map(([v, t]) =>
          `<button data-wp="${v}" class="${S.period === v ? 'on' : ''}">${t}</button>`).join('')}</div>
        <span class="dist-hint">카드의 ☆를 누르면 여기에 모여요. 같은 무기는 기간제·무제한을 함께 묶어요.</span>
      </div>`;
    return;
  }
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
        <div class="kicker">${esc(NAV.find(([,ids]) => ids.includes(D.id))[0])}${D.now ? '' : ` 해독기 · <a href="https://csonline.nexon.com/Probability/Index?id=${D.id}" target="_blank" rel="noopener">공식 확률표 ↗</a>`}${RECENT_DEC.has(D.id) ? ` · <button class="kick-hist" data-hist>최근 확률 변동 ${RECENT_DEC.get(D.id)}</button>` : ''}</div>
        <h1>${esc(D.name)}</h1>
        ${checkLine(D)}
      </div>
      <div class="facts">
        <div class="fact"><div class="k">아이템</div><div class="v">${items.length}종</div></div>
        <div class="fact"><div class="k">${weapons ? '무기' : '캐릭터'}</div><div class="v">${weapons || items.filter(i => i.type === 'class').length}종</div></div>
        <div class="fact"><div class="k">${esc(top)} 등급 합계</div><div class="v" style="color:${GC[top]}">${pSum(byG[top])}</div></div>
      </div>
    </div>
    ${D.now ? nowMeta(D.now) + '<p class="dist-hint">공식 확률 페이지에 없는 해독기라 자동 업데이트되지 않아요. 넥슨 NOW 화면을 다시 저장해서 올리면 갱신돼요.</p>' : ''}
    <div class="price-row">
      <label>해독 1회 비용 <input id="price" type="number" min="0" step="100" inputmode="numeric" placeholder="예: 3000" value="${priceOf(D.id) || ''}"> 원</label>
      <span class="dist-hint">해독기+해독키 1회 가격을 넣으면 아이템마다 평균 비용이 나와요. (이 브라우저에만 저장)</span>
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
  const q = qnorm(S.q);
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
const starHTML = (it, cls = 'star') =>
  `<span class="${cls}${isWish(it.key) ? ' on' : ''}" data-wish="${it.key}" data-wname="${esc(it.base)}" role="button" tabindex="0" title="찜하기" aria-label="찜하기">${ICONS.star}</span>`;
function cardHTML(it, opt = {}){
  const pr = priceOf(it.dec);
  return `<button class="card" data-item="${it.id}" style="--c:${GC[it.grade]}">
    ${thumbHTML(it).replace('</div></div>', `</div><span class="tag grade">${esc(it.grade)}</span>${it.period ? `<span class="tag period">${it.period}</span>` : ''}${starHTML(it)}</div>`)}
    <div class="cbody">
      ${opt.dec ? `<div class="cdec">${esc(DEC_BY_ID[it.dec].name)}</div>` : ''}
      ${histBadge(it)}
      <div class="cname">${esc(it.name)}</div>
      ${opt.group ? `<div class="cgroup">${esc(it.group)}</div>` : ''}
      <div class="cprob"><b>${pShort(it.p)}</b><small>1/${oneIn(it.p)}회</small></div>
      ${pr ? `<div class="ccost">평균 비용 <b>≈ ${won(avgCost(it))}</b></div>` : ''}
    </div>
  </button>`;
}
function tableHTML(list, opt = {}){
  return `<table class="tbl"><thead><tr>
      <th style="width:100px">이미지</th><th>아이템</th>
      ${opt.dec ? '<th class="hide-sm">해독기</th>' : ''}
      ${opt.group ? '<th class="hide-sm">그룹</th>' : ''}
      <th class="num">확률</th><th class="num hide-sm">기대 횟수 · 비용</th></tr></thead><tbody>
    ${list.map(it => `<tr data-item="${it.id}" style="--c:${GC[it.grade]}">
      <td>${thumbHTML(it, 'mini')}</td>
      <td>${starHTML(it, 'star sm')}<span class="gd">${esc(it.grade)}</span><span class="nm">${esc(it.name.replace(/\s*\(\d+일\)$/, ''))}</span>${it.period ? `<span class="pd">${it.period}</span>` : ''}${histBadge(it)}</td>
      ${opt.dec ? `<td class="sm hide-sm">${esc(DEC_BY_ID[it.dec].name)}</td>` : ''}
      ${opt.group ? `<td class="sm hide-sm">${esc(it.group)}</td>` : ''}
      <td class="num p">${pShort(it.p)}</td>
      <td class="num sm hide-sm">1/${oneIn(it.p)}회${priceOf(it.dec) ? `<br><span class="cost">≈ ${won(avgCost(it))}</span>` : ''}</td></tr>`).join('')}
    </tbody></table>`;
}
function renderResults(){
  const list = filtered();
  const global = S.all && qnorm(S.q);
  const box = $('#results');
  if (S.wish && !global) return renderWish(box);
  if (S.page && !global) return renderPage(box);
  if (S.pend) { $('#activeFilters').innerHTML = ''; box.innerHTML = ''; return; }
  if (S.sec !== '해독기') return renderSec(box);

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

/* ===== 넥슨 NOW 표 화면 (강화·상자 등) ===== */
/* 표 칸의 이름이 아는 무기·캐릭터·아이템이면 작은 이미지를 붙임 */
const BASE_INFO = new Map();
ITEMS.forEach(it => { if (!BASE_INFO.has(it.base)) BASE_INFO.set(it.base, it); });
function cellThumb(c){
  const base = baseName(c.replace(/\s*\((?:무제한|\d+일)(?:_\d+강)?\)\s*$/, ''));
  if (!base || !IMAGES[base]) return '';
  const k = BASE_INFO.get(base);
  return thumbHTML({ base, name: base, type: k ? k.type : /^classes\//.test(IMAGES[base][0]) ? 'class' : 'weapon', grade: k ? k.grade : '기타' }, 'mini');
}
function renderPage(box){
  const pg = PAGE_BY_ID[S.page];
  const q = qnorm(S.q);
  let shown = 0;
  const tables = pg.tables.map(t => {
    const rows = q ? t.rows.filter(r => { const s = r.join(' '); return qnorm(s).includes(q) || chosung(qnorm(s)).includes(q); }) : t.rows;
    shown += rows.length;
    const isP = t.head.map(h => /확률|결과|%/.test(h));
    const num = t.head.map((h, i) => t.rows.every(r => /^[\d.,%+\-~\s]*$/.test(r[i] || '')));
    return `<table class="tbl ntbl"><thead><tr>${t.head.map((h, i) => `<th class="${num[i] ? 'num' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map(r => `<tr>${r.map((c, i) => { const th = num[i] ? '' : cellThumb(c);
        return `<td class="${num[i] ? 'num' : ''}${isP[i] && /%/.test(c) ? ' p' : ''}">${th ? `<div class="cellimg">${th}<span>${esc(c)}</span></div>` : esc(c)}</td>`; }).join('')}</tr>`).join('')}
      </tbody></table>`;
  });
  $('#activeFilters').innerHTML = `<span>${shown.toLocaleString()}행${S.q ? ` · 검색: ${esc(S.q)}` : ''}</span>`;
  box.innerHTML = `<div class="ntables" style="--c:var(--accent)">${tables.join('')}</div>`;
}

/* ===== 섹션 한눈에 보기 (강화·개조·상자 등) ===== */
function renderSec(box){
  const q = qnorm(S.q);
  const list = (MENU.find(([c]) => c === S.sec) || ['', []])[1].map(entryOf)
    .filter(e => !q || qnorm(e.title).includes(q) || chosung(qnorm(e.title)).includes(q));
  $('#activeFilters').innerHTML = `<span>${list.length}개 메뉴</span>`;
  box.innerHTML = `<div class="secgrid">${list.map(e => {
    const pg = e.pg, rows = pg ? (pg.tables ? pg.tables.reduce((a, t) => a + t.rows.length, 0) + '행' : pg.items.length + '종') : '';
    const head = pg && pg.tables ? pg.tables[0].head.join(' · ') : '';
    return `<button class="stile${e.kind === 'pending' ? ' pending' : ''}" ${e.kind === 'pending' ? `data-pend="${esc(e.title)}"` : e.kind === 'page' ? `data-page="${e.id}"` : `data-id="${e.id}"`}>
      <span class="si">${SEC_ICON[S.sec] || ICONS.box}</span>
      <span class="st">${esc(e.title)}</span>
      <span class="ss">${e.kind === 'pending' ? '아직 반영 안 됨' : `${esc((pg.version || '').replace(' 업데이트', ''))} · ${rows}`}</span>
      ${head ? `<span class="sh">${esc(head)}</span>` : ''}
    </button>`; }).join('')}</div>`;
}

/* ===== 교차검증 결과 창 ===== */
function openCheck(id){
  const D = DEC_BY_ID[id], c = crossCheck(D);
  const list = (t, arr) => arr.length ? `<h3>${t} (${arr.length})</h3><ul class="clist">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  hdlg.innerHTML = `<div class="h-head"><h2 id="hTitle">${esc(D.name)} 교차검증</h2>
      <button class="d-close" data-close aria-label="닫기">${ICONS.close}</button></div>
    <p class="h-desc">공식 확률 페이지(자동, ${UPDATED} 기준)와 넥슨 NOW 저장본(${esc(c.pg.saved)} 저장 · ${esc(c.pg.version)})을 아이템 이름과 확률로 비교했어요.
      패치 직후에는 한쪽만 먼저 바뀌어서 잠깐 다를 수 있어요.</p>
    <div class="h-body">
      <p><b>${c.match}개 일치</b>${c.ok ? ' · 모두 같아요 ✓' : ''}</p>
      ${list('넥슨 NOW에만 있음 (또는 확률이 다름)', c.onlyNow)}
      ${list('공식 확률 페이지에만 있음 (또는 확률이 다름)', c.onlyOff)}
    </div>`;
  if (!hdlg.open) hdlg.showModal();
}

/* ===== 찜 목록 화면 ===== */
function renderWish(box){
  $('#activeFilters').innerHTML = '';
  const keys = Object.keys(wish);
  if (!keys.length) {
    box.innerHTML = `<div class="empty"><b>아직 찜한 아이템이 없어요</b>아이템 카드 오른쪽 아래의 ☆ 또는 상세 창의 ☆를 누르면 여기에 모여요.</div>`;
    return;
  }
  const pOk = it => S.period === 'all' || (S.period === 'perm' ? !it.period : !!it.period);
  const pool = ITEMS.filter(it => isWish(it.key) && pOk(it));
  const byDec = new Map();
  pool.forEach(it => { if (!byDec.has(it.dec)) byDec.set(it.dec, []); byDec.get(it.dec).push(it); });
  const rows = [...byDec].map(([dec, arr]) => ({ dec, arr, sum: arr.reduce((a, b) => a + b.p, 0) }))
    .sort((a, b) => b.sum - a.sum);
  const cmp = rows.length ? `
    <section class="group" style="--c:var(--accent)">
      <div class="ghead nohand"><span class="bar"></span><h2>해독기별 비교</h2>
        <span class="meta">해독 1번에 찜한 아이템 중 하나라도 나올 확률</span></div>
      <table class="tbl wtbl"><thead><tr><th>해독기</th><th class="hide-sm">들어 있는 찜 아이템</th>
        <th class="num">1회 확률</th><th class="num">평균 횟수 · 비용</th></tr></thead><tbody>
      ${rows.map(r => { const pr = priceOf(r.dec), names = [...new Set(r.arr.map(i => i.base))];
        return `<tr data-goto="${r.dec}" style="--c:${decColor(DEC_BY_ID[r.dec])}">
          <td><span class="nm">${esc(DEC_BY_ID[r.dec].name)}</span></td>
          <td class="sm hide-sm">${names.map(esc).join(', ')} <span class="muted">(${r.arr.length}종)</span></td>
          <td class="num p">${pShort(r.sum)}</td>
          <td class="num sm">1/${oneIn(r.sum)}회<br><span class="cost">${pr ? '≈ ' + won(pr * 100 / r.sum) : '가격 미입력'}</span></td></tr>`; }).join('')}
      </tbody></table>
      <p class="note">비용은 각 해독기 화면 위쪽 “해독 1회 비용”에 넣은 가격으로 계산해요.</p>
    </section>` : '';
  const each = keys.map(k => {
    const its = ITEMS.filter(it => it.key === k && pOk(it)).sort((a, b) => b.p - a.p);
    const any = ITEMS.find(it => it.key === k);
    const head = any || { key: k, base: wish[k], name: wish[k], type: 'weapon', grade: '기타' };
    return `<section class="witem" style="--c:${GC[head.grade]}">
      <div class="whead">${thumbHTML(head, 'mini')}<h3>${esc(head.base)}</h3>${starHTML(head)}</div>
      ${its.length ? its.map(o => `<button class="orow" data-item="${o.id}" style="--c:${GC[o.grade]}">
          <span class="on">${esc(DEC_BY_ID[o.dec].name)}</span>
          <span class="og">${esc(o.name)} · ${esc(o.group || '(이름 없음)')}${priceOf(o.dec) ? ` · 평균 ≈ ${won(avgCost(o))}` : ''}</span>
          <span class="op">${pShort(o.p)}<small>1/${oneIn(o.p)}회</small></span></button>`).join('')
        : `<div class="note">${any ? '이 기간 조건에 맞는 아이템이 없어요.' : '지금은 어느 해독기에도 들어 있지 않아요.'}</div>`}
    </section>`;
  }).join('');
  box.innerHTML = cmp + `<div class="wlist">${each}</div>`;
}
function toggleWish(k, name){
  if (isWish(k)) delete wish[k]; else wish[k] = name;
  store.set('cso.wish', JSON.stringify(wish));
  document.querySelectorAll(`[data-wish="${k}"]`).forEach(el => el.classList.toggle('on', isWish(k)));
  renderNav();
  if (S.wish) { renderHero(); renderResults(); }
}

/* ===== 변경 기록 창 ===== */
const hdlg = $('#histDlg');
function openHist(){
  const body = HIST.length ? HIST.map(e => {
    const byDec = new Map();
    e.changes.forEach(c => { if (!byDec.has(c.dec)) byDec.set(c.dec, { name: c.decName, list: [] }); byDec.get(c.dec).list.push(c); });
    return `<section class="h-entry"><h3>${e.date} <small>${e.time || ''} 확인</small></h3>
      ${[...byDec].map(([dec, d]) => `<details class="h-dec"${d.list.length <= 12 ? ' open' : ''}>
        <summary>${DEC_BY_ID[dec] || PAGE_BY_ID[dec] ? `<button class="h-go" data-goto="${dec}">${esc(d.name)} ↗</button>` : `<b>${esc(d.name)}</b>`}
          <span class="muted">${d.list.length}건</span></summary>
        <ul>${d.list.map(c => `<li>${changeText(c)}</li>`).join('')}</ul></details>`).join('')}
    </section>`; }).join('')
    : `<div class="empty"><b>아직 기록된 변동이 없어요</b>${HSTART ? HSTART + '부터 ' : ''}공식 확률표가 바뀌면 자동으로 여기에 쌓여요.</div>`;
  hdlg.innerHTML = `<div class="h-head"><h2 id="hTitle">확률 변경 기록</h2>
      <button class="d-close" data-close aria-label="닫기">${ICONS.close}</button></div>
    <p class="h-desc">20분마다 공식 확률표를 확인해서 달라진 점만 기록해요. 카드에는 최근 ${BADGE_DAYS}일 안의 변동이 NEW / ▲ / ▼ 로 표시돼요.</p>
    <div class="h-body">${body}</div>`;
  if (!hdlg.open) hdlg.showModal();
  hdlg.scrollTop = 0;
}
hdlg.addEventListener('click', e => {
  if (e.target === hdlg || e.target.closest('[data-close]')) return hdlg.close();
  const g = e.target.closest('[data-goto]');
  if (g) { e.preventDefault(); hdlg.close(); PAGE_BY_ID[+g.dataset.goto] ? goPage(+g.dataset.goto) : go(+g.dataset.goto); }
});

function syncControls(){
  for (const [sel, v] of [['#typeSeg', S.type], ['#periodSeg', S.period], ['#viewSeg', S.view]])
    document.querySelectorAll(sel + ' button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $('#sort').value = S.sort;
  $('.switch').hidden = S.sec !== '해독기';
  $('#q').placeholder = S.sec === '해독기' ? '아이템 검색  (예: SKULL-7, 스컬7, ㅋㅅㅌㅅ)' : S.page ? '표 내용 검색' : '메뉴 이름 검색';
  document.title = (S.all && S.q ? `“${S.q}” 검색` : S.wish ? '찜 목록' : S.page ? PAGE_BY_ID[S.page].title : S.pend ? S.pend : S.sec !== '해독기' ? S.sec : DEC_BY_ID[S.dec].name) + ' 확률 | 카스온라인 해독기 확률 도감';
}
function renderAll(){ renderNav(); renderHero(); syncControls(); renderResults(); }

/* ===== 상세 팝업 ===== */
const dlg = $('#detail');
function openDetail(id){
  const it = ITEMS[id];
  const D = DEC_BY_ID[it.dec];
  const others = ITEMS.filter(o => o.key === it.key).sort((a,b) => b.p - a.p);
  const tries = +store.get('cso.tries', 100) || 100;
  const pr = priceOf(it.dec);
  const costLine = n => pr ? `<small>≈ ${won(pr * n)}</small>` : '';
  const myHist = [];
  HIST.forEach(e => e.changes.forEach(c => { if (c.item && norm(baseName(c.item)) === it.key) myHist.push({ ...c, date: e.date }); }));
  dlg.style.setProperty('--c', GC[it.grade]);
  dlg.innerHTML = `
    ${thumbHTML(it, 'd-hero').replace(/<\/div><\/div>$/, `</div><button class="d-close" data-close aria-label="닫기">${ICONS.close}</button></div>`)}
    <div class="d-body">
      <div class="d-title"><span class="tag grade">${esc(it.grade)}</span>${it.period ? `<span class="tag period">${it.period}</span>` : ''}<h2 id="dTitle">${esc(it.name)}</h2>${starHTML(it, 'star big')}</div>
      <div class="d-sub">${esc(D.name)} · ${esc(it.group || '(이름 없음)')}</div>
      <div class="d-stats">
        <div class="d-stat"><div class="k">획득 확률 (${D.now ? '넥슨 NOW' : '공식'})</div><div class="v c">${pFull(it.p)}${realOf(it) !== undefined ? `<small>실제 결과 ${realOf(it).toFixed(5)}%</small>` : ''}</div></div>
        <div class="d-stat"><div class="k">평균 기대 횟수${pr ? ' · 비용' : ''}</div><div class="v">${oneIn(it.p)}회${costLine(100 / it.p)}</div></div>
        <div class="d-stat"><div class="k">50% / 90% 확률로 얻으려면</div><div class="v">${triesFor(it.p,.5).toLocaleString()} / ${triesFor(it.p,.9).toLocaleString()}회${pr ? `<small>≈ ${won(pr * triesFor(it.p,.5))} / ${won(pr * triesFor(it.p,.9))}</small>` : ''}</div></div>
      </div>
      <div class="d-calc">
        <h3>해독 횟수 · 비용 계산기</h3>
        <div class="calc-row">
          <input type="number" id="calcN" min="1" max="1000000" value="${tries}" aria-label="해독 횟수"> 회
          ${[10, 50, 100, 500, 1000].map(n => `<button class="pre" data-n="${n}">${n}회</button>`).join('')}
        </div>
        <div class="calc-row money">
          <label>1회 비용 <input type="number" id="calcPrice" min="0" step="100" inputmode="numeric" placeholder="예: 3000" value="${pr || ''}"> 원</label>
          <label>예산 <input type="number" id="calcBudget" min="0" step="1000" inputmode="numeric" placeholder="예: 100000"> 원</label>
        </div>
        <div class="calc-out">
          <div>1개 이상 얻을 확률<b id="calcP"></b></div>
          <div>평균 획득 개수<b id="calcE"></b></div>
          <div>총 비용<b id="calcC"></b></div>
        </div>
        <div class="meter"><i id="calcM"></i></div>
      </div>
      <div class="d-hist">
        <h3>확률 변동 기록</h3>
        ${myHist.length ? `<ul>${myHist.map(c => `<li><span class="hd">${c.date}</span> <span class="muted">${esc(c.decName)}</span> ${changeText(c)}</li>`).join('')}</ul>`
          : `<div class="note">${HSTART ? HSTART + '부터 기록 중 · ' : ''}아직 바뀐 적 없어요.</div>`}
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
  const upd = fromBudget => {
    const price = Math.max(0, +$('#calcPrice').value || 0);
    if (fromBudget && price) $('#calcN').value = Math.max(1, Math.floor((+$('#calcBudget').value || 0) / price));
    const n = Math.max(1, Math.min(1e6, +$('#calcN').value || 1));
    store.set('cso.tries', n);
    if (!fromBudget) $('#calcBudget').value = price ? n * price : '';
    const r = chance(it.p, n);
    $('#calcP').textContent = pct(r);
    $('#calcE').textContent = (n * it.p / 100).toLocaleString('ko-KR', { maximumFractionDigits: 3 }) + '개';
    $('#calcC').textContent = price ? won(n * price) : '가격을 넣어 주세요';
    $('#calcM').style.width = (r * 100).toFixed(2) + '%';
  };
  $('#calcN').addEventListener('input', () => upd(false));
  $('#calcBudget').addEventListener('input', () => upd(true));
  $('#calcPrice').addEventListener('input', () => { setPrice(it.dec, $('#calcPrice').value); dlgDirty = true; upd(false); });
  dlg.querySelectorAll('.pre').forEach(b => b.onclick = () => { $('#calcN').value = b.dataset.n; upd(false); });
  upd(false);
  if (!dlg.open) dlg.showModal();
  dlg.scrollTop = 0;
}
let dlgDirty = false;   /* 상세 창에서 가격을 바꾸면 닫을 때 화면 다시 그리기 */
dlg.addEventListener('close', () => { if (dlgDirty) { dlgDirty = false; renderAll(); } });
dlg.addEventListener('click', e => {
  if (e.target === dlg || e.target.closest('[data-close]')) return dlg.close();
  const w = e.target.closest('[data-wish]'); if (w) return toggleWish(w.dataset.wish, w.dataset.wname);
  const row = e.target.closest('.orow:not(.cur)');
  if (row) { dlg.close(); go(+row.dataset.goto, false);
    requestAnimationFrame(() => document.querySelector(`[data-item="${row.dataset.oid}"]`)?.scrollIntoView({ block: 'center' })); }
});

/* ===== 이벤트 ===== */
$('#sidebar').addEventListener('click', e => {
  const b = e.target.closest('.nav-item'); if (!b) return;
  if ('wishnav' in b.dataset) goWish(); else if ('hist' in b.dataset) openHist(); else if ('secall' in b.dataset) goSec(S.sec);
  else if (b.dataset.pend) goPend(b.dataset.pend); else if (b.dataset.page) goPage(+b.dataset.page); else go(+b.dataset.id);
});
$('#decSelect').addEventListener('change', e => { const v = e.target.value;
  v === 'wish' ? goWish() : v === 'sec' ? goSec(S.sec) : v.startsWith('pend:') ? goPend(v.slice(5)) : v.startsWith('now') ? goPage(+v.slice(3)) : go(+v); });
$('#secbar').addEventListener('click', e => { const b = e.target.closest('[data-sec]'); if (b) goSec(b.dataset.sec); });
$('#histBtn').addEventListener('click', openHist);
let qTimer;
$('#q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { S.q = e.target.value.trim(); renderNav(); renderHero(); syncControls(); renderResults(); }, 120); });
$('#allDec').addEventListener('change', e => { S.all = e.target.checked; renderAll(); });
for (const [sel, key] of [['#typeSeg','type'], ['#periodSeg','period'], ['#viewSeg','view']])
  $(sel).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    S[key] = b.dataset.v; if (key === 'view') store.set('cso.view', S.view); syncControls(); renderResults(); });
$('#sort').addEventListener('change', e => { S.sort = e.target.value; renderResults(); });
let priceTimer;
$('#hero').addEventListener('input', e => {
  if (e.target.id !== 'price') return;
  clearTimeout(priceTimer);
  priceTimer = setTimeout(() => { setPrice(S.dec, e.target.value); renderResults(); }, 250);
});
$('#hero').addEventListener('click', e => {
  if (e.target.closest('[data-hist]')) return openHist();
  const ck = e.target.closest('[data-check]'); if (ck) return openCheck(+ck.dataset.check);
  const wp = e.target.closest('[data-wp]'); if (wp) { S.period = wp.dataset.wp; renderHero(); renderResults(); return; }
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
  const st = e.target.closest('.stile');
  if (st) return st.dataset.pend ? goPend(st.dataset.pend) : st.dataset.page ? goPage(+st.dataset.page) : go(+st.dataset.id);
  const w = e.target.closest('[data-wish]');
  if (w) { e.preventDefault(); e.stopPropagation(); return toggleWish(w.dataset.wish, w.dataset.wname); }
  const g = e.target.closest('tr[data-goto]'); if (g) return go(+g.dataset.goto);
  const h = e.target.closest('[data-toggle]');
  if (h) { const gi = +h.dataset.toggle; S.closed.has(gi) ? S.closed.delete(gi) : S.closed.add(gi);
    h.parentElement.classList.toggle('closed'); h.setAttribute('aria-expanded', !S.closed.has(gi)); return; }
  const c = e.target.closest('[data-item]'); if (c) openDetail(+c.dataset.item);
});
$('#results').addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-toggle], [data-wish]')) { e.preventDefault(); e.stopPropagation(); e.target.click(); }
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) && !dlg.open && !hdlg.open) { e.preventDefault(); $('#q').focus(); }
});
window.addEventListener('hashchange', () => { readHash(); renderAll(); });
document.querySelector('.brand').addEventListener('click', e => { e.preventDefault(); S.q = ''; $('#q').value = ''; go(DEFAULT_DEC); });

/* ===== 시작 ===== */
$('#updated').textContent = UPDATED;
if (HIST.length && RECENT_DEC.size) $('#histBtn').classList.add('fresh');
if (NOW) $('#nowInfo').textContent = `넥슨 NOW 확률(추가 해독기·강화·상자 등)은 직접 저장해 올린 파일 기준이며 자동 업데이트되지 않습니다. 마지막 반영 ${NOW.imported}`
  + (NOW.last && NOW.last.length ? ` — ${NOW.last.map(l => `${l.category} > ${l.title}${l.same ? '(이전과 같은 내용)' : ''}`).join(', ')}` : '') + '.';
if (typeof LAST_CHANGES !== 'undefined' && LAST_CHANGES && (LAST_CHANGES.changed.length || LAST_CHANGES.removed.length)) {
  const parts = [];
  if (LAST_CHANGES.changed.length) parts.push('변경: ' + LAST_CHANGES.changed.join(', '));
  if (LAST_CHANGES.removed.length) parts.push('삭제: ' + LAST_CHANGES.removed.join(', '));
  $('#lastChanges').textContent = `최근 자동 업데이트 ${LAST_CHANGES.date} — ${parts.join(' / ')}`;
}
readHash();
renderAll();
})();
