import { useEffect, useMemo, useState } from 'react';
import { getMyMap } from '../lib/api';
import { ScreenHeader } from '../components/ScreenHeader';
import { MascotAvatar, UserAvatar, MoreAvatar, LockedAvatar } from '../components/Avatar';
import { SUPPORTED_REGIONS, type Region, type MyMapMerchant } from '../types';

const DEMO_USER_ID = 1;

// ⚠️ "이 가게 단골" 아바타 목록(누가 단골인지 이름 리스트)을 내려주는 API가 문서상 없음.
// outreach/potential-customers는 다른 목적(집계/영입 대상)이라 이 화면엔 안 맞음.
// 백엔드에 "가게별 단골 유저 목록" 엔드포인트 추가를 요청하기 전까지는 데모용 목업으로 채움.
const DEMO_REGULARS = [
  { name: '주연', locked: false },
  { name: '민준', locked: false },
  { name: '?', locked: true },
];
const DEMO_MORE_COUNT = 31;

export function MerchantDetail({
  merchantId,
  merchantName,
  reason,
  onBack,
}: {
  merchantId: number;
  merchantName: string;
  reason: string;
  onBack: () => void;
}) {
  const [region, setRegion] = useState<Region>('대구');
  const [myMerchants, setMyMerchants] = useState<MyMapMerchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMap(DEMO_USER_ID)
      .then(setMyMerchants)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => myMerchants.filter((m) => m.regionLabel.includes(region)),
    [myMerchants, region]
  );

  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title={merchantName} onBack={onBack} />

      <div className="px-4">
        {/* 단골 인증 카드 - reason은 규칙 엔진이 만든 문장을 그대로 노출 */}
        <div
          className="rounded-2xl px-4 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg,#EAFBE0,#F3FBEF)' }}
        >
          <p className="text-[16px] font-bold text-neutral-900 leading-snug">{reason}</p>
          <div className="shrink-0 ml-3 w-14 h-14 rounded-full bg-white grid place-items-center text-[11px] font-semibold text-[#1F5B36] text-center leading-tight shadow-sm">
            단골
            <br />
            인증
          </div>
        </div>

        <p className="mt-4 mb-2 text-[13px] text-neutral-500">이 가게 단골</p>
        <div className="flex items-center">
          {DEMO_REGULARS.map((r, i) =>
            r.locked ? (
              <LockedAvatar key={i} size={38} />
            ) : (
              <UserAvatar key={i} name={r.name} size={38} />
            )
          )}
          <MoreAvatar count={DEMO_MORE_COUNT} size={38} />
        </div>

        <div className="flex items-center gap-1 mt-6 mb-2">
          <UserAvatar name="주" size={30} />
          <MascotAvatar size={30} />
        </div>

        {/* 지역 탭 - 내 단골 지도(my-map)를 지역별로 필터링해서 재사용 */}
        <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
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

        <div className="space-y-1 pb-6">
          {loading && <div className="py-8 text-center text-neutral-400 text-sm">불러오는 중...</div>}
          {!loading && filtered.length === 0 && (
            <div className="py-8 text-center text-neutral-400 text-sm">
              {region}에는 아직 방문 기록이 없어요.
            </div>
          )}
          {!loading &&
            filtered.map((m) => (
              <div key={m.merchantId} className="py-2.5">
                <p className="text-[15px] font-semibold text-neutral-900">{m.name}</p>
                <p className="text-[13px] text-neutral-500">재방문 {m.visitCount}회</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
