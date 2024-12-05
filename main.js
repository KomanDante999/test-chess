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

	// параметры слайдера STAGES 
	const paramsKdSliderStages = {
		id: 'kdSliderStages',
		navigationEnable: true,
		navigationDisableClass: 'disable-btn',
		paginationEnable: true,
		paginationActiveClass: 'active-btn',
		counterEnable: false,
		mobilFirst: false,
		loop: false,
		autoplay: {
			isEnable: false,
			delay: null,
		},
		breakpoints: [
			{
				maxWidth: Infinity,
				minWidth: 1024,
				disable: true,
			},
			{
				maxWidth: 1024,
				minWidth: 635,
				slides: 2,
				space: 20
			},
			{
				maxWidth: 635,
				minWidth: 0,
				slides: 1,
				space: 20
			},
		],
		animation: {
			duration: 0.9,
			ease: 'ease-in-out' // cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
		}
	}

	// параметры слайдера PLAYERS 
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