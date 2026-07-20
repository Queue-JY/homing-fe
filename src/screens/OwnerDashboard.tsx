import { useEffect, useState } from 'react';
import { getOutreach, getPotentialCustomers } from '../lib/api';
import { ScreenHeader } from '../components/ScreenHeader';
import type { OutreachSummary, PotentialCustomer } from '../types';

export function OwnerDashboard({
  merchantId,
  onBack,
  onSend,
}: {
  merchantId: number;
  onBack: () => void;
  onSend: (message: string) => void;
}) {
  const [outreach, setOutreach] = useState<OutreachSummary | null>(null);
  const [potential, setPotential] = useState<PotentialCustomer[] | null>(null);
  const [message, setMessage] = useState('');
  const [sendDeparted, setSendDeparted] = useState(true);
  const [sendPotential, setSendPotential] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOutreach(merchantId),
      getPotentialCustomers(merchantId),
    ])
      .then(([o, p]) => {
        setOutreach(o);
        setPotential(p);
      })
      .finally(() => setLoading(false));
  }, [merchantId]);

  const sendCount =
    (sendDeparted ? outreach?.totalDeparted ?? 0 : 0) +
    (sendPotential ? potential?.length ?? 0 : 0);

  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title="소식 보내기" onBack={onBack} />

      <div className="px-4 space-y-5 pb-8">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 text-sm">불러오는 중...</div>
        ) : (
          <>
            <div className="rounded-2xl bg-neutral-50 p-5">
              <label className="text-[14px] font-medium text-neutral-700">
                사장님 입력
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="예시) 신메뉴 마라라면 출시"
                rows={4}
                className="mt-3 w-full rounded-xl bg-white px-4 py-4 text-[18px] placeholder:text-neutral-400 outline-none resize-none"
              />
            </div>

            <div>
              <h3 className="text-[15px] font-bold mb-3">누구에게 보낼까요?</h3>

              <div
                className="rounded-2xl bg-neutral-50 p-4 flex items-center gap-4 cursor-pointer active:bg-neutral-100 transition"
                onClick={() => setSendDeparted(!sendDeparted)}
              >
                <input
                  type="checkbox"
                  checked={sendDeparted}
                  readOnly
                  className="w-5 h-5 accent-black"
                />
                <div className="flex-1">
                  <p className="text-neutral-500 text-[14px]">떠난 단골</p>
                  <p className="text-l font-bold text-neutral-900">
                    {outreach?.totalDeparted ?? 0}명
                  </p>
                </div>
              </div>

              <div
                className="mt-3 rounded-2xl bg-neutral-50 p-4 flex items-center gap-4 cursor-pointer active:bg-neutral-100 transition"
                onClick={() => setSendPotential(!sendPotential)}
              >
                <input
                  type="checkbox"
                  checked={sendPotential}
                  readOnly
                  className="w-5 h-5 accent-black"
                />
                <div className="flex-1">
                  <p className="text-neutral-500 text-[14px]">잠재 단골</p>
                  <p className="text-l font-bold text-neutral-900">
                    {potential?.length ?? 0}명
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[15px] font-bold mb-3">미리보기</h3>
              <div
                className="rounded-xl p-5 font-sans"
                style={{ background: '#F6F1DC' }}
              >
                <p className="font-bold text-[16px] tracking-tight">
                  대구 왔는교? 반갑데이!
                </p>
                <p className="mt-3 leading-relaxed text-[15.5px] text-neutral-800">
                  대명동 맛맛분식에 방문해보세요.
                  많은 사람들이 시험기간마다 밤새우던
                  그곳에서{' '}
                  <span className="font-medium">
                    {message || '신메뉴 마라라면'}
                  </span>
                  이 새로 나왔대요.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSend(message || '신메뉴 마라라면 출시')}
              className="mt-4 w-full rounded-xl py-4 text-[16px] font-semibold active:scale-[0.98] transition"
              style={{ background: '#FFE9A9' }}
            >
              {sendCount}명에게 전송하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}