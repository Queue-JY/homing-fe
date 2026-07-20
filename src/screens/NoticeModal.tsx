export function NoticeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-xl text-center">
        <p className="text-[17px] font-bold text-neutral-900 leading-snug">
          위 3가지 버튼을 눌러<br />원하는 시나리오를 체험해보세요
        </p>
        <div className="mt-4 flex justify-center gap-3 text-[13px] text-neutral-500">
          <span>출향인</span>·<span>외지인</span>·<span>소상공인</span>
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-neutral-900 text-white py-3 text-[15px] font-semibold"
        >
          확인
        </button>
      </div>
    </div>
  );
}