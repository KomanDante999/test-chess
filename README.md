# ОПИСАНИЕ ТЕСТОВОГО ЗАДАНИЯ:

## **_Test-CHESS (HTML, CSS, JS)_**

> Лендинг с бегущей строкой и двумя слайдерами. Полный адаптив под все разрешения.

<a href="https://komandante999.github.io/test-chess/"><img src="./src/img/readme/test-chess.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/test-chess.git "перейти на  Github")

### Техническое задание:
- Сверстайте адаптивный лендинг по [макету в Figma](https://www.figma.com/file/0xXfupPNU3aZxPqFbmhCKb/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%B2%D0%B5%D1%80%D1%81%D1%82%D0%BA%D0%B8-%7C-%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9-%D0%BB%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D0%B3?type=design&node-id=0%3A1&mode=design&t=rOAaagCJbi3KLDi4-1), используя стек html + css + чистый js (без библиотек и фреймворков).
  - Придерживайтесь принципа Pixel Perfect.
  - Страница должна быть адаптивной, хорошо выглядеть при любом размере экрана (нет горизонтального скролла, нет уезжающих за экран текстовых элементов, текст не наезжает на другой текст или изображение)
  - Избегайте дублирования текстового контента в мобильной и десктопной версиях.
  - Добавьте корректно работающую бегущую строку.
  - Кнопки на стартовом экране являются якорями и ведут к соответствующим блокам.
  - Карусель с карточками участников должна быть зацикленной и меняться автоматически через каждые 4 секунды.
  - Карусель с этапами не должна быть зацикленной и не должна автоматически менять слайды.
  - Добавьте анимацию по своему усмотрению.
### Особенности исполнения:
> Не смотря на кажущуюся простоту, проект оказался очень интересным и заставил местами подумать и поэкспериментировать с различными подходами.
## **_Общие_**
- Pixel Perfect проверялся с помощью плагина PerfectPixel для Chrome на разрешениях 1920px, 1384px и 392px. Последние два брекпоинта сдвинуты относительно макета на ширину вертикального скрола, возникающего в расширении при загрузке длинной картинки. Шаблоны, по которым производилась корректировка Pixel Perfect находятся в src\img\screens
## **_HTML_**
- Все тэги семантичны и валидны, validator.w3.org не выдает ни одной ошибки.
- Все ресурсы сайта загружаются локально, сайт не имеет зависимостей от внешних ресурсов.
- Предзагрузка шрифтов preload в формате **_woff2_**
- Скрипты имеют единую точку входа **_main.js_** и модульную структуру, загрузка в head
- Почти все изображения загружаются в разметке, что способствует быстрой адаптации к CMC. 
- Все изображения переведены в современный формат **_webp_**, так как не было требования поддержки старых браузеров.
- На всех брекпоинтах используется одна и та же разметка, задвоения контента нет. В том числе и в секции "этапов" одни и те же тэги используются и для статичного вывода карточек (с помощью greed) и для карусели.
- Секция header объединена с hero так как имеют общий бэкграунд.
- В секции "support-chess" информация в виде таблицы реализована с помощью тегов **_table_**. После долгих поисков вариантов именно данный вид display показал наилучшие результаты в простоте реализации заданного дизайна. И не смотря на то, что table считается устаревшим, удалось добиться его адаптивности и правильного поведения на всех разрешениях

## **_CSS_**
- Использована **_БЭМ_** нотация.
- В CSS добавлены **_вендорные префиксы_** (автоматически) для обеспечения кроссбраузерности.
- Файлы CSS **_минифицированы_** для ускорения загрузки.
- Исходный файл стилей style.css находится рядом с минифицированным для удобства проверки.
- Я использовал слегка доработанный файл сброса стилей от TailwindCss взамен Normalize.css
## **_JS_**
### **_watchForHover.js_**
> исключает использование hover-эффектов на touch устройствах
- Функция навешивает на document события touchstart и  mousemove и в зависимотси от срабатывания этих триггеров добавляет к body класс hasHover или убирает его. Соответственно в CSS все псевдоклассы :hover должны использовать этот класс. Например: 
```css
.hasHover .btn-third:hover
```
- Использование подобного подхода на мой взгляд лучше, чем привязываться к текущему разрешению или пытаться определить тип устройства, так как с одной стороны большой сенсорный монитор может вообще не иметь мыши и клавиатуры для ввода данных, а с другой стороны небольшой планшет или даже смартфон может иметь подключенную мышь для удобства работы. Кроме того, ресайзинг окна на обычном мониторе может привести к потере hover-эффектов при традиционном подходе.
### **_KdRunLine.js_**
> Реализация бегущей строки
- В качестве движка анимации использована функция **_requestAnimationFrame_**, что позволяет делать анимацию плавной, без рывков и точно управлять анимацией элементов.
- При загрузке страницы элементы анимации находятся по атрибуту data-kd-runline-item и позиционируются за пределами левого края viewport.
- Позиция первого движущегося элемента отслеживается с помощью **_getBoundingClientRect().x_**. Как только элемент выйдет на полную свою ширину, запускается анимация следующего элемента.
- Как только движущийся элемент уходит за пределы viewport, он останавливается и переносится в начало.
- При ресайзинге страницы анимация очищается с помощью **_cancelAnimationFrame_** и перезапускается с новыми значениями ширины viewport.
### **_KdSimplSlider.js_**
> Слайдер, используемый для карусели с карточками и карусели с этапами.

> До этого момента я самостоятельно уже писал слайдеры, но без навигации и с использованием библиотеки GSAP. Мне было интересно построить всю цепочку взаимодействий пользователя со слайдером и самостоятельно реализовать логику анимации. Надо сказать, что данная задача оказалась достаточно сложным, но вдохновляющим вызовом для меня. 
- Слайдер является достаточно универсальным решением. Настройки для каждого экземпляра класса слайдера пользователь задает в отдельном объекте настроек (в main.js).
- Размеры, внутренняя структура слайдов, оформление и расположение кнопок навигации, пагинации и счетчик полностью задаются в разметке и CSS. Слайдер реализует только **_логику_** смены слайдов в зависимости от событий и настроек.
- Слайдер реагирует на изменение размеров Viewport и в зависимости от настроек запускается, перезапускается или отключается. При отключении снимаются все инлайновые стили и события слайдера и разметку можно позиционировать с помощью CSS. Эта функция использована в карусели "преимущества", где одна и та же разметка используется на больших разрешениях с display: greed в виде таблицы, а на маленьких переходит в слайдер, что позволяет избежать дублирования тегов.  	      
- Точкой входа является ID, элементы слайдера обнаруживаются по атрибуту data-kd-slider. Допускается использование нескольких наборов кнопок навигации, пагинации и счетчика для одного слайдера, которые могут располагаться в разных местах.
- В слайдере реализована архитектура **_Model-View_**. Все элементы, их размеры, положение и функции, все изменения и обработчики событий сначала рассчитываются в модели, и только затем реализуются в представлении. Вся информация о слайдере находится в объекте this.model. Но до полноценной архитектуры MVC слайдер конечно не дотягивает.
- Анимация слайдов осуществляется с помощью свойства translateX, что облегчает перестроения DOM.
- Для сохранения контекста this в обработчиках событий на кнопках управления использована функция .bind(this), что позволяет использовать .removeEventListener() для удаления событий при перезапуске и отключении слайдера.


---
---



## Об авторе:
### HTML-верстальщик / Frontend-разработчик

<table>
  <tr>
    <td><img src="./src/img/readme/face.jpg" style="width: 200px"></td>
    <td>
      <table>
        <tr>
          <td>
            <h2>
              Халевин Сергей
            </h2>
          </td>
        </tr>
        <tr>
          <td>
            Телефон:
            <b>+7(913)189-20-88</b>
          </td>
        </tr>
        <tr>
          <td>
            Email:
            <b>dreftware@yandex.ru</b>
          </td>
        </tr>
        <tr>
          <td>
            Telegram:
            <b>@KomanDante999</b>
          </td>
        </tr>
        <tr>
          <td>
            Город проживания:
            <b>Лесосибирск</b>
          </td>
        </tr>
        <tr>
          <td>
            Дата Рождения:
            <b>06.12.1974</b>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

---

### hard skills:

| HTML | CSS3 | JS ES6+ | VUE 3 | GSAP | Tailwind CSS | WordPress |
| ---- | ---- | ------- | ----- | ---- | ------------ | --------- |
| Git  | Gulp | Sass    | Less  | Pug  | BEM          | twig      |

### soft skills:

- **_самостоятельность_** в решении проблем, обучении, освоении новых знаний
- **_ответственность_** за порученную работу, желание сделать ее как можно качественнее
- **_коммуникабельность_**, **_отзывчивость_**, всегда готов прийти на помощь, интересы коллектива ставлю выше личных

---
---

## Другие мои проекты:

### **_FULL PAGE SLIDER (HTML, CSS, GSAP, SWIPER)_**

> Одноэкранный слайдер с паралакс-эффектом и интерактивной анимацией курсора на GSAP. Полный адаптив под все разрешения.

<a href="https://komandante999.github.io/fullpage-slider/"><img src="./src/img/readme/Fullpage-slider.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/fullpage-slider "перейти на  Github")

### Технологии:
- Использование **_SWIPER_** с паралакс-эффектом.
- Синхронизация двух слайдеров - текстового и с изображениямиБ привязка к единому управлению и событиям.
- Кастомизация элементов управления SWIPER - навигации, пагинации и скролл-бара.
- Синхронизация анимации колеса-шестерни на заднем плане с событиями смены слайдов с помощью **_SWIPER API_**.
- Использование анимации **_GSAP_** для анимации курсора и событий на активных элементах сайта.
- Вывод текущего номера слайда с помощью SWIPER API и анимация смены номера слайда с помощью GSAP.
- Модальное окно реализовано с помощью библиотеки **_MicroModal_**.
- Полностью адаптивная верстка вплоть до 320px с использованием **_flex_** и нативного **_grid_**.
- Использование сборщика **_GULP_** для ускорения и автоматизации разработки сайта, модульный подход в архитектуре проекта. 
---

### **_RAIN IN THE FOREST (HTML, CSS, 3D)_**

> Красивый сайт-визитка с 3D эффектом Parallax на чистом CSS. Резиновая верстка.

<a href="https://komandante999.github.io/wd_rain-in-forest-3d/"><img src="./src/img/readme/Rain-in-forest.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/wd_rain-in-forest-3d.git "перейти на  Github")

### Технологии:
- Использование **_Object.assign_** для трансляции координат курсора в CSS переменные.
- Реализация эффекта глубины посредством нативных средств **_perspective_** и **_translateZ_** для нескольких слоев.
- Управление степенью ротации с помощью вычислений **_calc_**.
- **_Резиновая адаптивность_** на любых разрешениях и соотношениях сторон экрана - все размеры элементов вычисляются на основе одного коэффициента.
- Использование **_canvas_** для создания эффекта дождя.
---

### **_CREATIVE SCROLL (HTML, CSS, GSAP)_**

> Красивый сайт-портфолио с паралакс-эффектом, плавным скроллом, анимацией карточек при прокрутке, реализованных библиотекой GreenSock.

<a href="https://komandante999.github.io/wd-creative-scroll/"><img src="./src/img/readme/creative-scroll.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/wd-creative-scroll.git "перейти на  Github")

### Технологии:
- Использование **_ScrollSmoother_** для управления плавной прокруткой сайта.
- Использование **_ScrollSmoother_** для задания различной скорости прокрутки различных элементов сайта.
- Использование **_ScrollTrigger_** для управления анимацией элементов в зависимости от их появления на экране.
---

### **_BLANCHARD - художественная галерея (HTML, CSS)_**

> Адаптивная веб-страница с подключением плагинов swiper.js, jQuery accordion, tab, choices, popper, tippy, just-validate, inputmask, yandex-map.

<a href="https://komandante999.github.io/Blanchard-deploy/"><img src="./src/img/readme/blanchard.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/Blanchard-deploy.git "перейти на  Github")

### Требования ТЗ:
- **_Адаптивная_** вёрстка, корректно отображающаяся на компьютере, планшете и мобильном устройстве
- **_Кроссбраузерность_**, корректное отображение в Chrome, Firefox, Safari, Opera, Edge
- **_Pixel Perfect_** вёрстка (под все разрешения). Отличия на 1–3 пикселя.
- **_Сlean code_**. Чистая семантическая вёрстка. Минимум тегов и вложенностей.
- **_Accessibility_**. Интерфейс сайта доступен с клавиатуры и при использовании скринридера.
- **_БЭМ_** - именование классов. Отсутствуют элементы без блока, модификаторы без блока или элемента, модификаторы модификаторов.
- **_Usability_**. Удобный для пользователя интерфейс: все кнопки и ссылки явно дают понять, что на них можно кликнуть, нет неожиданного поведения элементов.
- Теги HTML- и CSS-документов должны быть **_валидными_**
- На мобильных устройствах ховеры не должны работать. Минимум медиазапросов для реализации адаптива
- Флексбокс-вёрстка, без использования фреймворков.
---

### **_PHOTO - портфолио (HTML, CSS, GSAP)_**
> Сайт-визитка с анимацией при загрузке сайта и открытия бургерного меню.

<a href="https://komandante999.github.io/PHOTO/"><img src="./src/img/readme/Photo.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/PHOTO.git "перейти на  Github")

### Требования ТЗ:
- С помощью инструментария библиотеки GreenSock реализуйте анимацию загрузки сайта.
- С помощью инструментария библиотеки GreenSock реализуйте анимацию открытия/закрытия бургер-меню
---

### **_EUCLID - строительная компания (HTML, CSS, Lighthouse)_**

> Одностраничный сайт с оптимизацией загрузки до зеленого сектора в Lighthouse.

<a href="https://komandante999.github.io/Euclid-optimization/"><img src="./src/img/readme/Euclid.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/Euclid-optimization.git "перейти на  Github")

### Требования ТЗ:
- Семантичная валидная верстка с соблюдением код-стайл.
- Pixel perfect на каждом из макетов для адаптива.
- Именование классов по методологии **БЭМ**.
- Реализовать “резиновый” адаптив.
- Количество брейк-поинтов в медиа запросах не превышает семи.
- Не использовать Bootstrap.
- Реализовать все состояния интерактивных элементов: hover, focus, active.
- Протестировать на нескольких реальных устройствах (телефон, планшет).
- Реализовать возможность “хождения” по сайту с клавиатуры.
- Реализовать возможность пользоваться сайтом с помощью скринридера NVDA.
- Проверить сайт в следующих браузерах: Opera, Yandex, Chrome, Edge, Firefox, Safari.
- Проверить сайт на мобильных устройствах в нескольких браузерах на ваш iOS и Android.
- Реализовать слайдер с помощью библиотеки **Swiper-js**.
- Реализовать табы и аккордеон с помощью библиотеки **jQuery**.
- Оптимизировать HTML, JS, CSS, использовав минификаторы.
- Оптимизировать загрузку шрифтов с помощью preload.
- Оптимизировать изображения сервисом Squoosh, сделайть версии в формате WebP, подключив их через тег picture.
- Оптимизировать загрузку изображений, использовав Lazy Load.
- Проверить сайт в Lighthouse.

---
### **_3D MODELING - курсы 3D моделирования (HTML, CSS, Bootstrap)_**

> Одностраничный сайт c использованием библиотеки Bootstrap.

<a href="https://komandante999.github.io/3D-modeling-courses/"><img src="./src/img/readme/3D-modeling.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/3D-modeling-courses.git "перейти на  Github")

### Требования ТЗ:
- Семантияная валидная верстка с соблюдением код-стайл.
- Pixel perfect.
- Именование классов по методологии БЭМ.
- Сделать адаптивную верстку, используя классы **Bootstrap**, медиа-запросы и тег picture для адаптивности картинок.

---
### **_LAGOON - каталог отелей (HTML, CSS)_**

> Одностраничный сайт без функционала.

<a href="https://komandante999.github.io/Lagoona/"><img src="./src/img/readme/Lagoona.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/Lagoona.git "перейти на  Github")

### Требования ТЗ:
- Семантияная валидная верстка.
- Правильная реализация контектстных и декоративных изображений.
- Соблюдение код-стайл.
- Использование flexbox модели для позиционирования элементов.
- Проверка верстки на переполнение.
- Pixel perfect.
- Верстка и стилизация элементов фориы.
- Использование псевдоэлементов и абсолютного позиционирования.
- Добавить эффекты состояния на активные элементы. Порядок состояний должен быть именно таким: focus, hover, active.
---

### **_HTML-EMAIL - письмо для компании Blanchard (HTML-4, CSS)_**

> HTML-письмо.

<a href="https://komandante999.github.io/HTML-email/"><img src="./src/img/readme/HTML-email.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/HTML-email.git "перейти на  Github")

### Требования ТЗ:
- Сверстайте HTML-письмо по макету.
- Уделить особое внимание качеству адаптивной верстки.
- Протестировать письмо в почтовых клиентах Outlook (не ниже версии 2013) и Gmail. Письмо должно корректно отображаться в десктопной, браузерных и в мобильных версиях.
- Протестировать письмо в Mail.ru, Yandex, Apple Mail, Windows 10 Mail, outlook.com, в десктопных, браузерных и мобильных версиях этих почтовых клиентов.
---
---

## ПРОЕКТЫ НА VUE:

### **_MOIRE - каталог премиального белья (VUE-3, Tailwind CSS)_**

`готов на 80%`

> Одностраничное приложение с основным функционалом интернет-магазина.

<a href="https://komandante999.github.io/moire/"><img src="./src/img/readme/moire.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/moire.git "перейти на  Github")

### Требования ТЗ:

- Просмотр списка товаров по страницам.
- Фильтрация списка товаров по параметрам.
- Просмотр информации о товаре на его детальной странице.
- Добавить товар с выбранным цветом и размером в корзину..
- Измененеи количества товаров в корзине.
- Удаление товаров из корзины.
- При перезагрузке страницы неотправленные данные из корзины сохраняются (Local Storage).
- Внести данные на странице оформления заказа.
- Выбрать способ доставки и оплаты.
- Оформить заказ и посмотреть информацию о нём на странице успешного оформления заказа.
- Реализовать Bread crumbs.
- Окружение приложения должно быть развёрнуто с использованием Vue CLI.
- В работе должен использоваться ESLint, vuex, vuerouter.
- Интерфейс должен быть отзывчивым: во время обращений к API показывается прелоадер, при возникновении пользовательских ошибок посетитель уведомляется о них.
---

### **_TECHNOZAVR - интернет-магазин (VUE-2)_**

> Одностраничное приложение с основным функционалом интернет-магазина.

<a href="https://komandante999.github.io/vue-tehnozavr/#/"><img src="./src/img/readme/tehnozavr.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/vue-skb-projeck01.git "перейти на  Github")

### Требования ТЗ:

- Просмотр списка товаров по страницам.
- Фильтрация списка товаров по параметрам.
- Просмотр информации о товаре на его детальной странице.
- Добавление товара в корзину.
- Измененеи количества товаров в корзине.
- Удаление товаров из корзины.
- При перезагрузке страницы неотправленные данные из корзины сохраняются (Local Storage).
- Внести данные на странице оформления заказа.
- Оформить заказ и посмотреть информацию о нём на странице успешного оформления заказа.
- Реализовать Bread crumbs
- Окружение приложения должно быть развёрнуто с использованием Vue CLI.
- В работе должен использоваться ESLint, vuex, vuerouter.
- Интерфейс должен быть отзывчивым: во время обращений к API показывается прелоадер, при возникновении пользовательских ошибок посетитель уведомляется о них.
---

### **_MAMOD - форма регистрации (VUE-2)_**

> простая форма регистрации на Vue-2.

<a href="#"><img src="./src/img/readme/mamod-test.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/mamod-test.git "перейти на  Github")

### Требования ТЗ:
- Vue 2.
- Сверстать форму регистрации, согласно
  [макету](https://www.figma.com/file/RzfLe0cwuP26lGIy3bBgdz/MamodTestFrontend?type=design&node-id=0%3A1&mode=design&t=wpvbhcFaqv9EThYh)
- Варианты в селекте “Должность” - любой произвольный набор данных, в формате
  ```js
  [{ value: number, name: string }, { value: number, name: string }, ...etc];
  ```
- Чекбокс согласия на обработку персональных данных - по умолчанию установлен. Но если его выключить, то форма не должна отправляться.
- Реализовать функциональность отправки данных моковым POST запросом со следующими параметрами:
  ```js
  // Все поля обязательны
  public: boolean;
  username: string;
  role: number;
  email: string;
  password: string;
  password_repeat: string;
  ```
- Интерактивно отработать ошибку не введённых данных (подсветка поля, надпись под ним и тп.).
- При успешной регистрации - скрыть форму и отобразить текст “Регистрация успешно завершена” в произвольных стилях.
---
---

## ПРОЕКТЫ НА WORDPRESS:

### **_DVERI-MASTER (WordPress)_**

> Многостраничный сайт магазина дверей с администрированием через CMS WordPress

<a href="https://dveri.komandante999.ru/"><img src="./src/img/readme/Dveri-master.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/dveri-master.git "перейти на  Github")

### Использованные технологии:
- Развертывание локального сервера Open Server.
- Установка WordPress на локальный сервер.
- Создание собственной темы с нуля.
- Работа с плагинами Custom Field Suite и Contact Form 7
- Различные подходы к организации циклов для списков элементов - через нативные функции WordPress и через инструментарий плагина Custom Field Suite
- Использование шорткодов для форм обратной связи.
- Работа с хостингом, настройка базы данных, домена.
- Перенос сайта с локального сервера на хостинг, особенности настройки.

---
---

## ПРОЕКТЫ НА JS:

### **_AURORA-CRM (JS)_**

> Система управления контактными данными клиентов, взаимодействующая с локальным сервером.

<a href="https://komandante999.github.io/AURORA-CRM_demo/"><img src="./src/img/readme/Aurora-CRM.jpg"></a>

(требует запуск локального сервера, имеется в репозитории)

[Посмотреть код в репозитории](https://github.com/KomanDante999/Aurora-CRM.git "перейти на  Github")

### Требования ТЗ:
- Просмотр списка клиентов в виде таблицы.
- Сортировка списка по полям.
- Просмотр информации клиента в модальном окне.
- Изменение информации о клиенте в модальном окне, добавление и удаление клиента.
- Поиск с авто-дополнением, переход из окна поиска в таблицу с клавиатуры.
- Валидация формы перед отправкой на сервер.
- Анимация открытия модального окна, индикация загрузки, всплывающие подсказки.

### Результат выполнения задания:

`были отработаны навыки использования модулей, классов, асинхронных функция JS, приемы работы с массивами в формате ES6, взаимодействие с API сервера`


### **_GAME-PAIRS - игра "Найди пару" (JS)_**

> простая игра на JS.

<a href="https://komandante999.github.io/game-PAIRS/"><img src="./src/img/readme/game-PAIRS.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/game-PAIRS.git "перейти на  Github")

### Требования ТЗ:

- Разработать простую игру в пары.
- Самостоятельно разработать дизайн игры.
- Создать функцию, генерирующую массив парных чисел.
- Создать функцию перемешивания массива с помощью алгоритма Фишера — Йетса.
- Создать функцию перемешивания массива с помощью алгоритма Фишера — Йетса.
- На основе массива создать DOM-элементы карточек.
- Добавить функцию настройки количество карточек на поле (в модальном окне).
- Реализовать таймер окончания игры по выбору игрока.
- Реализовать сообщение о результатах игры (в модальном окне).
---

### **_BLOG (JS, REST-API)_**

> простой блог с возможностью перехода к статье и комментариям с использованием REST-API.

<a href="https://komandante999.github.io/blog/"><img src="./src/img/readme/BLOG.jpg"></a>

[Посмотреть код в репозитории](https://github.com/KomanDante999/blog.git "перейти на  Github")

### Требования ТЗ:

- Разработать простую игру в пары.
- Самостоятельно разработать дизайн игры.
- Создать функцию, генерирующую массив парных чисел.
- Создать функцию перемешивания массива с помощью алгоритма Фишера — Йетса.
- Создать функцию перемешивания массива с помощью алгоритма Фишера — Йетса.
- На основе массива создать DOM-элементы карточек.
- Добавить функцию настройки количество карточек на поле (в модальном окне).
- Реализовать таймер окончания игры по выбору игрока.
- Реализовать сообщение о результатах игры (в модальном окне).

---
---

[Go To TOP](#TOP)
