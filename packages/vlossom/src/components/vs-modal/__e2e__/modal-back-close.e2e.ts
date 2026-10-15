import { expect, test, type Page } from '@playwright/test';

async function establishHistoryBaseline(page: Page): Promise<void> {
    await page.evaluate(() => {
        window.history.pushState({ e2eBase: true }, '', '/e2e.html#e2e-base');
    });
}

test.describe('modal backClose', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/e2e.html');
        await establishHistoryBaseline(page);
    });

    test('closes a backClose modal with browser Back', async ({ page }) => {
        await page.getByTestId('open-back-close').click();
        await expect(page.getByTestId('back-close-modal')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('back-close-modal')).toBeHidden();
    });

    test('keeps a backClose false modal open after browser Back', async ({ page }) => {
        await page.getByTestId('open-no-back-close').click();
        await expect(page.getByTestId('no-back-close-modal')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('no-back-close-modal')).toBeVisible();
    });

    test('closes only the top modal in a backClose stack', async ({ page }) => {
        await page.getByTestId('open-stack').click();
        await expect(page.getByTestId('stack-bottom')).toBeVisible();
        await expect(page.getByTestId('stack-top')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('stack-top')).toBeHidden();
        await expect(page.getByTestId('stack-bottom')).toBeVisible();
    });

    test('closes the modal even when a select dropdown is open above it', async ({ page }) => {
        await page.getByTestId('open-select-modal').click();
        await expect(page.getByTestId('select-modal')).toBeVisible();
        await page.getByTestId('modal-select').click();

        await page.goBack();

        await expect(page.getByTestId('select-modal')).toBeHidden();
    });

    test('resolves confirm with false when closed by browser Back', async ({ page }) => {
        await page.getByTestId('open-confirm').click();
        await expect(page.getByRole('dialog').last()).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('confirm-resolved-false');
    });

    test('resolves alert when closed by browser Back', async ({ page }) => {
        await page.getByTestId('open-alert').click();
        await expect(page.getByRole('dialog')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('alert-resolved');
    });

    test('resolves prompt with null when closed by browser Back', async ({ page }) => {
        await page.getByTestId('open-prompt').click();
        await expect(page.getByRole('dialog')).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('prompt-resolved-null');
    });

    test('closes an inner confirm before its host modal', async ({ page }) => {
        await page.getByTestId('open-confirm-host').click();
        await page.getByTestId('open-inner-confirm').click();
        await expect(page.getByRole('dialog').last()).toBeVisible();

        await page.goBack();

        await expect(page.getByTestId('status')).toHaveText('confirm-resolved-false');
        await expect(page.getByTestId('confirm-host')).toBeVisible();
    });

    test('keeps history synchronized after ESC closes a modal', async ({ page }) => {
        await page.getByTestId('open-esc-sync').click();
        await expect(page.getByTestId('esc-sync-modal')).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(page.getByTestId('esc-sync-modal')).toBeHidden();

        await page.goBack();

        await expect(page.getByTestId('esc-sync-modal')).toBeHidden();
    });

    test('keeps history synchronized after dim click closes a modal', async ({ page }) => {
        await page.getByTestId('open-dim-sync').click();
        await expect(page.getByTestId('dim-sync-modal')).toBeVisible();

        await page.locator('.vs-dimmed').click({ position: { x: 5, y: 5 } });
        await expect(page.getByTestId('dim-sync-modal')).toBeHidden();

        await page.goBack();

        await expect(page.getByTestId('dim-sync-modal')).toBeHidden();
    });

    test('clears stacked modal history without leaving a stale modal', async ({ page }) => {
        await page.getByTestId('open-clear-stack').click();
        await expect(page.getByTestId('clear-bottom')).toBeVisible();
        await expect(page.getByTestId('clear-top')).toBeVisible();

        await page.getByTestId('clear-all').click();
        await expect(page.getByTestId('clear-bottom')).toBeHidden();
        await expect(page.getByTestId('clear-top')).toBeHidden();

        await page.goBack();

        await expect(page.getByTestId('clear-bottom')).toBeHidden();
        await expect(page.getByTestId('clear-top')).toBeHidden();
    });

    test('restores history when beforeClose rejects', async ({ page }) => {
        await page.getByTestId('open-reject-modal').click();
        await expect(page.getByText('Rejecting modal', { exact: true })).toBeVisible();

        await page.goBack();

        await expect(page.getByText('Rejecting modal', { exact: true })).toBeVisible();
        await expect(page).toHaveURL(/#e2e-base$/);
    });

    test('does not leave a stale history entry after button close', async ({ page }) => {
        await page.getByTestId('open-back-close').click();
        await expect(page.getByTestId('back-close-modal')).toBeVisible();
        await page.getByTestId('close-by-button').click();
        await expect(page.getByTestId('back-close-modal')).toBeHidden();

        await page.goBack();

        await expect(page.getByTestId('back-close-modal')).toBeHidden();
    });
});
