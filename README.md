# CRISPY — 3D portfolio (Boris K)

Статический сайт, сборка не нужна.

```
site/
  index.html        главная
  project.html      страница проекта (?id=<project-id>)
  css/style.css
  js/data.js        ← ВЕСЬ КОНТЕНТ: проекты, пары день/ночь, процесс, цены
  js/common.js      общее: liquid glass, курсор, скролл, навигация, лайтбокс
  js/main.js        главная: WebGL-hero, сетка работ, слайдеры, калькулятор
  js/project.js     страница проекта: горизонтальная галерея с параллаксом
  img/              WebP: name.webp (до 2000px) + name_t.webp (превью 900px)
  video/fluid.mp4   луп симуляции воды (секция Fluid; чёрный фон убирается через mix-blend-mode: screen)
```

## Запуск локально
```bash
python -m http.server 8765 --directory site
```
→ http://localhost:8765

## Деплой
Залить папку `site/` на Netlify / Vercel / GitHub Pages / Cloudflare Pages.
При изменении css/js увеличь `?v=N` в `index.html` и `project.html`, чтобы сбросить кэш.

## Что править
| Что | Где |
|---|---|
| Проекты: название, теги, картинки, brief/result, клиент, инструменты | `js/data.js` → `PROJECTS` |
| Пары день/ночь для слайдера | `js/data.js` → `LIGHT_PAIRS` |
| Секция Blueprint → Render | `js/data.js` → `PROCESS` + разметка в `index.html` |
| **Цены калькулятора** (сейчас — прикидка, поставь свои) | `js/data.js` → `PRICING` |
| Hero-картинка | `js/common.js` → `HERO_IMG` + `<img class="hero__img">` в `index.html` |
| Видео воды | `site/video/fluid.mp4` — любое видео на чёрном фоне, 1280px, h264 |
| Видео в проекте | `PROJECTS[i].videos = [{src, poster, label}]` — покажется в карточке (скраб) и в галерее проекта |
| Статистика, био, опыт, контакты | `index.html` |

## Добавить проект
1. Сконвертировать рендеры в WebP (скрипт ниже) → `img/pN_001.webp`, `img/pN_001_t.webp` …
2. Добавить объект в `PROJECTS` (`size`: `wide` 8/12, `narrow tall` 4/12, `half` 6/12).

```python
from PIL import Image; import os
SRC='C:/path/to/project/'; files=['001.png','002.png']; pid='p22'
for i,f in enumerate(files,1):
    im=Image.open(SRC+f).convert('RGB')
    for tag,mx,q in (('',2000,84),('_t',900,80)):
        c=im.copy(); c.thumbnail((mx,mx),Image.LANCZOS)
        c.save(f'site/img/{pid}_{i:03d}{tag}.webp','WEBP',quality=q,method=6)
```

## Фичи
- **WebGL hero** (three.js): стена стеклянных панелей поверх рендера — панели наклоняются к курсору, преломляют картинку, ловят блик; при загрузке собираются из хаоса. Без WebGL — статичная картинка.
- **Liquid glass**: настоящая рефракция через SVG `feDisplacementMap` (Chromium), fallback blur-glass.
- **Скраб-галерея**: движение мыши по карточке листает ракурсы; клик — страница проекта.
- **Страница проекта**: hero, brief → result, горизонтальная галерея с пином и параллаксом (на мобильных — вертикальный стек), лайтбокс, «следующий проект».
- **Fluid-секция**: видео симуляции на чёрном → screen-blend поверх тёмного фона, играет только в зоне видимости, параллакс.
- **Слайдеры**: день/ночь (5 пар), гидравлическая схема → симуляция, layout pass → final (кроссфейд).
- **Калькулятор**: тип работы, ракурсы, световые сценарии, 2K/4K, экстра → цена + диапазон, кнопка формирует письмо с брифом.
- Прелоадер, split-text, магнитные кнопки, Lenis, зерно, счётчики.
- `?shot=<px>` — dev-режим для скриншотов (без прелоадера).
