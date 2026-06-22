import { test, expect } from '@playwright/test';

test('create transaction income success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.getByRole('button', { name: 'Criar nova receita' }).click();

  await page.locator('#description').fill('maçã');
  await page.locator('#amount').fill('1200');

  await page.getByRole('button', { name: 'Enviar transação' }).click();

  await expect(page.getByText('A transação foi criada com sucesso'));
});

test('create transaction income error with negative price, expect send request howether without negative signal', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.getByRole('button', { name: 'Criar nova receita' }).click();

  await page.locator('#description').fill('maçã');
  await page.locator('#amount').fill('-1200');

  await page.getByRole('button', { name: 'Enviar transação' }).click();

  await expect(page.getByText('A transação foi criada com sucesso'));

  await expect(page.getByText('maçã')).toBeVisible();
});

test('create transaction expense success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.getByRole('button', { name: 'Criar nova receita' }).click();

  await page.locator('#description').fill('maçã');
  await page.locator('#amount').fill('1200');

  await page.getByRole('button', { name: 'Enviar transação' }).click();

  await expect(page.getByText('A transação foi criada com sucesso')).toBeVisible();
});