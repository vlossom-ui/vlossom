# Vlossom 사용 가이드

Vlossom은 완전한 tree shaking을 지원합니다. 필요한 컴포넌트만 import하여 최적의 번들 크기를 달성하세요!

## 📖 사용 방법

### 0. 기본 사용법 (모든 컴포넌트 등록) ⭐

`VlossomComponents`를 import하여 모든 컴포넌트를 한 번에 등록합니다.

```typescript
import { createApp } from 'vue';
import { createVlossom, VlossomComponents } from 'vlossom';
import App from './App.vue';

const app = createApp(App);
app.use(
    createVlossom({
        components: VlossomComponents, // 모든 컴포넌트 등록
        theme: 'dark',
        colorScheme: { default: 'blue' },
    }),
);
app.mount('#app');
```

> ✨ **장점**: 간단한 import로 모든 Vlossom 컴포넌트 사용 가능
> ✅ **필수 요구사항**: VlossomComponents 또는 개별 컴포넌트를 반드시 지정해야 합니다.
> ⚠️ **참고**: VlossomComponents를 import하지 않으면 컴포넌트들은 번들에서 완전히 제외됩니다!

### 1. 최적화 사용법 (Tree Shaking) 🌲

필요한 컴포넌트만 직접 import하여 완전한 tree shaking을 실현합니다.

```typescript
import { createApp } from 'vue';
import { createVlossom, VsAvatar, VsButton } from 'vlossom';
import App from './App.vue';

const app = createApp(App);
app.use(
    createVlossom({
        components: { VsAvatar, VsButton }, // 필수! 필요한 컴포넌트만
        theme: 'dark',
        colorScheme: { VsButton: 'blue' },
    }),
);
app.mount('#app');
```

### 2. 개별 등록 (최소 번들)

Vlossom 기능 없이 순수 컴포넌트만 사용합니다.

```typescript
import { createApp } from 'vue';
import { VsAvatar, VsButton } from 'vlossom';
// VlossomComponents는 import하지 않음 → 나머지 컴포넌트 모두 제외!
import App from './App.vue';

const app = createApp(App);

// Vue 기본 API로 개별 등록
app.component('VsAvatar', VsAvatar);
app.component('VsButton', VsButton);

app.mount('#app');
```

## 📊 방법별 비교

|                   | 기본 사용법 ⭐ | 최적화 사용법 🌲 | 개별 등록  |
| ----------------- | :------------: | :--------------: | :--------: |
| **사용성**        |   ⭐⭐⭐⭐⭐   |     ⭐⭐⭐⭐     |   ⭐⭐⭐   |
| **Tree Shaking**  |      ⭐⭐      |    ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐ |
| **번들 크기**     |      최대      |       최소       |    최소    |
| **Vlossom 기능**  |       ✅       |        ✅        |     ❌     |
| **컴포넌트 등록** |      자동      |       자동       |    수동    |

## 🎯 언제 사용할까?

- **대부분의 경우** → 기본 사용법 ⭐ (모든 컴포넌트 사용, 빠른 개발)
- **성능 최적화가 중요한 프로덕션** → 최적화 사용법 🌲 (완전한 tree shaking)
- **극한 최적화가 필요한 경우** → 개별 등록 (Vlossom 기능 없이 순수 컴포넌트만)

**개선된 점:**

- 🎯 완전한 tree shaking 지원
- 📦 최적의 번들 크기
- 🚀 간단한 API

**최적화 과정:**

1. **사용자 선택**: 필요한 컴포넌트만 import
2. **명시적 등록**: components 옵션에 사용할 컴포넌트만 지정
3. **번들러 분석**: import하지 않은 컴포넌트는 완전 제거
4. **결과**: 최적의 번들 크기 달성

## 📁 최적화된 구조

```
src/
├── main.ts
├── framework/
│   └── vlossom-plugin.ts     # component 등록
├── components/
│   ├── index.ts              # 개별 컴포넌트를 named로 export
│   ├── component-map.ts      # 모든 component를 내보내는 파일
│   ├── component-types.ts    # component 타입들만 모아서 export
│   └── vs-button/
│       ├── VsButton.vue      # 컴포넌트
│       └── types.ts          # 컴포넌트별 타입
```

---
