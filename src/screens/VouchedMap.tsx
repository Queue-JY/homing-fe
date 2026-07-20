import { useEffect, useState } from 'react';
import { getVouchedMap } from '../lib/api';
import { ScreenHeader } from '../components/ScreenHeader';
import { UserAvatar } from '../components/Avatar';
import { SUPPORTED_REGIONS, type Region, type VouchedMerchant } from '../types';

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

  useEffect(() => {
    setLoading(true);
    setError(false);
    getVouchedMap(region)
      .then((data) => setMerchants(data.sort((a, b) => a.rank - b.rank)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [region]);

  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title="단골 보증 지도" onBack={onBack} />

      {/* 지역 탭 */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {SUPPORTED_REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition ${
              region === r
                ? 'bg-[#DDF3CE] text-[#1F5B36]'
                : 'text-neutral-500'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="px-4 pb-2 text-[13px] text-neutral-400">방문 수가 아니라 단골 수 기준</p>

      <div className="px-4 space-y-2 pb-6">
        {loading && (
          <div className="py-16 text-center text-neutral-400 text-sm">불러오는 중...</div>
        )}
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
                <p className="text-[13px] text-neutral-500 mt-0.5">
                  단골 {m.dangolCount}명이 꼽은 노포
                </p>
              </div>
              {m.rank === 1 && <UserAvatar name={m.category} size={32} />}
            </button>
          ))}
      </div>
    </div>
  );
}
