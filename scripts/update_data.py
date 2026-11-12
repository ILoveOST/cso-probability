#!/usr/bin/env python3
"""카스온라인 공식 확률 페이지를 읽어 js/data.js 를 갱신합니다.

GitHub Actions(.github/workflows/update.yml)가 하루 두 번 실행합니다.
- 확률/아이템이 바뀌었을 때만 data.js 를 다시 씁니다. (안 바뀌면 파일을 건드리지 않음)
- 어느 해독기든 확률 합계가 100%가 아니면 아무것도 쓰지 않고 실패로 끝납니다.
  (넥슨 페이지 구조가 바뀌어 잘못 읽었을 때 사이트에 틀린 값이 올라가지 않도록)
- 새로 나온 무기는 Counter-Strike Online Wiki 에서 이미지를 찾아 images/weapons 에 저장합니다.

로컬 시험: python scripts/update_data.py --html-dir 폴더   (폴더 안에 menu.html, <id>.html)
"""
import argparse
import datetime
import json
import os
import re
import sys
import time
import urllib.parse
from collections import Counter
from html.parser import HTMLParser

BASE = 'https://csonline.nexon.com'
MENU_URL = BASE + '/Probability/Index?id=9616'
PAGE_URL = BASE + '/Probability/Index?id={}'
WIKI_API = 'https://cso.fandom.com/api.php'
WIKI_BASE = 'https://static.wikia.nocookie.net/cso/images/'
UA = 'Mozilla/5.0 (compatible; cso-probability-bot/1.0; +https://github.com/ILoveOST/cso-probability)'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(ROOT, 'js', 'data.js')
HISTORY_JS = os.path.join(ROOT, 'js', 'history.js')
HISTORY_START = '2026-11-11'      # 이 날부터 변동 이력을 기록
SUM_TOLERANCE = 0.05          # 확률 합계 허용 오차(%) — 공식 표기가 소수점 5자리라 생기는 반올림 오차
KST = datetime.timezone(datetime.timedelta(hours=9))


# ----------------------------------------------------------------- 공통
def log(*a):
    print(*a, flush=True)


_session = None
def http_get(url, binary=False, headers=None):
    global _session
    import requests
    if _session is None:
        _session = requests.Session()
        _session.headers['User-Agent'] = UA
    last = None
    for attempt in range(3):
        try:
            r = _session.get(url, timeout=30, headers=headers or {})
            r.raise_for_status()
            if binary:
                return r.content
            r.encoding = 'utf-8'
            return r.text
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(3 * (attempt + 1))
    raise RuntimeError(f'가져오기 실패: {url} ({last})')


def norm(s):
    s = s.lower()
    for a, b in (('ⅰ', 'i'), ('ⅱ', 'ii'), ('ⅲ', 'iii'), ('ⅳ', 'iv'), ('ⅴ', 'v'),
                 ('Ⅰ', 'i'), ('Ⅱ', 'ii'), ('Ⅲ', 'iii'), ('Ⅳ', 'iv'), ('Ⅴ', 'v')):
        s = s.replace(a, b)
    return re.sub(r'[^a-z0-9가-힣]', '', s)


def base_name(n):
    n = re.sub(r'^\[ZHC\]\s*', '', n)
    n = re.sub(r'\s*\(\d+일\)\s*$', '', n)
    n = re.sub(r'\s*-\s*\d+강\s*$', '', n)
    n = re.sub(r'\([^()]*파츠[^()]*\)', '', n)
    return n.strip()


def period_of(text):
    m = re.search(r'\((\d+일)\)', text or '')
    return m.group(1) if m else None


def items_period(items):
    """아이템 이름 끝의 (N일) — 모두 같으면 그 값, 없으면 None, 섞여 있으면 'mixed'"""
    ps = set()
    for i in items:
        m = re.search(r'\((\d+일)\)\s*$', i)
        ps.add(m.group(1) if m else None)
    return ps.pop() if len(ps) == 1 else 'mixed'


# ----------------------------------------------------------------- HTML 파싱
class _Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self._cur = [], None

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            a = dict(attrs)
            m = re.search(r'Probability/Index\?id=(\d+)', a.get('href') or '')
            if m:
                self._cur = [int(m.group(1)), a.get('title') or '', '']

    def handle_data(self, data):
        if self._cur is not None:
            self._cur[2] += data

    def handle_endtag(self, tag):
        if tag == 'a' and self._cur is not None:
            self.links.append(self._cur)
            self._cur = None


