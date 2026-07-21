import { useState } from 'react';
import { ScreenHeader } from '../components/ScreenHeader';

const PRIMARY = '#3E9169';
const MUTED = '#7E8B84';
const GREEN_BG = '#DDF3CE';
const YELLOW_BG = '#FFE9A9';
const YELLOW_SOFT = '#FFF4C7';

// ⚠️ "나(주연)"가 실제로 단골 인증된 가게 목록 (지난번 확인한 실제 my-map 응답 기반).
// 리뷰 작성 시 이 목록 안에서만 가게를 고를 수 있게 해서 "그 가게 단골만 글을 쓸 수 있다"는 제약을 구현.
const MY_DANGOL_MERCHANTS = [
  { merchantId: 1, merchantName: '행복분식', category: '분식', visitCount: 15, spanLabel: '400일' },
  { merchantId: 2, merchantName: '북문골목떡볶이', category: '분식', visitCount: 15, spanLabel: '400일' },
  { merchantId: 4, merchantName: '분순커피', category: '카페', visitCount: 15, spanLabel: '200일' },
];

type CertifiedReview = {
  id: number;
  merchantId: number;
  userName: string;
  isMe?: boolean;
  merchantName: string;
  category: string;
  visitCount: number;
  spanLabel: string;
  comment: string; // 사람이 직접 쓴 글 - AI가 대신 써주지 않음
};

// ⚠️ 백엔드에 "전체 단골 프로필/리뷰" API가 없어서 데모용 더미로 구성.
// badgePublic:true(단골 뱃지 공개)를 켠 사람만 이 피드에 뜬다는 설정.
const INITIAL_REVIEWS: CertifiedReview[] = [
  {
    id: 1,
    merchantId: 1,
    userName: '주연',
    isMe: true,
    merchantName: '행복분식',
    category: '분식',
    visitCount: 15,
    spanLabel: '400일',
    comment: '4년 내내 여기만 갔어요. 졸업하고도 생각나는 맛.',
  },
  {
    id: 2,
    merchantId: 3,
    userName: '민준',
    merchantName: '봄미용실',
    category: '미용',
    visitCount: 4,
    spanLabel: '210일',
    comment: '자주는 못 가도 늘 여기로 돌아가게 돼요.',
  },
  {
    id: 3,
    merchantId: 4,
    userName: '수현',
    merchantName: '오늘의커피',
    category: '카페',
    visitCount: 17,
    spanLabel: '260일',
    comment: '과제할 때마다 여기 아메리카노, 인생 카페.',
  },
  {
    id: 4,
    merchantId: 5,
    userName: '지은',
    merchantName: '대현문구',
    category: '문구',
    visitCount: 12,
    spanLabel: '150일',
    comment: '학기 시작마다 여기서 다이어리 샀어요.',
  },
];

type DemoProfile = { name: string; isMe?: boolean; merchantCount: number; topCategory: string };

const DEMO_PROFILES: DemoProfile[] = [
  { name: '주연', isMe: true, merchantCount: 3, topCategory: '분식' },
  { name: '민준', merchantCount: 2, topCategory: '미용' },
  { name: '수현', merchantCount: 4, topCategory: '카페' },
  { name: '지은', merchantCount: 3, topCategory: '문구' },
];

function BadgeAvatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold"
        style={{ background: PRIMARY, fontSize: size * 0.4 }}
      >
        {name.slice(0, 1)}
      </div>
      <div
        className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center border-2 border-white"
        style={{ width: size * 0.42, height: size * 0.42, background: YELLOW_BG }}
      >
        <svg width={size * 0.24} height={size * 0.24} viewBox="0 0 24 24" fill="none" stroke="#8A6A00" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
}

