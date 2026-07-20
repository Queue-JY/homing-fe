import { useCallback, useEffect, useRef, useState } from 'react';
import { getVouchedMap } from '../lib/api';
import { loadKakaoMapSdk } from '../lib/kakaoMap';
import { ScreenHeader } from '../components/ScreenHeader';
import { UserAvatar } from '../components/Avatar';
import { SUPPORTED_REGIONS, type Region, type VouchedMerchant } from '../types';

const DEFAULT_CENTER = { lat: 35.893, lng: 128.6103 }; // 산격동

export function VouchedMap({
  initialRegion,
  onBack,
  onSelectMerchant,
}: {
  initialRegion?: Region;
  onBack: () => void;
  onSelectMerchant: (merchantId: number) => void;
}) {
  const [region, setRegion] = useState<Region>(initialRegion ?? '서울');
  const [merchants, setMerchants] = useState<VouchedMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 지도 초기화 (최초 1회)
  useEffect(() => {
    let cancelled = false;
    loadKakaoMapSdk().then(() => {
      if (cancelled || !mapDivRef.current) return;
      const kakao = window.kakao;
      mapRef.current = new kakao.maps.Map(mapDivRef.current, {
        center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
        level: 6,
      });
      drawMarkers(merchants);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawMarkers = useCallback((list: VouchedMerchant[]) => {
    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();
    let placed = 0;

    list.forEach((m: any) => {
      if (m.lat == null || m.lng == null) return; // 좌표 없는 항목은 지도에서 제외, 리스트엔 남김
      const position = new kakao.maps.LatLng(m.lat, m.lng);
      const marker = new kakao.maps.Marker({ position, map });
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:6px 9px;font-size:12px;white-space:nowrap;">
          <strong>${m.name}</strong> · 단골 ${m.dangolCount}명
        </div>`,
      });
      kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
      kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
      kakao.maps.event.addListener(marker, 'click', () => onSelectMerchant(m.merchantId));

      bounds.extend(position);
      markersRef.current.push(marker);
      placed++;
    });

    if (placed > 0) map.setBounds(bounds);
  }, [onSelectMerchant]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getVouchedMap(region)
      .then((data) => {
        const sorted = data.sort((a, b) => a.rank - b.rank);
        setMerchants(sorted);
        drawMarkers(sorted);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [region, drawMarkers]);

  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title="단골 보증 지도" onBack={onBack} />

      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {SUPPORTED_REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition ${
              region === r ? 'bg-[#DDF3CE] text-[#1F5B36]' : 'text-neutral-500'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 미리보기 지도 - 폐업 가게는 좌표를 안 실어서 여기 안 올라오고 아래 리스트에만 표시 */}
      <div className="px-4 pb-3">
        <div ref={mapDivRef} className="w-full h-[200px] rounded-2xl overflow-hidden bg-neutral-100" />
      </div>

      <p className="px-4 pb-2 text-[13px] text-neutral-400">방문 수가 아니라 단골 수 기준</p>

      <div className="px-4 space-y-2 pb-6">
        {loading && <div className="py-16 text-center text-neutral-400 text-sm">불러오는 중...</div>}
        {!loading && error && (
          <div className="py-16 text-center text-neutral-400 text-sm">
            지도를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        )}
        {!loading && !error && merchants.length === 0 && (
          <div className="py-16 text-center text-neutral-400 text-sm">
            {region}에는 아직 보증된 단골 가게가 없어요.
          </div>
        )}
        {!loading &&
          merchants.map((m) => (
            <button
              key={m.merchantId}
              onClick={() => onSelectMerchant(m.merchantId)}
              className="w-full flex items-center justify-between rounded-xl bg-neutral-50 hover:bg-neutral-100 transition px-4 py-3.5 text-left"
            >
              <div>
                <p className="text-[15px] font-semibold text-neutral-900">{m.name}</p>
                <p className="text-[13px] text-neutral-500 mt-0.5">단골 {m.dangolCount}명이 꼽은 노포</p>
              </div>
              {m.rank === 1 && <UserAvatar name={m.category} size={32} />}
            </button>
          ))}
      </div>
    </div>
  );
}