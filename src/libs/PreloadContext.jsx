import { createContext, useContext } from 'react';

// 클라이언트 환경 null
// 서버 환경 { done: false, promises: [] }
const PreloaderContext = createContext(null);
export default PreloaderContext;

export const Preloader = ({ resolve }) => {
    const preloadContext = useContext(preloadContext);
    if (!preloadContext) return null; // context 값이 유효하지 않다면 아무 것도 하지 않음
    if (preloadContext.done) return null; // 이미 작업이 끝났다면 아무것도 하지 않음

    // promise 배열에 프라미스 등록
    // 설령 resolve 함수가 프라미스를 반환하지 않더라도, 프라미스 취급을 하기 위해
    // Promise.resolve 함수 사용
    preloadContext.promises.push(Promise.resolve(resolve()));
    return null;
};
