export class KdRunLine {
	_viewportW = null
	_currentItem = 0

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


				this.animateTest({
					timing: function (timeFraction) {
						return timeFraction
					},
					item: this.items[0],
					currentItem: this.currentItem,
				})

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

	animateTest({ timing, item, }) {

		requestAnimationFrame(function animation(time) {

			let progress = timing(time * 0.000001)
			item.elem.style.transform = `translateX(${progress * 100000}px)`
			// console.log('progress', progress);
			// console.log('x', item.elem.getBoundingClientRect().x);

			if (item.elem.getBoundingClientRect().x > 0) {
				this.nextItem()
			}
			requestAnimationFrame(animation)
		})
	}

	nextItem() {
		this.currentItem = this.currentItem + 1
		console.log('this.currentItem', this.currentItem);
	}

	get viewportW() {
		return window.innerWidth
	}
	set viewportW(value) {
		this._viewportW = value
	}

	get currentItem() {
		return this._currentItem
	}
	set currentItem(value) {
		this._currentItem = value
	}

}