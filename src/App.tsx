import { useState } from 'react';
import { MyMap } from './screens/MyMap';
import { RegionModal } from './screens/RegionModal';
import { VouchedMap } from './screens/VouchedMap';
import { MerchantDetail } from './screens/MerchantDetail';
import { OwnerDashboard } from './screens/OwnerDashboard';
import { OutreachDemo } from './screens/OutreachDemo';
import type { Region } from './types';

type Screen =
  | { name: 'myMap' }
  | { name: 'modal' }
  | { name: 'vouchedMap'; region?: Region }
  | { name: 'merchantDetail'; merchantId: number; merchantName: string; reason: string }
  | { name: 'ownerDashboard'; merchantId: number }
  | { name: 'outreachDemo'; merchantId: number; merchantName: string; message: string };

// 데모/개발 중 화면 흐름을 안 타고 바로바로 확인하기 위한 스위처.
// 배포 전에는 이 배열 + 아래 스위처 바(<div className="... bg-neutral-800">)만 지우면 됨.
const DEV_SCREENS: { label: string; screen: Screen }[] = [
  { label: '① 나의 지도', screen: { name: 'myMap' } },
  { label: '② 모달', screen: { name: 'modal' } },
  { label: '③ 보증지도', screen: { name: 'vouchedMap', region: '서울' } },
  {
    label: '④ 가게상세',
    screen: {
      name: 'merchantDetail',
      merchantId: 1,
      merchantName: '가게 상세 (더미)',
      reason: '3년간 47회 방문 · 재학시절 터줏대감',
    },
  },
  { label: '⑤ 사장님대시보드', screen: { name: 'ownerDashboard', merchantId: 1 } },
  {
    label: '⑥ 소식보내기결과',
    screen: {
      name: 'outreachDemo',
      merchantId: 1,
      merchantName: '행복분식',
      message: '신메뉴 마라라면 출시',
    },
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'modal' });

  return (
    <div className="w-full h-screen flex flex-col items-center bg-neutral-200">
      {/* 개발용 스위처 - 배포 전 이 블록 통째로 삭제 */}
      <div className="w-full flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2 bg-neutral-800">
        {DEV_SCREENS.map((s) => (
          <button
            key={s.label}
            onClick={() => setScreen(s.screen)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-700 text-neutral-100 text-[12px] whitespace-nowrap"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-[420px] flex-1 bg-white overflow-y-auto">
        {screen.name === 'myMap' && (
          <MyMap
            onBack={() => setScreen({ name: 'modal' })}
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

        {screen.name === 'modal' && (
          <RegionModal
            onOpenMap={(region) => setScreen({ name: 'vouchedMap', region: region as Region })}
            onDismiss={() => setScreen({ name: 'vouchedMap' })}
          />
        )}

        {screen.name === 'vouchedMap' && (
          <VouchedMap
            initialRegion={screen.region}
            onBack={() => setScreen({ name: 'modal' })}
            onSelectMerchant={(id) =>
              // 데모: 상세로 넘어갈 때 이름/판정문구는 실제로는 my-map 응답에서 가져와야 함.
              // 여기서는 화면 전환 시연을 위해 임시로 표시값을 넘김 - 실제 연동 시 API 응답으로 교체.
              setScreen({
                name: 'merchantDetail',
                merchantId: id,
                merchantName: '가게 상세',
                reason: '단골 인증 판정 근거가 여기에 표시됩니다',
              })
            }
          />
        )}

        {screen.name === 'merchantDetail' && (
          <MerchantDetail
            merchantId={screen.merchantId}
            merchantName={screen.merchantName}
            reason={screen.reason}
            onBack={() => setScreen({ name: 'vouchedMap' })}
          />
        )}

        {screen.name === 'ownerDashboard' && (
          <OwnerDashboard
            merchantId={screen.merchantId}
            onBack={() =>
              setScreen({
                name: 'merchantDetail',
                merchantId: screen.merchantId,
                merchantName: '',
                reason: '',
              })
            }
            onSend={(message) =>
              setScreen({
                name: 'outreachDemo',
                merchantId: screen.merchantId,
                merchantName: '',
                message,
              })
            }
          />
        )}

        {screen.name === 'outreachDemo' && (
          <OutreachDemo
            merchantName={screen.merchantName}
            message={screen.message}
            regionLine="대명동 맛맛분식 아직 있어요. 시험기간마다 밤새우던 그곳에서 마라라면이 새로 나왔대요."
            onClose={() => setScreen({ name: 'ownerDashboard', merchantId: screen.merchantId })}
          />
        )}
      </div>
    </div>
  );
}
