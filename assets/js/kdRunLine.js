export class KdRunLine {
	_viewportW = null

	constructor(params) {
		this.$RunLine = document.getElementById(params.id)

		if (this.$RunLine) {
			this.rawItems = Array.from(this.$RunLine.querySelectorAll('[data-kd-runline-item]'))
			this.items = []
			this.rawItems.forEach(item => {
				this.items.push({
					elem: item,
					num: Number(item.dataset.kdRunlineItem),
					width: item.getBoundingClientRect().width,
				})
			})

			// events

			window.addEventListener('load', () => {
				this.startSet()
				this.currentNumber = 0
				this.animateTest({
					duration: 10000,
					timing: function (timeFraction) {
						return timeFraction
					},
					arrItems: this.items,
				})

				// this.doAnimation()
			})


		}
	}

	startSet() {
		this.items.forEach(item => {
			item.width = item.elem.getBoundingClientRect().width
			console.log(item.width);
			item.elem.style.top = '0px'
			item.elem.style.left = `-${item.width}px`
			// item.elem.style.opacity = '0'
			// item.elem.style.transitionProperty = 'transform'
			// item.elem.style.transitionTimingFunction = 'linear'
		})
	}

	animateTest({ duration, timing, arrItems, }) {
		let start = performance.now()
		console.log('arrItems :>> ', arrItems);

		requestAnimationFrame(function animation(time) {
			let timeFraction = (time - start) / duration
			if (timeFraction > 1) {
				timeFraction = 1
			}

			let progress = timing(timeFraction)
			arrItems[0].elem.style.transform = `translateX(${progress * 2000}px)`
			// console.log('progress', progress);
			// console.log('x', arrItems[0].elem.getBoundingClientRect().x);
			if (arrItems[0].elem.getBoundingClientRect().x > 0) {

			}

			if (timeFraction < 1) {
				requestAnimationFrame(animation)
			}

		})
	}

	doAnimation() {
		console.log('int', this.currentNumber);
		this.items[this.currentNumber].elem.style.opacity = '1'
		this.items[this.currentNumber].elem.style.transitionDuration = '5s'
		this.items[this.currentNumber].elem.style.transform = `translateX(${this.items[this.currentNumber].width}px)`
		if (this.currentNumber > 0) {
			this.items[this.currentNumber - 1].elem.style.transitionDuration = '7s'
			this.items[this.currentNumber - 1].elem.style.transform = `translateX(${this.items[this.currentNumber].width + this.viewportW}px)`
		}
		if (this.currentNumber > 0) {
			this.items[this.currentNumber - 1].elem.style.transitionDuration = '7s'
			this.items[this.currentNumber - 1].elem.style.transform = `translateX(${this.items[this.currentNumber].width + this.viewportW}px)`
		}

		setTimeout(() => {
			if (this.currentNumber < this.items.length - 1) {
				this.currentNumber++;
				console.log('out', this.currentNumber);
				this.doAnimation()
			}
		}, 5000);
	}




	get viewportW() {
		return window.innerWidth
	}
	set viewportW(value) {
		this._viewportW = value
	}

}