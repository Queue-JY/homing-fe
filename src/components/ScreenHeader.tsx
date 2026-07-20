import { Home, Heart, MessageCircle } from 'lucide-react';

export function ScreenHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={onBack}
        className="font-header flex items-center gap-2 text-[15px] font-semibold text-neutral-900"
      >
        <span className="text-lg">←</span>
        {title}
      </button>
      <div className="flex items-center gap-3 text-neutral-500">
        <Home size={20} strokeWidth={1.8} />
        <MessageCircle size={20} strokeWidth={1.8} />
        <Heart size={20} strokeWidth={1.8} />
      </div>
    </div>
  );
}
