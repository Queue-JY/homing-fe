import { useEffect, useState } from 'react';
import { getMyMap, getVouchedMap } from '../lib/api';
import { useDetectedRegion } from '../hooks/useDetectedRegion';
import { REGION_GREETINGS, type VouchedMerchant } from '../types';

const DEMO_USER_ID = 1;

export function RegionModal({
  onOpenMap,
  onDismiss,
}: {
  onOpenMap: (region: string) => void;
  onDismiss: () => void;
}) {
  const { region } = useDetectedRegion();
  const [favoriteCategory, setFavoriteCategory] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<VouchedMerchant | null>(null);
  const [loading, setLoading] = useState(true);

  // 파일럿 데이터가 대구/산격동 상권에만 있어서, 감지 실패 시 기본값도 대구로
  const targetRegion = region ?? '대구';

  useEffect(() => {
    setLoading(true);

    Promise.all([getMyMap(DEMO_USER_ID), getVouchedMap(targetRegion)])
      .then(([myMerchants, vouched]) => {
        // 최근 결제 내역(my-map) 기준 방문 횟수가 가장 많은 업종 = 취향
        const byCategory = myMerchants.reduce<Record<string, number>>((acc, m) => {
          acc[m.category] = (acc[m.category] ?? 0) + m.visitCount;
          return acc;
        }, {});
        const topCategory =
          Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        setFavoriteCategory(topCategory);

        // 지금 있는 지역의 단골 보증 지도에서 같은 업종 우선, 없으면 랭킹 1위
        const sorted = [...vouched].sort((a, b) => a.rank - b.rank);
        const sameCategory = topCategory
          ? sorted.find((m) => m.category === topCategory)
          : null;
        setRecommendation(sameCategory ?? sorted[0] ?? null);
      })
      .finally(() => setLoading(false));
  }, [targetRegion]);

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
          <p className="font-greeting text-[20px] font-bold text-neutral-900 leading-snug">
            {greeting}
          </p>
        </div>

        <p className="mt-3 text-[15px] text-neutral-700 leading-relaxed">
          {loading
            ? '최근 결제 내역을 확인하고 있어요...'
            : recommendation && favoriteCategory
            ? `최근 ${favoriteCategory} 자주 가셨죠? 이 근처 단골 많은 ${recommendation.name}, 한번 가보세요`
            : recommendation
            ? `이 근처 단골들이 많이 찾는 ${recommendation.name}을 추천해요`
            : `${targetRegion}에서 취향에 맞는 가게를 찾고 있어요`}
        </p>

        <button
          onClick={() => onOpenMap(targetRegion)}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-white/80 backdrop-blur px-4 py-3 text-[15px] font-semibold text-neutral-900 shadow-sm active:scale-[0.99] transition disabled:opacity-50"
        >
          단골 보증 지도 열기 ↗
        </button>
      </div>
    </div>
  );
}