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

test('create transaction income with negative price, expect send request howether without negative signal', async ({ page }) => {
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

  await expect(page.getByText('maçã').first()).toBeVisible();
});

test('create transaction expense success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.getByRole('button', { name: 'Criar novo gasto' }).click();

  await page.locator('#description').fill('maçã dourada');
  await page.locator('#amount').fill('500');

  await page.getByRole('button', { name: 'Enviar transação' }).click();
  
  await page.waitForTimeout(1000);

  await expect(page.getByText('maçã dourada').first()).toBeVisible();
  await expect(page.getByText('R$ 500,00').first()).toBeVisible();
});

test('delete transaction success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.locator('button[data-slot="dropdown-menu-trigger"]').first().click();
  await page.locator('div[data-slot="dropdown-menu-item"]').getByText('Deletar').click();
  await page.getByRole('button', { name: 'Confirmar' }).click();

  await expect(page.getByText('A transação foi deletada com sucesso')).toBeVisible();
});

test('edit transaction success', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.locator('button[data-slot="dropdown-menu-trigger"]').first().click();
  await page.locator('div[data-slot="dropdown-menu-item"]').getByText('Editar').click();

  await page.locator('#description').fill('batata roxa');
  await page.locator('#amount').fill('20');

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Enviar transação' }).click();

  await expect(page.getByText('A transação foi editada com sucesso')).toBeVisible();
});

test('edit transaction error with input description null', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('textbox', { name: 'E-mail' }).fill('saulobrustolin@icloud.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha123$');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('');

  await page.locator('button[data-slot="dropdown-menu-trigger"]').first().click();
  await page.locator('div[data-slot="dropdown-menu-item"]').getByText('Editar').click();

  await page.locator('#description').fill('');
  await page.locator('#amount').fill('0,00');

  await page.getByRole('button', { name: 'Enviar transação' }).click();

  await expect(page.getByText('A descrição é obrigatória')).toBeVisible();
  await expect(page.getByText('O preço precisa ser maior que 0')).toBeVisible();
});