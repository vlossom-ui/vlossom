// tsc는 .vue 파일을 읽지 못한다. 테마에서 SFC를 import할 수 있게 타입만 알려 준다.
declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}
