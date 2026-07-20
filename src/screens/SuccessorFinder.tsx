import { ScreenHeader } from '../components/ScreenHeader';

export function SuccessorFinder({
  onBack,
  onGoSuccessor,
}: {
  onBack: () => void;
  onGoSuccessor: () => void; // 대현문구 등 후속 가게 페이지로 이동
}) {
  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title="대체 가게 찾기" onBack={onBack} />

      <div className="px-4 pt-4 pb-8 space-y-6">
        {/* 상단 녹색 정보 카드 */}
        <div
          className="rounded-2xl px-5 py-5 text-[15px] leading-relaxed"
          style={{ background: 'linear-gradient(135deg, #E0F5E9, #F0FAF4)' }}
        >
          <p className="font-bold text-neutral-900">
            산격문구는 2022년 11월에 폐업했습니다
          </p>
          <p className="mt-1 text-neutral-700">
            당신은 14회 방문한 단골이었습니다
          </p>
        </div>

        {/* 번호 리스트 */}
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-[15px] font-medium text-neutral-700 mt-0.5">
              1
            </div>
            <p className="text-[15px] text-neutral-800 leading-relaxed">
              같은 시절 이곳 단골이던 <span className="font-semibold">11명</span>을 찾았습니다
            </p>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-[15px] font-medium text-neutral-700 mt-0.5">
              2
            </div>
            <p className="text-[15px] text-neutral-800 leading-relaxed">
              그중 <span className="font-semibold">6명</span>이 지금도 대구에서 문구를 삽니다
            </p>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-[15px] font-medium text-neutral-700 mt-0.5">
              3
            </div>
            <p className="text-[15px] text-neutral-800 leading-relaxed">
              같은 골목의 <span className="font-semibold">대현문구</span>로 가장 많이 옮겼습니다
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <button
          onClick={onGoSuccessor}
          className="w-full mt-8 rounded-2xl py-4 text-[17px] font-semibold text-neutral-900 active:scale-[0.985] transition"
          style={{ background: '#FFF9D9' }}
        >
          대현문구 보러가기 →
        </button>
      </div>
    </div>
  );
}