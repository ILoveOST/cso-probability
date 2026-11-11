#!/usr/bin/env python3
"""넥슨 NOW에서 직접 저장한 확률 페이지 → js/nexonnow.js

사용법
  1) 넥슨 NOW 확률 페이지에서 원하는 메뉴를 열고 Ctrl+S 로 저장합니다.
     ("웹페이지, 전체"(.html) 또는 "웹페이지, 단일 파일"(.mhtml) 둘 다 됩니다. 파일 이름은 아무거나 괜찮습니다.)
  2) 저장한 파일을 GitHub 저장소의 nexon-now/ 폴더에 올립니다.
  3) GitHub Actions 가 이 스크립트를 실행해서 js/nexonnow.js 를 만들고, 올린 파일은 지운 뒤 사이트를 다시 배포합니다.

- 페이지 이름·분류는 파일 안의 화면 내용(메뉴 경로)으로 알아내므로 파일 이름은 상관없습니다.
- 같은 페이지를 다시 올리면 그 페이지만 새 내용으로 바뀌고, 나머지는 그대로 남습니다.
- 확률이 바뀐 해독기는 js/history.js 변동 이력에 함께 기록됩니다.
- 넥슨 NOW 사이트에 직접 접속하지 않습니다(직접 저장한 파일만 읽음).
"""
import datetime
import email
import glob
import html as htmllib
import json
import os
import re
import shutil
import sys
import zlib
from html.parser import HTMLParser

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import update_data as U  # noqa: E402

ROOT = U.ROOT
IN_DIR = os.path.join(ROOT, 'nexon-now')
OUT_JS = os.path.join(ROOT, 'js', 'nexonnow.js')
NOW_URL = 'https://now.nexon.com/service/csonline'


def log(*a):
    print(*a, flush=True)


# ----------------------------------------------------------------- 파일 읽기
def read_saved(path):
    raw = open(path, 'rb').read()
    if path.lower().endswith(('.mhtml', '.mht')):
        msg = email.message_from_bytes(raw)
        for part in msg.walk():
            if part.get_content_type() == 'text/html':
                cs = part.get_content_charset() or 'utf-8'
                return part.get_payload(decode=True).decode(cs, errors='replace')
        return ''
    return raw.decode('utf-8', errors='replace')


def text_of(fragment):
    t = re.sub(r'<br\s*/?>', '\n', fragment)
    t = re.sub(r'<[^>]+>', '', t)
    return re.sub(r'[ \t ]+', ' ', htmllib.unescape(t)).strip()


