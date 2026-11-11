# 카스온라인 해독기 확률 도감

카운터스트라이크 온라인 공식 확률 페이지의 해독기를 무기·캐릭터 이미지와 함께 보여주는 정적 웹사이트입니다.
GitHub Pages로 공개되고, 공식 확률 페이지가 바뀌면 자동으로 반영됩니다. `index.html`을 더블클릭해도 동작합니다.

## 자동 업데이트

- `.github/workflows/update.yml`이 매일 **09:17, 21:17(한국 시간)**에 `scripts/update_data.py`를 실행합니다.
- 공식 페이지의 해독기 목록과 확률표를 읽어 `js/data.js`와 비교하고, **바뀐 경우에만** 고쳐서 저장한 뒤 사이트를 다시 배포합니다.
- 해독기가 새로 생기면 사이트 목록에 자동으로 추가되고, 사라지면 빠집니다. 새 무기 이미지는 위키에서 자동으로 찾아 넣습니다(못 찾으면 아이콘).
- 어느 해독기든 확률 합계가 100%가 아니면(페이지 구조가 바뀌어 잘못 읽은 경우) **아무것도 바꾸지 않고 실패**로 끝나며, GitHub이 실패 알림 메일을 보냅니다.
- 바로 확인하고 싶으면 GitHub 저장소 → Actions → "확률 자동 업데이트" → **Run workflow**를 누르면 됩니다.
- GitHub은 60일 동안 저장소에 변화가 없으면 예약 실행을 멈출 수 있습니다. 그 전에 안내 메일이 오며, Actions 탭에서 다시 켤 수 있습니다.

## 폴더 구조

```
index.html               페이지
css/style.css            디자인
js/data.js               확률 데이터 (자동 수집) + 이미지 매핑
js/app.js                화면 동작 (해독기 전환, 검색, 필터, 상세 팝업, 계산기)
images/weapons/          위키에서 받은 무기 이미지 (309개, WebP)
images/classes/          위키에서 받은 캐릭터(클래스) 이미지 (74개, WebP)
images/items/            위키에서 받은 코스튬·좀비 스킨·도색도안·상자 이미지 (84개, WebP)
scripts/update_data.py   공식 확률 페이지 → js/data.js 자동 갱신 (GitHub Actions가 실행)
.github/workflows/update.yml  자동 업데이트 + 사이트 배포 설정
tools/download_images.bat  (내 컴퓨터용) 이미지 다시 받기
tools/download_images.ps1  위 배치 파일이 실행하는 PowerShell 스크립트
```

## 이미지

- 출처: Counter-Strike Online Wiki (cso.fandom.com)
- 위키 서버가 WebP 형식으로 내려주기 때문에 파일은 `.webp`입니다.
- `tools/download_images.bat`을 실행하면 `images/weapons/`, `images/classes/`, `images/items/`에 없는 파일만 새로 받습니다. 실패하면 `tools/download_log.txt`에 원인이 남습니다.
- 로컬 이미지가 없으면 위키 주소에서 바로 불러오고, 그것도 실패하면 아이콘으로 표시합니다.
- 기간제·강화(-6강)·파츠·[ZHC] 표기가 붙은 아이템은 기본 무기 이미지를 씁니다.
- 2023~2024 이벤트 보상 코스튬 22개와 대기실 마크 21개는 위키에 이미지가 없어 아이콘으로 표시됩니다. `images/items/`에 넣고 `js/data.js`의 `IMAGES`에 추가하면 바로 반영됩니다.

## 데이터 수정

`js/data.js`는 자동으로 다시 만들어지므로 확률은 직접 고칠 필요가 없습니다. `IMAGES`(이미지 연결)는 직접 추가해도 자동 업데이트가 유지합니다.

- `LISTS`: 아이템 목록 (`|`로 구분)
- `DECODERS[].rows`: `[그룹명, 개당 확률(%), LISTS 번호, 등급, 종류, (mixed일 때 앞쪽 무기 수)]`
- `IMAGES`: `무기·캐릭터 기본 이름: [images/ 아래 경로, 위키 경로]`

해독기 링크: 주소 끝에 `#id=해독기번호` (예: `index.html#id=8308` → 유니크 해독기)
