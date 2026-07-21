import { useEffect, useMemo, useState } from 'react';
import { getMyMap } from '../lib/api';
import { ScreenHeader } from '../components/ScreenHeader';
import { SUPPORTED_REGIONS, type Region, type MyMapMerchant } from '../types';

const DEMO_USER_ID = 1;
type DemoMerchant = {
  merchantId: number;
  name: string;
  visitCount: number;
  regionLabel: string;
};

// ⚠️ "이 가게 단골" 아바타 목록(누가 단골인지 이름 리스트)을 내려주는 API가 문서상 없음.
// outreach/potential-customers는 다른 목적(집계/영입 대상)이라 이 화면엔 안 맞음.
// 백엔드에 "가게별 단골 유저 목록" 엔드포인트 추가를 요청하기 전까지는 데모용 목업으로 채움.
// isMe: 로그인한 본인(주연)이면 true → 실제 getMyMap 데이터를 보여주고,
// 그 외 공개 유저는 아직 "다른 유저의 단골 지도" 조회 API가 없어 데모 목업으로 대체.
const DEMO_REGULARS = [
  { name: '주연', locked: false, isMe: true },
  { name: '민준', locked: false, isMe: false },
  { name: '수현', locked: false, isMe: false },
  { name: '지은', locked: false, isMe: false },
  { name: '?', locked: true, isMe: false },
];

const DEMO_MORE_COUNT = 29;

const DEMO_OTHER_MAP: Record<string, DemoMerchant[]> = {
  민준: [
    { merchantId: 901, name: '별빛 서점', visitCount: 8, regionLabel: '대구 중구' },
    { merchantId: 902, name: '해오름 국밥', visitCount: 15, regionLabel: '대구 남구' },
    { merchantId: 903, name: '카페 브리즈', visitCount: 6, regionLabel: '대구 수성구' },
  ],
  수현: [
    { merchantId: 904, name: '행복분식', visitCount: 21, regionLabel: '대구 북구' },
    { merchantId: 905, name: '모퉁이 서점', visitCount: 12, regionLabel: '대구 중구' },
    { merchantId: 906, name: '오늘의커피', visitCount: 17, regionLabel: '대구 달서구' },
  ],
  지은: [
    { merchantId: 907, name: '대현문구', visitCount: 18, regionLabel: '대구 북구' },
    { merchantId: 908, name: '연경김밥', visitCount: 11, regionLabel: '대구 동구' },
    { merchantId: 909, name: '달빛식당', visitCount: 9, regionLabel: '대구 중구' },
    { merchantId: 910, name: '카페온', visitCount: 5, regionLabel: '대구 수성구' },
  ],
};

