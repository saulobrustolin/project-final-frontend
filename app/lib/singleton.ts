import type { CollectionType } from "./types";

export const collections: Map<string, CollectionType> = new Map([
    ['Não específicado', { name: 'Não específicado', icon: 'CircleQuestionMark' }],
    ['Restaurante', { name: 'Restaurante', icon: 'ChefHat' }],
    ['Rolezin', { name: 'Rolezin', icon: 'Beer' }],
    ['Compras no geral', { name: 'Compras no geral', icon: 'ShoppingCart' }],
    ['Casa', { name: 'Casa', icon: 'House' }],
    ['Luz', { name: 'Luz', icon: 'Zap' }],
    ['Internet', { name: 'Internet', icon: 'Earth' }],
    ['Água', { name: 'Água', icon: 'Droplet' }],
    ['Mercado', { name: 'Mercado', icon: 'ShoppingBasket' }],
    ['Viagem', { name: 'Viagem', icon: 'Plane' }],
]);

export const menus = [
    { name: 'Transações', to: '/', icon: 'DollarSign' },
    { name: 'Orçamentos', to: '/budgets', icon: 'HandCoins' },
    { name: 'Configurações', to: '/settings', icon: 'Settings' }
];