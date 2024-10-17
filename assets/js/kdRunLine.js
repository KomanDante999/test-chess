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
					with: item.offsetWidth,
				})
			})

			// events
			this.startSet()

			window.addEventListener('load', () => {
				this.currentNumber = 0
				console.log('elem', this.items[0].elem);
				this.animateTest({
					duration: 5000,
					timing: function (timeFraction) {
						return timeFraction
					},
					elem: this.items[0].elem,
				})

				// this.doAnimation()
			})


		}
	}

	startSet() {
		this.items.forEach(item => {
			item.elem.style.top = '0px'
			item.elem.style.left = `-${item.with}px`
			// item.elem.style.opacity = '0'
			item.elem.style.transitionProperty = 'transform'
			item.elem.style.transitionTimingFunction = 'linear'
		})
	}

	animateTest({ duration, timing, elem, }) {
		let start = performance.now()
		console.log('start', start);

		requestAnimationFrame(function animation(time) {
			let timeFraction = (time - start) / duration
			if (timeFraction > 1) {
				timeFraction = 1
			}

			let progress = timing(timeFraction)
			console.log('progress', progress);
			elem.style.transform = `translateX(${progress * 100}px)`

			if (timeFraction < 1) {
				requestAnimationFrame(animation)
			}

		})
	}

	doAnimation() {
		console.log('int', this.currentNumber);
		this.items[this.currentNumber].elem.style.opacity = '1'
		this.items[this.currentNumber].elem.style.transitionDuration = '5s'
		this.items[this.currentNumber].elem.style.transform = `translateX(${this.items[this.currentNumber].with}px)`
		if (this.currentNumber > 0) {
			this.items[this.currentNumber - 1].elem.style.transitionDuration = '7s'
			this.items[this.currentNumber - 1].elem.style.transform = `translateX(${this.items[this.currentNumber].with + this.viewportW}px)`
		}
		if (this.currentNumber > 0) {
			this.items[this.currentNumber - 1].elem.style.transitionDuration = '7s'
			this.items[this.currentNumber - 1].elem.style.transform = `translateX(${this.items[this.currentNumber].with + this.viewportW}px)`
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