# HoMing FE 데모 (5개 화면)

백엔드 API 문서 기준으로 구현한 5개 화면. `src/App.tsx`에서 화면 전환 흐름 확인 가능.

## 구현된 화면
1. `screens/RegionModal.tsx` — 위치 기반 진입 팝업
2. `screens/VouchedMap.tsx` — 단골 보증 지도
3. `screens/MerchantDetail.tsx` — 가게 상세
4. `screens/OwnerDashboard.tsx` — 사장님 대시보드
5. `screens/OutreachDemo.tsx` — 소식 보내기 결과 (잠금화면 데모)

## 백엔드 문서 대비 반영한 주의사항
- **가게 이름 하드코딩 금지**: 카카오 로컬 API 실시간 조회라 재시딩마다 이름이 바뀔 수 있음 → 모든 화면에서 API 응답값(`name`, `regionLabel`)만 사용, 절대 상수로 안 박음.
- **소식 보내기 = 발송 아님**: `outreach` API는 집계만 내려주고 실제 SMS/알림 발송 API가 없음 → `OwnerDashboard`의 "전송하기"는 실제 전송을 하지 않고, `OutreachDemo` 화면에 `DEMO · 실제 발송 아님` 라벨을 명시적으로 붙여서 시연용임을 밝힘.
- **위치→행정동 변환 미구현**: 백엔드에 좌표→행정동 엔드포인트가 없어서 `hooks/useDetectedRegion.ts`에 임시로 대략적인 위경도 범위 매칭을 넣어둠. 정확도 낮으니 실제 서비스 전엔 반드시 백엔드에 엔드포인트 추가 요청 후 교체할 것.
- **"이 가게 단골" 아바타 리스트 API 없음**: 가게별 단골 유저 이름 목록을 내려주는 엔드포인트가 문서에 없어서 `MerchantDetail.tsx`에 데모용 목업(`DEMO_REGULARS`)으로 채워둠. 실제 데이터 필요하면 백엔드에 신규 엔드포인트 요청 필요.
- **인증 없음**: 문서대로 로그인 화면 없이 `DEMO_USER_ID = 1`을 고정해서 씀. 실서비스 전환 시 이 상수만 실제 로그인 유저 ID로 교체.
- **REST 키는 절대 프론트에 안 씀**: 지도 렌더링엔 JS 키만 사용 (`.env.example` 참고), REST 키는 백엔드 전용이라 코드 어디에도 없음.

## 세팅
```bash
cp .env.example .env
npm install
npm install lucide-react   # ScreenHeader 아이콘용
npm run dev
```

카카오맵을 실제로 붙이려면 `FE/map-poc.html`(백엔드 레포)의 SDK 로딩 코드를 참고해서
개발 서버 포트(localhost:5173)를 카카오 디벨로퍼스 JS 키 도메인에 등록해야 함.

## 아직 안 붙인 것 (다음 순서)
- 나의 지도(`GET /users/{userId}/my-map`)를 실제 카카오맵 위에 마커로 렌더링하는 화면 (지금은 리스트/상세에서 데이터만 소비, 지도 시각화는 `map-poc.html` 포팅 필요)
- 마이데이터 연결하기 버튼 → `onboardMyData()` 호출 UI (`lib/api.ts`에 함수는 이미 있음)
- 대체 가게 찾기 / 잠재 단골 찾기 상세 화면 (`getSuccessors`, `getPotentialCustomers` API는 준비됨, 화면은 미제작)