export function CommunityPage({
  onBack,
  onSelectMerchant,
}: {
  onBack: () => void;
  onSelectMerchant: (merchantId: number) => void;
}) {
  const [tab, setTab] = useState<'reviews' | 'profiles'>('reviews');
  const [reviews, setReviews] = useState<CertifiedReview[]>(INITIAL_REVIEWS);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState(MY_DANGOL_MERCHANTS[0].merchantId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const merchant = MY_DANGOL_MERCHANTS.find((m) => m.merchantId === selectedMerchantId)!;
    setReviews([
      {
        id: Date.now(),
        merchantId: merchant.merchantId,
        userName: '주연',
        isMe: true,
        merchantName: merchant.merchantName,
        category: merchant.category,
        visitCount: merchant.visitCount,
        spanLabel: merchant.spanLabel,
        comment: newComment.trim(),
      },
      ...reviews,
    ]);
    setNewComment('');
    setShowWriteForm(false);
  };

  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title="커뮤니티" onBack={onBack} />

      {/* 자동 소집 배너 - 가입은 필요 없지만, 글은 그 가게 진짜 단골만 직접 쓸 수 있다는 컨셉 */}
      <div className="px-4 pb-4">
        <div
          className="rounded-2xl px-4 py-4"
          style={{ background: `linear-gradient(135deg, ${GREEN_BG} 0%, ${YELLOW_SOFT} 100%)` }}
        >
          <p className="text-[14px] font-bold" style={{ color: '#1F5B36' }}>
            가입은 필요 없어요
          </p>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#3D4A3F' }}>
            결제 기록으로 단골 인증된 사람 <span className="font-bold">{reviews.length + 8}명</span>이
            이미 여기 모여있어요. 글은 그 가게의 진짜 단골만 직접 남길 수 있어요.
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 px-4 pb-3">
        {(['reviews', 'profiles'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-full text-[14px] font-medium transition"
            style={tab === t ? { background: PRIMARY, color: '#fff' } : { background: '#F5F5F3', color: MUTED }}
          >
            {t === 'reviews' ? '단골 인증 리뷰' : '단골 프로필'}
          </button>
        ))}
      </div>

      {tab === 'reviews' && (
        <div className="px-4 space-y-3 pb-8">
          {/* 리뷰 추가하기 */}
          {!showWriteForm ? (
            <button
              onClick={() => setShowWriteForm(true)}
              className="w-full rounded-xl py-3 text-[14px] font-semibold transition active:scale-[0.98]"
              style={{ background: YELLOW_BG, color: '#5C4400' }}
            >
              + 내 단골집에 리뷰 남기기
            </button>
          ) : (
            <div className="rounded-2xl border px-4 py-3.5" style={{ borderColor: '#EFEFEF' }}>
              <p className="text-[12px] mb-2" style={{ color: MUTED }}>
                내가 단골로 인증된 가게에서만 고를 수 있어요
              </p>
              <select
                value={selectedMerchantId}
                onChange={(e) => setSelectedMerchantId(Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-[14px] mb-2"
                style={{ borderColor: BORDER_LIKE }}
              >
                {MY_DANGOL_MERCHANTS.map((m) => (
                  <option key={m.merchantId} value={m.merchantId}>
                    {m.merchantName} ({m.visitCount}회 방문)
                  </option>
                ))}
              </select>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="이 가게에 대한 한 줄, 직접 남겨주세요"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-[14px] resize-none"
                style={{ borderColor: BORDER_LIKE }}
              />
              <div className="flex gap-2 mt-2.5">
                <button
                  onClick={() => setShowWriteForm(false)}
                  className="flex-1 rounded-lg py-2.5 text-[13px] font-medium"
                  style={{ background: '#F5F5F3', color: MUTED }}
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                  style={{ background: PRIMARY, color: '#fff' }}
                >
                  등록하기
                </button>
              </div>
            </div>
          )}

          {reviews.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectMerchant(r.merchantId)}
              className="w-full text-left rounded-2xl border px-4 py-3.5 transition active:scale-[0.99]"
              style={{ borderColor: '#EFEFEF' }}
            >
              <div className="flex items-start gap-3">
                <BadgeAvatar name={r.userName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[14px] font-semibold text-neutral-900">
                      {r.userName}
                      {r.isMe ? ' (나)' : ''}
                    </p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: YELLOW_BG, color: '#8A6A00' }}>
                      단골 인증
                    </span>
                    <span className="text-[12px]" style={{ color: MUTED }}>· {r.merchantName}</span>
                  </div>

                  <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-800">“{r.comment}”</p>

                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: GREEN_BG, color: '#1F5B36' }}>
                      {r.category}
                    </span>
                    <span className="text-[11px]" style={{ color: MUTED }}>
                      {r.visitCount}회 방문 · {r.spanLabel}째 단골
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'profiles' && (
        <div className="px-4 grid grid-cols-2 gap-2.5 pb-8">
          {DEMO_PROFILES.map((p) => (
            <div key={p.name} className="rounded-2xl border px-3.5 py-4 flex flex-col items-center text-center gap-2" style={{ borderColor: '#EFEFEF' }}>
              <BadgeAvatar name={p.name} size={44} />
              <div>
                <p className="text-[14px] font-semibold text-neutral-900">
                  {p.name}
                  {p.isMe ? ' (나)' : ''}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>{p.merchantCount}곳의 인증 단골</p>
                <span className="mt-1.5 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: GREEN_BG, color: '#1F5B36' }}>
                  주로 {p.topCategory}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const BORDER_LIKE = '#E5E5E5';