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

export const getVouchedMap = (region?: string) =>
  api
    .get<VouchedMerchant[]>('/api/map/vouched', { params: region ? { region } : {} })
    .then((r) => r.data);

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

// ⚠️ 이 API는 "소식 보내기 대상 집계"만 내려줌. 실제 문자/알림 발송 API는 백엔드에 없음.
// 전송하기 버튼을 눌러도 이 API가 뭘 보내주지 않는다 - UI에서 반드시 데모 시뮬레이션임을 표시할 것.