class _Tables(HTMLParser):
    """rowspan/colspan 을 펼쳐서 표를 2차원 목록으로"""
    def __init__(self):
        super().__init__()
        self.tables, self._t, self._row, self._cell, self._pending = [], None, None, None, {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'table':
            self._t = {'head': [], 'rows': []}
            self._pending = {}
            self.tables.append(self._t)
        elif tag == 'tr' and self._t is not None:
            self._row = []
        elif tag in ('td', 'th') and self._row is not None:
            self._cell = {'th': tag == 'th', 'text': '',
                          'rs': int(a.get('rowspan') or 1), 'cs': int(a.get('colspan') or 1)}
        elif tag == 'br' and self._cell is not None:
            self._cell['text'] += ' '

    def handle_data(self, data):
        if self._cell is not None:
            self._cell['text'] += data

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self._cell is not None:
            self._row.append(self._cell)
            self._cell = None
        elif tag == 'tr' and self._row is not None:
            self._finish_row()
            self._row = None
        elif tag == 'table':
            self._t = None

    def _finish_row(self):
        out, col, cells = [], 0, list(self._row)
        while cells or col in self._pending:
            if col in self._pending:
                txt, left = self._pending[col]
                out.append(txt)
                if left > 1:
                    self._pending[col] = (txt, left - 1)
                else:
                    del self._pending[col]
                col += 1
                continue
            c = cells.pop(0)
            txt = re.sub(r'\s+', ' ', c['text']).strip()
            for _ in range(c['cs']):
                out.append(txt)
                if c['rs'] > 1:
                    self._pending[col] = (txt, c['rs'] - 1)
                col += 1
        if not out:
            return
        if all(c['th'] for c in self._row) and not self._t['rows']:
            self._t['head'] = out
        else:
            self._t['rows'].append(out)


def parse_page(doc):
    """저장한 넥슨 NOW 화면 하나 → dict (못 읽으면 None)"""
    m = re.search(r'<p[^>]*class="breadcrumb"[^>]*>(.*?)</p>', doc, re.S)
    crumbs = [htmllib.unescape(t).strip() for t in re.findall(r'>([^<>]+)<', m.group(1))] if m else []
    crumbs = [c for c in crumbs if c]
    h2 = re.search(r'<h2[^>]*>\s*([^<]+?)\s*</h2>', doc)
    title = (crumbs[-1] if crumbs else (h2.group(1) if h2 else '')).strip()
    category = crumbs[0] if len(crumbs) > 1 else ''
    if not title:
        return None
    ver = re.search(r'class="selectbox"[^>]*>\s*([^<]+?)\s*<', doc)
    period = re.search(r'class="countingPeriodContent"[^>]*>(.*?)</span>\s*</span>', doc, re.S)
    upd = re.search(r'class="lastUpdateContent"[^>]*>\s*([^<]+?)\s*<', doc)
    def ck_lines(fragment):
        out = []
        for blk in re.findall(r'<div[^>]*class="ck-content"[^>]*>(.*?)</div>', fragment, re.S):
            for line in re.findall(r'<(?:p|li|h\d)[^>]*>(.*?)</(?:p|li|h\d)>', blk, re.S):
                t = text_of(line)
                if t and t not in out:
                    out.append(t)
        return out
    notes = ck_lines(doc)
    p = _Tables()
    p.feed(doc)
    # 표마다 바로 위에 있는 설명 글(예: '티어1 파츠로 진행한 조합 실패 결과입니다.')을 붙임
    starts = [m.start() for m in re.finditer(r'<table\b', doc)]
    ends = [0] + [doc.find('</table>', st) + 8 for st in starts[:-1]]
    for k, t in enumerate(p.tables):
        t['desc'] = ck_lines(doc[ends[k]:starts[k]]) if k < len(starts) else []
    tables = [t for t in p.tables if t['rows']]
    return {
        'category': category, 'title': title,
        'version': (ver.group(1).strip() if ver else ''),
        'period': text_of(period.group(1)) if period else '',
        'updated': upd.group(1).strip() if upd else '',
        'notes': notes, 'tables': tables, 'menu': parse_menu(doc),
    }


def parse_menu(doc):
    """넥슨 NOW 왼쪽 메뉴 순서 (사이트 탭·메뉴 순서로 사용)"""
    menu = []
    for cat, inner in re.findall(r'<li[^>]*class="main"[^>]*>\s*<span[^>]*>([^<]+)</span>\s*<ul[^>]*>(.*?)</ul>\s*</li>', doc, re.S):
        menu.append([htmllib.unescape(cat).strip(), [htmllib.unescape(x).strip()
                     for x in re.findall(r'class="select-menu"[^>]*>([^<]+)<', inner)]])
    return menu


def split_doc(doc):
    """'넥슨NOW 전체 저장' 버튼으로 만든 파일이면 메뉴별로 나눔 → (메뉴 순서, [화면들])"""
    if 'id="nownx-bundle"' not in doc:
        return None, [doc]
    body = doc.split('<!--NOWNX-END-->')[0]
    parts = body.split('<!--NOWNX-SECTION-->')
    return parse_menu(parts[0]), parts[1:]


# ----------------------------------------------------------------- 해독기 페이지 → 아이템 목록
def conv_name(n):
    """넥슨 NOW 표기 → 공식 확률 페이지 표기
       '쿠스토스 (무제한)' → '쿠스토스'
       '파이슨 데스페라도 (30일_6강)' → '파이슨 데스페라도 - 6강 (30일)'
       '헌터킬러 X-90 (30일_5강_건부스트 파츠-티어6_뱀피릭 파츠-티어6)'
         → '헌터킬러 X-90(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)'"""
    m = re.match(r'^(.*?)\s*\(((?:무제한|\d+일)[^()]*)\)\s*$', n)
    if not m:
        return n.strip()
    base, inner = m.groups()
    tok = []
    for t in (t.strip() for t in inner.split('_')):
        if t and tok and re.fullmatch(r'티어\d+', t):
            tok[-1] += '-' + t            # '넉백 업 파츠_티어6' → '넉백 업 파츠-티어6'
        elif t:
            tok.append(t)
    per = tok.pop(0)
    enh = next((t for t in tok if re.fullmatch(r'\d+강', t)), '')
    parts = [t for t in tok if t != enh]
    out = base.strip() + (f"({', '.join(parts)})" if parts else '') + (f' - {enh}' if enh else '')
    return out + (f' ({per})' if per != '무제한' else '')


def col(head, *names):
    for i, h in enumerate(head):
        if any(n in h for n in names):
            return i
    return -1


def decoder_items(page):
    """해독기 페이지면 [(이름, 설정확률)] 아니면 None  (실제 결과는 쓰지 않음)"""
    if page['category'] != '해독기' or not page['tables']:
        return None
    t = page['tables'][0]
    ci, cp = col(t['head'], '아이템'), col(t['head'], '설정 확률', '확률')
    if ci < 0 or cp < 0:
        return None
    out = []
    for r in t['rows']:
        try:
            p = float(r[cp].replace('%', '').replace(',', ''))
        except (ValueError, IndexError):
            continue
        out.append([conv_name(r[ci]), f'{p:.5f}'])
    return out or None


DROP_NOTE = re.compile(r'집계|시도\(사용\)|시도 횟수|한 시간 간격|재집계|영향을 미치지 않는|페이지 안내|데이터 누락|누락된 데이터|데이터센터 장애')


def clean_note(n):
    """안내 문구에서 '실제 결과' 이야기를 빼고, 실제 결과·집계에 관한 문장은 버림 (설정 확률만 다룸)"""
    if DROP_NOTE.search(n):
        return ''
    n = re.sub(r',?\s*그리고 실제 결과', '', n)
    n = re.sub(r'(과|와)\s*실제 결과', '', n)
    n = re.sub(r'\s+', ' ', n).strip()
    return '' if re.fullmatch(r'[※\-\s]*', n) else n


ACTUAL_HEAD = '실제 결과 (넥슨 NOW 기준)'


def settings_only(page):
    """설정 확률만 남김: '실제 결과'·'횟수' 칸과 집계 관련 안내 문구 제거
       단, 설정 확률 칸이 아예 없는 표(예: 강화 성공 확률)는 넥슨 NOW '실제 결과'를 확률로 사용 (actual 표시)"""
    for t in page.get('tables') or []:
        if t.get('actual'):
            continue
        is_set = lambda h: bool(re.search(r'설정 확률|^확률$', h)) and '구간' not in h
        real_i = next((i for i, h in enumerate(t['head']) if '실제' in h), -1)
        if not any(is_set(h) for h in t['head']) and real_i >= 0:
            keep = [i for i, h in enumerate(t['head']) if (i == real_i or '실제' not in h) and h.strip() != '횟수']
            t['head'] = [ACTUAL_HEAD if i == real_i else t['head'][i] for i in keep]
            t['rows'] = [[r[i] if i < len(r) else '' for i in keep] for r in t['rows']]
            t['actual'] = True
            t['period'], t['updated'] = page.get('period', ''), page.get('updated', '')
            t['desc'] = [d for d in (clean_note(x) for x in t.get('desc', [])) if d]
            continue
        keep = [i for i, h in enumerate(t['head']) if '실제' not in h and h.strip() != '횟수']
        if len(keep) != len(t['head']):
            t['head'] = [t['head'][i] for i in keep]
            t['rows'] = [[r[i] for i in keep if i < len(r)] for r in t['rows']]
        has_prob = any(re.search(r'설정 확률|^확률$', h) and '구간' not in h for h in t['head'])
        if not has_prob:
            t['rows'], t['actual_only'] = [], True
        t['desc'] = [d for d in (clean_note(x) for x in t.get('desc', [])) if d]
    if page.get('items'):
        page['items'] = [it[:2] for it in page['items']]
    page['notes'] = [d for d in (clean_note(x) for x in page.get('notes', [])) if d]
    if page.get('tables'):
        page['notes'] = []          # 표 페이지는 표마다 설명을 붙이므로 페이지 안내는 생략
    for k in ('period', 'updated'):
        page.pop(k, None)
    return page


def page_id(title):
    return 900000 + zlib.crc32(title.encode('utf-8')) % 90000


# ----------------------------------------------------------------- 저장
def load_now():
    if not os.path.exists(OUT_JS):
        return {'imported': '', 'menu': [], 'pages': [], 'images': {}}
    s = open(OUT_JS, encoding='utf-8').read()
    m = re.search(r'const NEXON_NOW = (\{.*\});\s*$', s, re.S)
    return json.loads(m.group(1)) if m else {'imported': '', 'menu': [], 'pages': [], 'images': {}}


def write_now(data):
    js = ('/* 넥슨 NOW 확률 - 직접 저장한 페이지를 nexon-now/ 폴더에 올리면 scripts/import_nexon_now.py 가 자동으로 만듭니다.\n'
          f'   출처: {NOW_URL} (자동 업데이트 대상 아님 · 패치 때 다시 저장해서 올리면 갱신) */\n'
          'const NEXON_NOW = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js)


def cleanup():
    """올린 파일 정리: README.md 말고 전부 지움 (저장할 때 같이 생긴 _files 폴더 포함)"""
    removed = 0
    for name in os.listdir(IN_DIR):
        p = os.path.join(IN_DIR, name)
        if name.lower() == 'readme.md':
            continue
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
        removed += 1
    return removed


def main():
    # 폴더 바로 아래의 .html / .mhtml 만 읽음 (_files 폴더 안의 saved_resource.html 같은 건 무시)
    files = sorted(f for f in glob.glob(os.path.join(IN_DIR, '*'))
                   if os.path.isfile(f) and re.search(r'\.(html?|mhtml?)$', f, re.I))
    if not files:
        n = cleanup() if '--keep' not in sys.argv else 0
        log(f'읽을 저장 파일 없음' + (f' — 남아 있던 {n}개 정리함 (_files 폴더는 올리지 않아도 됩니다)' if n else ''))
        return
    data = load_now()
    by_title = {p['title']: p for p in data['pages']}
    now = datetime.datetime.now(U.KST)
    official = U.load_old() or {'DECODERS': [], 'IMAGES': {}}
    official_names = {D['name'] for D in official['DECODERS']}
    hist_entries, done, last = [], [], []

    docs = []
    for path in files:
        try:
            bmenu, parts = split_doc(read_saved(path))
        except Exception as e:  # noqa: BLE001
            log(f'읽기 실패: {os.path.basename(path)} ({e})')
            continue
        if bmenu:
            data['menu'] = bmenu
            log(f'전체 저장 파일: {os.path.basename(path)} — 메뉴 {len(parts)}개')
        docs += [(path, d) for d in parts]
    for path, doc in docs:
        try:
            pg = parse_page(doc)
        except Exception as e:  # noqa: BLE001
            log(f'읽기 실패: {os.path.basename(path)} ({e})')
            continue
        if not pg or not pg['tables']:
            log(f"확률표를 찾지 못함(건너뜀): {os.path.basename(path)} {pg['title'] if pg else ''} — 표가 보이는 상태에서 저장했는지 확인")
            continue
        if pg['menu']:
            data['menu'] = pg['menu']
        items = decoder_items(pg)
        rec = {'id': page_id(pg['title']), 'category': pg['category'], 'title': pg['title'],
               'version': pg['version'], 'period': pg['period'], 'updated': pg['updated'],
               'saved': now.strftime('%Y-%m-%d %H:%M'), 'notes': pg['notes'],
               'official': pg['title'] in official_names}
        if items:
            rec['items'] = items
        else:
            rec['tables'] = pg['tables']
        settings_only(rec)
        old = by_title.get(pg['title'])
        if old:
            settings_only(old)
        core = lambda p: [(t['head'], t['rows']) for t in p.get('tables') or [] if not t.get('actual')]   # 실제 결과 표는 매시간 바뀌므로 비교 제외
        same = bool(old and old.get('items') == rec.get('items') and core(old) == core(rec)
                    and old.get('version') == rec['version'])
        if same:
            log(f"  (이미 반영된 것과 같은 내용: {rec['title']})")
        last.append({'category': rec['category'], 'title': rec['title'], 'same': same})
        # 변동 이력 (이전에 올린 적이 있고 내용이 바뀐 경우)
        if old:
            if items and old.get('items') and not rec['official']:
                a = {n[0]: n[1] for n in old['items']}
                b = {n[0]: n[1] for n in items}
                for n, p in b.items():
                    if n not in a:
                        hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'type': 'new', 'item': n, 'to': p})
                    elif float(a[n]) != float(p):
                        hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'item': n, 'from': a[n], 'to': p,
                                             'type': 'up' if float(p) > float(a[n]) else 'down'})
                for n, p in a.items():
                    if n not in b:
                        hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'type': 'removed', 'item': n, 'from': p})
            elif not items and core(old) != core(rec):
                hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'type': 'page_update',
                                     'from': old.get('version', ''), 'to': rec['version']})
        by_title[pg['title']] = rec
        done.append(path)
        log(f"반영: [{rec['category']}] {rec['title']} · {rec['version']} · "
            + (f"아이템 {len(items)}개" if items else f"표 {len(pg['tables'])}개, {sum(len(t['rows']) for t in pg['tables'])}행"))

    if not done:
        raise SystemExit('반영한 파일이 없음 — 올린 파일이 넥슨 NOW 확률 화면이 맞는지 확인해 주세요')

    # 메뉴 순서대로 정렬
    order = [t for _, ts in data['menu'] for t in ts]
    data['pages'] = sorted((settings_only(p) for p in by_title.values()), key=lambda p: order.index(p['title']) if p['title'] in order else 999)
    data['imported'] = now.strftime('%Y-%m-%d %H:%M')
    data['last'] = last

    # 새 해독기 아이템 중 이미지가 없는 무기 → 위키에서 찾기
    known = dict(official.get('IMAGES') or {})
    known.update(data.get('images') or {})
    need = {U.base_name(n) for p in data['pages'] if p.get('items') and not p['official']
            for n, *_ in p['items']}
    # 상자·강화 등 표: '아이템·구성품·보상' 칸의 이름도 위키에서 찾아봄 (못 찾으면 그냥 글자로 표시)
    for p in data['pages']:
        for t in p.get('tables') or []:
            cols = [i for i, h in enumerate(t['head']) if re.search(r'아이템|구성품|보상|획득|상품|결과', h)]
            for r in t['rows']:
                for i in cols:
                    if i < len(r) and r[i] and not re.match(r'^[\d.,%+\-~\s]*$', r[i]):
                        need.add(U.base_name(conv_name(r[i])))
    need = sorted(need - set(known))
    if need and '--no-images' not in sys.argv:
        log(f'이미지 없는 아이템 {len(need)}개 위키에서 찾는 중')
        data.setdefault('images', {}).update(U.fetch_wiki_images(need))

    write_now(data)
    if hist_entries:
        h = U.load_history()
        h.insert(0, {'date': now.strftime('%Y-%m-%d'), 'time': now.strftime('%H:%M'), 'changes': hist_entries})
        U.write_history(h)
        log(f'변동 이력 {len(hist_entries)}건 기록')
    if '--keep' not in sys.argv:
        cleanup()
    log(f'완료: {len(done)}개 페이지 반영 (전체 {len(data["pages"])}개)')


if __name__ == '__main__':
    main()
