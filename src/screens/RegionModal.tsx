import { useEffect, useState } from 'react';
import { getMyMap } from '../lib/api';
import { useDetectedRegion } from '../hooks/useDetectedRegion';
import { MascotAvatar } from '../components/Avatar';
import { REGION_GREETINGS, type MyMapMerchant } from '../types';

const DEMO_USER_ID = 1;

export function RegionModal({
  onOpenMap,
  onDismiss,
}: {
  onOpenMap: (region: string) => void;
  onDismiss: () => void;
}) {
  const { region } = useDetectedRegion();
  const [merchant, setMerchant] = useState<MyMapMerchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데모 진입 시나리오: 감지된 지역이 없으면 기본값으로 '서울'을 보여준다
    const targetRegion = region ?? '서울';
    getMyMap(DEMO_USER_ID)
      .then((list) => {
        // 이름 하드코딩 금지 - regionLabel에 감지된 지역명이 포함된 첫 가게를 그대로 사용
        const match = list.find((m) => m.regionLabel.includes(targetRegion)) ?? list[0] ?? null;
        setMerchant(match);
      })
      .finally(() => setLoading(false));
  }, [region]);

  const targetRegion = region ?? '서울';
  const greeting = REGION_GREETINGS[targetRegion];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 배경: 실제로는 사용자가 쓰던 앱 화면 위에 뜨는 팝업이라 살짝 어둡게만 처리 */}
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />

      <div
        className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-2xl p-6 shadow-xl"
        style={{
          background: 'linear-gradient(155deg,#EAFBE0 0%,#F3FBEF 55%,#FFFFFF 100%)',
        }}
      >
        <div className="flex items-start gap-3">
          <MascotAvatar size={44} />
          <div className="flex-1 pt-1">
            <p className="font-greeting text-[20px] font-bold text-neutral-900 leading-snug">
              {greeting}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[15px] text-neutral-700 leading-relaxed">
          {loading
            ? '단골 가게를 확인하고 있어요...'
            : merchant
            ? `예전에 자주 가던 ${merchant.name} 아직 있어요`
            : `${targetRegion}에서 예전에 방문했던 단골 가게를 찾고 있어요`}
        </p>

        <button
          onClick={() => onOpenMap(targetRegion)}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-white/80 backdrop-blur px-4 py-3 text-[15px] font-semibold text-neutral-900 shadow-sm active:scale-[0.99] transition disabled:opacity-50"
        >
          단골 지도 열기 ↗
        </button>
      </div>
    </div>
  );
}
