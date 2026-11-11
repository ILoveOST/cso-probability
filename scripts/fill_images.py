#!/usr/bin/env python3
"""이미지가 없는 아이템을 Counter-Strike Online Wiki(cso.fandom.com)에서 더 넓게 찾아 채움 → js/images-extra.js

- 대상: 공식 해독기(js/data.js) + 넥슨 NOW 해독기·상자(js/nexonnow.js) 아이템 중 이미지가 없는 무기·캐릭터
  (상자·재료·코인처럼 원래 그림이 없는 아이템은 건너뜀)
- 위키의 모든 일반 문서를 읽어서, 문서 앞부분에 적힌 한국 이름(예: '아바레스트 (KR)' 또는 korean = …)이
  아이템 이름과 **정확히 같을 때만** 그 문서의 대표 이미지를 연결함 (비슷한 이름은 연결하지 않음)
- 한국 이름이 없어서 못 찾은 아이템은 위키 검색 결과 후보만 로그에 남김 (자동 연결하지 않음)
- GitHub Actions 에서 실행: Actions → 확률 자동 업데이트 → Run workflow → '이미지 다시 찾기' 체크
"""
import json
import os
import re
import sys
import time
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import update_data as U  # noqa: E402

ROOT = U.ROOT
EXTRA_JS = os.path.join(ROOT, 'js', 'images-extra.js')
NOW_JS = os.path.join(ROOT, 'js', 'nexonnow.js')
SKIP = re.compile(r'코스튬|마크|도색|스킨|상자|파츠|교환권|쿠폰|포인트|캡슐|조각|재료|부품|스프레이|패키지|칭호|닉네임|'
                  r'캐릭터 카드|코어|구슬|기어|코인|해독기|경험치|유리$|보급함|바구니')
ROMAN = r'[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]|[IVX]+|\d+'


def log(*a):
    print(*a, flush=True)


def base_name(n):
    n = re.sub(r'\s*\(\d+일\)\s*$', '', n)
    n = re.sub(r'\s+\d[\d,]*개$', '', n)
    return U.base_name(n)


def box_item_name(c):
    """js/app.js 의 boxItemName 과 같은 규칙"""
    m = re.match(r'^(.*?)\s*\(((?:무제한|\d+일)[^()]*)\)\s*(.*)$', c)
    if not m:
        return c.strip()
    base, inner, tail = m.groups()
    per = inner.split('_')[0]
    enh = (re.search(r'(\d+)강', inner) or re.search(r'(\d+)강', tail))
    qty = re.search(r'(\d[\d,]*)\s*개', tail)
    out = base.strip() + (f' - {enh.group(1)}강' if enh else '')
    out += f' {qty.group(1)}개' if qty and qty.group(1) != '1' else ''
    return out + (f' ({per})' if per != '무제한' else '')


def load_js_obj(path, name, default):
    if not os.path.exists(path):
        return default
    m = re.search(r'const ' + name + r' = (.*?);\s*$', open(path, encoding='utf-8').read(), re.S | re.M)
    return json.loads(m.group(1)) if m else default


def all_bases():
    """{기본 이름: 'class' | 'weapon'}"""
    old = U.load_old()
    out = {}
    for D in old['DECODERS']:
        for r in D['rows']:
            for i, n in enumerate(old['LISTS'][r[2]].split('|')):
                t = r[4] if r[4] != 'mixed' else ('weapon' if i < (r[5] if len(r) > 5 else 5) else 'class')
                if t in ('weapon', 'class'):
                    out.setdefault(base_name(n), t)
    now = load_js_obj(NOW_JS, 'NEXON_NOW', {'pages': []})
    for p in now['pages']:
        names = [n for n, *_ in p.get('items') or []]
        if p.get('category') == '상자' and p.get('tables'):
            t = p['tables'][0]
            ai = next((i for i, h in enumerate(t['head']) if re.search(r'아이템|구성품', h)), -1)
            if ai >= 0:
                names += [box_item_name(r[ai]) for r in t['rows'] if ai < len(r)]
        for n in names:
            if not SKIP.search(n):
                out.setdefault(base_name(n), 'weapon')
    return out, old['IMAGES'], now.get('images') or {}


def has_image(base, images):
    if base in images:
        return True
    keys = {re.sub(r'\s', '', k) for k in images}
    if re.sub(r'\s', '', base) in keys:
        return True
    s = re.sub(r'[\s\-]*(?:' + ROMAN + r')$', '', base)
    return s != base and any(re.sub(r'[\s\-]*(?:' + ROMAN + r')$', '', k) == s for k in images)


