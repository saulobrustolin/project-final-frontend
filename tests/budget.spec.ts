import { test, expect } from '@playwright/test';

test('create budget success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('joaogomes@gmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');
  await page.getByText('Orçamentos').click();

  await page.waitForURL('/budgets');

  await page.getByRole('button', { name: 'Criar novo budget' }).click();

  await page.locator('#description').fill('viagem europa');
  await page.locator('#target').fill('30000');

  await page.getByRole('button', { name: 'Enviar budget' }).click();

  await page.waitForTimeout(2000);

  await expect(page.getByText('viagem europa').first()).toBeVisible();
  await expect(page.getByText('R$ 30.000,00').first()).toBeVisible();
});

test('create budget error with form null', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('joaogomes@gmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');
  await page.getByText('Orçamentos').first().click();

  await page.waitForURL('/budgets');

  await page.getByRole('button', { name: 'Criar novo budget' }).click();

  await page.getByRole('button', { name: 'Enviar budget' }).click();

  await page.waitForTimeout(2000);

  await expect(page.getByText('A descrição é obrigatória').first()).toBeVisible();
  await expect(page.getByText('O objetivo precisa ser maior que 0').first()).toBeVisible();
});

test('create budget and edit with success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('joaogomes@gmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');
  await page.getByText('Orçamentos').click();

  await page.waitForURL('/budgets');

  await page.getByRole('button', { name: 'Criar novo budget' }).click();

  await page.locator('#description').fill('viagem europa');
  await page.locator('#target').fill('30000');

  await page.getByRole('button', { name: 'Enviar budget' }).click();

  await page.waitForTimeout(1000);

  await page.getByText('viagem europa').first().click();

  await page.locator('#description').fill('viagem europa$$');
  await page.locator('#target').fill('60000');
  await page.locator('#balance').fill('60000');

  await page.getByRole('button', { name: 'Enviar budget' }).click();

  await page.waitForTimeout(1000);

  await expect(page.getByText('viagem europa$$').first()).toBeVisible();
  await expect(page.getByText('concluído').first()).toBeVisible();
});

test('create budget and edit with error description null', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('joaogomes@gmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');
  await page.getByText('Orçamentos').click();

  await page.waitForURL('/budgets');

  await page.getByRole('button', { name: 'Criar novo budget' }).click();

  await page.locator('#description').fill('viagem europa');
  await page.locator('#target').fill('30000');

  await page.getByRole('button', { name: 'Enviar budget' }).click();

  await page.waitForTimeout(1000);

  await page.getByText('viagem europa').first().click();

  await page.locator('#description').fill('');

  await page.getByRole('button', { name: 'Enviar budget' }).click();

  await expect(page.getByText('A descrição é obrigatória').first()).toBeVisible();
});