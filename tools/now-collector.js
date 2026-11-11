/* 넥슨 NOW 전체 저장 버튼 (즐겨찾기 버튼으로 사용)
   - 넥슨 NOW 카스온라인 확률 페이지에서 누르면, 왼쪽 메뉴를 처음부터 끝까지 차례로 눌러서
     화면에 나온 확률표를 모두 모아 파일 하나(nexon-now-all_날짜.html)로 내려받습니다.
   - 사람이 메뉴를 하나씩 누르는 것과 같은 속도로, 내 브라우저 안에서 한 번만 동작합니다.
   - 내려받은 파일을 GitHub nexon-now 폴더에 올리면 사이트에 자동 반영됩니다.
   이 파일은 now-helper.html 이 읽어서 즐겨찾기 버튼으로 만들어 줍니다. */
(async () => {
  const UPLOAD = 'https://github.com/ILoveOST/cso-probability/upload/main/nexon-now';
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const menus = [...document.querySelectorAll('li.sub .select-menu')];
  const content = () => document.querySelector('#content');
  if (!menus.length || !content()) { alert('넥슨 NOW 카스온라인 확률 페이지(now.nexon.com)에서 눌러 주세요.'); return; }
  if (window.__nownxRunning) return;
  window.__nownxRunning = true;

  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:2147483647;right:16px;bottom:16px;width:320px;background:#141924;color:#e9edf5;'
    + 'border:1px solid #2f3850;padding:14px 16px;border-radius:14px;font:14px/1.55 sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.55);white-space:pre-line';
  document.body.appendChild(box);
  const say = t => { box.textContent = t; };

  const crumb = () => { const s = document.querySelectorAll('#content .breadcrumb span'); return s.length ? s[s.length - 1].textContent.trim() : ''; };
  const tableText = () => [...document.querySelectorAll('#content table')].map(t => t.innerText).join('|');
  const out = [], fail = [];
  let prev = null;

  for (let i = 0; i < menus.length; i++) {
    const name = menus[i].textContent.trim();
    say(`넥슨 NOW 전체 저장 중… ${i + 1} / ${menus.length}\n${name}\n\n끝날 때까지 이 창을 그대로 두세요.`);
    menus[i].click();
    let ok = false, last = '', stable = 0;
    for (let t = 0; t < 60; t++) {                 // 표가 다 뜰 때까지 최대 약 15초 기다림
      await sleep(250);
      const tx = tableText();
      if (crumb() === name && tx && tx !== prev) {
        stable = tx === last ? stable + 1 : 0;
        last = tx;
        if (stable >= 2) { ok = true; break; }      // 0.5초 동안 그대로면 다 뜬 것으로 봄
      }
    }
    if (!ok && crumb() === name && tableText()) ok = true;   // 앞 메뉴와 표가 똑같은 경우
    if (ok) {
      prev = tableText();
      out.push(`<!--NOWNX-SECTION-->${content().outerHTML}`);
    } else fail.push(name);
    await sleep(400);
  }

  const nav = document.querySelector('.navigation_scroll') || document.querySelector('li.main')?.closest('ul');
  const d = new Date(), p = n => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>NEXON NOW 전체</title></head><body>'
    + `<div id="nownx-bundle" data-saved="${d.toISOString()}">${nav ? nav.outerHTML : ''}${out.join('\n')}<!--NOWNX-END--></div></body></html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = `nexon-now-all_${stamp}.html`;
  document.body.appendChild(a); a.click(); a.remove();

  box.innerHTML = '';
  const h = document.createElement('div');
  h.textContent = `완료! ${out.length}개 메뉴를 파일 하나로 저장했어요.` + (fail.length ? `\n못 읽은 메뉴 ${fail.length}개: ${fail.join(', ')}` : '')
    + `\n\n다운로드된 "nexon-now-all_${stamp}.html" 파일을 GitHub nexon-now 폴더에 올리면 사이트에 반영돼요.`;
  const link = document.createElement('a');
  link.href = UPLOAD; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'nexon-now 폴더에 올리러 가기 ↗';
  link.style.cssText = 'display:inline-block;margin-top:10px;color:#ffb53d;font-weight:700';
  const close = document.createElement('button');
  close.textContent = '닫기';
  close.style.cssText = 'float:right;margin-top:8px;background:#2f3850;color:#fff;border:0;border-radius:8px;padding:4px 12px;cursor:pointer';
  close.onclick = () => box.remove();
  box.append(h, link, close);
  window.__nownxRunning = false;
})();