def wiki_index():
    """위키 모든 문서 → {한국 이름(정규화): (문서 제목, 이미지 파일)}"""
    titles, cont = [], {}
    while True:
        r = U.wiki_api(action='query', list='allpages', apnamespace=0, aplimit=500, apfilterredir='nonredirects', **cont)
        titles += [x['title'] for x in r.get('query', {}).get('allpages', [])]
        if 'continue' not in r:
            break
        cont = {'apcontinue': r['continue']['apcontinue']}
    log(f'위키 문서 {len(titles)}개 읽는 중')
    idx = {}
    for i in range(0, len(titles), 50):
        r = U.wiki_api(action='query', prop='revisions', rvprop='content', rvslots='main', titles='|'.join(titles[i:i + 50]))
        for pg in r.get('query', {}).get('pages', {}).values():
            t = (pg.get('revisions') or [{}])[0].get('slots', {}).get('main', {}).get('*', '')
            if not t:
                continue
            head = t[:8000]
            im = re.search(r'\|\s*image\d?\s*=\s*([^\n|]*)', head)
            f = None
            if im and im.group(1).strip():
                f = re.sub(r'^(?:File|Image):', '', im.group(1).strip()).strip(' []')
            if not f:
                g = re.search(r'\[\[(?:File|Image):([^|\]]+)', head)
                f = g.group(1).strip() if g else None
            if not f or not re.search(r'\.(png|jpe?g|gif|webp)$', f, re.I):
                continue
            krs = re.findall(r'([^\n*|=\]\[]+?)\s*\(KR\)', head)
            krs += re.findall(r'\|\s*(?:kr|korean|krname|kor|name_?kr)\s*=\s*([^\n|]+)', head, re.I)
            for kr in krs:
                for part in re.split(r'/|,', kr):
                    part = re.sub(r"'''?|<[^>]+>", '', part).strip()
                    if re.search(r'[가-힣]', part) and len(part) <= 40:
                        is_char = bool(re.search(r'\{\{\s*(?:Infobox[ _])?(?:Character|Class)|Category:[^\]]*(?:Character|Class)', t, re.I))
                        idx.setdefault(U.norm(part), (pg['title'], f, is_char))
        time.sleep(0.3)
    return idx


def download(title, f, kind):
    r = U.wiki_api(action='query', prop='imageinfo', iiprop='url', titles='File:' + f)
    info = next(iter(r['query']['pages'].values())).get('imageinfo')
    if not info:
        return None
    url = re.sub(r'/revision/latest.*$', '', info[0]['url'])
    data = U.http_get(url + '/revision/latest', binary=True, headers={'Accept': 'image/webp,image/*'})
    local = re.sub(r'[^A-Za-z0-9._-]+', '_', urllib.parse.unquote(f)).lower()
    local = re.sub(r'\.(png|jpe?g|gif)$', '.webp', local)
    folder = 'classes' if kind == 'class' else 'weapons'
    os.makedirs(os.path.join(ROOT, 'images', folder), exist_ok=True)
    with open(os.path.join(ROOT, 'images', folder, local), 'wb') as fp:
        fp.write(data)
    return [f'{folder}/{local}', url.replace(U.WIKI_BASE, '')]


def main():
    bases, images, now_images = all_bases()
    extra = load_js_obj(EXTRA_JS, 'IMAGES_EXTRA', {})
    known = {**images, **now_images, **extra}
    need = sorted(b for b in bases if b and not has_image(b, known))
    log(f'이미지 없는 무기·캐릭터 {len(need)}개: ' + ', '.join(need))
    if not need:
        return
    idx = wiki_index()
    found, miss = 0, []
    for b in need:
        hit = idx.get(U.norm(b))
        if not hit:
            miss.append(b)
            continue
        try:
            got = download(hit[0], hit[1], 'class' if hit[2] or bases[b] == 'class' else 'weapon')
        except Exception as e:  # noqa: BLE001
            log(f'  받기 실패: {b} ({e})')
            continue
        if got:
            extra[b] = got
            found += 1
            log(f'  찾음: {b} ← 위키 "{hit[0]}" ({hit[1]})')
    # 못 찾은 것: 위키 검색 후보만 기록 (자동 연결 안 함)
    for b in miss:
        try:
            r = U.wiki_api(action='query', list='search', srsearch=b, srlimit=3)
            cands = [x['title'] for x in r.get('query', {}).get('search', [])]
        except Exception:  # noqa: BLE001
            cands = []
        log(f'  못 찾음: {b}' + (f'  (위키 검색 후보: {", ".join(cands)})' if cands else ''))
        time.sleep(0.2)
    with open(EXTRA_JS, 'w', encoding='utf-8') as fp:
        fp.write('/* 추가 이미지 연결 - scripts/fill_images.py 가 위키에서 한국 이름이 정확히 같은 문서를 찾아 만듭니다.\n'
                 '   직접 추가해도 됩니다: "아이템 기본 이름": ["images/ 아래 경로", "위키 경로(없으면 빈 칸)"] */\n'
                 'const IMAGES_EXTRA = ' + json.dumps(extra, ensure_ascii=False, indent=0) + ';\n')
    log(f'완료: {found}개 새로 연결, {len(miss)}개는 위키에 한국 이름이 없어 못 찾음')


if __name__ == '__main__':
    main()