const PAGE_BG = '#FFFFFF';
const CARD_GRADIENT = 'linear-gradient(135deg,#ECF9F2 0%, #F5FCF8 100%)';
const PRIMARY = '#6EB58C';
const MUTED = '#7E8B84';
const ACCENT_BG = '#DDF3CE';
const BORDER_SOFT = '#E8EFEA';
const CTA_BG = '#FFE9A9';
const LOCK_BG = '#F4F5F4';
const LOCK_ICON = '#9EA7A1';

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={LOCK_ICON}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="9" rx="2.2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function MerchantDetail({
  merchantName,
  reason,
  onBack,
  onGoCommunity,
}: {
  merchantName: string;
  reason: string;
  onBack: () => void;
  onGoCommunity: () => void;
}) {
  const [region, setRegion] = useState<Region>('대구');
  const [myMerchants, setMyMerchants] = useState<MyMapMerchant[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<{ name: string; isMe: boolean; locked: boolean }>({
    name: '주연',
    isMe: true,
    locked: false,
  });

  useEffect(() => {
    getMyMap(DEMO_USER_ID)
      .then(setMyMerchants)
      .finally(() => setLoading(false));
  }, []);

  const activeMapData = selected.locked
    ? []
    : selected.isMe
    ? myMerchants
    : DEMO_OTHER_MAP[selected.name] ?? [];

  const filtered = useMemo(
    () => activeMapData.filter((m) => m.regionLabel.includes(region)),
    [activeMapData, region]
  );

  return (
    <div className="min-h-full" style={{ background: PAGE_BG }}>
      <ScreenHeader title={merchantName} onBack={onBack} />

      <div className="px-4">
        {/* 단골 인증 카드 - reason은 규칙 엔진이 만든 문장을 그대로 노출 */}
        <div
          className="rounded-2xl px-4 py-4 flex items-center justify-between"
          style={{ background: CARD_GRADIENT, boxShadow: '0 6px 18px rgba(39,140,111,0.08)' }}
        >
          <p className="text-[16px] font-bold leading-snug" style={{ color: '#222' }}>
            {reason}
          </p>
          <div
            className="shrink-0 ml-3 w-14 h-14 rounded-full bg-white grid place-items-center text-[11px] font-semibold text-center leading-tight shadow-sm"
            style={{ color: '#222', border: `2px solid ${PRIMARY}` }}
          >
            단골
            <br />
            인증
          </div>
        </div>

        {/* 이 가게 커뮤니티로 이동 */}
        <div className="mt-4">
          <button
            onClick={onGoCommunity}
            className="w-full rounded-xl py-3 text-[15px] font-semibold text-neutral-900 transition active:scale-[0.98]"
            style={{ background: CTA_BG }}
          >
            커뮤니티 가기 →
          </button>
        </div>

        <div className="flex items-baseline justify-between mt-6 mb-2.5">
          <p className="text-[13px] font-medium" style={{ color: MUTED }}>
            이 가게 단골 리스트
          </p>
        </div>

        {/* 단골 아바타 - 탭하면 그 사람의 단골 지도(방문 기록)로 전환 */}
        <div className="flex items-center gap-2">
          {DEMO_REGULARS.map((r, i) => {
            const isSelected = !r.locked && selected.name === r.name;
            return (
              <button
                key={i}
                onClick={() =>
                  r.locked
                    ? setSelected({ name: r.name, isMe: false, locked: true })
                    : setSelected({ name: r.name, isMe: r.isMe, locked: false })
                }
                className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-bold transition"
                style={
                  r.locked
                    ? {
                        background: LOCK_BG,
                        border: `1px solid ${BORDER_SOFT}`,
                        boxShadow: selected.locked ? `0 0 0 2px ${ACCENT_BG}` : 'none',
                      }
                    : {
                        background: ACCENT_BG,
                        color: '#000000',
                        boxShadow: isSelected ? `0 0 0 2px ${ACCENT_BG}` : 'none',
                      }
                }
              >
                {r.locked ? <LockIcon /> : r.name.slice(0, 1)}
              </button>
            );
          })}
          <div
            className="w-9 h-9 rounded-full grid place-items-center text-[11px] font-semibold"
            style={{ background: '#EFF6EC', color: MUTED }}
          >
            +{DEMO_MORE_COUNT}
          </div>
        </div>

        {/* 선택된 단골의 단골 지도 안내 */}
        <div className="mt-4 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5" style={{ background: '#F0F8EC' }}>
          {selected.locked ? (
            <>
              <div className="w-8 h-8 shrink-0 rounded-full grid place-items-center" style={{ background: LOCK_BG }}>
                <LockIcon size={13} />
              </div>
              <p className="text-[13px] font-medium" style={{ color: MUTED }}>
                비공개 단골이에요. 지도를 볼 수 없어요.
              </p>
            </>
          ) : (
            <>
              <div
                className="w-8 h-8 shrink-0 rounded-full grid place-items-center text-[11px] font-bold text-black"
                style={{ background: '#ffffff' }}
              >
                {selected.name.slice(0, 1)}
              </div>
              <p className="text-[13px] font-medium" style={{ color: '#000000' }}>
                {selected.name}
                {selected.isMe ? ' (나)' : ''}님의 단골 지도
              </p>
            </>
          )}
        </div>

        {/* 지역 탭 */}
        <div className="flex gap-2 pb-3 pt-4 overflow-x-auto no-scrollbar">
          {SUPPORTED_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className="px-3.5 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition"
              style={
                region === r
                  ? { background: ACCENT_BG, color: PRIMARY }
                  : { background: 'transparent', color: MUTED }
              }
            >
              {r}
            </button>
          ))}
        </div>

        <div className="space-y-1 pb-6">
          {loading && (
            <div className="py-8 text-center text-sm" style={{ color: MUTED }}>불러오는 중...</div>
          )}
          {!loading && selected.locked && (
            <div className="py-8 text-center text-sm" style={{ color: MUTED }}>
              비공개 단골의 방문 기록은 볼 수 없어요.
            </div>
          )}
          {!loading && !selected.locked && filtered.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: MUTED }}>
              {region}에는 아직 방문 기록이 없어요.
            </div>
          )}
          {!loading &&
            !selected.locked &&
            filtered.map((m) => (
              <div key={m.merchantId} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: '#1B2E20' }}>{m.name}</p>
                  <p className="text-[13px]" style={{ color: MUTED }}>재방문 {m.visitCount}회</p>
                </div>
                <span
                  className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-[12px] font-bold"
                  style={{ background: ACCENT_BG, color: PRIMARY }}
                >
                  {m.visitCount}회
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}