def parse_menu(html):
    p = _Links()
    p.feed(html)
    seen, out = set(), []
    for i, title, text in p.links:
        name = re.sub(r'\s+', ' ', (text or title)).strip() or title.strip()
        if i in seen or '해독기' not in name:
            continue
        seen.add(i)
        out.append((i, name))
    return out


class _Tables(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables, self._row, self._cell = [], None, None

    def handle_starttag(self, tag, attrs):
        if tag == 'table':
            self.tables.append([])
        elif tag == 'tr' and self.tables:
            self._row = []
        elif tag in ('td', 'th') and self._row is not None:
            a = dict(attrs)
            self._cell = {'tag': tag, 'text': '', 'rowspan': int(a.get('rowspan') or 1)}

    def handle_data(self, data):
        if self._cell is not None:
            self._cell['text'] += data

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self._cell is not None:
            self._cell['text'] = re.sub(r'\s+', ' ', self._cell['text']).strip()
            self._row.append(self._cell)
            self._cell = None
        elif tag == 'tr' and self._row is not None:
            if self._row and self.tables:
                self.tables[-1].append(self._row)
            self._row = None


def parse_decoder(html):
    """[(그룹명, 아이템명, '0.12345')] 순서대로"""
    p = _Tables()
    p.feed(html)
    table = next((t for t in p.tables if t and any('확률' in c['text'] for c in t[0])), None)
    if table is None:
        raise ValueError('확률 표를 찾지 못함')
    rows, group = [], ''
    for cells in table[1:]:
        tds = [c for c in cells if c['tag'] == 'td']
        if len(tds) >= 3:
            group = tds[0]['text']
            item, prob = tds[-2]['text'], tds[-1]['text']
        elif len(tds) == 2:
            item, prob = tds[0]['text'], tds[1]['text']
        else:
            continue
        m = re.search(r'(\d+(?:\.\d+)?)\s*%', prob)
        if not m or not item:
            raise ValueError(f'행을 읽지 못함: {[c["text"] for c in tds]}')
        rows.append((group, item, m.group(1)))
    if not rows:
        raise ValueError('표가 비어 있음')
    return rows


# ----------------------------------------------------------------- 기존 data.js
def load_old():
    if not os.path.exists(DATA_JS):
        return None
    s = open(DATA_JS, encoding='utf-8').read()

    def grab(name, kind='['):
        end = ']' if kind == '[' else '}'
        m = re.search(r'const %s = (\%s.*?\%s);\n' % (name, kind, end), s, re.S)
        return json.loads(m.group(1)) if m else None
    upd = re.search(r"const UPDATED = '([^']*)';", s)
    return {
        'LISTS': grab('LISTS'), 'DECODERS': grab('DECODERS'),
        'IMAGES': grab('IMAGES', '{') or {}, 'LAST_CHANGES': grab('LAST_CHANGES', '{'),
        'UPDATED': upd.group(1) if upd else '',
    }


# ----------------------------------------------------------------- 그룹명 보정 / 분류
def fix_labels(all_segs):
    """공식 표에서 그룹명이 한 칸씩 밀렸거나 비어 있는 경우를 아이템 기준으로 바로잡음"""
    # 같은 아이템 목록에 붙은 '정상' 그룹명 모음 (기간이 아이템과 맞는 것만)
    good = {}
    for segs in all_segs.values():
        for s in segs:
            if s['label'] and period_of(s['label']) == items_period(s['items']):
                good.setdefault(s['key'], Counter())[s['label']] += 1

    def lookup(seg):
        c = good.get(seg['key'])
        return c.most_common(1)[0][0] if c else None

    for did, segs in all_segs.items():
        # 1) 밀림: i번째 그룹명의 기간이 자기 아이템과 다르고 다음 아이템과 같으면 뒤로 한 칸씩 이동
        for i in range(len(segs) - 1):
            lp, ip = period_of(segs[i]['label']), items_period(segs[i]['items'])
            if lp and lp != ip and lp == items_period(segs[i + 1]['items']):
                old = [s['label'] for s in segs]
                new = old[:i] + [None] + old[i:-1]
                ok = all(period_of(new[j] or '') == items_period(segs[j]['items']) or not new[j]
                         for j in range(i + 1, len(segs)))
                if ok:
                    new[i] = lookup(segs[i]) or re.sub(r'\s*\(\d+일\)', '', old[i]).strip()
                    for j, s in enumerate(segs):
                        s['label'] = new[j]
                    log(f'  [{did}] 그룹명 밀림 보정 ({len(segs) - i}개 그룹)')
                break
        # 2) 빈 그룹명: 같은 목록의 정상 이름 → 앞 그룹 이름
        for i, s in enumerate(segs):
            if not s['label']:
                s['label'] = (segs[i - 1]['label'] if i else None) or lookup(s) or '(그룹명 없음)'


ETC_RE = re.compile(r'도색도안|대기실 마크|코스튬|선택 상자|스프레이')


def item_type(base, group, dec_name, known):
    if base in known:
        return known[base]
    if ETC_RE.search(base) or re.search(r'코스튬|마크|도색|스킨|이벤트', group) or '도색도안' in dec_name:
        return 'etc'
    if '클래스' in dec_name:
        return 'class'
    if '클래스' in group and '/' not in group and '무기' not in group:
        return 'class'
    return 'weapon'


def grade_of(group, ltype, dec_name):
    if ltype == 'class':
        return '초월' if '초월' in group else '클래스'
    for k in ('에픽', '초월', '유니크', '레어', '고급', '일반'):
        if k in group:
            return k
    if 'ZHC' in group:
        return 'ZHC'
    if 'Top' in group:
        return 'Top'
    if '스페셜' in group:
        return '유니크'
    if '프로모션' in group:
        for k in ('초월', '유니크', '에픽'):
            if k in dec_name:
                return k
    return '기타'


# ----------------------------------------------------------------- 위키 이미지 (새 무기만)
def wiki_api(**params):
    params.update(format='json')
    return json.loads(http_get(WIKI_API + '?' + urllib.parse.urlencode(params)))


def wiki_weapon_index():
    """위키 무기 문서의 한국 이름(KR) → 대표 이미지 파일명"""
    titles = set()
    for cat in ('Weapons', 'Epic_(Grade)', 'Transcendent_(Grade)', 'Unique_(Grade)', 'Rare_(Grade)',
                'Advanced_(Grade)', 'Premium_weapons', 'Limited_edition_weapon'):
        cont = {}
        while True:
            r = wiki_api(action='query', list='categorymembers', cmtitle='Category:' + cat,
                         cmlimit=500, cmnamespace=0, **cont)
            titles.update(x['title'] for x in r.get('query', {}).get('categorymembers', []))
            if 'continue' not in r:
                break
            cont = {'cmcontinue': r['continue']['cmcontinue']}
    idx = {}
    titles = sorted(titles)
    for i in range(0, len(titles), 50):
        r = wiki_api(action='query', prop='revisions', rvprop='content', rvslots='main',
                     titles='|'.join(titles[i:i + 50]))
        for pg in r.get('query', {}).get('pages', {}).values():
            t = (pg.get('revisions') or [{}])[0].get('slots', {}).get('main', {}).get('*', '')
            if not t or t.lstrip().upper().startswith('#REDIRECT'):
                continue
            head = t[:4000]
            im = re.search(r'\|\s*image\s*=([^\n]*)', head)
            f = re.search(r'File:([^|\]]+)', im.group(1)) if im else None
            if not f:
                continue
            for kr in re.findall(r'([^\n*|=\]]+?)\s*\(KR\)', head):
                for part in kr.split('/'):
                    if re.search(r'[가-힣]', part):
                        idx.setdefault(norm(part.strip()), f.group(1).strip())
    return idx


def fetch_wiki_images(bases):
    if not bases:
        return {}
    try:
        idx = wiki_weapon_index()
    except Exception as e:  # noqa: BLE001
        log('  위키 목록을 가져오지 못해 이미지는 건너뜀:', e)
        return {}
    out = {}
    for b in bases:
        f = idx.get(norm(b))
        if not f:
            log(f'  이미지 못 찾음(아이콘 표시): {b}')
            continue
        try:
            r = wiki_api(action='query', prop='imageinfo', iiprop='url', titles='File:' + f)
            info = next(iter(r['query']['pages'].values())).get('imageinfo')
            if not info:
                continue
            url = re.sub(r'/revision/latest.*$', '', info[0]['url'])
            data = http_get(url + '/revision/latest', binary=True, headers={'Accept': 'image/webp,image/*'})
            local = re.sub(r'[^A-Za-z0-9._-]+', '_', urllib.parse.unquote(f)).lower()
            local = re.sub(r'\.(png|jpe?g|gif)$', '.webp', local)
            os.makedirs(os.path.join(ROOT, 'images', 'weapons'), exist_ok=True)
            with open(os.path.join(ROOT, 'images', 'weapons', local), 'wb') as fp:
                fp.write(data)
            out[b] = ['weapons/' + local, url.replace(WIKI_BASE, '')]
            log(f'  새 이미지: {b} → {local}')
        except Exception as e:  # noqa: BLE001
            log(f'  이미지 받기 실패: {b} ({e})')
    return out


# ----------------------------------------------------------------- 변동 이력
def load_history():
    if not os.path.exists(HISTORY_JS):
        return []
    s = open(HISTORY_JS, encoding='utf-8').read()
    m = re.search(r'const HISTORY = (\[.*?\]);\n', s, re.S)
    return json.loads(m.group(1)) if m else []


def write_history(hist):
    js = ('/* 확률 변동 이력 - scripts/update_data.py 가 확률이 바뀔 때마다 맨 앞에 추가합니다.\n'
          '   type: new(새 아이템) removed(빠진 아이템) up/down(확률 변경) decoder_new/decoder_removed */\n'
          f"const HISTORY_START = '{HISTORY_START}';\n"
          'const HISTORY = [\n' + ',\n'.join(
              ' {"date": %s, "time": %s, "changes": [\n%s\n ]}' % (
                  json.dumps(e['date']), json.dumps(e.get('time', '')),
                  ',\n'.join('  ' + json.dumps(c, ensure_ascii=False) for c in e['changes']))
              for e in hist) + '\n];\n')
    with open(HISTORY_JS, 'w', encoding='utf-8') as f:
        f.write(js)


def diff_items(old_dec, old_lists, new_dec, new_lists):
    """해독기 하나의 아이템별 확률 비교 → 변경 목록"""
    def items(D, L):
        out = {}
        for r in D['rows']:
            for n in L[r[2]].split('|'):
                out.setdefault(n, (r[1], r[0]))
        return out
    a, b = items(old_dec, old_lists), items(new_dec, new_lists)
    ch = []
    for n, (p, g) in b.items():
        if n not in a:
            ch.append({'type': 'new', 'item': n, 'group': g, 'to': p})
        elif float(a[n][0]) != float(p):
            ch.append({'type': 'up' if float(p) > float(a[n][0]) else 'down',
                       'item': n, 'group': g, 'from': a[n][0], 'to': p})
    for n, (p, g) in a.items():
        if n not in b:
            ch.append({'type': 'removed', 'item': n, 'group': g, 'from': p})
    return ch


# ----------------------------------------------------------------- 메인
def write_data(lists, decoders, images, updated, last_changes):
    js = ('/* 카스온라인 해독기 확률 데이터 - 공식 확률형 아이템 페이지에서 자동 수집 (scripts/update_data.py)\n'
          '   LISTS: 아이템 목록(| 구분)\n'
          '   DECODERS[].rows: [그룹명, 개당 확률(%), LISTS 번호, 등급, 종류(weapon|class|etc|mixed), (mixed일 때 앞쪽 무기 수)]\n'
          '   IMAGES: 무기·캐릭터·코스튬·도색도안 기본 이름 -> [images/ 아래 경로, 위키 경로] */\n'
          f"const UPDATED = '{updated}';\n"
          f"const WIKI_BASE = '{WIKI_BASE}';\n"
          'const LISTS = ' + json.dumps(lists, ensure_ascii=False, indent=1) + ';\n'
          'const DECODERS = ' + json.dumps(decoders, ensure_ascii=False, indent=1) + ';\n'
          'const IMAGES = ' + json.dumps(images, ensure_ascii=False, indent=0) + ';\n'
          'const LAST_CHANGES = ' + json.dumps(last_changes, ensure_ascii=False) + ';\n')
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(js)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--html-dir', help='네트워크 대신 저장된 HTML로 시험')
    ap.add_argument('--no-images', action='store_true')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--no-memory', action='store_true', help='(시험용) 기존 종류·등급 기억 없이 분류')
    args = ap.parse_args()

    def page(key):
        if args.html_dir:
            return open(os.path.join(args.html_dir, f'{key}.html'), encoding='utf-8').read()
        return http_get(MENU_URL if key == 'menu' else PAGE_URL.format(key))

    old = load_old() or {'LISTS': [], 'DECODERS': [], 'IMAGES': {}, 'LAST_CHANGES': None, 'UPDATED': ''}

    # 기존 데이터에서 아이템 종류·등급 기억 (새로 읽은 표에도 그대로 적용해 결과가 흔들리지 않게)
    known_type, known_grade = {}, {}
    for t, prefix in (('weapon', 'weapons/'), ('class', 'classes/'), ('etc', 'items/')):
        for b, v in old['IMAGES'].items():
            if v[0].startswith(prefix):
                known_type[b] = t
    for D in old['DECODERS'] or []:
        for row in D['rows']:
            g, p, li, gr, ty = row[:5]
            items = old['LISTS'][li].split('|')
            wc = row[5] if len(row) > 5 else 5
            for k, n in enumerate(items):
                known_type.setdefault(base_name(n), ty if ty != 'mixed' else ('weapon' if k < wc else 'class'))
            known_grade[(old['LISTS'][li], g)] = gr

    if args.no_memory:
        known_type, known_grade = {}, {}

    menu_html = page('menu')
    menu = parse_menu(menu_html)
    if len(menu) < 5:
        # 원인 확인용: 받은 화면의 제목·글자·링크 일부를 로그에 남김
        title = re.search(r'<title[^>]*>(.*?)</title>', menu_html, re.S)
        text = re.sub(r'\s+', ' ', re.sub(r'<script.*?</script>|<style.*?</style>|<[^>]+>', ' ', menu_html, flags=re.S))
        log(f'[진단] 받은 화면 크기 {len(menu_html)}자, 제목: {title.group(1).strip() if title else "-"}')
        log(f'[진단] 글자: {text[:600]}')
        log('[진단] Probability 링크: ' + ' | '.join(re.findall(r'href="([^"]*Probab[^"]*)"', menu_html)[:15]))
        log('[진단] 점검 문구: ' + ('있음' if re.search(r'점검|maintenance', menu_html, re.I) else '없음'))
        raise SystemExit(f'해독기 목록을 제대로 읽지 못함 ({len(menu)}개) — 넥슨 페이지 구조가 바뀌었는지 확인 필요')
    log(f'해독기 {len(menu)}개 확인')
    # 해독기 말고 다른 확률 페이지(상자·강화 등)가 생겼는지 기록만 남김
    other = sorted({(h, re.sub(r'<[^>]+>|\s+', ' ', t).strip()) for h, t in
                    re.findall(r'<a[^>]+href="([^"]*Probab[^"]*)"[^>]*>(.*?)</a>', menu_html, re.S | re.I)
                    if '해독기' not in t})
    if other:
        log('해독기 외 확률 링크: ' + ' / '.join(f'{t} ({h})' for h, t in other))

    # 1) 모든 해독기 읽기 + 합계 검사
    all_segs, names, errors = {}, {}, []
    for did, name in menu:
        try:
            rows = parse_decoder(page(did))
            total = sum(float(p) for _, _, p in rows)
            if abs(total - 100) > SUM_TOLERANCE:
                raise ValueError(f'확률 합계 {total:.5f}%')
        except Exception as e:  # noqa: BLE001
            errors.append(f'{name}({did}): {e}')
            continue
        segs = []
        for g, item, p in rows:
            if segs and segs[-1]['raw'] == g and segs[-1]['p'] == p:
                segs[-1]['items'].append(item)
            else:
                segs.append({'raw': g, 'label': g, 'p': p, 'items': [item]})
        for s in segs:
            s['key'] = '|'.join(s['items'])
        all_segs[did], names[did] = segs, name
        log(f'  {name}: {len(rows)}행, 합계 {total:.4f}%')
        if not args.html_dir:
            time.sleep(1)          # 넥슨 서버에 부담 주지 않도록 천천히
    if errors:
        log('읽기 실패 — 아무것도 바꾸지 않고 종료합니다:')
        for e in errors:
            log('  ' + e)
        sys.exit(1)

    fix_labels(all_segs)

    # 2) 목록/행 만들기
    lists, lidx, decoders = [], {}, []
    for did, segs in all_segs.items():
        rows = []
        for s in segs:
            if s['key'] not in lidx:
                lidx[s['key']] = len(lists)
                lists.append(s['key'])
            li = lidx[s['key']]
            types = [item_type(base_name(n), s['label'], names[did], known_type) for n in s['items']]
            if len(set(types)) == 1:
                ltype, extra = types[0], []
            else:
                wc = 0
                while wc < len(types) and types[wc] == 'weapon':
                    wc += 1
                ltype, extra = 'mixed', ([] if wc == 5 else [wc])
                if not all(t == 'class' for t in types[wc:]):
                    ltype, extra = Counter(types).most_common(1)[0][0], []
            grade = known_grade.get((s['key'], s['label'])) or grade_of(s['label'], ltype, names[did])
            rows.append([s['label'], s['p'], li, grade, ltype] + extra)
        decoders.append({'id': did, 'name': names[did], 'rows': rows})

    # 3) 바뀐 해독기
    old_by = {D['id']: D for D in old['DECODERS'] or []}

    def expand(D, L):
        return [(r[0], r[1], L[r[2]]) for r in D['rows']] + [D['name']]
    changed = [D['name'] for D in decoders
               if D['id'] not in old_by or expand(D, lists) != expand(old_by[D['id']], old['LISTS'])]
    removed = [D['name'] for i, D in old_by.items() if i not in names]
    data_changed = bool(changed or removed)

    # 4) 새 아이템 이미지
    images = dict(old['IMAGES'])
    new_weapons = sorted({base_name(n) for D in decoders for r in D['rows']
                          for k, n in enumerate(lists[r[2]].split('|'))
                          if (r[4] == 'weapon' or (r[4] == 'mixed' and k < (r[5] if len(r) > 5 else 5)))
                          and base_name(n) not in images})
    if new_weapons:
        log(f'이미지 없는 무기 {len(new_weapons)}개:', ', '.join(new_weapons))
        if not args.no_images and not args.html_dir and not args.dry_run:
            images.update(fetch_wiki_images(new_weapons))

    if args.no_memory:
        data_changed = True
    if not data_changed and images == old['IMAGES']:
        log('변경 없음')
        set_output(False)
        return
    now = datetime.datetime.now(KST)
    today = now.strftime('%Y-%m-%d')
    updated = today if data_changed else old['UPDATED']
    last = {'date': today, 'changed': changed, 'removed': removed} if data_changed else old['LAST_CHANGES']
    log('바뀐 해독기:', ', '.join(changed) or '-', '| 사라진 해독기:', ', '.join(removed) or '-')
    if args.dry_run:
        log('(dry-run) 파일은 쓰지 않음')
        return
    write_data(lists, decoders, images, updated, last)
    log('js/data.js 갱신 완료')
    if data_changed and old['DECODERS']:
        entries = []
        new_by = {D['id']: D for D in decoders}
        for D in decoders:
            if D['id'] not in old_by:
                entries.append({'dec': D['id'], 'decName': D['name'], 'type': 'decoder_new'})
            elif D['name'] in changed:
                for c in diff_items(old_by[D['id']], old['LISTS'], D, lists):
                    entries.append({'dec': D['id'], 'decName': D['name'], **c})
        for i, D in old_by.items():
            if i not in new_by:
                entries.append({'dec': i, 'decName': D['name'], 'type': 'decoder_removed'})
        if entries:
            hist = load_history()
            hist.insert(0, {'date': today, 'time': now.strftime('%H:%M'), 'changes': entries})
            write_history(hist)
            log(f'변동 이력 {len(entries)}건 기록')
    set_output(True)


def set_output(changed):
    """GitHub Actions에 '바뀜 여부'를 알려서, 안 바뀌었으면 배포를 건너뛰게 함"""
    path = os.environ.get('GITHUB_OUTPUT')
    if path:
        with open(path, 'a') as f:
            f.write(f'changed={"true" if changed else "false"}\n')


if __name__ == '__main__':
    main()
