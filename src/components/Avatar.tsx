// 마스코트 캐릭터 이미지는 디자인팀이 준 에셋을 public/mascot-bird.png 로 넣어서 쓰면 됨.
// (지금은 파일이 없어서 이모지로 폴백 - 실제 파일 받으면 MASCOT_SRC만 채우면 됨)
const MASCOT_SRC = '/mascot-bird.png';

export function MascotAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center overflow-hidden shrink-0 ring-2 ring-white shadow-sm"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(160deg,#57FF9A,#43CE80 60%,#00C6A9)',
      }}
    >
      <img
        src={MASCOT_SRC}
        alt="마스코트"
        className="w-full h-full object-cover"
        onError={(e) => {
          // 에셋 없을 때 이모지로 폴백
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

const INITIAL_COLORS = ['#F58B54', '#6ADB86', '#4DD7C1', '#BDEA6A', '#43CE80'];

export function UserAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0) || '?';
  const color = INITIAL_COLORS[initial.charCodeAt(0) % INITIAL_COLORS.length];
  return (
    <div
      className="rounded-full grid place-items-center text-white font-semibold shrink-0 ring-2 ring-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
}

export function MoreAvatar({ count, size = 40 }: { count: number; size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center bg-neutral-200 text-neutral-600 font-medium shrink-0 ring-2 ring-white"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      +{count}
    </div>
  );
}

export function LockedAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center bg-neutral-300 shrink-0 ring-2 ring-white"
      style={{ width: size, height: size }}
    >
      🔒
    </div>
  );
}
