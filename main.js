import { watchForHover } from "./assets/js/watch-for-hover.js";
import { KdRunLine } from "./assets/js/kdRunLine.js";
import { KdSimplSlider } from "./assets/js/kdSimplSlider.js";

document.addEventListener('DOMContentLoaded', () => {

	const paramsKdRunLine = {
		id: 'kdRunline',
		speedAnimation: 2.1,
	}
	const paramsKdRunLine2 = {
		id: 'kdRunline2',
		speedAnimation: 2.1,
	}

	// slider parameters STAGES
	const paramsKdSliderStages = {
		id: 'kdSliderStages',                      // точка входа
		navigationEnable: true,                    // включение кнопок навигации (добавьте необходимую разметку)
		navigationDisableClass: 'disable-btn',     // CSS класс, который будет добавлен к заблокированной кнопки навигации
		paginationEnable: true,                    // включение кнопок пагинации (добавьте необходимую разметку)
		paginationActiveClass: 'active-btn',       // CSS класс, который будет добавлен к активной кнопки пагинации
		counterEnable: false,                      // включение счетчика слайдов (добавьте необходимую разметку)
		loop: false,                               // включение зацикливания слайдов
		autoplay: {
			isEnable: false,                         // включение автоматического листания слайдов (прерывается по клику на кнопки управление)
			delay: null,                             // таймаут между слайдами
			isPlayAfterStop: false,                  // включение запуска автоматического листания после прерывания
			delayPlayAfterStop: null,                // таймаут до запуска автоматического листания после прерывания
		},
		animation: {
			duration: 0.9,                           // длительность анимации слайдов
			ease: 'ease-in-out'                      // временная функция анимации   cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
		},
		mobilFirst: false,                         // поведение медиа-запросов в зависимости от способа адаптивной верстки - mobile first или desktop first
		breakpoints: [                             // поведение слайдера в зависимости от ширины viewport 
			{
				maxWidth: Infinity,                    // начальная ширина viewport
				minWidth: 1024,                        // конечная ширина viewport
				disable: true,                         // полное отключение слайдера на данном промежутке с очисткой всех изменений в разметке
			},
			{
				maxWidth: 1024,
				minWidth: 635,
				slides: 2,                            // число одновременно показываемых слайдов на данном промежутке
				space: 20                             // отступы между слайдами на данном промежутке
			},                                      // ширина слайда рассчитывается и устанавливается автоматически
			{
				maxWidth: 635,
				minWidth: 0,
				slides: 1,
				space: 20
			},
		],
	}

	// slider parameters PLAYERS
	const paramsKdSliderPlayers = {
		id: 'kdSliderPlayers',
		navigationEnable: true,
		navigationDisableClass: 'disable-btn',
		counterEnable: true,
		mobilFirst: false,
		loop: true,
		autoplay: {
			isEnable: true,
			delay: 4,
			isPlayAfterStop: true,
			delayPlayAfterStop: 10,
		},
		breakpoints: [
			{
				maxWidth: Infinity,
				minWidth: 1384,
				slides: 4,
				space: 0
			},
			{
				maxWidth: 1384,
				minWidth: 1024,
				slides: 3,
				space: 0
			},
			{
				maxWidth: 1024,
				minWidth: 635,
				slides: 2,
				space: 0
			},
			{
				maxWidth: 635,
				minWidth: 0,
				slides: 1,
				space: 0
			},
		],
		animation: {
			duration: 0.6,
			ease: 'ease-out' // cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
		}
	}

	watchForHover()  // отслеживание метода ввода: курсор или тап
	new KdRunLine(paramsKdRunLine)  // бегущая строка
	new KdRunLine(paramsKdRunLine2)  // бегущая строка в footer
	new KdSimplSlider(paramsKdSliderStages)  // слайдер в секции STAGES
	new KdSimplSlider(paramsKdSliderPlayers)  // слайдер в секции PLAYERS
})