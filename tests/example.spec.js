// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Google drive app', () => {
  test.beforeEach(async ({ page }) => {
    // here we mock auth route by redirecting to mock-auth
    await page.route('**/auth', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ auth_url: 'http://localhost:5000/mock-auth' })
      });
    });

    await page.route('**/mock-auth', async route => {
      await route.fulfill({
        status: 302,
        headers: { Location: 'http://localhost:5173' }
      });
    });

    // mock list-files to always return authenticated
    await page.route('**/list_files', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: '1', name: 'File 1', mimeType: 'text/plain' },
          { id: '2', name: 'File 2', mimeType: 'application/pdf' }
        ])
      });
    });

    await page.goto('/');
  });

  test('should authenticate and list files', async ({ page }) => {
    await expect(page.getByText('Google Drive')).toBeVisible();
    await expect(page.getByText('Your Files:')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('File 1')).toBeVisible();
    await expect(page.getByText('File 2')).toBeVisible();
  });

  test('should upload a file', async ({ page }) => {
    // mock upload endpoint 
    await page.route('**/upload_file', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ id: '3', name: 'Uploaded File', mimeType: 'text/plain' })
      });
    });

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 }); // wait to become visible
    await expect(fileInput).toBeEnabled();

    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test file content')
    });

    // new uploaded file is in list
    await expect(page.getByText('Uploaded File')).toBeVisible({ timeout: 10000 });
  });

  test('should delete a file', async ({ page }) => {
    // Mock delete endpt
    await page.route('**/delete_file/**', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await expect(page.getByText('File 1')).toBeVisible({ timeout: 10000 }); // wait to become visible

    const deleteButton = page.getByTestId('delete-1');
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();

    await expect(page.getByText('File 1')).not.toBeVisible({ timeout: 10000 });
  });
});