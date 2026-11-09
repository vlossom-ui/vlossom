// Enter를 스스로 처리하는 요소. button·a는 Enter 뒤 기본 동작으로 click이 일어나고, textarea는 줄바꿈을 넣는다.
const ENTER_OWNER_SELECTOR = 'button, a[href], textarea';

export const keyEventUtils = {
    isEnterOwnedByTarget(event?: KeyboardEvent): boolean {
        const target = event?.target;
        return target instanceof Element && target.closest(ENTER_OWNER_SELECTOR) !== null;
    },
};
