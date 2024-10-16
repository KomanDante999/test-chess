import { watchForHover } from "./assets/js/watch-for-hover.js";
import { KdRunLine } from "./assets/js/kdRunLine.js";

document.addEventListener('DOMContentLoaded', () => {

	watchForHover()

	const paramsKdRunLine = {
		id: 'kdRunline',
	}

	new KdRunLine(paramsKdRunLine)
})