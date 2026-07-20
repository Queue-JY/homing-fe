import { useEffect, useState } from 'react';
import { SUPPORTED_REGIONS, type Region } from '../types';

/**
 * ⚠️ 문서 5번 항목 참고:
 * "위치 인식 후 고향/타지역 이동" 로직은 백엔드에 없음. 좌표→행정동 변환은
 * 카카오 로컬 API(좌표to주소)가 필요한데 REST 키는 서버 전용이라 FE가 직접 못 부름.
 * → 백엔드 팀에 좌표→행정동 변환 엔드포인트 추가를 요청하는 게 맞는 방향.
 *
 * 그 전까지는 데모용으로 브라우저 Geolocation만 받아서 대략적인 위경도 범위로
 * 임시 매칭한다. 정확도 낮음 - 실제 서비스 전에는 반드시 백엔드 엔드포인트로 교체할 것.
 */
const ROUGH_BOUNDS: { region: Region; latMin: number; latMax: number; lngMin: number; lngMax: number }[] = [
  { region: '서울', latMin: 37.42, latMax: 37.70, lngMin: 126.76, lngMax: 127.18 },
  { region: '부산', latMin: 34.88, latMax: 35.40, lngMin: 128.80, lngMax: 129.30 },
  { region: '대구', latMin: 35.60, latMax: 36.10, lngMin: 128.40, lngMax: 128.80 },
  { region: '인천', latMin: 37.30, latMax: 37.75, lngMin: 126.30, lngMax: 126.80 },
  { region: '광주', latMin: 35.05, latMax: 35.25, lngMin: 126.75, lngMax: 126.98 },
  { region: '대전', latMin: 36.25, latMax: 36.45, lngMin: 127.30, lngMax: 127.50 },
  { region: '울산', latMin: 35.45, latMax: 35.70, lngMin: 129.20, lngMax: 129.45 },
  { region: '세종', latMin: 36.44, latMax: 36.68, lngMin: 127.20, lngMax: 127.40 },
  { region: '경기', latMin: 36.90, latMax: 38.30, lngMin: 126.40, lngMax: 127.80 },
  { region: '강원', latMin: 37.00, latMax: 38.65, lngMin: 127.50, lngMax: 129.40 },
  { region: '충북', latMin: 36.20, latMax: 37.20, lngMin: 127.30, lngMax: 128.30 },
  { region: '충남', latMin: 35.90, latMax: 37.00, lngMin: 126.10, lngMax: 127.30 },
  { region: '전북', latMin: 35.30, latMax: 36.10, lngMin: 126.40, lngMax: 127.90 },
  { region: '전남', latMin: 34.00, latMax: 35.30, lngMin: 126.00, lngMax: 127.60 },
  { region: '경북', latMin: 35.70, latMax: 37.00, lngMin: 128.30, lngMax: 129.60 },
  { region: '경남', latMin: 34.70, latMax: 35.70, lngMin: 127.60, lngMax: 129.10 },
  { region: '제주', latMin: 33.10, latMax: 33.60, lngMin: 126.10, lngMax: 126.95 },
];

function matchRegion(lat: number, lng: number): Region | null {
  const hit = ROUGH_BOUNDS.find(
    (b) => lat >= b.latMin && lat <= b.latMax && lng >= b.lngMin && lng <= b.lngMax
  );
  return hit ? hit.region : null;
}

export function useDetectedRegion() {
  const [region, setRegion] = useState<Region | null>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'done' | 'denied'>('idle');

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRegion(matchRegion(pos.coords.latitude, pos.coords.longitude));
        setStatus('done');
      },
      () => setStatus('denied'),
      { timeout: 5000 }
    );
  }, []);

  return { region, status, supportedRegions: SUPPORTED_REGIONS };
}
