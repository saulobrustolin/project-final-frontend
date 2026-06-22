import { test, expect } from '@playwright/test';

test('signin success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await expect(page.getByText('Usuário autenticado com sucesso')).toBeVisible();
});

test('signin error', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha1234');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('E-mail ou senha incorreta'));
});

test('signup already email', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('link', { name: 'Registrar' }).click();

  await page.getByRole('textbox', { name: 'Nome completo' }).fill('Saulo Brustolin');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'CPF' }).fill('302.408.410-00');
  await page.locator('#password').fill('senha123$');
  await page.locator('#confirm-password').fill('senha123$');

  await page.getByRole('button', { name: 'Criar conta' }).click();

  await expect(page.getByText("Já existe um usuário com este e-mail"));
});

test('signup success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('link', { name: 'Registrar' }).click();

  await page.getByRole('textbox', { name: 'Nome completo' }).fill('Saulo Brustolin');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulohave@icloud.com');
  await page.getByRole('textbox', { name: 'CPF' }).fill('879.331.380-20');
  await page.locator('#password').fill('senha123$');
  await page.locator('#confirm-password').fill('senha123$');

  await page.getByRole('button', { name: 'Criar conta' }).click();

  await page.waitForTimeout(1000);

  await expect(page.getByText('Usuário registrado com sucesso'));
});

test('signup incorrect password', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('link', { name: 'Registrar' }).click();

  await page.getByRole('textbox', { name: 'Nome completo' }).fill('Saulo Brustolin');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulohave@icloud.com');
  await page.getByRole('textbox', { name: 'CPF' }).fill('879.331.380-20');
  await page.locator('#password').fill('senha123$');
  await page.locator('#confirm-password').fill('senha123$$');

  await page.getByRole('button', { name: 'Criar conta' }).click();

  await expect(page.getByText('As senhas não coincidem'));
});
