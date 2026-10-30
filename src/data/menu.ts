import { images } from './images'

export const categories = [
  { id: 'starters', label: 'Закуски', french: 'Les entrées' },
  { id: 'salads', label: 'Салаты', french: 'Les salades' },
  { id: 'soups', label: 'Супы', french: 'Les potages' },
  { id: 'mains', label: 'Основные блюда', french: 'Les plats' },
  { id: 'desserts', label: 'Десерты', french: 'Les desserts' },
  { id: 'drinks', label: 'Напитки', french: 'Les boissons' },
] as const
export type CategoryId = typeof categories[number]['id']
export interface Dish {
  id: string
  category: CategoryId
  name: string
  french: string
  description: string
  price: number
  portion: string
  allergens: string[]
  image: string
  imageAlt: string
  tag?: string
}
export const dishes: Dish[] = [
  { id: 'salmon-tartare', category: 'starters', name: 'Тартар из лосося', french: 'Tartare de saumon', description: 'Атлантический лосось, каперсы, шалот, лимонный крем и хрустящий тост.', price: 6200, portion: '160 г', allergens: ['Рыба', 'Молоко', 'Глютен', 'Горчица'], image: images.tartare, imageAlt: 'Тартар из лосося со сливочным сыром и зеленью', tag: 'Выбор шефа' },
  { id: 'camembert', category: 'starters', name: 'Камамбер из печи', french: 'Camembert rôti', description: 'Тёплый нормандский сыр, цветочный мёд, грецкий орех и ремесленный хлеб.', price: 5400, portion: '220 г', allergens: ['Молоко', 'Орехи', 'Глютен'], image: images.cheese, imageAlt: 'Мягкий сыр с мёдом, розмарином и багетом' },
  { id: 'pate', category: 'starters', name: 'Паштет с лесными грибами', french: 'Pâté aux champignons', description: 'Нежный паштет из куриной печени, белые грибы, тимьян, луковый конфитюр и поджаренная бриошь.', price: 5800, portion: '180 г', allergens: ['Глютен', 'Молоко', 'Яйца', 'Сульфиты'], image: images.pate, imageAlt: 'Паштет с грибами на фарфоровой тарелке' },
  { id: 'nicoise', category: 'salads', name: 'Нисуаз с тунцом', french: 'Salade niçoise', description: 'Тунец, стручковая фасоль, томаты, перепелиное яйцо, оливки и дижонская заправка.', price: 6100, portion: '240 г', allergens: ['Рыба', 'Яйца', 'Горчица'], image: images.salad, imageAlt: 'Свежие овощи и зелень для салата', tag: 'Классика Ривьеры' },
  { id: 'chevre', category: 'salads', name: 'Салат с тёплым шевром', french: 'Chèvre chaud', description: 'Козий сыр на тосте, молодой салат, печёная груша, орехи пекан и медовый винегрет.', price: 5200, portion: '210 г', allergens: ['Молоко', 'Глютен', 'Орехи', 'Горчица'], image: images.salad, imageAlt: 'Салатная зелень и сезонные овощи' },
  { id: 'beetroot', category: 'salads', name: 'Свёкла и мягкий сыр', french: 'Betterave & fromage frais', description: 'Запечённая свёкла, сливочный сыр, руккола, фундук и бальзамический крем.', price: 4600, portion: '220 г', allergens: ['Молоко', 'Орехи', 'Сульфиты'], image: images.salad, imageAlt: 'Овощная композиция с зеленью' },
  { id: 'onion-soup', category: 'soups', name: 'Французский луковый суп', french: 'Soupe à l’oignon', description: 'Карамелизированный лук, насыщенный говяжий бульон, багет и золотистая корочка грюйера.', price: 4200, portion: '300 г', allergens: ['Глютен', 'Молоко', 'Сельдерей', 'Сульфиты'], image: images.soup, imageAlt: 'Горячий суп в глубокой тарелке', tag: 'Французская классика' },
  { id: 'bisque', category: 'soups', name: 'Биск с креветками', french: 'Bisque de crevettes', description: 'Бархатистый бульон из панцирей, тигровые креветки, сливки и щепотка эстрагона.', price: 5900, portion: '280 г', allergens: ['Ракообразные', 'Молоко', 'Сельдерей', 'Сульфиты'], image: images.soup, imageAlt: 'Ресторанная подача кремового супа' },
  { id: 'mushroom', category: 'soups', name: 'Велюте из белых грибов', french: 'Velouté de cèpes', description: 'Белые грибы, шампиньоны, сливки, грибной бульон и гренки с тимьяном.', price: 4500, portion: '280 г', allergens: ['Молоко', 'Глютен', 'Сельдерей'], image: images.soup, imageAlt: 'Суп с ароматными травами' },
  { id: 'filet', category: 'mains', name: 'Филе-миньон', french: 'Filet de bœuf', description: 'Нежная говяжья вырезка, перечный соус на сливках и картофельный гратен.', price: 12900, portion: '320 г', allergens: ['Молоко', 'Сульфиты', 'Сельдерей'], image: images.steak, imageAlt: 'Филе говядины с соусом и гарниром', tag: 'Выбор шефа' },
  { id: 'salmon', category: 'mains', name: 'Лосось бер-блан', french: 'Saumon au beurre blanc', description: 'Филе лосося, сезонные овощи и классический соус из сливочного масла и белого вина.', price: 8900, portion: '280 г', allergens: ['Рыба', 'Молоко', 'Сульфиты'], image: images.salmon, imageAlt: 'Филе лосося с овощами' },
  { id: 'duck', category: 'mains', name: 'Утиная грудка с вишней', french: 'Magret de canard', description: 'Утиная грудка, вишнёвый соус, пюре из сельдерея и молодой шпинат.', price: 9800, portion: '290 г', allergens: ['Молоко', 'Сельдерей', 'Сульфиты'], image: images.duck, imageAlt: 'Утка с гарниром во французском бистро' },
  { id: 'brulee', category: 'desserts', name: 'Ванильный крем-брюле', french: 'Crème brûlée', description: 'Нежный заварной крем с бурбонской ванилью под тонкой карамельной корочкой.', price: 3400, portion: '140 г', allergens: ['Молоко', 'Яйца'], image: images.brulee, imageAlt: 'Крем-брюле с золотистой карамельной корочкой', tag: 'Сладкий финал' },
  { id: 'fondant', category: 'desserts', name: 'Шоколадный фондан', french: 'Fondant au chocolat', description: 'Тёплый шоколадный десерт с текучей сердцевиной и ванильным мороженым.', price: 3900, portion: '170 г', allergens: ['Молоко', 'Яйца', 'Глютен', 'Соя'], image: images.chocolate, imageAlt: 'Шоколадный десерт с кремом' },
  { id: 'tatin', category: 'desserts', name: 'Тарт Татен', french: 'Tarte Tatin', description: 'Перевёрнутый пирог с карамелизированными яблоками, слоёным тестом и крем-фреш.', price: 3600, portion: '180 г', allergens: ['Молоко', 'Глютен', 'Яйца'], image: images.dessert, imageAlt: 'Авторская подача десерта' },
  { id: 'wine', category: 'drinks', name: 'Бордо, красное сухое', french: 'Bordeaux rouge', description: 'Вымышленная позиция винной карты: купаж мерло и каберне с нотами вишни и пряностей. 18+.', price: 4200, portion: '150 мл', allergens: ['Сульфиты'], image: images.wine, imageAlt: 'Бокал красного вина' },
  { id: 'lemonade', category: 'drinks', name: 'Лимонад «Прованс»', french: 'Limonade de Provence', description: 'Лимонный сок, сироп лаванды, розмарин и газированная вода. Без алкоголя.', price: 2400, portion: '300 мл', allergens: [], image: images.table, imageAlt: 'Бокалы на сервированном столе' },
  { id: 'coffee', category: 'drinks', name: 'Кофе по-венски', french: 'Café viennois', description: 'Двойной эспрессо, воздушные взбитые сливки и тёртый тёмный шоколад.', price: 1900, portion: '180 мл', allergens: ['Молоко', 'Соя'], image: images.coffee, imageAlt: 'Чашка ароматного кофе' },
]
export const formatPrice = (price: number) => `${new Intl.NumberFormat('ru-RU').format(price)} ₸`
