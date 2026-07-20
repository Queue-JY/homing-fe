import { useCallback, useEffect, useRef, useState } from 'react';
import { getVouchedMap } from '../lib/api';
import { loadKakaoMapSdk } from '../lib/kakaoMap';
import { ScreenHeader } from '../components/ScreenHeader';
import { SUPPORTED_REGIONS, type Region, type VouchedMerchant } from '../types';

const DEFAULT_CENTER = { lat: 35.893, lng: 128.6103 };
const PRIMARY = '#3E9169';
const RANK1_COLOR = '#E8A33D';
const MUTED = '#7E8B84';

export function VouchedMap({
  initialRegion,
  onBack,
  onSelectMerchant,
}: {
  initialRegion?: Region;
  onBack: () => void;
  onSelectMerchant: (merchantId: number) => void;
}) {
  const [region, setRegion] = useState<Region>(initialRegion ?? '대구');
  const [merchants, setMerchants] = useState<VouchedMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadKakaoMapSdk()
      .then(() => {
        if (cancelled || !mapDivRef.current) return;
        const kakao = window.kakao;
        mapRef.current = new kakao.maps.Map(mapDivRef.current, {
          center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: 6,
        });
      })
      .catch((err) => setMapError(err instanceof Error ? err.message : '지도를 불러오지 못했어요.'));
    return () => {
      cancelled = true;
    };
  }, []);

  const drawPins = useCallback(
    (list: VouchedMerchant[]) => {
      const kakao = window.kakao;
      const map = mapRef.current;
      if (!kakao || !map) return;

      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];

      const bounds = new kakao.maps.LatLngBounds();
      let placed = 0;

      list.forEach((m: any) => {
        if (m.lat == null || m.lng == null) return;
        const position = new kakao.maps.LatLng(m.lat, m.lng);
        const isTop = m.rank === 1;

        const el = document.createElement('div');
        el.style.cssText =
          'display:flex;flex-direction:column;align-items:center;cursor:pointer;transform:translateY(-6px);';
        el.innerHTML = `
          <div style="width:34px;height:34px;border-radius:50%;background:${
            isTop ? RANK1_COLOR : PRIMARY
          };color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.18);border:2px solid #fff;">
            ${m.dangolCount}
          </div>
          <div style="margin-top:5px;background:#fff;padding:4px 9px;border-radius:8px;font-size:12px;font-weight:600;color:#1B2E20;box-shadow:0 2px 6px rgba(0,0,0,0.12);white-space:nowrap;">
            ${m.name}
          </div>
        `;
        el.addEventListener('click', () => onSelectMerchant(m.merchantId));

        const overlay = new kakao.maps.CustomOverlay({
          position,
          content: el,
          yAnchor: 1,
        });
        overlay.setMap(map);
        overlaysRef.current.push(overlay);
        bounds.extend(position);
        placed++;
      });

      if (placed > 0) map.setBounds(bounds);
    },
    [onSelectMerchant]
  );

  useEffect(() => {
    setLoading(true);
    setError(false);
    getVouchedMap(region)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.rank - b.rank);
        setMerchants(sorted);
        drawPins(sorted);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [region, drawPins]);

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

      <div className="px-4 pb-2">
        <div
          ref={mapDivRef}
          className="w-full h-[240px] rounded-2xl overflow-hidden"
          style={{ background: '#E7F3E9' }}
        />
        {mapError && (
          <p className="mt-2 text-[12px] text-red-500">{mapError}</p>
        )}
      </div>

      <p className="px-4 pb-2 text-[13px]" style={{ color: MUTED }}>
        방문 수가 아니라 단골 수 기준
      </p>

      <div className="px-4 pt-2">
        <p className="text-[15px] font-bold mb-2.5">단골 랭킹</p>
      </div>

      <div className="px-4 space-y-2.5 pb-8">
        {loading && (
          <div className="py-12 text-center text-sm" style={{ color: MUTED }}>불러오는 중...</div>
        )}
        {!loading && error && (
          <div className="py-12 text-center text-sm" style={{ color: MUTED }}>
            지도를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        )}
        {!loading && !error && merchants.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: MUTED }}>
            {region}에는 아직 보증된 단골 가게가 없어요.
          </div>
        )}
        {!loading &&
          merchants.map((m, idx) => (
            <button
              key={m.merchantId}
              onClick={() => onSelectMerchant(m.merchantId)}
              className="w-full flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition active:scale-[0.99]"
              style={{ borderColor: '#EFEFEF' }}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-full grid place-items-center text-white text-[14px] font-bold"
                style={{ background: idx === 0 ? RANK1_COLOR : PRIMARY }}
              >
                {idx + 1}
              </div>
              <div>
                <p className="text-[15px] font-semibold text-neutral-900">{m.name}</p>
                <p className="text-[13px]" style={{ color: MUTED }}>
                  단골 {m.dangolCount}명이 꼽음
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}