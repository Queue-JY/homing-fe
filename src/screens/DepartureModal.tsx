export function DepartureModal({
  onOpenMap,
  onDismiss,
}: {
  onOpenMap: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />
      <div
        className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-2xl p-6 shadow-xl"
        style={{ background: 'linear-gradient(155deg,#EAFBE0 0%,#F3FBEF 55%,#FFFFFF 100%)' }}
      >
        <p className="text-[20px] font-bold text-neutral-900 leading-snug">
          예전에 자주 방문했던 단골집,<br />아직 그대로 있을까요?
        </p>
        <p className="mt-3 text-[15px] text-neutral-700 leading-relaxed">
          폐업 확인 후 다시 찾아가보세요.
        </p>
        <button
          onClick={onOpenMap}
          className="mt-4 w-full rounded-xl bg-white/80 backdrop-blur px-4 py-3 text-[15px] font-semibold text-neutral-900 shadow-sm active:scale-[0.99] transition"
        >
          나의 지도로 이동 ↗
        </button>
      </div>
    </div>
  );
}