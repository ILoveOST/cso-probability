/* 카스온라인 해독기 확률 데이터 - 공식 확률형 아이템 페이지 16종 (2026-10-27 수집)
   LISTS: 아이템 목록(| 구분)
   DECODERS[].rows: [그룹명, 개당 확률(%), LISTS 번호, 등급, 종류(weapon|class|etc|mixed: 앞 5개 무기)]
   IMAGES: 무기·캐릭터·코스튬·도색도안 기본 이름 -> [images/ 아래 경로, 위키 경로] */
const UPDATED = '2026-10-27';
const WIKI_BASE = 'https://static.wikia.nocookie.net/cso/images/';
const LISTS = [
 "실피드|드라카르 Ⅲ|포톤 런처|라이트닝 퓨리",
 "쿠스토스|페일노트|오트클레르|데스 이터|사복검",
 "새틀라이트 마인|레바테인|키클롭스|인피니티 레이저 피스트|듀얼 베레타 건슬링거|매그넘 런처|듀얼소드 팬텀 슬레이어|데바스테이터|마창 스칼렛 로즈|파이슨 데스페라도",
 "이그나이트-10|이그나이트-7|미라클 프리즘 소드|스타라이트 롤링 슈터|샤이닝 하트 로드|지옥무쌍검|헌터킬러 X-12|암토치|Bunker Buster LTD|헌터킬러 X-90|브로드 디바인|벤디타|썬더볼트|브릭피스S1451",
 "플라즈마 수류탄|플라즈마 건|Claymore Mine MDS|싸이클론|파팽|스타체이서 SR|헌터킬러 X-45|플레임 잭 해머|토네이도|헌터킬러 X-7|세이버리|듀얼 UZI|OICW|뉴커먼|헌터킬러 X-15",
 "불사신 에릭|스마일 메리|린|스카디|카이|이스마엘|미라주|녹스",
 "하이엘프 나타샤|로미|리더 안소이|슈퍼 솔져 제니퍼|특수요원 크리스|보스 데이비드 블랙|에단|아네모네",
 "주방장 헤비 좀비(코스튬)|간호사 스팅 핑거(코스튬)|미이라 스탬퍼(코스튬)|스쿨룩 라이트 좀비(코스튬)",
 "리사|밀라|유리 LE|앨리스 LE|최지윤 LE|미카엘라 LE|링링|도미닉|건스미스|헨리|안소이|짐|칼리토|발터|하리|키릭스|미카엘라|레이븐|루시아|엔조|에리카|메이|유리|리트슈카|제니퍼|최지윤|나타샤|크리스",
 "슈퍼 히어로 백팩|슈퍼 히어로 헬멧|복서 헤드기어|복서 챔피언벨트|아이돌 마이크|아이돌 선글라스|황금 가면|황금 방패|도발용 사과머리|도발용 표적판|도발용 화살표|젠틀맨 콧수염|젠틀맨 지팡이|젠틀맨 회중시계|엘레강스 머리|아프로 머리|고양이 귀|고양이 생선|고양이 꼬리|돼지 귀|돼지 삼지창|돼지 꼬리|팬더 귀|팬더 인형|팬더 꼬리|다람쥐 귀|도토리 가방|다람쥐 꼬리",
 "배틀 ULTIMAX-100|SKULL-7|SKULL-9|SKULL-5|SKULL-1|SKULL-3|SKULL-11|BALROG-VII|BALROG-V|BALROG-IX|BALROG-I|BALROG-Ⅲ|BALROG-XI|SKULL-4|SKULL-8|SKULL-6|JANUS-5|JANUS-7|JANUS-1|JANUS-9|SPAS12 매버릭|JANUS-11|M1887 매버릭|JANUS-3|크로우 바 매버릭|THANATOS-7|THANATOS-11|THANATOS-9|THANATOS-5|VULCANUS-7|VULCANUS-5|THANATOS-1|VULCANUS-9|VULCANUS-11|THANATOS-3|CROW-7|CROW-5|VULCANUS-1|VULCANUS-3|CROW-9|CROW-11|CROW-3|TURBULENT-7|TURBULENT-5|CROW-1|CHARGER-7|TURBULENT-9|CHARGER-5|TURBULENT-3|TURBULENT-1|TURBULENT-11|StG44|QBZ95B|PKM|AT4CS|SPAS-12|MK48|토마호크|파커헤일 M82|M32 MGL|킹코브라|UTS-15|MG36 크리스마스 에디션|HK G11|UMP45 스네이크|레비아탄|AWP-Z|배틀 갈릴|배틀 파마스|배틀 QBB95|배틀 MP5|택티컬 나이프|ARX-160|GROZA|HK G11 골드 에디션|M2|마체테|크로우 바|클로 해머|M60E4 매버릭|갈릴 매버릭|페트롤 부머|모신나강 스코프|MG42|MP40|마우저C96 쉬넬페우어|용격포|슬래셔|M1 개런드|M1918 BAR|Sten Mk2|M1911 A1|K1A 매버릭|길보아 카빈|토마호크 크리스마스 에디션|RPG-7|라이트닝 레일|파이어 발칸|M950|잭 해머|UZI|FNP-45|Hecate II|Norinco Type 86s|에어 버스터|QBS-09|NEGEV NG7|파이슨|HK121|HK121 커스텀|PP-2000|KH-2002|ULTIMAX-100|PP-19 Bizon|배틀 FNP-45|배틀 QBS-09|배틀 Hecate II|배틀 잭 해머|배틀 PP-19 Bizon|배틀 파이슨|락 브레이커|아나콘다|M4A1 스코프|M24|QBB95 + 추가 탄창|인피니티 실버|인피니티 블랙|인피니티 레드|TAR-21|배틀 헌팅대거|배틀 글록 18C|배틀 USP45",
 "썬더 고스트 워커|적룡포|리퍼|볼케이노|블레이드 룬브레이커|AUG 가디언|흑룡포|게이볼그|M249 피닉스|매그넘 드릴|크로스보우|크로스보우 어드밴스|혈적자|M3 블랙 드래곤|NEGEV NG7 아이아스|사이킥 하모니움|X-TRACKER|바렛 M95 화이트 타이거",
 "청룡도|컴파운드 보우|브릭피스M777|레이저 미니건|바티스타|레일 버스터|스턴 라이플|BOUNCER|M32 MGL 베놈|스타체이서 AR|F2000|K1A 스페셜 에디션|블래스터|디바인 록|드래곤클로|템페스트|와일드윙|아발란체|슈팅 스타|에테리얼|사염검|FG 런처|빔 소드|레일캐논|브릭피스V2|다트 피스톨|사피엔시아|코일건|체인 수류탄|어택 M950|DESTROYER|브릭피스T50|파워 FALCON|철선|버닝 AUG|Special Duck Foot Gun|Sterling Bayonet|맹독 살포기|라이트닝 다오-1|라이트닝 배찌-1|PSG-1|MG3|TRG-42|SL8|윈체스터 M1887|M134 미니건|듀얼 인피니티|듀얼 인피니티 커스텀|컴뱃 나이프|M79 소드오프|MP7A1 확장 탄창|듀얼 인피니티 파이널|HK23E 경기관총|M14 EBR|더블바렐 샷건|바렛 M95|카타나|듀얼 크리스|M60E4|톰슨 시카고|MG36|XM2010|SL8 커스텀|KSG12|AS50|샐러맨더|SPAS-12 디럭스|더블 택티컬 나이프|길보아 바이퍼|Falcon|VICTORY 한국|VICTORY 중국|VICTORY 일본|VICTORY 인도네시아|VICTORY 미국|VICTORY 캐나다|VICTORY 터키|VICTORY 러시아|VICTORY 독일|다오 수류탄|듀얼 MP7A1",
 "사이보그|퀸|핑크하트 시호|블랙로즈 미호|메데이아|칼라엘|액시온|아이테리스|도로시 다크나이트|플로라 팔라딘|초월 최지윤|초월 유리|소냐 라이칸스로프|엘리자베스 크림슨헌터|초월 미카엘라|초월 페르난도|초월 블레어|로즈 피닉스|용기사 키릭스|교관 제라드|로이|훈련병 에리카",
 "음악하는 에리카 대기실 마크|방송하는 미라주 대기실 마크|좀비를 잡아라 대기실 마크|시호의 핑크물결 대기실 마크|사자탈 대기실 마크|마녀의 밤 대기실 마크|야구광 보안관 대기실 마크|이탈리아 닭 대기실 마크|판다 대기실 마크|토끼 풍선 대기실 마크|SD 캐릭터의 귀여움 대기실 마크|밤하늘의 향연 대기실 마크|네잎 클로버 대기실 마크|눈부신 해안가 대기실 마크|달빛 저녁 대기실 마크|신나는 바캉스 대기실 마크|여름 밤 캠핑 대기실 마크|수줍은 소녀 좀비 대기실 마크|캠핑카 대기실 마크|바삭바삭 쿠키 대기실 마크|푸른 그을림 대기실 마크",
 "햄버거 모자|사이다 컵|저팔계 귀|저팔계 꼬리|거북이 가방|문어 모자|초밥 모자|김말이 초밥|상어 모자|양뿔|야구광 보안관 모자|CSO 야구 응원 풍선|고양이 모자|볶음면 모자|강철 가방|뚫어뻥|아이스크림 콘 모자|블루 랜턴|프로펠러 모자|무지개 솜사탕|연잎밥 탈|추석 달무리",
 "쿠스토스 (30일)|페일노트 (30일)|오트클레르 (30일)|데스 이터 (30일)|사복검 (30일)|불사신 에릭 (30일)|스마일 메리 (30일)|린 (30일)|스카디 (30일)|카이 (30일)|이스마엘 (30일)|미라주 (30일)|녹스 (30일)",
 "쿠스토스 (10일)|페일노트 (10일)|오트클레르 (10일)|데스 이터 (10일)|사복검 (10일)|불사신 에릭 (10일)|스마일 메리 (10일)|린 (10일)|스카디 (10일)|카이 (10일)|이스마엘 (10일)|미라주 (10일)|녹스 (10일)",
 "[ZHC] 스페셜 무기 선택 상자",
 "[ZHC] 에어 버스터|[ZHC] JANUS-3|[ZHC] JANUS-9|[ZHC] JANUS-11|[ZHC] VULCANUS-1|[ZHC] VULCANUS-3|[ZHC] VULCANUS-5|[ZHC] VULCANUS-7|[ZHC] VULCANUS-9|[ZHC] VULCANUS-11|[ZHC] 용격포|[ZHC] 슬래셔|[ZHC] M950|[ZHC] THANATOS-5|[ZHC] THANATOS-7|[ZHC] THANATOS-9|[ZHC] THANATOS-11|[ZHC] 크로스보우|[ZHC] 볼케이노|[ZHC] 청룡도|[ZHC] 썬더볼트|[ZHC] 플라즈마 건|[ZHC] 세이버리|[ZHC] 레비아탄|[ZHC] OICW|[ZHC] FG 런처|[ZHC] SKULL-4|[ZHC] SKULL-6|[ZHC] SKULL-8|[ZHC] BALROG-I|[ZHC] BALROG-Ⅲ|[ZHC] BALROG-V|[ZHC] BALROG-VII|[ZHC] BALROG-IX|[ZHC] BALROG-XI|[ZHC] JANUS-1|[ZHC] JANUS-5|[ZHC] JANUS-7|[ZHC] 아발란체|[ZHC] 템페스트|[ZHC] 데저트 이글 50C 골드에디션|[ZHC] 톰슨 시카고 골드|[ZHC] M79 소드오프 골드|[ZHC] MP5 골드에디션|[ZHC] M134 크리스마스 에디션|[ZHC] MG3 크리스마스 에디션|[ZHC] M95 크리스마스 에디션|[ZHC] SKULL-1|[ZHC] SKULL-3|[ZHC] SKULL-5|[ZHC] SKULL-7|[ZHC] SKULL-9|[ZHC] SKULL-11",
 "[ZHC] 에어 버스터 (3일)|[ZHC] JANUS-3 (3일)|[ZHC] JANUS-9 (3일)|[ZHC] JANUS-11 (3일)|[ZHC] VULCANUS-1 (3일)|[ZHC] VULCANUS-3 (3일)|[ZHC] VULCANUS-5 (3일)|[ZHC] VULCANUS-7 (3일)|[ZHC] VULCANUS-9 (3일)|[ZHC] VULCANUS-11 (3일)|[ZHC] 용격포 (3일)|[ZHC] 슬래셔 (3일)|[ZHC] M950 (3일)|[ZHC] THANATOS-5 (3일)|[ZHC] THANATOS-7 (3일)|[ZHC] THANATOS-9 (3일)|[ZHC] THANATOS-11 (3일)|[ZHC] 크로스보우 (3일)|[ZHC] 볼케이노 (3일)|[ZHC] 청룡도 (3일)|[ZHC] 썬더볼트 (3일)|[ZHC] 플라즈마 건 (3일)|[ZHC] 세이버리 (3일)|[ZHC] 레비아탄 (3일)|[ZHC] OICW (3일)|[ZHC] FG 런처 (3일)|[ZHC] SKULL-4 (3일)|[ZHC] SKULL-6 (3일)|[ZHC] SKULL-8 (3일)|[ZHC] BALROG-I (3일)|[ZHC] BALROG-Ⅲ (3일)|[ZHC] BALROG-V (3일)|[ZHC] BALROG-VII (3일)|[ZHC] BALROG-IX (3일)|[ZHC] BALROG-XI (3일)|[ZHC] JANUS-1 (3일)|[ZHC] JANUS-5 (3일)|[ZHC] JANUS-7 (3일)|[ZHC] 아발란체 (3일)|[ZHC] 템페스트 (3일)|[ZHC] 데저트 이글 50C 골드에디션 (3일)|[ZHC] 톰슨 시카고 골드 (3일)|[ZHC] M79 소드오프 골드 (3일)|[ZHC] MP5 골드에디션 (3일)|[ZHC] M134 크리스마스 에디션 (3일)|[ZHC] MG3 크리스마스 에디션 (3일)|[ZHC] M95 크리스마스 에디션 (3일)|[ZHC] SKULL-1 (3일)|[ZHC] SKULL-3 (3일)|[ZHC] SKULL-5 (3일)|[ZHC] SKULL-7 (3일)|[ZHC] SKULL-9 (3일)|[ZHC] SKULL-11 (3일)",
 "[ZHC] 에어 버스터 (1일)|[ZHC] JANUS-3 (1일)|[ZHC] JANUS-9 (1일)|[ZHC] JANUS-11 (1일)|[ZHC] VULCANUS-1 (1일)|[ZHC] VULCANUS-3 (1일)|[ZHC] VULCANUS-5 (1일)|[ZHC] VULCANUS-7 (1일)|[ZHC] VULCANUS-9 (1일)|[ZHC] VULCANUS-11 (1일)|[ZHC] 용격포 (1일)|[ZHC] 슬래셔 (1일)|[ZHC] M950 (1일)|[ZHC] THANATOS-5 (1일)|[ZHC] THANATOS-7 (1일)|[ZHC] THANATOS-9 (1일)|[ZHC] THANATOS-11 (1일)|[ZHC] 크로스보우 (1일)|[ZHC] 볼케이노 (1일)|[ZHC] 청룡도 (1일)|[ZHC] 썬더볼트 (1일)|[ZHC] 플라즈마 건 (1일)|[ZHC] 세이버리 (1일)|[ZHC] 레비아탄 (1일)|[ZHC] OICW (1일)|[ZHC] FG 런처 (1일)|[ZHC] SKULL-4 (1일)|[ZHC] SKULL-6 (1일)|[ZHC] SKULL-8 (1일)|[ZHC] BALROG-I (1일)|[ZHC] BALROG-Ⅲ (1일)|[ZHC] BALROG-V (1일)|[ZHC] BALROG-VII (1일)|[ZHC] BALROG-IX (1일)|[ZHC] BALROG-XI (1일)|[ZHC] JANUS-1 (1일)|[ZHC] JANUS-5 (1일)|[ZHC] JANUS-7 (1일)|[ZHC] 아발란체 (1일)|[ZHC] 템페스트 (1일)|[ZHC] 데저트 이글 50C 골드에디션 (1일)|[ZHC] 톰슨 시카고 골드 (1일)|[ZHC] M79 소드오프 골드 (1일)|[ZHC] MP5 골드에디션 (1일)|[ZHC] M134 크리스마스 에디션 (1일)|[ZHC] MG3 크리스마스 에디션 (1일)|[ZHC] M95 크리스마스 에디션 (1일)|[ZHC] SKULL-1 (1일)|[ZHC] SKULL-3 (1일)|[ZHC] SKULL-5 (1일)|[ZHC] SKULL-7 (1일)|[ZHC] SKULL-9 (1일)|[ZHC] SKULL-11 (1일)",
 "네온 홀리트리 도색도안|데스 로즈 도색도안|달무리 도색도안|베놈 바이퍼 도색도안|골드 호랑이 도색도안|실버 호랑이 도색도안|반투명 도색도안|네모닉 도색도안|레더 도색도안|레드바론 도색도안|2020 CN 도색도안|2020 KR 도색도안|2020 TW 도색도안|2020 NA 도색도안|레드 도색도안|오렌지 도색도안|옐로우 도색도안|그린 도색도안|블루 도색도안|퍼플 도색도안|JANUS-11 추억 도색도안|THANATOS-11 추억 도색도안|SKULL-11 추억 도색도안",
 "BALROG-XI 추억 도색도안|TURBULENT-11 추억 도색도안|CROW-11 추억 도색도안|레드썬더 도색도안|블루썬더 도색도안|에리카 도색도안|호크 도색도안|갤럭시 도색도안|최지윤 도색도안|블러드 도색도안|포이즌 도색도안|아쿠아 도색도안|리프그린 도색도안|바이올렛 도색도안|플래닛 도색도안|레이스 도색도안|허니 도색도안|스네이크 도색도안|프라모델 도색도안|KR 도색도안|CN 도색도안|TW 도색도안|JP 도색도안|NA 도색도안|ID 도색도안|핑크빛 칠석 도색도안|달밤 도색도안",
 "유리 LE|앨리스 LE|최지윤 LE|미카엘라 LE|링링|이자벨|아린|도미닉|건스미스|헨리|안소이|짐|칼리토|발터|하리|키릭스|데이비드 블랙|제라드|미카엘라|레이븐|루시아|엔조|에리카|메이|유리|리트슈카|제니퍼|최지윤|나타샤|크리스",
 "스쿨룩 라이트 좀비(코스튬)|미이라 스탬퍼(코스튬)|주방장 헤비 좀비(코스튬)|간호사 스팅 핑거(코스튬)|산타이치 헤비 좀비(코스튬)",
 "슈퍼 히어로 백팩|슈퍼 히어로 헬멧|복서 헤드기어|복서 챔피언벨트|아이돌 마이크|아이돌 선글라스|황금 가면|황금 방패|도발용 사과머리|도발용 표적판|도발용 화살표|젠틀맨 콧수염|젠틀맨 지팡이|젠틀맨 회중시계|엘레강스 머리|아프로 머리",
 "고양이 귀|고양이 생선|고양이 꼬리|돼지 귀|돼지 삼지창|돼지 꼬리|팬더 귀|팬더 인형|팬더 꼬리|다람쥐 귀|도토리 가방|다람쥐 꼬리",
 "파이슨 데스페라도|적룡포|스타체이서 SR|헌터킬러 X-12|헌터킬러 X-90|AUG 가디언|M249 피닉스",
 "SG552 라이칸스로프|헌터킬러 X-45|워해머 스톰 자이언트|헌터킬러 X-7|헌터킬러 X-15|스타체이서 AR|M4A1 다크나이트|AK47 팔라딘|M32 MGL 베놈|리퍼|D.Eagle 크림슨헌터|Claymore Mine MDS|혈적자|블레이드 룬브레이커|매그넘 드릴|게이볼그|암토치|뉴커먼",
 "흑룡포|BOUNCER|Bunker Buster LTD|브로드 디바인|듀얼 인피니티 파이널|레이저 미니건|브릭피스S1451|에어 버스터|맹독 살포기|플라즈마 건|벤디타|듀얼 UZI|M950|스턴 라이플|SKULL-9|컴파운드 보우|레일캐논|세이버리|청룡도|볼케이노|파팽|크로스보우 어드밴스|바티스타|썬더볼트|싸이클론",
 "배틀 QBS-09 (100일)|배틀 Hecate II (100일)|배틀 잭 해머 (100일)|배틀 PP-19 Bizon (100일)|배틀 파이슨 (100일)|배틀 NEGEV NG7 (100일)|M950 (100일)|THANATOS-9 (100일)|TURBULENT-5 (100일)|CROW-3 (100일)|VULCANUS-9 (100일)|CROW-9 (100일)|TURBULENT-9 (100일)|BALROG-XI (100일)|CROW-1 (100일)|슬래셔 (100일)|JANUS-9 (100일)|TURBULENT-3 (100일)|TURBULENT-1 (100일)|크로우 바 매버릭 (100일)|TURBULENT-7 (100일)|레비아탄 (100일)|M60E4 매버릭 (100일)|페트롤 부머 (100일)|TURBULENT-11 (100일)|THANATOS-5 (100일)|CROW-11 (100일)|CHARGER-7 (100일)|CHARGER-5 (100일)|AWP-Z (100일)",
 "배틀 QBS-09 (30일)|배틀 Hecate II (30일)|배틀 잭 해머 (30일)|배틀 PP-19 Bizon (30일)|배틀 파이슨 (30일)|배틀 NEGEV NG7 (30일)|M950 (30일)|THANATOS-9 (30일)|TURBULENT-5 (30일)|CROW-3 (30일)|VULCANUS-9 (30일)|CROW-9 (30일)|TURBULENT-9 (30일)|BALROG-XI (30일)|CROW-1 (30일)|슬래셔 (30일)|JANUS-9 (30일)|TURBULENT-3 (30일)|TURBULENT-1 (30일)|크로우 바 매버릭 (30일)|TURBULENT-7 (30일)|레비아탄 (30일)|M60E4 매버릭 (30일)|페트롤 부머 (30일)|TURBULENT-11 (30일)|THANATOS-5 (30일)|CROW-11 (30일)|CHARGER-7 (30일)|CHARGER-5 (30일)|AWP-Z (30일)",
 "에비타|안젤리나|밀리아|카린",
 "불사신 에릭 (30일)|스마일 메리 (30일)|린 (30일)|스카디 (30일)|카이 (30일)|이스마엘 (30일)|미라주 (30일)|녹스 (30일)",
 "하이엘프 나타샤 (30일)|로미 (30일)|리더 안소이 (30일)|슈퍼 솔져 제니퍼 (30일)|특수요원 크리스 (30일)|보스 데이비드 블랙 (30일)|에단 (30일)|아네모네 (30일)",
 "주방장 헤비 좀비(코스튬) (30일)|간호사 스팅 핑거(코스튬) (30일)|미이라 스탬퍼(코스튬) (30일)|스쿨룩 라이트 좀비(코스튬) (30일)",
 "리사 (30일)|밀라 (30일)|유리 LE (30일)|앨리스 LE (30일)|최지윤 LE (30일)|미카엘라 LE (30일)|링링 (30일)|도미닉 (30일)|건스미스 (30일)|헨리 (30일)|안소이 (30일)|짐 (30일)|칼리토 (30일)|발터 (30일)|하리 (30일)|키릭스 (30일)|미카엘라 (30일)|레이븐 (30일)|루시아 (30일)|엔조 (30일)|에리카 (30일)|메이 (30일)|유리 (30일)|리트슈카 (30일)|제니퍼 (30일)|최지윤 (30일)|나타샤 (30일)|크리스 (30일)",
 "슈퍼 히어로 백팩 (30일)|슈퍼 히어로 헬멧 (30일)|복서 헤드기어 (30일)|복서 챔피언벨트 (30일)|아이돌 마이크 (30일)|아이돌 선글라스 (30일)|황금 가면 (30일)|황금 방패 (30일)|도발용 사과머리 (30일)|도발용 표적판 (30일)|도발용 화살표 (30일)|젠틀맨 콧수염 (30일)|젠틀맨 지팡이 (30일)|젠틀맨 회중시계 (30일)|엘레강스 머리 (30일)|아프로 머리 (30일)|고양이 귀 (30일)|고양이 생선 (30일)|고양이 꼬리 (30일)|돼지 귀 (30일)|돼지 삼지창 (30일)|돼지 꼬리 (30일)|팬더 귀 (30일)|팬더 인형 (30일)|팬더 꼬리 (30일)|다람쥐 귀 (30일)|도토리 가방 (30일)|다람쥐 꼬리 (30일)",
 "배틀 ULTIMAX-100|SKULL-7|SKULL-9|SKULL-5|SKULL-1|SKULL-3|SKULL-11|BALROG-VII|BALROG-V|BALROG-IX|BALROG-I|BALROG-Ⅲ|BALROG-XI|SKULL-4|SKULL-8|SKULL-6|JANUS-5|JANUS-7|JANUS-1|JANUS-9|SPAS12 매버릭|JANUS-11|M1887 매버릭|JANUS-3|크로우 바 매버릭|THANATOS-7|THANATOS-11|THANATOS-9|THANATOS-5|VULCANUS-7|VULCANUS-5|THANATOS-1|VULCANUS-9|VULCANUS-11|THANATOS-3|CROW-7|CROW-5|VULCANUS-1|VULCANUS-3|CROW-9|CROW-11|CROW-3|TURBULENT-7|TURBULENT-5|CROW-1|CHARGER-7|TURBULENT-9|CHARGER-5|TURBULENT-3|TURBULENT-1|TURBULENT-11",
 "StG44|QBZ95B|PKM|AT4CS|SPAS-12|MK48|토마호크|파커헤일 M82|M32 MGL|킹코브라|UTS-15|MG36 크리스마스 에디션|HK G11|UMP45 스네이크|레비아탄|AWP-Z|배틀 갈릴|배틀 파마스|배틀 QBB95|배틀 MP5|택티컬 나이프|ARX-160|GROZA|HK G11 골드 에디션|M2|마체테|크로우 바|클로 해머|M60E4 매버릭|갈릴 매버릭|페트롤 부머|모신나강 스코프|MG42|MP40|마우저C96 쉬넬페우어|용격포|슬래셔|M1 개런드|M1918 BAR|Sten Mk2|M1911 A1|K1A 매버릭|길보아 카빈|토마호크 크리스마스 에디션|RPG-7|라이트닝 레일|파이어 발칸|M950|잭 해머|UZI|FNP-45|Hecate II|Norinco Type 86s|에어 버스터|QBS-09|NEGEV NG7|파이슨|HK121|HK121 커스텀|PP-2000|KH-2002|ULTIMAX-100|PP-19 Bizon|배틀 FNP-45|배틀 QBS-09|배틀 Hecate II|배틀 잭 해머|배틀 PP-19 Bizon|배틀 파이슨|락 브레이커",
 "아나콘다|M4A1 스코프|M24|QBB95 + 추가 탄창|인피니티 실버|인피니티 블랙|인피니티 레드|TAR-21|배틀 헌팅대거|배틀 글록 18C|배틀 USP45",
 "배틀 ULTIMAX-100 (100일)|SKULL-7 (100일)|SKULL-9 (100일)|SKULL-5 (100일)|SKULL-1 (100일)|SKULL-3 (100일)|SKULL-11 (100일)|BALROG-VII (100일)|BALROG-V (100일)|BALROG-IX (100일)|BALROG-I (100일)|BALROG-Ⅲ (100일)|BALROG-XI (100일)|SKULL-4 (100일)|SKULL-8 (100일)|SKULL-6 (100일)|JANUS-5 (100일)|JANUS-7 (100일)|JANUS-1 (100일)|JANUS-9 (100일)|SPAS12 매버릭 (100일)|JANUS-11 (100일)|M1887 매버릭 (100일)|JANUS-3 (100일)|크로우 바 매버릭 (100일)|THANATOS-7 (100일)|THANATOS-11 (100일)|THANATOS-9 (100일)|THANATOS-5 (100일)|VULCANUS-7 (100일)|VULCANUS-5 (100일)|THANATOS-1 (100일)|VULCANUS-9 (100일)|VULCANUS-11 (100일)|THANATOS-3 (100일)|CROW-7 (100일)|CROW-5 (100일)|VULCANUS-1 (100일)|VULCANUS-3 (100일)|CROW-9 (100일)|CROW-11 (100일)|CROW-3 (100일)|TURBULENT-7 (100일)|TURBULENT-5 (100일)|CROW-1 (100일)|CHARGER-7 (100일)|TURBULENT-9 (100일)|CHARGER-5 (100일)|TURBULENT-3 (100일)|TURBULENT-1 (100일)|TURBULENT-11 (100일)",
 "StG44 (100일)|QBZ95B (100일)|PKM (100일)|AT4CS (100일)|SPAS-12 (100일)|MK48 (100일)|토마호크 (100일)|파커헤일 M82 (100일)|M32 MGL (100일)|킹코브라 (100일)|UTS-15 (100일)|MG36 크리스마스 에디션 (100일)|HK G11 (100일)|UMP45 스네이크 (100일)|레비아탄 (100일)|AWP-Z (100일)|배틀 갈릴 (100일)|배틀 파마스 (100일)|배틀 QBB95 (100일)|배틀 MP5 (100일)|택티컬 나이프 (100일)|ARX-160 (100일)|GROZA (100일)|HK G11 골드 에디션 (100일)|M2 (100일)|마체테 (100일)|크로우 바 (100일)|클로 해머 (100일)|M60E4 매버릭 (100일)|갈릴 매버릭 (100일)|페트롤 부머 (100일)|모신나강 스코프 (100일)|MG42 (100일)|MP40 (100일)|마우저C96 쉬넬페우어 (100일)|용격포 (100일)|슬래셔 (100일)|M1 개런드 (100일)|M1918 BAR (100일)|Sten Mk2 (100일)|M1911 A1 (100일)|K1A 매버릭 (100일)|길보아 카빈 (100일)|토마호크 크리스마스 에디션 (100일)|RPG-7 (100일)|라이트닝 레일 (100일)|파이어 발칸 (100일)|M950 (100일)|잭 해머 (100일)|UZI (100일)|FNP-45 (100일)|Hecate II (100일)|Norinco Type 86s (100일)|에어 버스터 (100일)|QBS-09 (100일)|NEGEV NG7 (100일)|파이슨 (100일)|HK121 (100일)|HK121 커스텀 (100일)|PP-2000 (100일)|KH-2002 (100일)|ULTIMAX-100 (100일)|PP-19 Bizon (100일)|배틀 FNP-45 (100일)|배틀 QBS-09 (100일)|배틀 Hecate II (100일)|배틀 잭 해머 (100일)|배틀 PP-19 Bizon (100일)|배틀 파이슨 (100일)|락 브레이커 (100일)",
 "아나콘다 (100일)|M4A1 스코프 (100일)|M24 (100일)|QBB95 + 추가 탄창 (100일)|인피니티 실버 (100일)|인피니티 블랙 (100일)|인피니티 레드 (100일)|TAR-21 (100일)|배틀 헌팅대거 (100일)|배틀 글록 18C (100일)|배틀 USP45 (100일)",
 "바이퍼 팽 T1",
 "프리즈번 트윈암즈 T1|리코일 블리츠 T1|블랙워터 T1",
 "아르카나 Ⅱ|무라사메 Ⅱ|노아스 Ⅱ|썬더 플래시 Ⅱ|아스칼론 Ⅱ|제노사이더 Ⅱ",
 "아르카나 Ⅰ|무라사메 Ⅰ|노아스 Ⅰ|썬더 플래시 Ⅰ|아스칼론 Ⅰ|제노사이더 Ⅰ",
 "일렉트론-V|일렉트론-III|일렉트론-XI|일렉트론-VII",
 "이그나이트-10 (30일)|이그나이트-7 (30일)|미라클 프리즘 소드(스피드업 파츠-티어6, 뱀피릭 파츠-티어6) (30일)|스타라이트 롤링 슈터(건부스트 파츠-티어6, 스피드업 파츠-티어6) (30일)|샤이닝 하트 로드(헬스업 파츠-티어6, 뱀피릭 파츠-티어6) (30일)|지옥무쌍검 (30일)|헌터킬러 X-12(건부스트 파츠-티어6, 스트레스 다운 파츠-티어6) (30일)|암토치 (30일)|Bunker Buster LTD (30일)|헌터킬러 X-90(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)|브로드 디바인(헬스업 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)|벤디타(건부스트 파츠-티어6, 홀드 업 파츠-티어6) - 6강 (30일)|썬더볼트(건부스트 파츠-티어6, 크리티컬 파츠-티어6) - 6강 (30일)|브릭피스S1451 (30일)",
 "플라즈마 수류탄 (30일)|플라즈마 건(건부스트 파츠-티어6, 넉백 업 파츠-티어6) - 6강 (30일)|Claymore Mine MDS (30일)|싸이클론 (30일)|파팽 - 6강 (30일)|스타체이서 SR (30일)|헌터킬러 X-45(건부스트 파츠-티어6, 스피드업 파츠-티어6) - 5강 (30일)|플레임 잭 해머 (30일)|토네이도 (30일)|헌터킬러 X-7(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)|세이버리 - 9강 (30일)|듀얼 UZI - 6강 (30일)|OICW - 5강 (30일)|뉴커먼 - 6강 (30일)|헌터킬러 X-15(헬스업 파츠-티어6, 크리티컬 파츠-티어6) - 5강 (30일)",
 "배틀 ULTIMAX-100 (30일)|SKULL-7 (30일)|SKULL-9 (30일)|SKULL-5 (30일)|SKULL-1 (30일)|SKULL-3 (30일)|SKULL-11 (30일)|BALROG-VII (30일)|BALROG-V (30일)|BALROG-IX (30일)|BALROG-I (30일)|BALROG-Ⅲ (30일)|BALROG-XI (30일)|SKULL-4 (30일)|SKULL-8 (30일)|SKULL-6 (30일)|JANUS-5 (30일)|JANUS-7 (30일)|JANUS-1 (30일)|JANUS-9 (30일)|SPAS12 매버릭 (30일)|JANUS-11 (30일)|M1887 매버릭 (30일)|JANUS-3 (30일)|크로우 바 매버릭 (30일)|THANATOS-7 (30일)|THANATOS-11 (30일)|THANATOS-9 (30일)|THANATOS-5 (30일)|VULCANUS-7 (30일)|VULCANUS-5 (30일)|THANATOS-1 (30일)|VULCANUS-9 (30일)|VULCANUS-11 (30일)|THANATOS-3 (30일)|CROW-7 (30일)|CROW-5 (30일)|VULCANUS-1 (30일)|VULCANUS-3 (30일)|CROW-9 (30일)|CROW-11 (30일)|CROW-3 (30일)|TURBULENT-7 (30일)|TURBULENT-5 (30일)|CROW-1 (30일)|CHARGER-7 (30일)|TURBULENT-9 (30일)|CHARGER-5 (30일)|TURBULENT-3 (30일)|TURBULENT-1 (30일)|TURBULENT-11 (30일)",
 "StG44 (30일)|QBZ95B (30일)|PKM (30일)|AT4CS (30일)|SPAS-12 (30일)|MK48 (30일)|토마호크 (30일)|파커헤일 M82 (30일)|M32 MGL (30일)|킹코브라 (30일)|UTS-15 (30일)|MG36 크리스마스 에디션 (30일)|HK G11 (30일)|UMP45 스네이크 (30일)|레비아탄 (30일)|AWP-Z (30일)|배틀 갈릴 (30일)|배틀 파마스 (30일)|배틀 QBB95 (30일)|배틀 MP5 (30일)|택티컬 나이프 (30일)|ARX-160 (30일)|GROZA (30일)|HK G11 골드 에디션 (30일)|M2 (30일)|마체테 (30일)|크로우 바 (30일)|클로 해머 (30일)|M60E4 매버릭 (30일)|갈릴 매버릭 (30일)|페트롤 부머 (30일)|모신나강 스코프 (30일)|MG42 (30일)|MP40 (30일)|마우저C96 쉬넬페우어 (30일)|용격포 (30일)|슬래셔 (30일)|M1 개런드 (30일)|M1918 BAR (30일)|Sten Mk2 (30일)|M1911 A1 (30일)|K1A 매버릭 (30일)|길보아 카빈 (30일)|토마호크 크리스마스 에디션 (30일)|RPG-7 (30일)|라이트닝 레일 (30일)|파이어 발칸 (30일)|M950 (30일)|잭 해머 (30일)|UZI (30일)|FNP-45 (30일)|Hecate II (30일)|Norinco Type 86s (30일)|에어 버스터 (30일)|QBS-09 (30일)|NEGEV NG7 (30일)|파이슨 (30일)|HK121 (30일)|HK121 커스텀 (30일)|PP-2000 (30일)|KH-2002 (30일)|ULTIMAX-100 (30일)|PP-19 Bizon (30일)|배틀 FNP-45 (30일)|배틀 QBS-09 (30일)|배틀 Hecate II (30일)|배틀 잭 해머 (30일)|배틀 PP-19 Bizon (30일)|배틀 파이슨 (30일)|락 브레이커 (30일)",
 "바이퍼 팽 T2",
 "쿠스토스 (30일)|페일노트 (30일)|오트클레르 (30일)|데스 이터 (30일)|사복검 (30일)|마창 스칼렛 로즈 (30일)|새틀라이트 마인 (30일)|레바테인 (30일)|키클롭스 (30일)|인피니티 레이저 피스트 - 5강 (30일)|듀얼 베레타 건슬링거 (30일)|매그넘 런처 (30일)|듀얼소드 팬텀 슬레이어 (30일)|데바스테이터 (30일)|파이슨 데스페라도 - 6강 (30일)",
 "쿠스토스 (10일)|페일노트 (10일)|오트클레르 (10일)|데스 이터 (10일)|사복검 (10일)|마창 스칼렛 로즈 (10일)|새틀라이트 마인 (10일)|레바테인 (10일)|키클롭스 (10일)|인피니티 레이저 피스트 - 5강 (10일)|듀얼 베레타 건슬링거 (10일)|매그넘 런처 (10일)|듀얼소드 팬텀 슬레이어 (10일)|데바스테이터 (10일)|파이슨 데스페라도 - 6강 (10일)",
 "이그나이트-10 (30일)|이그나이트-7 (30일)|미라클 프리즘 소드(스피드업 파츠-티어6, 뱀피릭 파츠-티어6) (30일)|스타라이트 롤링 슈터(건부스트 파츠-티어6, 스피드업 파츠-티어6) (30일)|샤이닝 하트 로드(헬스업 파츠-티어6, 뱀피릭 파츠-티어6) (30일)|지옥무쌍검 (30일)|헌터킬러 X-12(건부스트 파츠-티어6, 스트레스 다운 파츠-티어6) (30일)|암토치 (30일)|Bunker Buster LTD (30일)|헌터킬러 X-90(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)|브로드 디바인(헬스업 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)|벤디타(건부스트 파츠-티어6, 홀드 업 파츠-티어6) - 6강 (30일)|썬더볼트(건부스트 파츠-티어6, 크리티컬 파츠-티어6) - 6강 (30일)|브릭피스S1451 (30일)|플라즈마 수류탄 (30일)|플라즈마 건(건부스트 파츠-티어6, 넉백 업 파츠-티어6) - 6강 (30일)|Claymore Mine MDS (30일)|싸이클론 (30일)|파팽 - 6강 (30일)|스타체이서 SR (30일)|헌터킬러 X-45(건부스트 파츠-티어6, 스피드업 파츠-티어6) - 5강 (30일)|플레임 잭 해머 (30일)|토네이도 (30일)|헌터킬러 X-7(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (30일)|세이버리 - 9강 (30일)|듀얼 UZI - 6강 (30일)|OICW - 5강 (30일)|뉴커먼 - 6강 (30일)|헌터킬러 X-15(헬스업 파츠-티어6, 크리티컬 파츠-티어6) - 5강 (30일)",
 "이그나이트-10 (10일)|이그나이트-7 (10일)|미라클 프리즘 소드(스피드업 파츠-티어6, 뱀피릭 파츠-티어6) (10일)|스타라이트 롤링 슈터(건부스트 파츠-티어6, 스피드업 파츠-티어6) (10일)|샤이닝 하트 로드(헬스업 파츠-티어6, 뱀피릭 파츠-티어6) (10일)|지옥무쌍검 (10일)|헌터킬러 X-12(건부스트 파츠-티어6, 스트레스 다운 파츠-티어6) (10일)|암토치 (10일)|Bunker Buster LTD (10일)|헌터킬러 X-90(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (10일)|브로드 디바인(헬스업 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (10일)|벤디타(건부스트 파츠-티어6, 홀드 업 파츠-티어6) - 6강 (10일)|썬더볼트(건부스트 파츠-티어6, 크리티컬 파츠-티어6) - 6강 (10일)|브릭피스S1451 (10일)|플라즈마 수류탄 (10일)|플라즈마 건(건부스트 파츠-티어6, 넉백 업 파츠-티어6) - 6강 (10일)|Claymore Mine MDS (10일)|싸이클론 (10일)|파팽 - 6강 (10일)|스타체이서 SR (10일)|헌터킬러 X-45(건부스트 파츠-티어6, 스피드업 파츠-티어6) - 5강 (10일)|플레임 잭 해머 (10일)|토네이도 (10일)|헌터킬러 X-7(건부스트 파츠-티어6, 뱀피릭 파츠-티어6) - 5강 (10일)|세이버리 - 9강 (10일)|듀얼 UZI - 6강 (10일)|OICW - 5강 (10일)|뉴커먼 - 6강 (10일)|헌터킬러 X-15(헬스업 파츠-티어6, 크리티컬 파츠-티어6) - 5강 (10일)",
 "프로스트 바이퍼|데모닉 바이퍼",
 "무라사메 Ⅴ|아르카나 Ⅴ|제노사이더 Ⅴ|아스칼론 Ⅴ",
 "쿠스토스 (30일)|페일노트 (30일)|오트클레르 (30일)|데스 이터 (30일)|사복검 (30일)|새틀라이트 마인 (30일)|레바테인 (30일)|키클롭스 (30일)|인피니티 레이저 피스트 - 5강 (30일)|듀얼 베레타 건슬링거 (30일)|매그넘 런처 (30일)|듀얼소드 팬텀 슬레이어 (30일)|데바스테이터 (30일)|마창 스칼렛 로즈 (30일)|파이슨 데스페라도 - 6강 (30일)"
];
const DECODERS = [
 {
  "id": 9616,
  "name": "PC방 프리미엄 해독기",
  "rows": [
   [
    "초월 2차 재판매 그룹 (무제한)",
    "0.06250",
    0,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 1그룹 (무제한)",
    "0.15000",
    1,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 2그룹 (무제한)",
    "0.32500",
    2,
    "초월",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "0.28571",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "0.40000",
    4,
    "유니크",
    "weapon"
   ],
   [
    "초월 클래스 1그룹 (무제한)",
    "0.03750",
    5,
    "초월",
    "class"
   ],
   [
    "초월 클래스 2그룹 (무제한)",
    "0.05625",
    6,
    "초월",
    "class"
   ],
   [
    "좀비 스킨 (무제한)",
    "0.25000",
    7,
    "기타",
    "etc"
   ],
   [
    "클래스 (무제한)",
    "0.32143",
    8,
    "클래스",
    "class"
   ],
   [
    "코스튬 (무제한)",
    "0.28571",
    9,
    "기타",
    "etc"
   ],
   [
    "레어 무기 (무제한)",
    "0.21970",
    10,
    "레어",
    "weapon"
   ],
   [
    "초월 해독기 미등장 그룹 (무제한)",
    "0.12500",
    11,
    "초월",
    "weapon"
   ],
   [
    "유니크/레어 해독기 미등장 그룹 (무제한)",
    "0.01235",
    12,
    "유니크",
    "weapon"
   ],
   [
    "클래스 해독기 미등장 그룹 (무제한)",
    "0.18182",
    13,
    "클래스",
    "class"
   ],
   [
    "대기실 마크 (무제한)",
    "0.33333",
    14,
    "기타",
    "etc"
   ],
   [
    "코스튬 (무제한)",
    "0.29545",
    15,
    "기타",
    "etc"
   ],
   [
    "초월 1그룹/클래스 1그룹 기간제 (30일)",
    "0.57692",
    16,
    "초월",
    "mixed"
   ],
   [
    "초월 1그룹/클래스 1그룹 기간제 (10일)",
    "0.75000",
    17,
    "초월",
    "mixed"
   ]
  ]
 },
 {
  "id": 9615,
  "name": "PC방 해독기",
  "rows": [
   [
    "초월 2차 재판매 그룹 (무제한)",
    "0.00625",
    0,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 1그룹 (무제한)",
    "0.01500",
    1,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 2그룹 (무제한)",
    "0.03250",
    2,
    "초월",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "0.02857",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "0.04000",
    4,
    "유니크",
    "weapon"
   ],
   [
    "초월 클래스 1그룹 (무제한)",
    "0.00375",
    5,
    "초월",
    "class"
   ],
   [
    "초월 클래스 2그룹 (무제한)",
    "0.00563",
    6,
    "초월",
    "class"
   ],
   [
    "좀비 스킨 (무제한)",
    "0.02500",
    7,
    "기타",
    "etc"
   ],
   [
    "클래스 (무제한)",
    "0.03214",
    8,
    "클래스",
    "class"
   ],
   [
    "코스튬 (무제한)",
    "0.02857",
    9,
    "기타",
    "etc"
   ],
   [
    "레어 무기 (무제한)",
    "0.02197",
    10,
    "레어",
    "weapon"
   ],
   [
    "초월 해독기 미등장 그룹 (무제한)",
    "0.01250",
    11,
    "초월",
    "weapon"
   ],
   [
    "유니크/레어 해독기 미등장 그룹 (무제한)",
    "0.00123",
    12,
    "유니크",
    "weapon"
   ],
   [
    "클래스 해독기 미등장 그룹 (무제한)",
    "0.01818",
    13,
    "클래스",
    "class"
   ],
   [
    "대기실 마크 (무제한)",
    "0.03333",
    14,
    "기타",
    "etc"
   ],
   [
    "코스튬 (무제한)",
    "0.02955",
    15,
    "기타",
    "etc"
   ],
   [
    "초월 1그룹/클래스 1그룹 기간제 (30일)",
    "3.07692",
    16,
    "초월",
    "mixed"
   ],
   [
    "초월 1그룹/클래스 1그룹 기간제 (10일)",
    "3.97885",
    17,
    "초월",
    "mixed"
   ]
  ]
 },
 {
  "id": 9330,
  "name": "[ZHC] 고급 암호 해독기",
  "rows": [
   [
    "[ZHC] 이벤트",
    "1.00000",
    18,
    "ZHC",
    "etc"
   ],
   [
    "[ZHC] 무제한",
    "0.05094",
    19,
    "ZHC",
    "weapon"
   ],
   [
    "[ZHC] 기간제 (3일)",
    "0.72075",
    20,
    "ZHC",
    "weapon"
   ],
   [
    "[ZHC] 기간제 (1일)",
    "1.09623",
    21,
    "ZHC",
    "weapon"
   ]
  ]
 },
 {
  "id": 9084,
  "name": "도색도안 해독기",
  "rows": [
   [
    "도색도안 1그룹",
    "2.17391",
    22,
    "기타",
    "etc"
   ],
   [
    "도색도안 2그룹",
    "1.85185",
    23,
    "기타",
    "etc"
   ]
  ]
 },
 {
  "id": 8453,
  "name": "이벤트 해독기",
  "rows": [
   [
    "초월 무기 1그룹 (무제한)",
    "0.15000",
    1,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 2그룹 (무제한)",
    "0.32500",
    2,
    "초월",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "0.28571",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "0.40000",
    4,
    "유니크",
    "weapon"
   ],
   [
    "초월 클래스 1그룹 (무제한)",
    "0.03750",
    5,
    "초월",
    "class"
   ],
   [
    "초월 클래스 2그룹 (무제한)",
    "0.05625",
    6,
    "초월",
    "class"
   ],
   [
    "좀비 스킨 (무제한)",
    "0.25000",
    7,
    "기타",
    "etc"
   ],
   [
    "클래스 (무제한)",
    "0.32143",
    8,
    "클래스",
    "class"
   ],
   [
    "코스튬 (무제한)",
    "0.28571",
    9,
    "기타",
    "etc"
   ],
   [
    "레어 무기 (무제한)",
    "0.21970",
    10,
    "레어",
    "weapon"
   ],
   [
    "초월 해독기 미등장 그룹 (무제한)",
    "0.12500",
    11,
    "초월",
    "weapon"
   ],
   [
    "유니크/레어 해독기 미등장 그룹 (무제한)",
    "0.01235",
    12,
    "유니크",
    "weapon"
   ],
   [
    "클래스 해독기 미등장 그룹 (무제한)",
    "0.18182",
    13,
    "클래스",
    "class"
   ],
   [
    "대기실 마크 (무제한)",
    "0.33333",
    14,
    "기타",
    "etc"
   ],
   [
    "코스튬 (무제한)",
    "0.29545",
    15,
    "기타",
    "etc"
   ],
   [
    "초월 1그룹/클래스 1그룹 기간제 (30일)",
    "0.57692",
    16,
    "초월",
    "mixed"
   ],
   [
    "초월 1그룹/클래스 1그룹 기간제 (10일)",
    "0.76923",
    17,
    "초월",
    "mixed"
   ]
  ]
 },
 {
  "id": 985,
  "name": "클래스 Top.30 해독기",
  "rows": [
   [
    "Top.30",
    "0.75000",
    24,
    "클래스",
    "class"
   ],
   [
    "코스튬 (좀비)",
    "1.00000",
    25,
    "기타",
    "etc"
   ],
   [
    "코스튬 (인간)",
    "1.18750",
    26,
    "기타",
    "etc"
   ],
   [
    "코스튬 (인간)",
    "4.45833",
    27,
    "기타",
    "etc"
   ]
  ]
 },
 {
  "id": 957,
  "name": "Top.50 무제한 확정 해독기",
  "rows": [
   [
    "Top.7",
    "1.00000",
    28,
    "Top",
    "weapon"
   ],
   [
    "Top.25",
    "1.55556",
    29,
    "Top",
    "weapon"
   ],
   [
    "Top.50",
    "2.60000",
    30,
    "Top",
    "weapon"
   ]
  ]
 },
 {
  "id": 956,
  "name": "Top.50 해독기",
  "rows": [
   [
    "Top.7",
    "0.15000",
    28,
    "Top",
    "weapon"
   ],
   [
    "Top.25",
    "0.23333",
    29,
    "Top",
    "weapon"
   ],
   [
    "Top.50",
    "0.39000",
    30,
    "Top",
    "weapon"
   ],
   [
    "브랜드 Top.30",
    "0.83333",
    31,
    "Top",
    "weapon"
   ],
   [
    "브랜드 Top.30",
    "2.00000",
    32,
    "Top",
    "weapon"
   ]
  ]
 },
 {
  "id": 8311,
  "name": "클래스 해독기",
  "rows": [
   [
    "로테이션 (무제한)",
    "0.18750",
    33,
    "클래스",
    "class"
   ],
   [
    "초월 클래스 1그룹 (무제한)",
    "0.06250",
    5,
    "초월",
    "class"
   ],
   [
    "초월 클래스 2그룹 (무제한)",
    "0.09375",
    6,
    "초월",
    "class"
   ],
   [
    "좀비 스킨 (무제한)",
    "0.62500",
    7,
    "기타",
    "etc"
   ],
   [
    "클래스 (무제한)",
    "0.21429",
    8,
    "클래스",
    "class"
   ],
   [
    "코스튬 (무제한)",
    "0.28571",
    9,
    "기타",
    "etc"
   ],
   [
    "초월 클래스 1그룹 (30일)",
    "0.78000",
    34,
    "초월",
    "class"
   ],
   [
    "초월 클래스 2그룹 (30일)",
    "3.27000",
    35,
    "초월",
    "class"
   ],
   [
    "좀비 스킨 (30일)",
    "4.87500",
    36,
    "기타",
    "etc"
   ],
   [
    "클래스 (30일)",
    "0.69643",
    37,
    "클래스",
    "class"
   ],
   [
    "코스튬 (30일)",
    "0.36071",
    38,
    "기타",
    "etc"
   ]
  ]
 },
 {
  "id": 8312,
  "name": "클래스 프리미엄 해독기",
  "rows": [
   [
    "초월 클래스 1그룹 (무제한)",
    "0.25000",
    5,
    "초월",
    "class"
   ],
   [
    "초월 클래스 2그룹 (무제한)",
    "0.37500",
    6,
    "초월",
    "class"
   ],
   [
    "좀비 스킨 (무제한)",
    "2.50000",
    7,
    "기타",
    "etc"
   ],
   [
    "클래스 (무제한)",
    "1.75000",
    8,
    "클래스",
    "class"
   ],
   [
    "코스튬 (무제한)",
    "1.28571",
    9,
    "기타",
    "etc"
   ]
  ]
 },
 {
  "id": 8310,
  "name": "레어 해독기",
  "rows": [
   [
    "레어 무기 (무제한)",
    "0.01961",
    39,
    "레어",
    "weapon"
   ],
   [
    "고급 무기 (무제한)",
    "0.04857",
    40,
    "고급",
    "weapon"
   ],
   [
    "일반 무기 (무제한)",
    "0.05455",
    41,
    "일반",
    "weapon"
   ],
   [
    "레어 무기 (100일)",
    "0.78431",
    42,
    "레어",
    "weapon"
   ],
   [
    "고급 무기 (100일)",
    "0.64286",
    43,
    "고급",
    "weapon"
   ],
   [
    "일반 무기 (100일)",
    "0.90909",
    44,
    "일반",
    "weapon"
   ]
  ]
 },
 {
  "id": 8308,
  "name": "유니크 해독기",
  "rows": [
   [
    "프로모션 (무제한)",
    "0.56000",
    45,
    "유니크",
    "weapon"
   ],
   [
    "프로모션 (무제한)",
    "0.03667",
    46,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 개조 그룹 (무제한)",
    "0.20000",
    47,
    "유니크",
    "weapon"
   ],
   [
    "레어 무기 개조 그룹 (무제한)",
    "0.50000",
    48,
    "레어",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "0.21429",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "0.33333",
    4,
    "유니크",
    "weapon"
   ],
   [
    "스페셜 무기(무제한)",
    "0.20000",
    49,
    "유니크",
    "weapon"
   ],
   [
    "레어 무기 (무제한)",
    "0.19608",
    39,
    "레어",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (30일)",
    "0.71429",
    50,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (30일)",
    "0.66667",
    51,
    "유니크",
    "weapon"
   ],
   [
    "레어 무기 (30일)",
    "0.47059",
    52,
    "레어",
    "weapon"
   ],
   [
    "고급 무기 (30일)",
    "0.46186",
    53,
    "고급",
    "weapon"
   ]
  ]
 },
 {
  "id": 8309,
  "name": "유니크 프리미엄 해독기",
  "rows": [
   [
    "프로모션 (무제한)",
    "2.80000",
    45,
    "유니크",
    "weapon"
   ],
   [
    "프로모션 (무제한)",
    "0.18667",
    46,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 개조 그룹 (무제한)",
    "1.00000",
    47,
    "유니크",
    "weapon"
   ],
   [
    "레어 무기 개조 그룹 (무제한)",
    "2.50000",
    48,
    "레어",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "1.07143",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "1.66667",
    4,
    "유니크",
    "weapon"
   ],
   [
    "스페셜 무기(무제한)",
    "1.00000",
    49,
    "유니크",
    "weapon"
   ],
   [
    "레어 무기 (무제한)",
    "0.62039",
    39,
    "레어",
    "weapon"
   ]
  ]
 },
 {
  "id": 8292,
  "name": "초월 해독기",
  "rows": [
   [
    "프로모션 (무제한)",
    "0.45000",
    54,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 1그룹 (무제한)",
    "0.15000",
    1,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 2그룹 (무제한)",
    "0.32500",
    2,
    "초월",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "0.28571",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "0.40000",
    4,
    "유니크",
    "weapon"
   ],
   [
    "초월 무기 (30일)",
    "2.29667",
    55,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 (10일)",
    "1.33333",
    56,
    "초월",
    "weapon"
   ],
   [
    "유니크 무기 (30일)",
    "0.68966",
    57,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 (10일)",
    "0.38276",
    58,
    "유니크",
    "weapon"
   ]
  ]
 },
 {
  "id": 8293,
  "name": "초월 프리미엄 해독기",
  "rows": [
   [
    "프로모션 (무제한)",
    "3.00000",
    54,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 1그룹 (무제한)",
    "1.00000",
    1,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 2그룹 (무제한)",
    "2.30000",
    2,
    "초월",
    "weapon"
   ],
   [
    "유니크 무기 1그룹 (무제한)",
    "2.14286",
    3,
    "유니크",
    "weapon"
   ],
   [
    "유니크 무기 2그룹 (무제한)",
    "2.60000",
    4,
    "유니크",
    "weapon"
   ]
  ]
 },
 {
  "id": 2599,
  "name": "에픽 해독기",
  "rows": [
   [
    "에픽 무기 프로모션",
    "0.17500",
    59,
    "에픽",
    "weapon"
   ],
   [
    "프로모션 (무제한)",
    "0.13175",
    60,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 1그룹 (무제한)",
    "0.80000",
    1,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 2그룹 (무제한)",
    "0.60000",
    2,
    "초월",
    "weapon"
   ],
   [
    "초월 무기 (30일)",
    "5.94153",
    61,
    "초월",
    "weapon"
   ]
  ]
 }
];
const IMAGES = {
"AK47 팔라딘": [
"weapons/ak47paladin.webp",
"6/68/Ak47paladin.png"
],
"ARX-160": [
"weapons/arx160.webp",
"b/bd/Arx160.png"
],
"AS50": [
"weapons/as50.webp",
"a/a2/As50.png"
],
"AT4CS": [
"weapons/at4ex.webp",
"1/13/At4ex.png"
],
"AUG 가디언": [
"weapons/buffaug.webp",
"1/1f/Buffaug.png"
],
"AWP-Z": [
"weapons/awpz.webp",
"a/ae/Awpz.png"
],
"BALROG-I": [
"weapons/balrog1.webp",
"2/2c/Balrog1.png"
],
"BALROG-IX": [
"weapons/balrog9.webp",
"d/d8/Balrog9.png"
],
"BALROG-V": [
"weapons/balrog5.webp",
"d/d5/Balrog5.png"
],
"BALROG-VII": [
"weapons/balrog7.webp",
"b/b8/Balrog7.png"
],
"BALROG-XI": [
"weapons/balrogxi.webp",
"d/dc/BalrogXI.png"
],
"BALROG-Ⅲ": [
"weapons/balrog3.webp",
"f/f4/Balrog3.png"
],
"BOUNCER": [
"weapons/bouncer.webp",
"f/f5/Bouncer.png"
],
"Bunker Buster LTD": [
"weapons/bunkerbuster.webp",
"8/86/Bunkerbuster.png"
],
"CHARGER-5": [
"weapons/charger5.webp",
"2/28/Charger5.png"
],
"CHARGER-7": [
"weapons/charger7.webp",
"c/ce/Charger7.png"
],
"CROW-1": [
"weapons/crow1.webp",
"5/59/Crow1.png"
],
"CROW-11": [
"weapons/crow11.webp",
"2/25/Crow11.png"
],
"CROW-3": [
"weapons/crow3.webp",
"f/f1/Crow3.png"
],
"CROW-5": [
"weapons/crow5.webp",
"2/2f/Crow5.png"
],
"CROW-7": [
"weapons/crow7.webp",
"b/be/Crow7.png"
],
"CROW-9": [
"weapons/crow9.webp",
"0/05/Crow9.png"
],
"Claymore Mine MDS": [
"weapons/claymore.webp",
"0/0c/Claymore.png"
],
"D.Eagle 크림슨헌터": [
"weapons/bloodhunter.webp",
"3/39/Bloodhunter.png"
],
"DESTROYER": [
"weapons/destroyer_icon.webp",
"5/5d/Destroyer_icon.png"
],
"F2000": [
"weapons/f2000_gfx.webp",
"4/49/F2000_gfx.png"
],
"FG 런처": [
"weapons/fg-launcher.webp",
"e/ea/FG-Launcher.png"
],
"FNP-45": [
"weapons/fnp45.webp",
"e/ea/Fnp45.png"
],
"Falcon": [
"weapons/falcon.webp",
"0/06/Falcon.png"
],
"GROZA": [
"weapons/groza.webp",
"1/13/Groza.png"
],
"HK G11": [
"weapons/g11.webp",
"f/f2/G11.png"
],
"HK G11 골드 에디션": [
"weapons/g11g.webp",
"0/07/G11g.png"
],
"HK121": [
"weapons/hk121_icon.webp",
"e/e5/Hk121_icon.png"
],
"HK121 커스텀": [
"weapons/hk121ex_icon.webp",
"3/33/Hk121ex_icon.png"
],
"HK23E 경기관총": [
"weapons/hk23_gfx.webp",
"c/c3/Hk23_gfx.png"
],
"Hecate II": [
"weapons/pgm.webp",
"6/61/Pgm.png"
],
"JANUS-1": [
"weapons/janus1.webp",
"c/c1/Janus1.png"
],
"JANUS-11": [
"weapons/janus11.webp",
"1/1c/Janus11.png"
],
"JANUS-3": [
"weapons/janus3.webp",
"8/8b/Janus3.png"
],
"JANUS-5": [
"weapons/janus-5.webp",
"c/c9/Janus-5.png"
],
"JANUS-7": [
"weapons/janus7_icon.webp",
"3/38/JANUS7_icon.png"
],
"JANUS-9": [
"weapons/janus9.webp",
"c/c7/Janus9.png"
],
"K1A 매버릭": [
"weapons/k1a_maverick.webp",
"3/30/K1a_maverick.png"
],
"K1A 스페셜 에디션": [
"weapons/k1ase_gfx.webp",
"a/a6/K1ase_gfx.png"
],
"KH-2002": [
"weapons/kh2002.webp",
"7/79/Kh2002.png"
],
"KSG12": [
"weapons/ksg12.webp",
"a/ad/Ksg12.png"
],
"M1 개런드": [
"weapons/m1garand.webp",
"b/bf/M1garand.png"
],
"M134 미니건": [
"weapons/m134_gfx.webp",
"9/9e/M134_gfx.png"
],
"M134 크리스마스 에디션": [
"weapons/m134_xmas.webp",
"d/d2/M134_xmas.png"
],
"M14 EBR": [
"weapons/m14ebr.webp",
"1/13/M14ebr.png"
],
"M1887 매버릭": [
"weapons/m1887_maverick.webp",
"f/f2/M1887_maverick.png"
],
"M1911 A1": [
"weapons/m1911a1.webp",
"b/b2/M1911a1.png"
],
"M1918 BAR": [
"weapons/m1918bar.webp",
"1/1c/M1918bar.png"
],
"M2": [
"weapons/m2_icon_gfx.webp",
"d/d8/M2_icon_gfx.png"
],
"M24": [
"weapons/m24_gfx.webp",
"3/32/M24_gfx.png"
],
"M249 피닉스": [
"weapons/buffm249.webp",
"c/ca/Buffm249.png"
],
"M3 블랙 드래곤": [
"weapons/buffm3.webp",
"e/e7/BuffM3.png"
],
"M32 MGL": [
"weapons/m32.webp",
"c/c8/M32.png"
],
"M32 MGL 베놈": [
"weapons/m32venom.webp",
"d/d7/M32venom.png"
],
"M4A1 다크나이트": [
"weapons/m4a1darkknight.webp",
"5/56/M4a1darkknight.png"
],
"M4A1 스코프": [
"weapons/m4a1scope_icon.webp",
"2/23/M4a1scope_icon.png"
],
"M60E4": [
"weapons/m60.webp",
"2/2a/M60.png"
],
"M60E4 매버릭": [
"weapons/maverick_m60e4.webp",
"0/03/Maverick_m60e4.png"
],
"M79 소드오프": [
"weapons/m79_icon.webp",
"f/f0/M79_icon.png"
],
"M79 소드오프 골드": [
"weapons/m79_gold.webp",
"c/c4/M79_gold.png"
],
"M95 크리스마스 에디션": [
"weapons/m95_xmas.webp",
"d/de/M95_xmas.png"
],
"M950": [
"weapons/m950.webp",
"f/fb/M950.png"
],
"MG3": [
"weapons/mg3.webp",
"1/12/Mg3.png"
],
"MG3 크리스마스 에디션": [
"weapons/mg3_xmas.webp",
"d/da/Mg3_xmas.png"
],
"MG36": [
"weapons/mg36_gfx.webp",
"b/b5/Mg36_gfx.png"
],
"MG36 크리스마스 에디션": [
"weapons/mg36xmas.webp",
"6/65/Mg36xmas.png"
],
"MG42": [
"weapons/mg42.webp",
"e/ec/Mg42.png"
],
"MK48": [
"weapons/mk48.webp",
"6/6a/Mk48.png"
],
"MP40": [
"weapons/mp40.webp",
"0/03/Mp40.png"
],
"MP5 골드에디션": [
"weapons/mp5g_gfx.webp",
"d/d8/Mp5g_gfx.png"
],
"MP7A1 확장 탄창": [
"weapons/mp7a160r.webp",
"3/38/Mp7a160r.png"
],
"NEGEV NG7": [
"weapons/ng7.webp",
"b/bf/Ng7.png"
],
"NEGEV NG7 아이아스": [
"weapons/buffng7.webp",
"a/ac/Buffng7.png"
],
"Norinco Type 86s": [
"weapons/norinco86s.webp",
"e/e4/Norinco86s.png"
],
"OICW": [
"weapons/oicw.webp",
"c/cc/Oicw.png"
],
"PKM": [
"weapons/pkm.webp",
"4/40/Pkm.png"
],
"PP-19 Bizon": [
"weapons/bison.webp",
"f/f6/Bison.png"
],
"PP-2000": [
"weapons/pp2000.webp",
"1/19/Pp2000.png"
],
"PSG-1": [
"weapons/psg1.webp",
"2/2c/Psg1.png"
],
"QBB95 + 추가 탄창": [
"weapons/qbb95ex_icon.webp",
"c/ca/Qbb95ex_icon.png"
],
"QBS-09": [
"weapons/qbs09.webp",
"5/51/Qbs09.png"
],
"QBZ95B": [
"weapons/qbz95b.webp",
"c/c9/Qbz95b.png"
],
"RPG-7": [
"weapons/rpg7.webp",
"e/eb/Rpg7.png"
],
"SG552 라이칸스로프": [
"weapons/sg552buff.webp",
"3/38/Sg552buff.png"
],
"SKULL-1": [
"weapons/skull1.webp",
"f/ff/Skull1.png"
],
"SKULL-11": [
"weapons/skul_11_copy.webp",
"c/cd/Skul_11_copy.png"
],
"SKULL-3": [
"weapons/skull3.webp",
"0/03/Skull3.png"
],
"SKULL-4": [
"weapons/skull4.webp",
"4/4c/Skull4.png"
],
"SKULL-5": [
"weapons/skull5.webp",
"8/80/Skull5.png"
],
"SKULL-6": [
"weapons/skull6_icon.webp",
"c/cb/Skull6_icon.png"
],
"SKULL-7": [
"weapons/m249ex_gfx.webp",
"0/0c/M249ex_gfx.png"
],
"SKULL-8": [
"weapons/skull8.webp",
"4/49/Skull8.png"
],
"SKULL-9": [
"weapons/skullaxe_gfx.webp",
"8/83/Skullaxe_gfx.png"
],
"SL8": [
"weapons/icon_sl8_cso.webp",
"6/67/Icon_sl8_cso.png"
],
"SL8 커스텀": [
"weapons/sl8ex.webp",
"7/78/Sl8ex.png"
],
"SPAS-12": [
"weapons/spas12.webp",
"6/68/Spas12.png"
],
"SPAS-12 디럭스": [
"weapons/spas12ex.webp",
"4/4c/Spas12ex.png"
],
"SPAS12 매버릭": [
"weapons/maverick_spas12.webp",
"b/bb/Maverick_spas12.png"
],
"Special Duck Foot Gun": [
"weapons/specialduckfootgun.webp",
"d/d0/Specialduckfootgun.png"
],
"StG44": [
"weapons/stg44.webp",
"6/62/Stg44.png"
],
"Sten Mk2": [
"weapons/stenmk2.webp",
"e/e5/Stenmk2.png"
],
"Sterling Bayonet": [
"weapons/sterlingbayonet.webp",
"b/b6/Sterlingbayonet.png"
],
"TAR-21": [
"weapons/tar21_icon.webp",
"7/7d/Tar21_icon.png"
],
"THANATOS-1": [
"weapons/thanatos1.webp",
"f/f3/Thanatos1.png"
],
"THANATOS-11": [
"weapons/thanatos11.webp",
"e/e3/Thanatos11.png"
],
"THANATOS-3": [
"weapons/thanatos3.webp",
"6/68/Thanatos3.png"
],
"THANATOS-5": [
"weapons/thanatos5.webp",
"1/11/Thanatos5.png"
],
"THANATOS-7": [
"weapons/thanatos7.webp",
"5/57/Thanatos7.png"
],
"THANATOS-9": [
"weapons/thanatos9.webp",
"2/25/Thanatos9.png"
],
"TRG-42": [
"weapons/trg42.webp",
"c/cd/Trg42.png"
],
"TURBULENT-1": [
"weapons/turbulent1.webp",
"b/b9/Turbulent1.png"
],
"TURBULENT-11": [
"weapons/turbulent-11.webp",
"a/ae/TURBULENT-11.png"
],
"TURBULENT-3": [
"weapons/turbulent3.webp",
"8/82/Turbulent3.png"
],
"TURBULENT-5": [
"weapons/turbulent5.webp",
"4/4e/Turbulent5.png"
],
"TURBULENT-7": [
"weapons/turbulent7.webp",
"0/0b/Turbulent7.png"
],
"TURBULENT-9": [
"weapons/turbulent9.webp",
"e/e1/Turbulent9.png"
],
"ULTIMAX-100": [
"weapons/ultimax100.webp",
"f/fa/Ultimax100.png"
],
"UMP45 스네이크": [
"weapons/ump45snake.webp",
"8/88/Ump45snake.png"
],
"UTS-15": [
"weapons/uts15.webp",
"b/bd/Uts15.png"
],
"UZI": [
"weapons/uzi.webp",
"9/98/Uzi.png"
],
"VICTORY 독일": [
"weapons/mg3germany.webp",
"c/c6/Mg3germany.png"
],
"VICTORY 러시아": [
"weapons/mg3russia.webp",
"e/e7/Mg3russia.png"
],
"VICTORY 미국": [
"weapons/mg3usa.webp",
"1/17/Mg3usa.png"
],
"VICTORY 인도네시아": [
"weapons/mg3indonesia.webp",
"b/b5/Mg3indonesia.png"
],
"VICTORY 일본": [
"weapons/mg3japan.webp",
"3/3d/Mg3japan.png"
],
"VICTORY 중국": [
"weapons/mg3china.webp",
"7/71/Mg3china.png"
],
"VICTORY 캐나다": [
"weapons/mg3canada.webp",
"1/1b/Mg3canada.png"
],
"VICTORY 터키": [
"weapons/mg3turkey.webp",
"7/75/Mg3turkey.png"
],
"VICTORY 한국": [
"weapons/mg3korea.webp",
"a/a8/Mg3korea.png"
],
"VULCANUS-1": [
"weapons/vulcanus1.webp",
"7/75/Vulcanus1.png"
],
"VULCANUS-11": [
"weapons/vulcanus11.webp",
"a/a4/Vulcanus11.png"
],
"VULCANUS-3": [
"weapons/vulcanus3.webp",
"b/b2/Vulcanus3.png"
],
"VULCANUS-5": [
"weapons/vulcanus5icon.webp",
"0/0b/Vulcanus5icon.PNG"
],
"VULCANUS-7": [
"weapons/vulcanus7.webp",
"c/cc/Vulcanus7.png"
],
"VULCANUS-9": [
"weapons/vulcanus9.webp",
"c/cb/Vulcanus9.png"
],
"X-TRACKER": [
"weapons/xtracker.webp",
"2/24/Xtracker.png"
],
"XM2010": [
"weapons/xm2010.webp",
"f/fc/Xm2010.png"
],
"갈릴 매버릭": [
"weapons/galil_maverick.webp",
"9/99/Galil_maverick.png"
],
"게이볼그": [
"weapons/speargun.webp",
"4/4a/Speargun.png"
],
"길보아 바이퍼": [
"weapons/viperboa.webp",
"f/fd/Viperboa.png"
],
"길보아 카빈": [
"weapons/gilboa.webp",
"b/b4/Gilboa.png"
],
"노아스 Ⅰ": [
"weapons/noah1.webp",
"9/93/Noah1.png"
],
"노아스 Ⅱ": [
"weapons/noah1.webp",
"9/93/Noah1.png"
],
"뉴커먼": [
"weapons/newcomen.webp",
"8/8e/Newcomen.png"
],
"다오 수류탄": [
"weapons/cartfrag.webp",
"6/60/Cartfrag.png"
],
"다트 피스톨": [
"weapons/dartgun.webp",
"c/c3/Dartgun.png"
],
"더블 택티컬 나이프": [
"weapons/tknifeex.webp",
"9/9e/Tknifeex.png"
],
"더블바렐 샷건": [
"weapons/dbarrel_gfx.webp",
"5/5d/Dbarrel_gfx.png"
],
"데모닉 바이퍼": [
"weapons/frostbiteex.webp",
"e/e6/Frostbiteex.png"
],
"데바스테이터": [
"weapons/buffm2.webp",
"a/a1/Buffm2.png"
],
"데스 이터": [
"weapons/death_eater.webp",
"a/ad/Death_eater.png"
],
"데저트 이글 50C 골드에디션": [
"weapons/deserteagleg.webp",
"6/6c/Deserteagleg.png"
],
"듀얼 MP7A1": [
"weapons/mp7a1d.webp",
"3/3d/Mp7a1d.png"
],
"듀얼 UZI": [
"weapons/dualuzi.webp",
"9/98/Dualuzi.png"
],
"듀얼 베레타 건슬링거": [
"weapons/gunslinger.webp",
"c/c2/Gunslinger.png"
],
"듀얼 인피니티": [
"weapons/dualinfinity_gfx.webp",
"d/df/Dualinfinity_gfx.png"
],
"듀얼 인피니티 커스텀": [
"weapons/infinityex1_gfx.webp",
"9/98/Infinityex1_gfx.png"
],
"듀얼 인피니티 파이널": [
"weapons/infinityex2_gfx.webp",
"f/f8/Infinityex2_gfx.png"
],
"듀얼 크리스": [
"weapons/dualkriss.webp",
"0/00/Dualkriss.png"
],
"듀얼소드 팬텀 슬레이어": [
"weapons/dualswordphantomslayer.webp",
"f/f2/Dualswordphantomslayer.png"
],
"드라카르 Ⅲ": [
"weapons/drakar3.webp",
"2/2a/Drakar3.png"
],
"드래곤클로": [
"weapons/dragontail.webp",
"1/14/Dragontail.png"
],
"디바인 록": [
"weapons/musket.webp",
"2/2b/Musket.png"
],
"라이트닝 다오-1": [
"weapons/cartblues.webp",
"e/eb/Cartblues.png"
],
"라이트닝 레일": [
"weapons/lightningrail.webp",
"a/a3/Lightningrail.png"
],
"라이트닝 배찌-1": [
"weapons/cartreds.webp",
"a/a9/Cartreds.png"
],
"라이트닝 퓨리": [
"weapons/lightning_fury.webp",
"9/97/Lightning_fury.png"
],
"락 브레이커": [
"weapons/rockbreaker.webp",
"8/86/Rockbreaker.png"
],
"레바테인": [
"weapons/laevateinn.webp",
"7/77/Laevateinn.png"
],
"레비아탄": [
"weapons/watercannon.webp",
"e/e6/Watercannon.png"
],
"레이저 미니건": [
"weapons/laserminigun.webp",
"7/78/Laserminigun.png"
],
"레일 버스터": [
"weapons/railbuster.webp",
"2/2b/Railbuster.png"
],
"레일캐논": [
"weapons/railcannon.webp",
"c/c2/Railcannon.png"
],
"리코일 블리츠 T1": [
"weapons/recoil_blitz_t1.webp",
"5/53/Recoil_blitz_t1.png"
],
"리퍼": [
"weapons/chainsaw.webp",
"c/cc/Chainsaw.png"
],
"마우저C96 쉬넬페우어": [
"weapons/mauserc96.webp",
"e/ee/Mauserc96.png"
],
"마창 스칼렛 로즈": [
"weapons/demonic_scarlet_rose.webp",
"5/57/Demonic_scarlet_rose.png"
],
"마체테": [
"weapons/machete.webp",
"0/0c/Machete.png"
],
"매그넘 드릴": [
"weapons/magnumdrill.webp",
"0/02/MagnumDrill.png"
],
"매그넘 런처": [
"weapons/sgmissile.webp",
"1/13/Sgmissile.png"
],
"맹독 살포기": [
"weapons/pesticidesprayer.webp",
"4/4b/Pesticidesprayer.png"
],
"모신나강 스코프": [
"weapons/mosin.webp",
"9/9d/Mosin.png"
],
"무라사메 Ⅰ": [
"weapons/murasame1.webp",
"3/33/Murasame1.png"
],
"무라사메 Ⅱ": [
"weapons/murasame1.webp",
"3/33/Murasame1.png"
],
"무라사메 Ⅴ": [
"weapons/murasame1.webp",
"3/33/Murasame1.png"
],
"미라클 프리즘 소드": [
"weapons/magicknife.webp",
"3/3e/Magicknife.png"
],
"바렛 M95": [
"weapons/m95_gfx.webp",
"6/6e/M95_gfx.png"
],
"바렛 M95 화이트 타이거": [
"weapons/buffm95.webp",
"1/1a/Buffm95.png"
],
"바이퍼 팽 T1": [
"weapons/viper_fang_t1.webp",
"c/c1/Viper_Fang_T1.png"
],
"바이퍼 팽 T2": [
"weapons/viper_fang_t1.webp",
"c/c1/Viper_Fang_T1.png"
],
"바티스타": [
"weapons/batista.webp",
"5/56/Batista.png"
],
"배틀 FNP-45": [
"weapons/bfnp45.webp",
"b/b0/Bfnp45.png"
],
"배틀 Hecate II": [
"weapons/bpgm.webp",
"b/bd/Bpgm.png"
],
"배틀 MP5": [
"weapons/bmp5.webp",
"e/e1/Bmp5.png"
],
"배틀 NEGEV NG7": [
"weapons/bng7.webp",
"2/2b/Bng7.png"
],
"배틀 PP-19 Bizon": [
"weapons/bbison.webp",
"0/0d/Bbison.png"
],
"배틀 QBB95": [
"weapons/bqbb95.webp",
"3/3f/Bqbb95.png"
],
"배틀 QBS-09": [
"weapons/bqbs09.webp",
"d/de/Bqbs09.png"
],
"배틀 ULTIMAX-100": [
"weapons/bultimax100.webp",
"7/74/Bultimax100.png"
],
"배틀 USP45": [
"weapons/busp45.webp",
"0/08/Busp45.png"
],
"배틀 갈릴": [
"weapons/bgalil.webp",
"f/ff/Bgalil.png"
],
"배틀 글록 18C": [
"weapons/bglock18.webp",
"7/70/Bglock18.png"
],
"배틀 잭 해머": [
"weapons/bmk3a1.webp",
"e/ec/Bmk3a1.png"
],
"배틀 파마스": [
"weapons/bfamas.webp",
"0/0a/Bfamas.png"
],
"배틀 파이슨": [
"weapons/bpython.webp",
"9/9d/Bpython.png"
],
"배틀 헌팅대거": [
"weapons/bhdagger.webp",
"0/0d/Bhdagger.png"
],
"버닝 AUG": [
"weapons/burningaug.webp",
"a/af/Burningaug.png"
],
"벤디타": [
"weapons/bandita.webp",
"2/2b/Bandita.png"
],
"볼케이노": [
"weapons/gatling.webp",
"7/7c/Gatling.png"
],
"브로드 디바인": [
"weapons/mg3holy.webp",
"7/75/Mg3holy.png"
],
"브릭피스M777": [
"weapons/blockas.webp",
"3/31/Blockas.png"
],
"브릭피스S1451": [
"weapons/blocksmg.webp",
"2/22/Blocksmg.png"
],
"브릭피스T50": [
"weapons/blockmg.webp",
"d/d0/Blockmg.png"
],
"브릭피스V2": [
"weapons/blockar_gfx.webp",
"4/48/Blockar_gfx.png"
],
"블래스터": [
"weapons/sfgun.webp",
"a/a9/Sfgun.png"
],
"블랙워터 T1": [
"weapons/blackwater_t1.webp",
"a/a0/Blackwater_t1.png"
],
"블레이드 룬브레이커": [
"weapons/runeblade.webp",
"f/f8/Runeblade.png"
],
"빔 소드": [
"weapons/lightsaber.webp",
"4/49/Lightsaber.png"
],
"사복검": [
"weapons/plain_sword.webp",
"a/aa/Plain_sword.png"
],
"사염검": [
"weapons/snake_sword.webp",
"b/bd/Snake_sword.png"
],
"사이킥 하모니움": [
"weapons/pianogun.webp",
"f/f0/Pianogun.png"
],
"사피엔시아": [
"weapons/sapientia.webp",
"8/8e/Sapientia.png"
],
"새틀라이트 마인": [
"weapons/sbmine.webp",
"f/f8/Sbmine.png"
],
"샐러맨더": [
"weapons/salamander.webp",
"5/53/Salamander.png"
],
"샤이닝 하트 로드": [
"weapons/shining_heart_rod.webp",
"3/3a/Shining_heart_rod.png"
],
"세이버리": [
"weapons/savery_rifle_icon.webp",
"e/e6/Savery_rifle_icon.png"
],
"슈팅 스타": [
"weapons/firecracker_gfx.webp",
"4/4f/Firecracker_gfx.png"
],
"스타라이트 롤링 슈터": [
"weapons/magicsg.webp",
"4/4d/Magicsg.png"
],
"스타체이서 AR": [
"weapons/starchaserar.webp",
"a/a9/StarchaserAR.png"
],
"스타체이서 SR": [
"weapons/starchasersr.webp",
"e/e1/StarchaserSR.png"
],
"스턴 라이플": [
"weapons/stunrifle.webp",
"e/eb/Stunrifle.png"
],
"슬래셔": [
"weapons/chainsawm.webp",
"c/c7/Chainsawm.png"
],
"실피드": [
"weapons/jumpspirit_new.webp",
"4/44/Jumpspirit_new.png"
],
"싸이클론": [
"weapons/cyclone.webp",
"7/79/Cyclone.png"
],
"썬더 고스트 워커": [
"weapons/thunderpistol.webp",
"3/35/Thunderpistol.png"
],
"썬더 플래시 Ⅰ": [
"weapons/huntgrenade.webp",
"b/bd/Huntgrenade.png"
],
"썬더 플래시 Ⅱ": [
"weapons/huntgrenade.webp",
"b/bd/Huntgrenade.png"
],
"썬더볼트": [
"weapons/thunderbolt.webp",
"d/db/Thunderbolt.png"
],
"아나콘다": [
"weapons/icon_anaconda_cso.webp",
"e/eb/Icon_anaconda_cso.png"
],
"아르카나 Ⅰ": [
"weapons/arcana1.webp",
"5/59/Arcana1.png"
],
"아르카나 Ⅱ": [
"weapons/arcana1.webp",
"5/59/Arcana1.png"
],
"아르카나 Ⅴ": [
"weapons/arcana3.webp",
"d/d0/Arcana3.png"
],
"아발란체": [
"weapons/avalanche.webp",
"e/ed/Avalanche.png"
],
"아스칼론 Ⅰ": [
"weapons/ascalon.webp",
"f/fe/Ascalon.png"
],
"아스칼론 Ⅱ": [
"weapons/ascalon.webp",
"f/fe/Ascalon.png"
],
"아스칼론 Ⅴ": [
"weapons/ascalon.webp",
"f/fe/Ascalon.png"
],
"암토치": [
"weapons/arm_torch.webp",
"1/19/Arm_Torch.png"
],
"어택 M950": [
"weapons/m950attack.webp",
"0/07/M950attack.png"
],
"에어 버스터": [
"weapons/airburster_gfx.webp",
"7/70/Airburster_gfx.png"
],
"에테리얼": [
"weapons/ethereal.webp",
"7/78/Ethereal.png"
],
"오트클레르": [
"weapons/swordbombard.webp",
"d/de/Swordbombard.png"
],
"와일드윙": [
"weapons/catapult.webp",
"5/51/Catapult.png"
],
"용격포": [
"weapons/cannonm.webp",
"b/b1/Cannonm.png"
],
"워해머 스톰 자이언트": [
"weapons/buffmelee.webp",
"7/79/Buffmelee.png"
],
"윈체스터 M1887": [
"weapons/icon_m1887_cso.webp",
"6/6b/Icon_m1887_cso.png"
],
"이그나이트-10": [
"weapons/ignitebomb.webp",
"e/ea/Ignitebomb.png"
],
"이그나이트-7": [
"weapons/ignitemg.webp",
"1/18/Ignitemg.png"
],
"인피니티 레드": [
"weapons/infinity_red_icon.webp",
"9/9c/Infinity_red_icon.png"
],
"인피니티 레이저 피스트": [
"weapons/laserfist.webp",
"4/42/Laserfist.png"
],
"인피니티 블랙": [
"weapons/infinity_black_icon.webp",
"b/bf/Infinity_black_icon.png"
],
"인피니티 실버": [
"weapons/infinity_silver_icon.webp",
"2/20/Infinity_silver_icon.png"
],
"일렉트론-III": [
"weapons/lightningsmg.webp",
"d/df/Lightningsmg.png"
],
"일렉트론-V": [
"weapons/lightningar.webp",
"f/f5/Lightningar.png"
],
"일렉트론-VII": [
"weapons/lightningmg36.webp",
"1/16/Lightningmg36.png"
],
"일렉트론-XI": [
"weapons/lightningsg_1__1_.webp",
"d/d6/Lightningsg_1_%281%29.png"
],
"잭 해머": [
"weapons/mk3a1.webp",
"3/38/Mk3a1.png"
],
"적룡포": [
"weapons/reddragoncannon.webp",
"5/52/Reddragoncannon.png"
],
"제노사이더 Ⅰ": [
"weapons/satellitemg.webp",
"c/ca/Satellitemg.png"
],
"제노사이더 Ⅱ": [
"weapons/satellitemg.webp",
"c/ca/Satellitemg.png"
],
"제노사이더 Ⅴ": [
"weapons/satellitemg.webp",
"c/ca/Satellitemg.png"
],
"지옥무쌍검": [
"weapons/hellfire_sword.webp",
"1/1b/Hellfire_sword.png"
],
"철선": [
"weapons/ironfan.webp",
"d/d6/Ironfan.png"
],
"청룡도": [
"weapons/dragonsword.webp",
"1/18/Dragonsword.png"
],
"체인 수류탄": [
"weapons/chaingrenade.webp",
"7/7c/Chaingrenade.png"
],
"카타나": [
"weapons/katana.webp",
"e/e9/Katana.png"
],
"컴뱃 나이프": [
"weapons/combatknife_gfx.webp",
"f/fb/Combatknife_gfx.png"
],
"컴파운드 보우": [
"weapons/compound_bow.webp",
"9/9e/Compound_Bow.png"
],
"코일건": [
"weapons/coilmg.webp",
"b/b7/Coilmg.png"
],
"쿠스토스": [
"weapons/coustos.webp",
"4/44/Coustos.png"
],
"크로스보우": [
"weapons/crossbow_gfx.webp",
"a/a1/Crossbow_gfx.png"
],
"크로스보우 어드밴스": [
"weapons/advancedcrossbow.webp",
"8/88/Advancedcrossbow.png"
],
"크로우 바": [
"weapons/crowbar.webp",
"c/c0/Crowbar.png"
],
"크로우 바 매버릭": [
"weapons/crowbar_maverick.webp",
"6/62/Crowbar_maverick.png"
],
"클로 해머": [
"weapons/hammer.webp",
"8/81/Hammer.png"
],
"키클롭스": [
"weapons/cyclops.webp",
"a/a9/Cyclops.png"
],
"킹코브라": [
"weapons/kingcobra.webp",
"b/b7/Kingcobra.png"
],
"택티컬 나이프": [
"weapons/tactical_knife.webp",
"5/52/Tactical_knife.png"
],
"템페스트": [
"weapons/tempestsmg.webp",
"f/f3/Tempestsmg.png"
],
"토네이도": [
"weapons/sflaser.webp",
"4/4e/Sflaser.png"
],
"토마호크": [
"weapons/tomahawk.webp",
"e/ea/Tomahawk.png"
],
"토마호크 크리스마스 에디션": [
"weapons/tomahawk_xmas.webp",
"4/4c/Tomahawk_xmas.png"
],
"톰슨 시카고": [
"weapons/thompson_gfx.webp",
"1/1b/Thompson_gfx.png"
],
"톰슨 시카고 골드": [
"weapons/thompsongold.webp",
"7/7f/Thompsongold.png"
],
"파워 FALCON": [
"weapons/powerfalcon.webp",
"6/65/Powerfalcon.png"
],
"파이슨": [
"weapons/python.webp",
"e/e4/Python.png"
],
"파이슨 데스페라도": [
"weapons/python_desperado.webp",
"a/a0/Python_desperado.png"
],
"파이어 발칸": [
"weapons/firevulcan.webp",
"6/66/Firevulcan.png"
],
"파커헤일 M82": [
"weapons/m82.webp",
"5/53/M82.png"
],
"파팽": [
"weapons/papin.webp",
"a/a1/Papin.png"
],
"페일노트": [
"weapons/hunterbow.webp",
"9/9b/Hunterbow.png"
],
"페트롤 부머": [
"weapons/petrol_boomer.webp",
"6/68/Petrol_boomer.png"
],
"포톤 런처": [
"weapons/linkattacksg.webp",
"4/49/Linkattacksg.png"
],
"프로스트 바이퍼": [
"weapons/6940049224801250021.webp",
"3/30/6940049224801250021.png"
],
"프리즈번 트윈암즈 T1": [
"weapons/freezeburn_twin_arms_t1.webp",
"8/80/Freezeburn_Twin_Arms_T1.png"
],
"플라즈마 건": [
"weapons/plasma.webp",
"9/90/Plasma.png"
],
"플라즈마 수류탄": [
"weapons/plasma_grenade.webp",
"6/66/Plasma_grenade.png"
],
"플레임 잭 해머": [
"weapons/mk3a1se.webp",
"3/33/Mk3a1se.png"
],
"헌터킬러 X-12": [
"weapons/kronos11.webp",
"b/bd/Kronos11.png"
],
"헌터킬러 X-15": [
"weapons/hunterkillerx15.webp",
"f/f1/Hunterkillerx15.png"
],
"헌터킬러 X-45": [
"weapons/kronos1.webp",
"5/5e/Kronos1.png"
],
"헌터킬러 X-7": [
"weapons/kronos7.webp",
"f/f9/Kronos7.png"
],
"헌터킬러 X-90": [
"weapons/kronos3.webp",
"3/3b/Kronos3.png"
],
"혈적자": [
"weapons/bloodlust.webp",
"1/11/Bloodlust.png"
],
"흑룡포": [
"weapons/cannon.webp",
"a/a6/Cannon.png"
],
"건스미스": [
"classes/gunsmith.webp",
"5/56/Gunsmith.png"
],
"교관 제라드": [
"classes/buffclass20s2ct.webp",
"a/a8/Buffclass20s2ct.png"
],
"나타샤": [
"classes/natasha_icon.webp",
"3/3c/Natasha_icon.png"
],
"녹스": [
"classes/buffclass22s4tr.webp",
"c/c1/Buffclass22s4tr.png"
],
"데이비드 블랙": [
"classes/davidblack.webp",
"f/f8/Davidblack.png"
],
"도로시 다크나이트": [
"classes/buffclassa.webp",
"3/37/Buffclassa.png"
],
"도미닉": [
"classes/dominique.webp",
"a/a0/Dominique.png"
],
"레이븐": [
"classes/pirateboy.webp",
"5/55/Pirateboy.png"
],
"로미": [
"classes/buffclass21s4tr.webp",
"e/e8/Buffclass21s4tr.png"
],
"로이": [
"classes/buffclass21s4ct.webp",
"7/7c/Buffclass21s4ct.png"
],
"로즈 피닉스": [
"classes/buffclassphoenix.webp",
"8/8d/Buffclassphoenix.png"
],
"루시아": [
"classes/marinegirl.webp",
"5/55/Marinegirl.png"
],
"리더 안소이": [
"classes/leader_soi.webp",
"9/9b/Leader_soi.png"
],
"리사": [
"classes/lisa_vgui.webp",
"8/8e/Lisa_vgui.png"
],
"리트슈카": [
"classes/ritsuka.webp",
"f/f4/Ritsuka.png"
],
"린": [
"classes/buffclass22s2ct.webp",
"4/45/Buffclass22s2ct.png"
],
"링링": [
"classes/lingling.webp",
"a/a2/Lingling.png"
],
"메데이아": [
"classes/buffclass19s2tr.webp",
"3/39/Buffclass19s2tr.png"
],
"메이": [
"classes/chngirl01.webp",
"c/c0/Chngirl01.png"
],
"미라주": [
"classes/buffclass21s2ct.webp",
"0/0c/Buffclass21s2ct.png"
],
"미카엘라": [
"classes/pirategirl.webp",
"8/8a/Pirategirl.png"
],
"미카엘라 LE": [
"classes/pirategirl2.webp",
"6/69/Pirategirl2.png"
],
"밀라": [
"classes/mila.webp",
"e/e8/Mila.png"
],
"밀리아": [
"classes/buffclass24s3ct.webp",
"c/cc/Buffclass24s3ct.png"
],
"발터": [
"classes/mercenaryct.webp",
"6/62/Mercenaryct.png"
],
"보스 데이비드 블랙": [
"classes/buffclass20s3tr.webp",
"0/0a/Buffclass20s3tr.png"
],
"불사신 에릭": [
"classes/buffclass22s3ct.webp",
"9/91/Buffclass22s3ct.png"
],
"블랙로즈 미호": [
"classes/buffclass19s3ct.webp",
"0/03/Buffclass19s3ct.png"
],
"사이보그": [
"classes/buffclass19s4ct.webp",
"6/64/Buffclass19s4ct.png"
],
"소냐 라이칸스로프": [
"classes/sonya.webp",
"d/d0/Sonya.png"
],
"슈퍼 솔져 제니퍼": [
"classes/super_soldier_jennifer.webp",
"6/6e/Super_soldier_jennifer.png"
],
"스마일 메리": [
"classes/buffclass22s3tr.webp",
"a/a4/Buffclass22s3tr.png"
],
"스카디": [
"classes/buffclass22s4ct.webp",
"8/88/Buffclass22s4ct.png"
],
"아네모네": [
"classes/buffclass21s2tr.webp",
"5/55/Buffclass21s2tr.png"
],
"아린": [
"classes/alin.webp",
"7/78/Alin.png"
],
"아이테리스": [
"classes/buffclass19s1ct.webp",
"6/67/Buffclass19s1ct.png"
],
"안소이": [
"classes/soi.webp",
"9/97/Soi.png"
],
"안젤리나": [
"classes/buffclass24s2tr.webp",
"a/ac/Buffclass24s2tr.png"
],
"액시온": [
"classes/buffclass19s1tr.webp",
"0/02/Buffclass19s1tr.png"
],
"앨리스 LE": [
"classes/alice2.webp",
"5/5a/Alice2.png"
],
"에단": [
"classes/buffclass21s3ct_icon.webp",
"5/52/Buffclass21s3ct_icon.png"
],
"에리카": [
"classes/jpngirl01_gfx.webp",
"9/9f/Jpngirl01_gfx.png"
],
"에비타": [
"classes/buffclass24s2ct.webp",
"3/3c/Buffclass24s2ct.png"
],
"엔조": [
"classes/marineboy.webp",
"a/a5/Marineboy.png"
],
"엘리자베스 크림슨헌터": [
"classes/elizabeth.webp",
"d/d9/Elizabeth.png"
],
"용기사 키릭스": [
"classes/buffclass21s1tr.webp",
"1/1a/Buffclass21s1tr.png"
],
"유리": [
"classes/yuri_icon.webp",
"b/b6/Yuri_icon.png"
],
"유리 LE": [
"classes/yuri2.webp",
"3/3a/Yuri2.png"
],
"이스마엘": [
"classes/buffclass21s3tr_icon.webp",
"f/f2/Buffclass21s3tr_icon.png"
],
"이자벨": [
"classes/boxxergirl.webp",
"2/2e/Boxxergirl.png"
],
"제니퍼": [
"classes/jennifer_gfx.webp",
"f/fc/Jennifer_gfx.png"
],
"제라드": [
"classes/gerrard.webp",
"7/76/Gerrard.png"
],
"짐": [
"classes/zim.webp",
"d/df/Zim.png"
],
"초월 미카엘라": [
"classes/buffclasspirategirl.webp",
"6/67/Buffclasspirategirl.PNG"
],
"초월 블레어": [
"classes/buffclassblairbig.webp",
"c/c9/Buffclassblairbig.png"
],
"초월 유리": [
"classes/buffclassyuri.webp",
"5/59/Buffclassyuri.png"
],
"초월 최지윤": [
"classes/buffclasschoijiyoon.webp",
"3/34/Buffclasschoijiyoon.png"
],
"초월 페르난도": [
"classes/buffclassfernandobig.webp",
"8/88/Buffclassfernandobig.png"
],
"최지윤": [
"classes/choijiyoon_gfx.webp",
"6/6b/Choijiyoon_gfx.png"
],
"최지윤 LE": [
"classes/choijiyoon2.webp",
"a/a0/Choijiyoon2.png"
],
"카린": [
"classes/buffclass24s3tr.webp",
"7/75/Buffclass24s3tr.png"
],
"카이": [
"classes/buffclass22s2tr.webp",
"8/80/Buffclass22s2tr.png"
],
"칼라엘": [
"classes/buffclass19s2ct.webp",
"0/0d/Buffclass19s2ct.png"
],
"칼리토": [
"classes/mercenarytr.webp",
"8/8c/Mercenarytr.png"
],
"퀸": [
"classes/buffclass19s4tr.webp",
"a/a5/Buffclass19s4tr.png"
],
"크리스": [
"classes/criss.webp",
"f/fc/Criss.png"
],
"키릭스": [
"classes/vnman.webp",
"9/93/Vnman.png"
],
"특수요원 크리스": [
"classes/buffclass20s3ct.webp",
"2/21/Buffclass20s3ct.png"
],
"플로라 팔라딘": [
"classes/buffclassb.webp",
"c/c1/Buffclassb.png"
],
"핑크하트 시호": [
"classes/buffclass19s3tr.webp",
"7/7e/Buffclass19s3tr.png"
],
"하리": [
"classes/vngirl.webp",
"4/46/Vngirl.png"
],
"하이엘프 나타샤": [
"classes/buffclass21s1ct.webp",
"6/60/Buffclass21s1ct.png"
],
"헨리": [
"classes/henry_character.webp",
"4/48/Henry_character.png"
],
"훈련병 에리카": [
"classes/buffclass20s2tr.webp",
"9/90/Buffclass20s2tr.png"
],
"2020 CN 도색도안": [
"items/weaponpaintgunkatacn1.webp",
"e/e7/Weaponpaintgunkatacn1.png"
],
"2020 KR 도색도안": [
"items/weaponpaintgunkatakr1.webp",
"a/a4/Weaponpaintgunkatakr1.png"
],
"2020 NA 도색도안": [
"items/weaponpaintsummonknifena1.webp",
"0/09/Weaponpaintsummonknifena1.png"
],
"2020 TW 도색도안": [
"items/weaponpaintgungnirtw1.webp",
"a/a8/Weaponpaintgungnirtw1.png"
],
"BALROG-XI 추억 도색도안": [
"items/weaponpaintchn11thbalrog11.webp",
"2/29/Weaponpaintchn11thbalrog11.png"
],
"CN 도색도안": [
"items/weaponpaintairburstercn.webp",
"5/5d/Weaponpaintairburstercn.png"
],
"CROW-11 추억 도색도안": [
"items/weaponpaintchn11thcrow11.webp",
"d/d6/Weaponpaintchn11thcrow11.png"
],
"ID 도색도안": [
"items/weaponpaintdeserteagleid.webp",
"2/24/Weaponpaintdeserteagleid.png"
],
"JANUS-11 추억 도색도안": [
"items/weaponpaintchn11thjanus11.webp",
"d/d3/Weaponpaintchn11thjanus11.png"
],
"JP 도색도안": [
"items/weaponpaintpetrolboomerjp.webp",
"1/11/Weaponpaintpetrolboomerjp.png"
],
"KR 도색도안": [
"items/weaponpaintnataknifekr.webp",
"6/68/Weaponpaintnataknifekr.png"
],
"NA 도색도안": [
"items/weaponpaintsfpistolna.webp",
"b/ba/Weaponpaintsfpistolna.png"
],
"SKULL-11 추억 도색도안": [
"items/weaponpaintchn11thskull11.webp",
"e/e6/Weaponpaintchn11thskull11.png"
],
"THANATOS-11 추억 도색도안": [
"items/weaponpaintchn11ththanatos11.webp",
"2/2e/Weaponpaintchn11ththanatos11.png"
],
"TURBULENT-11 추억 도색도안": [
"items/weaponpaintchn11thturbulent11.webp",
"d/d9/Weaponpaintchn11thturbulent11.png"
],
"TW 도색도안": [
"items/weaponpaintchainsawmtw.webp",
"d/df/Weaponpaintchainsawmtw.png"
],
"간호사 스팅 핑거(코스튬)": [
"items/nurseskinresi.webp",
"a/af/Nurseskinresi.png"
],
"갤럭시 도색도안": [
"items/galaxypaint.webp",
"f/f2/Galaxypaint.png"
],
"고양이 귀": [
"items/coscathead.webp",
"c/c0/Coscathead.png"
],
"고양이 꼬리": [
"items/coscatpelvis.webp",
"c/cd/Coscatpelvis.png"
],
"고양이 생선": [
"items/coscatback.webp",
"e/eb/Coscatback.png"
],
"골드 호랑이 도색도안": [
"items/weaponpaintgoldtiger.webp",
"3/39/WeaponPaintgoldtiger.png"
],
"그린 도색도안": [
"items/weaponpaintgreen.webp",
"7/7f/WeaponPaintgreen.png"
],
"네모닉 도색도안": [
"items/weaponpaintreaper.webp",
"a/a7/Weaponpaintreaper.png"
],
"네온 홀리트리 도색도안": [
"items/weaponpaintneonholytree.webp",
"f/f2/Weaponpaintneonholytree.png"
],
"다람쥐 귀": [
"items/sqear.webp",
"2/2e/Sqear.png"
],
"다람쥐 꼬리": [
"items/sqtail.webp",
"8/8f/Sqtail.png"
],
"달무리 도색도안": [
"items/infinityex2paintlunarhalo.webp",
"8/89/InfinityEX2Paintlunarhalo.png"
],
"달밤 도색도안": [
"items/moonlight_paint_scheme.webp",
"5/5b/Moonlight_paint_scheme.png"
],
"데스 로즈 도색도안": [
"items/weaponpaintdeathrose.webp",
"5/5f/Weaponpaintdeathrose.png"
],
"도발용 사과머리": [
"items/cosprovokehead.webp",
"2/20/Cosprovokehead.png"
],
"도발용 표적판": [
"items/cosprovokeback.webp",
"d/d2/Cosprovokeback.png"
],
"도발용 화살표": [
"items/cosprovokepelvis.webp",
"b/b3/Cosprovokepelvis.png"
],
"도토리 가방": [
"items/acornback.webp",
"8/85/Acornback.png"
],
"돼지 귀": [
"items/pig_ear.webp",
"2/29/Pig_ear.png"
],
"돼지 꼬리": [
"items/pig_tail.webp",
"9/9f/Pig_tail.png"
],
"돼지 삼지창": [
"items/pig_fork.webp",
"4/46/Pig_fork.png"
],
"레더 도색도안": [
"items/leather_paint.webp",
"c/cb/Leather_paint.png"
],
"레드 도색도안": [
"items/weaponpaintred.webp",
"8/8b/WeaponPaintred.png"
],
"레드바론 도색도안": [
"items/buffaugpaint21rb.webp",
"4/43/Buffaugpaint21rb.png"
],
"레드썬더 도색도안": [
"items/redthunder.webp",
"5/56/Redthunder.png"
],
"레이스 도색도안": [
"items/weaponpaintinfinityex2only.webp",
"1/11/Weaponpaintinfinityex2only.png"
],
"리프그린 도색도안": [
"items/greenleafpaint.webp",
"f/fb/Greenleafpaint.png"
],
"미이라 스탬퍼(코스튬)": [
"items/mummystamper.webp",
"8/8f/Mummystamper.png"
],
"바이올렛 도색도안": [
"items/violetpaint.webp",
"2/2e/Violetpaint.png"
],
"반투명 도색도안": [
"items/weaponpainttranslucent.webp",
"d/d5/WeaponPaintTranslucent.png"
],
"베놈 바이퍼 도색도안": [
"items/weaponpaintvenomviper.webp",
"2/21/Weaponpaintvenomviper.png"
],
"복서 챔피언벨트": [
"items/boxerchampionbelt.webp",
"b/be/Boxerchampionbelt.png"
],
"복서 헤드기어": [
"items/boxerheadgear.webp",
"3/34/Boxerheadgear.png"
],
"블러드 도색도안": [
"items/weaponpaintblood.webp",
"a/a0/Weaponpaintblood.png"
],
"블루 도색도안": [
"items/weaponpaintblue.webp",
"9/90/WeaponPaintblue.png"
],
"블루썬더 도색도안": [
"items/bluethunder.webp",
"9/9a/Bluethunder.png"
],
"산타이치 헤비 좀비(코스튬)": [
"items/santaskinheavy.webp",
"7/77/Santaskinheavy.png"
],
"슈퍼 히어로 백팩": [
"items/superhero_back.webp",
"2/26/Superhero_back.png"
],
"슈퍼 히어로 헬멧": [
"items/superhero_head.webp",
"1/14/Superhero_head.png"
],
"스네이크 도색도안": [
"items/weaponpaintlaserminigunonly.webp",
"c/ce/Weaponpaintlaserminigunonly.png"
],
"스쿨룩 라이트 좀비(코스튬)": [
"items/studentskinlight.webp",
"3/36/Studentskinlight.png"
],
"스페셜 무기 선택 상자": [
"items/zhcspecialweaponselectbox.webp",
"d/dd/Zhcspecialweaponselectbox.png"
],
"실버 호랑이 도색도안": [
"items/weaponpaintsilvertiger.webp",
"8/8f/WeaponPaintsilvertiger.png"
],
"아이돌 마이크": [
"items/cosidolmic.webp",
"5/5f/Cosidolmic.png"
],
"아이돌 선글라스": [
"items/cosidolglass.webp",
"e/e0/Cosidolglass.png"
],
"아쿠아 도색도안": [
"items/aquapaint.webp",
"6/6d/Aquapaint.png"
],
"아프로 머리": [
"items/afro_costume.webp",
"e/eb/Afro_costume.png"
],
"에리카 도색도안": [
"items/ericapaint.webp",
"0/0c/Ericapaint.png"
],
"엘레강스 머리": [
"items/elegant_costume.webp",
"6/6e/Elegant_costume.png"
],
"옐로우 도색도안": [
"items/weaponpaintyellow.webp",
"2/23/WeaponPaintyellow.png"
],
"오렌지 도색도안": [
"items/weaponpaintorange.webp",
"4/42/WeaponPaintorange.png"
],
"젠틀맨 지팡이": [
"items/cosgentleback.webp",
"0/06/Cosgentleback.png"
],
"젠틀맨 콧수염": [
"items/cosgentlehead.webp",
"8/8f/Cosgentlehead.png"
],
"젠틀맨 회중시계": [
"items/cosgentlepelvis.webp",
"5/56/Cosgentlepelvis.png"
],
"주방장 헤비 좀비(코스튬)": [
"items/chefskinheavy.webp",
"5/51/Chefskinheavy.png"
],
"최지윤 도색도안": [
"items/choijiyoonpaint.webp",
"1/18/Choijiyoonpaint.png"
],
"팬더 귀": [
"items/6940049224801203943.webp",
"8/82/6940049224801203943.png"
],
"팬더 꼬리": [
"items/6940049224801203942.webp",
"8/86/6940049224801203942.png"
],
"팬더 인형": [
"items/6940049224801203941.webp",
"9/9f/6940049224801203941.png"
],
"퍼플 도색도안": [
"items/weaponpaintpurple.webp",
"d/d5/WeaponPaintpurple.png"
],
"포이즌 도색도안": [
"items/weaponpaintpoison.webp",
"3/3e/Weaponpaintpoison.png"
],
"프라모델 도색도안": [
"items/weaponpaintdestroyeronly.webp",
"c/c5/Weaponpaintdestroyeronly.png"
],
"플래닛 도색도안": [
"items/weaponpaintbowonly.webp",
"1/14/Weaponpaintbowonly.png"
],
"핑크빛 칠석 도색도안": [
"items/weaponpaintseventhnight.webp",
"f/f8/Weaponpaintseventhnight.png"
],
"허니 도색도안": [
"items/weaponpaintm950seonly.webp",
"a/a7/Weaponpaintm950seonly.png"
],
"호크 도색도안": [
"items/weaponpainteagle.webp",
"f/f6/Weaponpainteagle.png"
],
"황금 가면": [
"items/costume_mask.webp",
"8/88/Costume_mask.png"
],
"황금 방패": [
"items/costume_shield.webp",
"e/e4/Costume_shield.png"
]
};
