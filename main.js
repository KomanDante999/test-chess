import { watchForHover } from "./assets/js/watch-for-hover.js";
import { KdRunLine } from "./assets/js/kdRunLine.js";

document.addEventListener('DOMContentLoaded', () => {


	const paramsKdRunLine = {
		id: 'kdRunline',
		speedAnimation: 2.1,
	}

	watchForHover()  // отслеживание метода ввода: курсор или тап
	new KdRunLine(paramsKdRunLine)  // бегущая строка
})