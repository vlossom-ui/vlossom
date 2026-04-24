import { describe, it, expect, vi, afterEach } from 'vitest';
import { useClickOutside } from './../click-outside-composable';

describe('useClickOutside', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('excludedSelectors에 해당하는 요소를 클릭하면 콜백이 호출되지 않아야 한다', () => {
        // given
        const excludedElement = document.createElement('div');
        excludedElement.className = 'excluded';
        document.body.appendChild(excludedElement);

        const excludedSelectors = ['.excluded'];
        const callback = vi.fn();
        const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(excludedSelectors, callback);

        addClickOutsideListener();

        // when
        excludedElement.click();

        // then
        expect(callback).not.toHaveBeenCalled();

        // cleanup
        removeClickOutsideListener();
        document.body.removeChild(excludedElement);
    });

    it('excludedSelectors에 해당하지 않는 요소를 클릭하면 콜백이 호출되어야 한다', () => {
        // given
        const normalElement = document.createElement('div');
        normalElement.className = 'normal';
        document.body.appendChild(normalElement);

        const excludedSelectors = ['.excluded'];
        const callback = vi.fn();
        const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(excludedSelectors, callback);

        addClickOutsideListener();

        // when
        normalElement.click();

        // then
        expect(callback).toHaveBeenCalledTimes(1);

        // cleanup
        removeClickOutsideListener();
        document.body.removeChild(normalElement);
    });

    it('excludedSelectors의 자식 요소를 클릭하면 콜백이 호출되지 않아야 한다', () => {
        // given
        const excludedParent = document.createElement('div');
        excludedParent.className = 'excluded';
        const childElement = document.createElement('span');
        childElement.textContent = 'Child';
        excludedParent.appendChild(childElement);
        document.body.appendChild(excludedParent);

        const excludedSelectors = ['.excluded'];
        const callback = vi.fn();
        const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(excludedSelectors, callback);

        addClickOutsideListener();

        // when - 자식 요소 클릭
        childElement.click();

        // then - closest로 부모를 찾기 때문에 콜백이 호출되지 않아야 함
        expect(callback).not.toHaveBeenCalled();

        // cleanup
        removeClickOutsideListener();
        document.body.removeChild(excludedParent);
    });

    it('여러 개의 excludedSelectors를 지원해야 한다', () => {
        // given
        const excludedElement1 = document.createElement('div');
        excludedElement1.className = 'excluded-1';
        const excludedElement2 = document.createElement('div');
        excludedElement2.className = 'excluded-2';
        const normalElement = document.createElement('div');
        normalElement.className = 'normal';

        document.body.appendChild(excludedElement1);
        document.body.appendChild(excludedElement2);
        document.body.appendChild(normalElement);

        const excludedSelectors = ['.excluded-1', '.excluded-2'];
        const callback = vi.fn();
        const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(excludedSelectors, callback);

        addClickOutsideListener();

        // when - excludedElement1 클릭
        excludedElement1.click();

        // then
        expect(callback).not.toHaveBeenCalled();

        // when - excludedElement2 클릭
        excludedElement2.click();

        // then
        expect(callback).not.toHaveBeenCalled();

        // when - normalElement 클릭
        normalElement.click();

        // then
        expect(callback).toHaveBeenCalledTimes(1);

        // cleanup
        removeClickOutsideListener();
        document.body.removeChild(excludedElement1);
        document.body.removeChild(excludedElement2);
        document.body.removeChild(normalElement);
    });

    it('excludedSelectors가 빈 배열이면 모든 클릭에서 콜백이 호출되어야 한다', () => {
        // given
        const element = document.createElement('div');
        document.body.appendChild(element);

        const excludedSelectors: string[] = [];
        const callback = vi.fn();
        const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(excludedSelectors, callback);

        addClickOutsideListener();

        // when
        element.click();

        // then
        expect(callback).toHaveBeenCalledTimes(1);

        // cleanup
        removeClickOutsideListener();
        document.body.removeChild(element);
    });
});
