import './styles/index.css';
import './styles/index.scss';

console.log('Hello Vlossom');

export * from './declaration';
export * from './framework';

// 컴포넌트 exports (tree shaking 지원)
export * from './components';
// 전체 컴포넌트 맵 (named export로 tree shaking 최적화)
export { VlossomComponents } from './components/component-map';
// 컴포넌트 타입들 (타입만 따로 export로 tree shaking 최적화)
export * from './components/component-types';
