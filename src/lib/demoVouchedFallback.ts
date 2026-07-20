// lib/demoVouchedFallback.ts
import type { VouchedMerchant } from '../types';

// ⚠️ 백엔드에 서울/경기 가맹점 데이터가 아직 없어서(산격동 상권만 시딩됨) 넣은 데모 전용 프리셋.
// 실제 지역 데이터가 시딩되면 이 파일과 아래 폴백 분기는 지워도 됨.
export const DEMO_VOUCHED_FALLBACK: Record<string, VouchedMerchant[]> = {
  서울: [
    { merchantId: 901, name: '연남동커피', category: '카페', regionLabel: '서울 마포구 연남동', lat: 37.5619, lng: 126.9255, dangolCount: 12, active: true, rank: 1 },
    { merchantId: 902, name: '망원분식', category: '분식', regionLabel: '서울 마포구 망원동', lat: 37.5563, lng: 126.9013, dangolCount: 8, active: true, rank: 2 },
  ],
  경기: [
    { merchantId: 903, name: '수원왕갈비통닭', category: '분식', regionLabel: '경기 수원시 팔달구', lat: 37.2636, lng: 127.0286, dangolCount: 10, active: true, rank: 1 },
  ],
};