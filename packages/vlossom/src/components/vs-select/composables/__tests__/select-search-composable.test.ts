import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useSelectSearch } from '../select-search-composable';
import type { VsSelectSearchPropType } from '../../types';

describe('useSelectSearch', () => {
    describe('초기 상태', () => {
        it('search가 false일 때 isUsingSearch는 false를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(false);

            // when
            const { isUsingSearch } = useSelectSearch(search);

            // then
            expect(isUsingSearch.value).toBe(false);
        });

        it('search가 true일 때 isUsingSearch는 true를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(true);

            // when
            const { isUsingSearch } = useSelectSearch(search);

            // then
            expect(isUsingSearch.value).toBe(true);
        });
    });

    describe('isUsingSearch', () => {
        it('search가 객체이고 useRegex가 정의되어 있으면 true를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({ useRegex: true });

            // when
            const { isUsingSearch } = useSelectSearch(search);

            // then
            expect(isUsingSearch.value).toBe(true);
        });

        it('search가 객체이고 useCaseSensitive가 정의되어 있으면 true를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({ useCaseSensitive: true });

            // when
            const { isUsingSearch } = useSelectSearch(search);

            // then
            expect(isUsingSearch.value).toBe(true);
        });

        it('search가 객체이고 placeholder가 정의되어 있으면 true를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({ placeholder: 'Search...' });

            // when
            const { isUsingSearch } = useSelectSearch(search);

            // then
            expect(isUsingSearch.value).toBe(true);
        });

        it('search가 빈 객체이면 false를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({});

            // when
            const { isUsingSearch } = useSelectSearch(search);

            // then
            expect(isUsingSearch.value).toBe(false);
        });

        it('search 값이 변경되면 반응적으로 업데이트되어야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(false);
            const { isUsingSearch } = useSelectSearch(search);

            expect(isUsingSearch.value).toBe(false);

            // when
            search.value = true;

            // then
            expect(isUsingSearch.value).toBe(true);

            // when
            search.value = false;

            // then
            expect(isUsingSearch.value).toBe(false);
        });
    });

    describe('searchProps - boolean 타입', () => {
        it('search가 true일 때 기본 searchProps를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(true);

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value).toEqual({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            });
        });

        it('search가 false일 때도 기본 searchProps를 반환해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(false);

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value).toEqual({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            });
        });
    });

    describe('searchProps - 객체 타입', () => {
        it('useRegex가 명시되면 해당 값을 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({ useRegex: false });

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value.useRegex).toBe(false);
        });

        it('useRegex가 명시되지 않으면 기본값 true를 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({});

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value.useRegex).toBe(true);
        });

        it('useCaseSensitive가 명시되면 해당 값을 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({ useCaseSensitive: false });

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value.useCaseSensitive).toBe(false);
        });

        it('useCaseSensitive가 명시되지 않으면 기본값 true를 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({});

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value.useCaseSensitive).toBe(true);
        });

        it('placeholder가 명시되면 해당 값을 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({ placeholder: 'Search options...' });

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value.placeholder).toBe('Search options...');
        });

        it('placeholder가 명시되지 않으면 빈 문자열을 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({});

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value.placeholder).toBe('');
        });

        it('모든 속성을 명시한 경우 해당 값들을 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({
                useRegex: false,
                useCaseSensitive: false,
                placeholder: 'Custom placeholder',
            });

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value).toEqual({
                useRegex: false,
                useCaseSensitive: false,
                placeholder: 'Custom placeholder',
            });
        });

        it('일부 속성만 명시한 경우 나머지는 기본값을 사용해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({
                useRegex: false,
            });

            // when
            const { searchProps } = useSelectSearch(search);

            // then
            expect(searchProps.value).toEqual({
                useRegex: false,
                useCaseSensitive: true,
                placeholder: '',
            });
        });
    });

    describe('반응성 테스트', () => {
        it('search 값이 boolean에서 객체로 변경되면 searchProps가 업데이트되어야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(true);
            const { searchProps } = useSelectSearch(search);

            expect(searchProps.value).toEqual({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            });

            // when
            search.value = {
                useRegex: false,
                useCaseSensitive: false,
                placeholder: 'New placeholder',
            };

            // then
            expect(searchProps.value).toEqual({
                useRegex: false,
                useCaseSensitive: false,
                placeholder: 'New placeholder',
            });
        });

        it('search 객체의 속성이 변경되면 searchProps가 업데이트되어야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: 'Search',
            });
            const { searchProps } = useSelectSearch(search);

            expect(searchProps.value.placeholder).toBe('Search');

            // when
            search.value = {
                ...(search.value as any),
                placeholder: 'Updated Search',
            };

            // then
            expect(searchProps.value.placeholder).toBe('Updated Search');
        });
    });

    describe('통합 테스트', () => {
        it('전체 라이프사이클이 올바르게 동작해야 한다', () => {
            // given
            const search = ref<VsSelectSearchPropType>(false);
            const { isUsingSearch, searchProps } = useSelectSearch(search);

            // 초기 상태 - search false
            expect(isUsingSearch.value).toBe(false);
            expect(searchProps.value).toEqual({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            });

            // when - search true로 변경
            search.value = true;

            // then
            expect(isUsingSearch.value).toBe(true);
            expect(searchProps.value).toEqual({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            });

            // when - search 객체로 변경
            search.value = {
                useRegex: false,
                useCaseSensitive: true,
                placeholder: 'Type to search',
            };

            // then
            expect(isUsingSearch.value).toBe(true);
            expect(searchProps.value).toEqual({
                useRegex: false,
                useCaseSensitive: true,
                placeholder: 'Type to search',
            });

            // when - 빈 객체로 변경
            search.value = {};

            // then
            expect(isUsingSearch.value).toBe(false);
            expect(searchProps.value).toEqual({
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            });
        });
    });
});
