## rules

- 문서 작성 체크리스트를 기존으로 만든다
- 문서는 기본적으로 영어/한국어로 작성한다, 파일이름 README.md, README.ko.md
- 문서 종류는 컴퍼넌트 / 플러그인 / 디렉티브 / 컴포저블 / 유틸 함수가 된다.
- 룰과 체크리스트를 만족하지 않는 경우 'FAIL'을 프롬프트로 반환한다.
- 룰과 체크리스트를 만족하는 경우 'OK'를 프롬프트로 반환한다.
- 체크리스트를 만족하지 않는 내용이 있는 경우('FAIL'), 체크리스트가 'OK'를 80% 이상 만족할 수 있도록 SKILL.md에 반영해야한다.

## common check list

- [ ] 문서 종류에 따른 README를 모두 대응했는가
- [ ] 섹션 구조가 문서 종류 유형에 맞추어 일치하는가
- [ ] 소스코드의 실제 기능을 **그대로** 반영하여 작성되었는가 
- [ ] 영어 문서와 한글 문서가 서로 내용이 일치하는가
- [ ] 영어 문서와 한글 문서를 서로 연결해주는 링크가 있는가
- [ ] SKILL.md를 5회 반복했는가

## component check list

- [ ] packages/vlossom/src/components/COMPONENT_README_TEMPLATE.md 의 섹션 구조를 만족하는가

## plugin check list

- [ ] packages/vlossom/src/plugins/PLUGIN_REAMDE_TEMPLATE.md

## diretive check list

- [ ] packages/vlossom/src/directives/DIRECTIVE_README_TEMPLATE.md 

## composable check list

- [ ] packages/vlossom/src/composables/COMPOSABLE_README_TEMPLATE.md

## util check list

- [ ] packages/vlossom/src/utils/UTIL_REAMDE_TEMPLATE.md 