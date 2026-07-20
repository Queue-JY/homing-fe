import { useCallback, useEffect, useRef, useState } from 'react';
import { loadKakaoMapSdk } from '../lib/kakaoMap';
import { getMyMap, onboardMyData } from '../lib/api';
import { ScreenHeader } from '../components/ScreenHeader';
import type { MyMapMerchant } from '../types';

const DEMO_USER_ID = 1;
// map-poc.html과 동일한 기본 중심좌표 (산격동 경북대 정문) - 데이터 없을 때 폴백용
const DEFAULT_CENTER = { lat: 35.893, lng: 128.6103 };

export function MyMap({ onBack, onSelectMerchant }: { onBack: () => void; onSelectMerchant: (merchantId: number) => void }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [status, setStatus] = useState('불러오는 중...');
  const [isError, setIsError] = useState(false);
  const [merchants, setMerchants] = useState<MyMapMerchant[]>([]);

  // ⚠️ 마이데이터 온보딩 상태 - "연결됨"은 세션 로컬 state로만 관리.
  // 서버(MockMyDataClient)가 같은 subjectId("u0")에 대해 중복 체크 없이
  // 거래를 계속 쌓는 구조라, 버튼을 두 번 이상 못 누르게 FE에서 반드시 막아야 함.
  // (새로고침하면 다시 눌릴 수 있음 - 서버 쪽에 중복 방지가 생기기 전까진 한계로 남음)
  const [onboardStatus, setOnboardStatus] = useState<'idle' | 'connecting' | 'done' | 'error'>('idle');

  const drawMarkers = useCallback(
    (list: MyMapMerchant[]) => {
      const kakao = window.kakao;
      const map = mapRef.current;
      if (!kakao || !map) return;

      // 이전 마커 정리 (재연동 후 다시 그릴 때 중복 방지)
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      let placed = 0;
      const bounds = new kakao.maps.LatLngBounds();

      list.forEach((m) => {
        if (m.lat == null || m.lng == null) return;
        const position = new kakao.maps.LatLng(m.lat, m.lng);
        const marker = new kakao.maps.Marker({ position, map });

        // 말풍선: 이름 + 카테고리 + 방문 횟수 + 영업 상태. 이름/카테고리는 절대 하드코딩 금지 - API 응답 그대로.
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:8px 10px;font-size:13px;white-space:nowrap;line-height:1.5;">
            <strong>${m.name}</strong> (${m.category})<br/>
            단골 ${m.visitCount}회 방문 · ${m.active ? '영업중' : '폐업'}
          </div>`,
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
          onSelectMerchant(m.merchantId);
        });

        bounds.extend(position);
        markersRef.current.push(marker);
        placed++;
      });

      if (placed > 0) map.setBounds(bounds);
      setStatus(`가게 ${list.length}곳 중 마커 ${placed}개 표시됨 (마커를 눌러 상세 확인)`);
    },
    [onSelectMerchant]
  );

  const fetchAndDraw = useCallback(async () => {
    const list = await getMyMap(DEMO_USER_ID);
    setMerchants(list);
    drawMarkers(list);
  }, [drawMarkers]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadKakaoMapSdk();
        if (cancelled || !mapDivRef.current) return;

        const kakao = window.kakao;
        mapRef.current = new kakao.maps.Map(mapDivRef.current, {
          center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: 4,
        });

        await fetchAndDraw();
      } catch (err) {
        setIsError(true);
        setStatus(err instanceof Error ? err.message : '지도를 불러오지 못했어요.');
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    if (onboardStatus === 'connecting' || onboardStatus === 'done') return; // 중복 클릭 방지
    setOnboardStatus('connecting');
    try {
      await onboardMyData();
      await fetchAndDraw();
      setOnboardStatus('done');
    } catch (err) {
      setOnboardStatus('error');
    }
  };

  // 더미 없이 실제 my-map 응답의 active 필드로 폐업 가게만 걸러냄
  const closedMerchants = merchants.filter((m) => !m.active);

  return (
    <div className="min-h-full bg-white flex flex-col">
      <ScreenHeader title="나의 지도" onBack={onBack} />

      <div className="px-4 pb-3">
        <button
          onClick={handleConnect}
          disabled={onboardStatus === 'connecting' || onboardStatus === 'done'}
          className="w-full rounded-xl px-4 py-3 text-[15px] font-semibold text-white active:scale-[0.99] transition disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#57FF9A,#00C6A9)' }}
        >
          {onboardStatus === 'connecting'
            ? '마이데이터 연결 중...'
            : onboardStatus === 'done'
            ? '마이데이터 연결 완료 ✓'
            : '마이데이터 연결하기'}
        </button>
        {onboardStatus === 'error' && (
          <p className="mt-1.5 text-[12px] text-red-500">연결에 실패했어요. 잠시 후 다시 시도해주세요.</p>
        )}
        {onboardStatus === 'done' && (
          <p className="mt-1.5 text-[12px] text-neutral-400">
            데모 특성상 새로고침 전까지만 중복 연결이 막혀있어요. 재연동 테스트가 필요하면 서버 쪽 subjectId를 바꿔서 확인해주세요.
          </p>
        )}
      </div>

      <div className="relative">
        <div
          className={`absolute top-3 left-3 z-10 px-3 py-2 rounded-lg text-[12px] shadow ${
            isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white text-neutral-600'
          }`}
        >
          {status}
        </div>
        <div ref={mapDivRef} className="w-full min-h-[420px]" />
      </div>

      {closedMerchants.length > 0 && (
        <div className="px-4 py-4 border-t border-neutral-100">
          <p className="text-[13px] font-medium text-neutral-500 mb-2">폐업한 단골 가게</p>
          {closedMerchants.map((m) => (
            <button
              key={m.merchantId}
              onClick={() => onSelectMerchant(m.merchantId)}
              className="w-full flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-left mb-2 last:mb-0"
            >
              <div>
                <p className="text-[15px] font-semibold text-neutral-500 line-through">{m.name}</p>
                <p className="text-[12px] text-neutral-400">
                  방문 {m.visitCount}회 · {m.regionLabel}
                </p>
              </div>
              <span className="text-[12px] text-neutral-400 shrink-0 ml-3">대체 가게 찾기 →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}