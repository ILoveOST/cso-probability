/* 확률 변동 이력 - scripts/update_data.py 가 확률이 바뀔 때마다 맨 앞에 추가합니다.
   type: new(새 아이템) removed(빠진 아이템) up/down(확률 변경) decoder_new/decoder_removed */
const HISTORY_START = '2026-11-11';
const HISTORY = [
 {"date": "2026-11-12", "time": "14:43", "changes": [
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "올인원 레전드 무기 선택 상자", "to": "0.21600"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "쿠스토스", "to": "0.38000"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "타이런트 메이스", "to": "0.38000"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "사복검", "to": "0.38000"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "키클롭스", "from": "0.38000", "to": "0.28600", "type": "down"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "데바스테이터", "from": "0.38000", "to": "0.28600", "type": "down"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "페일노트", "from": "0.38000", "to": "0.28600", "type": "down"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "쿠스토스 (30일)", "to": "4.81160"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "타이런트 메이스 (30일)", "to": "4.81160"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "오트클레르 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "데스 이터 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "new", "item": "사복검 (30일)", "to": "4.81160"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "마창 스칼렛 로즈 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "새틀라이트 마인 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "레바테인 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "키클롭스 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "인피니티 레이저 피스트 - 5강 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "듀얼 베레타 건슬링거 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "매그넘 런처 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "듀얼소드 팬텀 슬레이어 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "데바스테이터 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "item": "페일노트 (30일)", "from": "4.80667", "to": "4.81160", "type": "up"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "올인원 초월 무기 선택 상자", "from": "0.29000"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "X-TRACKER", "from": "0.28600"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "바렛 M95 화이트 타이거", "from": "0.28600"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "파이슨 데스페라도", "from": "0.28600"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "X-TRACKER (30일)", "from": "4.80667"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "바렛 M95 화이트 타이거 (30일)", "from": "4.80667"},
  {"dec": 937246, "decName": "올인원 해독기", "type": "removed", "item": "파이슨 데스페라도 - 6강 (30일)", "from": "4.80667"}
 ]}
];
