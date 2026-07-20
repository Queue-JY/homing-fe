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

type Screen =
  | { name: 'departureModal' }
  | { name: 'visitorModal' }
  | { name: 'myMap' }
  | { name: 'successorFinder' }
  | { name: 'vouchedMap'; region?: Region }
  | { name: 'merchantDetail'; merchantId: number; merchantName: string; reason: string }
  | { name: 'ownerDashboard'; merchantId: number }
  | { name: 'outreachDemo'; merchantId: number; greeting: string; body: string };

const FLOWS = ['출향인', '외지인', '소상공인'] as const;
type FlowKey = typeof FLOWS[number];

// 각 시나리오의 시작 화면
const FLOW_ENTRY: Record<FlowKey, Screen> = {
  출향인: { name: 'departureModal' },
  외지인: { name: 'visitorModal' },
  소상공인: { name: 'ownerDashboard', merchantId: 1 },
};

export default function App() {
  const [showNotice, setShowNotice] = useState(true);
  const [screen, setScreen] = useState<Screen | null>(null);

  const startFlow = (key: FlowKey) => setScreen(FLOW_ENTRY[key]);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-neutral-200">
      {/* 상단 스위처: 3개 시나리오만 노출 */}
      <div className="w-full flex gap-2 justify-center px-3 py-2 bg-neutral-800">
        {FLOWS.map((key) => (
          <button
            key={key}
            onClick={() => startFlow(key)}
            className="px-4 py-1.5 rounded-full bg-neutral-700 text-neutral-100 text-[13px] font-medium"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="w-full max-w-[420px] flex-1 bg-white overflow-y-auto relative">
        {showNotice && <NoticeModal onClose={() => setShowNotice(false)} />}

        {!screen && !showNotice && (
          <div className="py-24 text-center text-neutral-400 text-sm">
            위 버튼을 눌러 시나리오를 선택해주세요
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
                merchantName: '대현문구',
                reason: '산격문구 단골들이 가장 많이 이동한 가게',
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
            onGoSuccessor={() => setScreen({ name: 'successorFinder' })}
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
  );
}