// 백엔드 응답 스키마 그대로 매핑한 타입.
// ⚠️ 가게 이름/지역명은 카카오 로컬 API 실시간 조회 결과라 재시딩마다 바뀔 수 있음.
//    절대 하드코딩하지 말고 항상 이 타입을 통해 API 응답값을 그대로 쓸 것.

export interface MyMapMerchant {
  merchantId: number;
  name: string;
  category: string;
  regionLabel: string;
  lat: number;
  lng: number;
  visitCount: number;
  lastVisit: string; // ISO datetime
  active: boolean;
  reason: string; // 규칙 엔진이 만든 판정 근거 문장 - 그대로 화면에 노출
  badgePublic: boolean;
}

export interface VouchedMerchant {
  merchantId: number;
  name: string;
  category: string;
  regionLabel: string;
  lat: number;
  lng: number;
  dangolCount: number;
  active: boolean;
  rank: number;
}

export interface SuccessorMerchant {
  merchantId: number;
  name: string;
  category: string;
  regionLabel: string;
  lat: number;
  lng: number;
  movedCount: number;
}

export interface PotentialCustomer {
  personId: number;
  name: string;
  era: string;
  currentRegion: string;
  sharedRegulars: number;
}

export interface OutreachSummary {
  merchantId: number;
  merchantName: string;
  totalDeparted: number;
  byRegion: { region: string; count: number }[];
}

export interface TrendPoint {
  periodStart: string;
  dangolCount: number;
  newDangolCount: number;
}

export interface MerchantTrend {
  merchantId: number;
  merchantName: string;
  periodDays: number;
  points: TrendPoint[];
  stagnantPeriods: number;
  atRisk: boolean;
}

export interface OnboardResponse {
  userId: number;
  ingestedTransactions: number;
}

export interface BadgeResponse {
  merchantId: number;
  badgePublic: boolean;
}

// 17개 광역자치단체 기준. 백엔드가 지역 목록 API를 안 주므로 FE 상수로 고정.
export const SUPPORTED_REGIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
] as const;
export type Region = (typeof SUPPORTED_REGIONS)[number];

// 지역별 방언 환영 문구. RegionModal 헤드라인에 씀 (Shilla 폰트 적용 대상).
export const REGION_GREETINGS: Record<Region, string> = {
  서울: '서울 방문을 환영합니다!',
  부산: '부산까지 왔다 아이가! 반갑습니더!',
  대구: '대구 왔는교? 반갑데이!',
  인천: '인천 방문을 환영합니다!',
  광주: '광주 왔당께! 어서 와부러!',
  대전: '대전 왔슈? 반갑습니다유!',
  울산: '울산까지 오셨네예! 환영합니더!',
  세종: '세종 방문을 환영합니다!',
  경기: '경기도에 오신 것을 환영합니다!',
  강원: '강원까지 오셨네요. 환영합니다!',
  충북: '충북 왔슈? 반갑습니다유!',
  충남: '충남 오셨슈? 잘 오셨습니다유!',
  전북: '전북 왔당께! 반갑구먼요!',
  전남: '전남까지 오셨당께! 환영혀요!',
  경북: '경북 왔는교? 잘 오이소!',
  경남: '경남 왔다 아이가! 어서 오이소!',
  제주: '제주 혼저 옵서예! 환영합니다!',
};
