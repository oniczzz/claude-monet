# Шрифты

- **Cormorant Garamond** — Christian Thalmann / Catharsis Fonts, SIL Open Font License 1.1. Пакет `@fontsource/cormorant-garamond`.
- **Manrope** — Mikhail Sharanda и участники проекта, SIL Open Font License 1.1. Пакет `@fontsource/manrope`.

Используются локально собираемые WOFF2-файлы из Fontsource: латиница и кириллица.
В production нет запросов к Google Fonts. Для текста предусмотрены системные
резервные шрифты: Times New Roman / Georgia и Arial / sans-serif; `font-display: swap`
задан в CSS Fontsource. Полные лицензии находятся в `node_modules/@fontsource/*/LICENSE`.

Источники:
- https://github.com/CatharsisFonts/Cormorant
- https://github.com/sharanda/manrope
- https://openfontlicense.org/
