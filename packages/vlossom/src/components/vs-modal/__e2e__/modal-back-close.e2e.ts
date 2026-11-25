import { expect, test, type Page } from '@playwright/test';
import { MODAL_HISTORY_STATE_KEY } from '../../../declaration/constants';

async function establishHistoryBaseline(page: Page): Promise<void> {
    await page.evaluate(() => {
        window.history.pushState({ e2eBase: true }, '', '/e2e/modal-back-close.html#e2e-base');
    });
}

const readState = (page: Page) => page.evaluate(() => history.state);

test.describe('모달 backClose', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/e2e/modal-back-close.html');
        await establishHistoryBaseline(page);
    });

    test('브라우저 뒤로가기로 backClose 모달을 닫는다', async ({ page }) => {
        await page.getByTestId('open-back-close').click();
        await expect(page.getByTestId('back-close-modal')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('back-close-modal')).toBeHidden();
    });

    test('backClose가 false인 모달은 브라우저 뒤로가기 후에도 열린 상태를 유지한다', async ({ page }) => {
        await page.getByTestId('open-no-back-close').click();
        await expect(page.getByTestId('no-back-close-modal')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('no-back-close-modal')).toBeVisible();
    });

    test('backClose 모달이 쌓여 있을 때 최상단 모달만 닫는다', async ({ page }) => {
        await page.getByTestId('open-stack').click();
        await expect(page.getByTestId('stack-bottom')).toBeVisible();
        await expect(page.getByTestId('stack-top')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('stack-top')).toBeHidden();
        await expect(page.getByTestId('stack-bottom')).toBeVisible();
        await page.goBack();
        await expect(page.getByTestId('stack-bottom')).toBeHidden();
        await expect.poll(() => readState(page)).toEqual({ e2eBase: true });
    });

    test('모달 위에 셀렉트 드롭다운이 열려 있어도 모달을 닫는다', async ({ page }) => {
        await page.getByTestId('open-select-modal').click();
        await expect(page.getByTestId('select-modal')).toBeVisible();
        await page.getByTestId('modal-select').click();
        await expect(page.getByText('Banana', { exact: true })).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('select-modal')).toBeHidden();
    });

    test('브라우저 뒤로가기로 닫으면 Confirm을 false로 resolve한다', async ({ page }) => {
        await page.getByTestId('open-confirm').click();
        await expect(page.getByRole('dialog').last()).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('confirm-resolved-false');
    });

    test('브라우저 뒤로가기로 닫으면 Alert를 resolve한다', async ({ page }) => {
        await page.getByTestId('open-alert').click();
        await expect(page.getByRole('dialog')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('alert-resolved');
    });

    test('브라우저 뒤로가기로 닫으면 Prompt를 null로 resolve한다', async ({ page }) => {
        await page.getByTestId('open-prompt').click();
        await expect(page.getByRole('dialog')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('prompt-resolved-null');
    });

    test('backClose가 꺼진 최상단 모달이 아래 모달을 보호한다', async ({ page }) => {
        await page.getByTestId('open-protected-stack').click();
        await expect(page.getByTestId('stack-top')).toBeVisible();
        const state = await readState(page);
        expect(state[MODAL_HISTORY_STATE_KEY]).toBeTruthy();
        await page.goBack();
        await expect.poll(() => readState(page)).toEqual(state);
        await expect(page.getByTestId('stack-bottom')).toBeVisible();
        await expect(page.getByTestId('stack-top')).toBeVisible();
    });

    test('호스트 모달보다 내부 Confirm을 먼저 닫는다', async ({ page }) => {
        await page.getByTestId('open-confirm-host').click();
        await page.getByTestId('open-inner-confirm').click();
        await expect(page.getByRole('dialog').last()).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('confirm-resolved-false');
        await expect(page.getByTestId('confirm-host')).toBeVisible();
    });

    test('ESC로 모달을 닫은 후에도 history를 동기화한다', async ({ page }) => {
        await page.getByTestId('open-esc-sync').click();
        await expect(page.getByTestId('esc-sync-modal')).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(page.getByTestId('esc-sync-modal')).toBeHidden();
        await expect.poll(() => readState(page)).toEqual({ e2eBase: true });

        await page.goBack();

        await expect(page.getByTestId('esc-sync-modal')).toBeHidden();
    });

    test('딤 영역 클릭으로 모달을 닫은 후에도 history를 동기화한다', async ({ page }) => {
        await page.getByTestId('open-dim-sync').click();
        await expect(page.getByTestId('dim-sync-modal')).toBeVisible();

        await page.locator('.vs-dimmed').click({ position: { x: 5, y: 5 } });
        await expect(page.getByTestId('dim-sync-modal')).toBeHidden();
        await expect.poll(() => readState(page)).toEqual({ e2eBase: true });

        await page.goBack();

        await expect(page.getByTestId('dim-sync-modal')).toBeHidden();
    });

    test('clear로 쌓인 모달과 history를 모두 정리하면 뒤로가기를 해도 모달을 다시 열리지 않는다', async ({ page }) => {
        await page.getByTestId('open-clear-stack').click();
        await expect(page.getByTestId('clear-bottom')).toBeVisible();
        await expect(page.getByTestId('clear-top')).toBeVisible();

        await page.getByTestId('clear-all').click();
        await expect(page.getByTestId('clear-bottom')).toBeHidden();
        await expect(page.getByTestId('status')).toHaveText('idle');
        await expect(page.getByTestId('clear-top')).toBeHidden();
        await expect.poll(() => readState(page)).toEqual({ e2eBase: true });

        await page.goBack();

        await expect(page.getByTestId('clear-bottom')).toBeHidden();
        await expect(page.getByTestId('clear-top')).toBeHidden();
    });

    test('beforeClose가 닫기를 거부하면 history를 복구한다', async ({ page }) => {
        await page.getByTestId('open-reject-modal').click();
        await expect(page.getByText('Rejecting modal', { exact: true })).toBeVisible();
        const modalState = await readState(page);
        expect(modalState[MODAL_HISTORY_STATE_KEY]).toBeTruthy();

        await page.goBack();

        await expect(page.getByText('Rejecting modal', { exact: true })).toBeVisible();
        await expect(page).toHaveURL(/#e2e-base$/);
        await expect.poll(() => readState(page)).toEqual(modalState);
    });

    test('버튼으로 닫은 모달의 history를 정리하면 뒤로가기로 다시 열리지 않는다', async ({ page }) => {
        await page.getByTestId('open-back-close').click();
        await expect(page.getByTestId('back-close-modal')).toBeVisible();
        await page.getByTestId('close-by-button').click();
        await expect(page.getByTestId('back-close-modal')).toBeHidden();
        await expect.poll(() => readState(page)).toEqual({ e2eBase: true });

        await page.goBack();

        await expect(page.getByTestId('back-close-modal')).toBeHidden();
    });
});
