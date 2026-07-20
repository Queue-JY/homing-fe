import { useEffect, useState } from 'react';
import { getOutreach, getPotentialCustomers, getTrend } from '../lib/api';
import { ScreenHeader } from '../components/ScreenHeader';
import { MascotAvatar } from '../components/Avatar';
import type { OutreachSummary, PotentialCustomer, MerchantTrend } from '../types';

export function OwnerDashboard({
  merchantId,
  onBack,
  onSend, // 실제 발송 없이 데모 화면(잠금화면 시뮬레이션)으로 넘어가는 콜백
}: {
  merchantId: number;
  onBack: () => void;
  onSend: (message: string) => void;
}) {
  const [outreach, setOutreach] = useState<OutreachSummary | null>(null);
  const [potential, setPotential] = useState<PotentialCustomer[] | null>(null);
  const [trend, setTrend] = useState<MerchantTrend | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOutreach(merchantId),
      getPotentialCustomers(merchantId),
      getTrend(merchantId),
    ])
      .then(([o, p, t]) => {
        setOutreach(o);
        setPotential(p);
        setTrend(t);
      })
      .finally(() => setLoading(false));
  }, [merchantId]);

  const latestPeriod = trend?.points[trend.points.length - 1];

  return (
    <div className="min-h-full bg-white">
      <ScreenHeader title="사장님 대시보드" onBack={onBack} />

      <div className="px-4 space-y-3 pb-8">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 text-sm">불러오는 중...</div>
        ) : (
          <>
            <StatCard label="떠난 단골" value={`${outreach?.totalDeparted ?? 0}명`} />
            <StatCard
              label="잠재 단골"
              value={`${potential?.length ?? 0}명 미방문`}
            />
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg,#EAFBE0,#F3FBEF)' }}
            >
              <span>⚠️</span>
              <p className="text-[15px] font-semibold text-neutral-900">
                신규 단골 {latestPeriod?.newDangolCount ?? 0}명 / {trend?.stagnantPeriods ?? 0}개월째
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 mb-2">
                <MascotAvatar size={26} />
                <p className="text-[15px] font-semibold text-neutral-900">소식 보내기</p>
              </div>

              <p className="text-[12px] text-neutral-400 mb-1.5">
                * 데모 버전이라 실제 문자/알림은 발송되지 않고, 발송 화면만 미리 보여드려요.
              </p>

              <label className="text-[13px] text-neutral-500 mb-1 block">사장님 입력</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="예) 신메뉴 마라라면 출시"
                rows={4}
                className="w-full rounded-xl bg-neutral-50 px-3.5 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none resize-none"
              />

              <button
                onClick={() => onSend(message || '신메뉴 마라라면 출시')}
                className="mt-3 w-full rounded-xl px-4 py-3 text-[15px] font-semibold text-white active:scale-[0.99] transition"
                style={{ background: 'linear-gradient(135deg,#57FF9A,#00C6A9)' }}
              >
                전송하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-50 px-4 py-3.5">
      <p className="text-[13px] text-neutral-500 mb-1">{label}</p>
      <p className="text-[20px] font-bold text-neutral-900">{value}</p>
    </div>
  );
}
