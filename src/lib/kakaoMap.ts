// map-poc.html의 <script src="...sdk.js?...&autoload=false"> + kakao.maps.load() 패턴을
// React에서 재사용 가능하게 감싼 로더. 여러 화면에서 지도를 써도 스크립트 태그는 한 번만 삽입됨.

declare global {
  interface Window {
    kakao: any;
  }
}

let loadPromise: Promise<void> | null = null;

export function loadKakaoMapSdk(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const appkey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!appkey) {
      reject(new Error('VITE_KAKAO_JS_KEY가 .env에 없음'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      // map-poc.html과 동일하게 autoload=false로 받아서 수동으로 load
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () =>
      reject(
        new Error(
          '카카오맵 SDK 로드 실패 - 디벨로퍼스에 이 도메인이 등록됐는지 확인 (401 domain mismatched 가능성)'
        )
      );
    document.head.appendChild(script);
  });

  return loadPromise;
}
