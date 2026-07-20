import { useEffect, useState } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// ⚠️ 백엔드에 실제 문자/알림 발송 API가 없음 (outreach는 집계 API일 뿐).
// 이 화면은 피칭 데모용으로 "발송됐다면 이렇게 보일 것"을 프론트에서만 재현한 목업.
// 실제 서비스에서는 이 화면 대신 진짜 푸시 발송 연동이 필요함.
export function OutreachDemo({
  message,
  merchantName,
  regionLine,
  onClose,
}: {
  message: string;
  merchantName: string;
  regionLine: string; // 예: "대명동 맛맛분식 아직 있어요. 시험기간마다 밤새우던 그곳에서..."
  onClose: () => void;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const dateLabel = `${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEKDAYS[now.getDay()]}요일`;

  return (
    <div
      className="min-h-full flex flex-col items-center pt-14 px-6 relative cursor-pointer"
      style={{ background: 'linear-gradient(180deg,#F7E9B0 0%,#F7E9B0 60%,#A9D98C 100%)' }}
      onClick={onClose}
    >
      <span className="absolute top-3 right-4 text-[10px] tracking-wide text-black/40 font-medium">
        DEMO · 실제 발송 아님
      </span>

      <p className="text-[52px] font-semibold text-neutral-900 tracking-tight">
        {hh}:{mm}
      </p>
      <p className="text-[15px] text-neutral-700 mt-1">{dateLabel}</p>

      <div className="w-full mt-8 rounded-2xl bg-white/90 backdrop-blur px-4 py-3.5 shadow-lg flex gap-3">
        <div
          className="shrink-0 w-9 h-9 rounded-xl grid place-items-center text-white font-bold text-[13px]"
          style={{ background: 'linear-gradient(135deg,#57FF9A,#00C6A9)' }}
        >
          iM
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-neutral-900">iM Bank</p>
          <p className="text-[13.5px] text-neutral-700 leading-snug mt-0.5">
            {regionLine || `${merchantName} 소식이 도착했어요.`}
          </p>
          {message && (
            <p className="text-[13.5px] text-neutral-700 leading-snug mt-0.5">{message}</p>
          )}
        </div>
      </div>

      <div className="flex-1" />
      <div className="mb-10 text-[64px]">🐦</div>
    </div>
  );
}
