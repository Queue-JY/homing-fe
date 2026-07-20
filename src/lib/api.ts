import axios from 'axios';
import type {
  MyMapMerchant,
  VouchedMerchant,
  SuccessorMerchant,
  PotentialCustomer,
  OutreachSummary,
  MerchantTrend,
  OnboardResponse,
  BadgeResponse,
} from '../types';
import { DEMO_VOUCHED_FALLBACK } from './demoVouchedFallback';

// /api/** 전체가 CORS 전면 허용이라 프록시/인터셉터 없이 바로 baseURL만 잡으면 됨.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.z0.co.kr',
});

// 인증 기능이 없는 데모 단계라 userId를 그냥 path에 직접 넣는 구조.
// 실서비스 전환 시 여기 하나만 고치면 되도록 함수로 감싸둠.

export const getMyMap = (userId: number) =>
  api.get<MyMapMerchant[]>(`/api/users/${userId}/my-map`).then((r) => r.data);

export const setBadgePublic = (userId: number, merchantId: number, badgePublic: boolean) =>
  api
    .patch<BadgeResponse>(`/api/users/${userId}/merchants/${merchantId}/badge`, { badgePublic })
    .then((r) => r.data);

// ⚠️ 지금 파일럿 데이터가 전부 "산격동 경북대정문" 상권 하나뿐이라
// regionLabel 안에 "대구"라는 문자열 자체가 없음. 그대로 region=대구로 쿼리하면
// 백엔드가 regionLabel 부분일치로 필터링할 경우 매번 빈 배열이 옴.
// → '대구' 탭은 파라미터 없이 전체 조회로 대체 (실제 데이터가 늘어나 지역이 다양해지면 이 분기 제거해도 됨)
export const getVouchedMap = async (region?: string) => {
  const params = region && region !== '대구' ? { region } : {};
  const data = await api.get<VouchedMerchant[]>('/api/map/vouched', { params }).then((r) => r.data);

  // 실제 응답이 비어있고, 데모용 프리셋이 있는 지역이면 그걸로 폴백
  if (data.length === 0 && region && DEMO_VOUCHED_FALLBACK[region]) {
    return DEMO_VOUCHED_FALLBACK[region];
  }
  return data;
};

export const getSuccessors = (merchantId: number, limit = 5) =>
  api
    .get<SuccessorMerchant[]>(`/api/merchants/${merchantId}/successors`, { params: { limit } })
    .then((r) => r.data);

export const getPotentialCustomers = (merchantId: number, limit = 20) =>
  api
    .get<PotentialCustomer[]>(`/api/merchants/${merchantId}/potential-customers`, {
      params: { limit },
    })
    .then((r) => r.data);

export const getOutreach = (merchantId: number) =>
  api.get<OutreachSummary>(`/api/merchants/${merchantId}/outreach`).then((r) => r.data);

export const getTrend = (merchantId: number, periods = 6, periodDays = 30) =>
  api
    .get<MerchantTrend>(`/api/merchants/${merchantId}/trend`, { params: { periods, periodDays } })
    .then((r) => r.data);

// 데모에서 "연결하기" 버튼 → 지도가 채워지는 연출용. subjectId는 "u0" 고정.
// ⚠️ 반복 호출 절대 금지: 같은 subjectId로 여러 번 부르면 거래(Transaction)가 계속 쌓여서
// visitCount가 부풀려짐. 서버 에러는 안 나고 데이터가 조용히 오염되니, 이 함수를 쓰는 곳에서는
// 버튼을 disabled 처리하거나 한 번 호출 후 다시 못 누르게 막아야 함.
export const onboardMyData = () =>
  api
    .post<OnboardResponse>('/api/mydata/onboard', {
      subjectId: 'u0',
      authCode: 'mock-auth-code',
      name: '홍길동',
      homeRegion: '산격동',
      currentRegion: '서울 강남구',
      era: '20s',
    })
    .then((r) => r.data);