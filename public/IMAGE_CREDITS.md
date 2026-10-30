# CLAUDE MONET — источники фотографий

Проект не использует кадры «Кухни», фотографии актёров и официальную символику.
Фотографии являются самостоятельными иллюстрациями атмосферы и кухни. Они не
изображают вымышленный ресторан из сериала. Составы блюд вымышлены; изображение
может отличаться от описания. Это явно отмечено в интерфейсе меню и галереи.

## Лицензия

Все фотографии используются с Unsplash по [Unsplash License](https://unsplash.com/license).
Лицензия разрешает бесплатное использование, в том числе коммерческое. Нельзя
продавать неизменённые фотографии или собирать конкурирующий фотобанк.
Проверка страницы лицензии: 30 октября 2026 года.

Ниже зафиксированы неизменяемые CDN-идентификаторы исходников. Параметры `w`,
`fit=crop`, `auto=format`, `q=80` формируют адаптивные варианты одной фотографии.
Использование CDN означает запрос пользователя к Unsplash. API, API-ключи,
случайные фото и Unsplash+ не используются.

| Ключ | Сюжет | Исходный файл / источник |
| --- | --- | --- |
| interior | Интерьер с деревянными столами и подвесными светильниками | [Unsplash original](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4) |
| table | Ресторанная сервировка | [Unsplash original](https://images.unsplash.com/photo-1414235077428-338989a2e8c0) |
| room | Ресторанный зал | [Unsplash original](https://images.unsplash.com/photo-1552566626-52f8b828add9) |
| steak | Говядина с соусом, Anthony LE | [Страница автора и фото](https://unsplash.com/photos/a-piece-of-steak-on-a-plate-with-sauce-and-garnish-dBNFPATdTbs), [оригинал](https://images.unsplash.com/photo-1694345598429-00511c301452) |
| salmon | Лосось с овощами | [Unsplash original](https://images.unsplash.com/photo-1467003909585-2f8a72700288) |
| tartare | Тартар из лосося, Max Griss | [Страница автора и фото](https://unsplash.com/photos/green-and-white-vegetable-salad-VTnpz_nSaa4), [оригинал](https://images.unsplash.com/photo-1610315266904-28edc705ff89) |
| cheese | Сыр с мёдом и багетом, Marco Palumbo | [Страница автора и фото](https://unsplash.com/photos/cheese-bread-and-honey-on-a-wooden-board-1jlAsDAMhms), [оригинал](https://images.unsplash.com/photo-1743193144224-d2db90ea7784) |
| pate | Паштет с грибами, sunorwind | [Страница автора и фото](https://unsplash.com/photos/a-blue-and-white-plate-with-food-on-it-_uDgtmu_8rI), [оригинал](https://images.unsplash.com/photo-1644675352812-acfc1be33302) |
| duck | Утиное блюдо, Manek Singh | [Страница автора и фото](https://unsplash.com/photos/a-plate-of-food-and-a-cup-of-coffee-DpMzZFt18r0), [оригинал](https://images.unsplash.com/photo-1642231877874-ce3e205f39c0) |
| dessert | Сливочный десерт | [Unsplash original](https://images.unsplash.com/photo-1488477181946-6428a0291777) |
| brulee | Крем-брюле, Max Griss | [Страница автора и фото](https://unsplash.com/photos/white-ceramic-bowl-with-brown-soup-Wp7ZsJYWP0M), [оригинал](https://images.unsplash.com/photo-1615235739538-95040f341ba8) |
| salad | Овощи и салатная зелень | [Unsplash original](https://images.unsplash.com/photo-1512621776951-a57141f2eefd) |
| soup | Французский луковый суп, Álvaro Bernal | [Страница автора и фото](https://unsplash.com/photos/french-onion-soup-in-a-white-bowl-with-cheese-topping-Qxlez2RBOtY), [оригинал](https://images.unsplash.com/photo-1768295982465-ffc2f48e63f4) |
| bread | Ремесленный хлеб | [Unsplash original](https://images.unsplash.com/photo-1509440159596-0249088772ff) |
| wine | Вино в бокале | [Unsplash original](https://images.unsplash.com/photo-1510812431401-41d2bd2722f3) |
| coffee | Чашка кофе | [Unsplash original](https://images.unsplash.com/photo-1509042239860-f550ce710b93) |
| chocolate | Шоколадный десерт | [Unsplash original](https://images.unsplash.com/photo-1578985545062-69928b1d9587) |

## Локальная графика

`favicon.svg` и `image-fallback.svg`, монограмма, декоративный растительный знак,
типографический логотип и композиция созданы специально для этого проекта.
Это не официальные логотипы сериала или ресторана.

Иконки: [Lucide](https://lucide.dev), ISC License, поставляются пакетом `lucide-react`.

## Ограничение проверки

В среде разработки исходящие запросы из shell к images.unsplash.com были
недоступны. Страницы источников и лицензия просмотрены через веб-инструмент;
получение всех оригинальных изображений и их доступность в браузере следует
проверить с обычным интернет-соединением. При ошибке загрузки сайт показывает
локальную SVG-заглушку, сохраняет размеры блока и остаётся функциональным.
