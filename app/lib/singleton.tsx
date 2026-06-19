import type { CollectionType } from "./types";

export const collections: Map<string, CollectionType> = new Map([
    ['Não específicado', { name: 'Não específicado', icon: 'CircleQuestionMark' }],
    ['Trabalho', { name: 'Trabalho', icon: 'BriefcaseBusiness' }],
    ['Restaurante', { name: 'Restaurante', icon: 'ChefHat' }],
    ['Rolezin', { name: 'Rolezin', icon: 'Beer' }],
    ['Compras no geral', { name: 'Compras no geral', icon: 'ShoppingCart' }],
    ['Casa', { name: 'Casa', icon: 'House' }],
    ['Luz', { name: 'Luz', icon: 'Zap' }],
    ['Internet', { name: 'Internet', icon: 'Earth' }],
    ['Água', { name: 'Água', icon: 'Droplet' }],
    ['Mercado', { name: 'Mercado', icon: 'ShoppingBasket' }],
    ['Viagem', { name: 'Viagem', icon: 'PlaneTakeoff' }],
]);