#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function kebabToPascal(kebab) {
    return kebab.split('-').map(capitalizeFirstLetter).join('');
}

function createComponent(componentName) {
    if (!componentName) {
        console.error('❌ 컴포넌트 이름을 입력해주세요.');
        console.log('사용법: pnpm component <componentName>');
        process.exit(1);
    }

    const kebabName = componentName.toLowerCase();
    const pascalName = kebabToPascal(kebabName);
    const folderName = `vs-${kebabName}`;

    const componentsDir = path.join(__dirname, '..', 'src', 'components');
    const componentDir = path.join(componentsDir, folderName);

    // 폴더가 이미 존재하는지 확인
    if (fs.existsSync(componentDir)) {
        console.error(`❌ '${folderName}' 폴더가 이미 존재합니다.`);
        process.exit(1);
    }

    // 폴더 생성
    fs.mkdirSync(componentDir, { recursive: true });

    // index.ts 파일 생성
    const indexContent = `export { default } from './${pascalName}.vue';
export * from './types';
`;

    // README.md 파일 생성
    const readmeContent = `# ${pascalName}

${pascalName} 컴포넌트에 대한 설명을 작성하세요.

## 사용법

\`\`\`vue
<template>
  <${pascalName} />
</template>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|      |      |         |             |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
|       |         |             |

## Slots

| Slot | Description |
|------|-------------|
|      |             |
`;

    // types.ts 파일 생성
    const typesContent = `export interface ${pascalName}Props {
  // props 타입 정의
}

export interface ${pascalName}Emits {
  // emits 타입 정의
}
`;

    // Vue 컴포넌트 파일 생성
    const vueContent = `<template>
  <div class="vs-${kebabName}">
    <!-- 컴포넌트 내용 -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { ${pascalName}Props, ${pascalName}Emits } from './types';

export default defineComponent({
  name: '${pascalName}',
  components: {},
  emits: [],
  props: {},
  setup(props, { emit }) {
    // 컴포넌트 로직
  },
});
</script>

<style scoped>
.vs-${kebabName} {
  /* 스타일 정의 */
}
</style>
`;

    // 파일들 생성
    fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);
    fs.writeFileSync(path.join(componentDir, 'README.md'), readmeContent);
    fs.writeFileSync(path.join(componentDir, 'types.ts'), typesContent);
    fs.writeFileSync(path.join(componentDir, `${pascalName}.vue`), vueContent);

    console.log(`✅ '${folderName}' 컴포넌트가 성공적으로 생성되었습니다!`);
    console.log(` 위치: ${componentDir}`);
    console.log('📄 생성된 파일들:');
    console.log('   - index.ts');
    console.log('   - README.md');
    console.log('   - types.ts');
    console.log(`   - ${pascalName}.vue`);
}

// 명령행 인수에서 컴포넌트 이름 가져오기
const componentName = process.argv[2];
createComponent(componentName);
