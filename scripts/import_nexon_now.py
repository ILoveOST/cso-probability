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
    notes = []
    for blk in re.findall(r'<div[^>]*class="ck-content"[^>]*>(.*?)</div>', doc, re.S):
        for line in re.findall(r'<(?:p|li|h\d)[^>]*>(.*?)</(?:p|li|h\d)>', blk, re.S):
            t = text_of(line)
            if t and t not in notes:
                notes.append(t)
    p = _Tables()
    p.feed(doc)
    tables = [t for t in p.tables if t['rows']]
    # 넥슨 NOW 왼쪽 메뉴 순서 (사이트 메뉴 순서로 사용)
    menu = []
    for cat, inner in re.findall(r'<li class="main"><span[^>]*>([^<]+)</span><ul>(.*?)</ul></li>', doc, re.S):
        menu.append([cat.strip(), [htmllib.unescape(x).strip()
                                   for x in re.findall(r'class="select-menu"[^>]*>([^<]+)<', inner)]])
    return {
        'category': category, 'title': title,
        'version': (ver.group(1).strip() if ver else ''),
        'period': text_of(period.group(1)) if period else '',
        'updated': upd.group(1).strip() if upd else '',
        'notes': notes, 'tables': tables, 'menu': menu,
    }


# ----------------------------------------------------------------- 해독기 페이지 → 아이템 목록
def conv_name(n):
    """넥슨 NOW 표기 → 공식 확률 페이지 표기
       '쿠스토스 (무제한)' → '쿠스토스', '파이슨 데스페라도 (30일_6강)' → '파이슨 데스페라도 - 6강 (30일)'"""
    m = re.match(r'^(.*?)\s*\((무제한|\d+일)(?:_(\d+)강)?\)\s*$', n)
    if not m:
        return n.strip()
    base, per, enh = m.groups()
    out = base.strip() + (f' - {enh}강' if enh else '')
    return out + (f' ({per})' if per != '무제한' else '')


def col(head, *names):
    for i, h in enumerate(head):
        if any(n in h for n in names):
            return i
    return -1


def decoder_items(page):
    """해독기 페이지면 [(이름, 설정확률, 실제결과)] 아니면 None"""
    if page['category'] != '해독기' or not page['tables']:
        return None
    t = page['tables'][0]
    ci, cp, cr = col(t['head'], '아이템'), col(t['head'], '설정 확률', '확률'), col(t['head'], '실제')
    if ci < 0 or cp < 0:
        return None
    out = []
    for r in t['rows']:
        try:
            p = float(r[cp].replace('%', '').replace(',', ''))
        except (ValueError, IndexError):
            continue
        real = r[cr].replace('%', '').strip() if 0 <= cr < len(r) else ''
        out.append([conv_name(r[ci]), f'{p:.5f}', real if re.match(r'^[\d.]+$', real) else ''])
    return out or None


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


def main():
    files = sorted(glob.glob(os.path.join(IN_DIR, '*.htm*')) + glob.glob(os.path.join(IN_DIR, '*.mht*')))
    if not files:
        log('nexon-now/ 폴더에 올린 파일 없음')
        return
    data = load_now()
    by_title = {p['title']: p for p in data['pages']}
    now = datetime.datetime.now(U.KST)
    official = U.load_old() or {'DECODERS': [], 'IMAGES': {}}
    official_names = {D['name'] for D in official['DECODERS']}
    hist_entries, done = [], []

    for path in files:
        try:
            pg = parse_page(read_saved(path))
        except Exception as e:  # noqa: BLE001
            log(f'읽기 실패: {os.path.basename(path)} ({e})')
            continue
        if not pg or not pg['tables']:
            log(f'확률표를 찾지 못함(건너뜀): {os.path.basename(path)} — 표가 보이는 상태에서 저장했는지 확인')
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
        old = by_title.get(pg['title'])
        # 변동 이력 (이전에 올린 적이 있고 내용이 바뀐 경우)
        if old:
            if items and old.get('items') and not rec['official']:
                a = {n: p for n, p, _ in old['items']}
                b = {n: p for n, p, _ in items}
                for n, p in b.items():
                    if n not in a:
                        hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'type': 'new', 'item': n, 'to': p})
                    elif float(a[n]) != float(p):
                        hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'item': n, 'from': a[n], 'to': p,
                                             'type': 'up' if float(p) > float(a[n]) else 'down'})
                for n, p in a.items():
                    if n not in b:
                        hist_entries.append({'dec': rec['id'], 'decName': rec['title'], 'type': 'removed', 'item': n, 'from': p})
            elif not items and old.get('tables') != rec.get('tables'):
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
    data['pages'] = sorted(by_title.values(), key=lambda p: order.index(p['title']) if p['title'] in order else 999)
    data['imported'] = now.strftime('%Y-%m-%d %H:%M')

    # 새 해독기 아이템 중 이미지가 없는 무기 → 위키에서 찾기
    known = dict(official.get('IMAGES') or {})
    known.update(data.get('images') or {})
    need = sorted({U.base_name(n) for p in data['pages'] if p.get('items') and not p['official']
                   for n, _, _ in p['items']} - set(known))
    if need and '--no-images' not in sys.argv:
        log(f'이미지 없는 아이템 {len(need)}개 위키에서 찾는 중')
        data.setdefault('images', {}).update(U.fetch_wiki_images(need))

    write_now(data)
    if hist_entries:
        h = U.load_history()
        h.insert(0, {'date': now.strftime('%Y-%m-%d'), 'time': now.strftime('%H:%M'), 'changes': hist_entries})
        U.write_history(h)
        log(f'변동 이력 {len(hist_entries)}건 기록')
    # 올린 파일 정리 (저장할 때 같이 생긴 _files 폴더 포함)
    if '--keep' not in sys.argv:
        for name in os.listdir(IN_DIR):
            p = os.path.join(IN_DIR, name)
            if name.lower() == 'readme.md':
                continue
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    log(f'완료: {len(done)}개 페이지 반영 (전체 {len(data["pages"])}개)')


if __name__ == '__main__':
    main()
