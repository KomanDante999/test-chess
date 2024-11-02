import { watchForHover } from "./assets/js/watch-for-hover.js";
import { KdRunLine } from "./assets/js/kdRunLine.js";
import { KdSimplSlider } from "./assets/js/kdSimplSlider.js";

document.addEventListener('DOMContentLoaded', () => {

	const paramsKdRunLine = {
		id: 'kdRunline',
		speedAnimation: 2.1,
	}
	const paramsKdSliderStages = {
		id: 'kdSliderStages',
		navigationEnable: true,
		navigationDisableClass: 'disable-btn',
		paginationEnable: true,
		paginationActiveClass: 'active-btn',
		mobilFirst: false,
		breakpoints: [
			{
				maxWidth: Infinity,
				minWidth: 1200,
				disable: true,
			},
			{
				maxWidth: 1024,
				minWidth: 600,
				slides: 2,
				space: 20
			},
			{
				maxWidth: 1200,
				minWidth: 1024,
				slides: 3,
				space: 30
			},
			{
				maxWidth: 600,
				minWidth: 0,
				slides: 1,
				space: 20
			},
		],
		animation: {
			duration: 0.9,
			ease: 'cubic-bezier(.21,.21,.27,1.83)' // cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
		}
	}

	watchForHover()  // отслеживание метода ввода: курсор или тап
	new KdRunLine(paramsKdRunLine)  // бегущая строка
	new KdSimplSlider(paramsKdSliderStages)
})