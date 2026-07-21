import { useState } from 'react';
import { MyMap } from './screens/MyMap';
import { RegionModal } from './screens/RegionModal';
import { DepartureModal } from './screens/DepartureModal';
import { VouchedMap } from './screens/VouchedMap';
import { MerchantDetail } from './screens/MerchantDetail';
import { OwnerDashboard } from './screens/OwnerDashboard';
import { OutreachDemo } from './screens/OutreachDemo';
import { SuccessorFinder } from './screens/SuccessorFinder';
import { NoticeModal } from './screens/NoticeModal';
import type { Region } from './types';
import logoImg from './assets/logo.png';
import { CommunityPage } from './screens/CommunityPage';

type Screen =
  | { name: 'departureModal' }
  | { name: 'visitorModal' }
  | { name: 'community' }
  | { name: 'myMap' }
  | { name: 'successorFinder' }
  | { name: 'vouchedMap'; region?: Region }
  | { name: 'merchantDetail'; merchantId: number; merchantName: string; reason: string }
  | { name: 'ownerDashboard'; merchantId: number }
  | { name: 'outreachDemo'; merchantId: number; greeting: string; body: string };

const FLOWS = ['출향인', '방문객', '소상공인', '커뮤니티'] as const;
type FlowKey = typeof FLOWS[number];

const FLOW_ENTRY: Record<FlowKey, Screen> = {
  출향인: { name: 'departureModal' },
  방문객: { name: 'visitorModal' },
  소상공인: { name: 'ownerDashboard', merchantId: 1 },
  커뮤니티: { name: 'community' },
};

export default function App() {
  const [showNotice, setShowNotice] = useState(true);
  const [screen, setScreen] = useState<Screen | null>(null);

  const startFlow = (key: FlowKey) => setScreen(FLOW_ENTRY[key]);

  return (
    // 💡 overflow-hidden 대신 overflow-x-auto를 적용하여 좁은 화면에서 가로 스크롤 허용
    <div className="w-full h-screen flex items-center bg-neutral-100 p-4 overflow-x-auto">
      {/* 중앙 메인 컨테이너 (min-w-max로 컨텐츠 최소 너비 보장 & mx-auto로 대화면 중앙 정렬) */}
      <div className="relative flex items-start gap-4 h-full max-h-[880px] mx-auto min-w-max">

        {/* 👈 스마트폰 좌측 바깥 날개 스위처 메뉴 (shrink-0으로 줄어듦 방지) */}
        <div className="flex flex-col gap-2 p-3 bg-white rounded-2xl shadow-md border border-neutral-200 shrink-0">
          <p className="text-[11px] font-bold text-neutral-400 px-2 pt-1 uppercase tracking-wider">
            시나리오
          </p>
          {FLOWS.map((key) => (
            <button
              key={key}
              onClick={() => startFlow(key)}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-left transition active:scale-95 flex items-center justify-between"
              style={{
                color: '#2A5235',
                backgroundColor: '#F0F8EC',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2F5D9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F8EC';
              }}
            >
              <span>{key}</span>
              <span className="text-[10px] text-[#5C8A67] ml-2">→</span>
            </button>
          ))}
        </div>

        {/* 📱 중앙 스마트폰 뷰 영역 (shrink-0 추가) */}
        <div className="w-[390px] h-full bg-white rounded-3xl shadow-xl overflow-y-auto relative border border-neutral-200 flex flex-col shrink-0">
          {showNotice && <NoticeModal onClose={() => setShowNotice(false)} />}

          {!screen && !showNotice && (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <img
                src={logoImg}
                alt="앱 로고"
                className="w-45 h-45 mb-4 object-contain"
              />
              <p className="font-semibold text-neutral-700 text-base mb-1">
                시나리오를 선택해주세요
              </p>
              <p className="text-xs text-neutral-400">
                좌측 날개 메뉴에서 [출향인 / 방문객 / 소상공인 / 커뮤니티]을 클릭하세요.
              </p>
            </div>
          )}

          {screen?.name === 'departureModal' && (
            <DepartureModal
              onOpenMap={() => setScreen({ name: 'myMap' })}
              onDismiss={() => setScreen({ name: 'myMap' })}
            />
          )}

          {screen?.name === 'visitorModal' && (
            <RegionModal
              onOpenMap={(region) => setScreen({ name: 'vouchedMap', region: region as Region })}
              onDismiss={() => setScreen({ name: 'vouchedMap' })}
            />
          )}

          {screen?.name === 'community' && (
            <CommunityPage
              onBack={() => startFlow('커뮤니티')}
              onSelectMerchant={(id) =>
                setScreen({
                  name: 'merchantDetail',
                  merchantId: id,
                  merchantName: '가게 상세',
                  reason: '단골 인증 판정 근거가 여기에 표시됩니다',
                })
              }
            />
          )}

          {screen?.name === 'myMap' && (
            <MyMap
              onBack={() => setScreen({ name: 'departureModal' })}
              onSelectMerchant={() => setScreen({ name: 'successorFinder' })}
            />
          )}

          {screen?.name === 'successorFinder' && (
            <SuccessorFinder
              onBack={() => setScreen({ name: 'myMap' })}
              onGoSuccessor={() =>
                setScreen({
                  name: 'merchantDetail',
                  merchantId: 2,
                  merchantName: '대현분식',
                  reason: '행복분식 단골들이 가장 많이 이동한 가게',
                })
              }
            />
          )}

          {screen?.name === 'vouchedMap' && (
            <VouchedMap
              initialRegion={screen.region}
              onBack={() => setScreen({ name: 'visitorModal' })}
              onSelectMerchant={(id) =>
                setScreen({
                  name: 'merchantDetail',
                  merchantId: id,
                  merchantName: '가게 상세',
                  reason: '단골 인증 판정 근거가 여기에 표시됩니다',
                })
              }
            />
          )}

          {screen?.name === 'merchantDetail' && (
            <MerchantDetail
              merchantName={screen.merchantName}
              reason={screen.reason}
              onBack={() => setScreen({ name: 'vouchedMap' })}
              onGoCommunity={() => setScreen({ name: 'community' })}
            />
          )}

          {screen?.name === 'ownerDashboard' && (
            <OwnerDashboard
              merchantId={screen.merchantId}
              onBack={() => startFlow('소상공인')}
              onSend={(greeting, body) =>
                setScreen({
                  name: 'outreachDemo',
                  merchantId: screen.merchantId,
                  greeting,
                  body,
                })
              }
            />
          )}

          {screen?.name === 'outreachDemo' && (
            <OutreachDemo
              greeting={screen.greeting}
              body={screen.body}
              onClose={() => setScreen({ name: 'ownerDashboard', merchantId: screen.merchantId })}
            />
          )}
        </div>

      </div>
    </div>
  );
}