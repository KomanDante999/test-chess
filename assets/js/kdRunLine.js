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
					draw: 0,
					move: false,
				})
			})

			// events

			window.addEventListener('load', () => {
				this.startSet()
				this.animateTest(this.items)
			})


		}
	}

	startSet() {
		this.items.forEach(item => {
			item.width = item.elem.getBoundingClientRect().width
			console.log(item.width);
			item.elem.style.top = '0px'
			item.elem.style.left = `-${item.width}px`
		})
	}

	animateTest(items) {
		let curItem = 0
		const viewportW = this.viewportW

		requestAnimationFrame(function animationId() {

			items.forEach(item => {
				// condition start 
				if (item.num == curItem) {
					item.move = true
				}
				// driver
				if (item.move) {
					item.draw = item.draw + 2
					item.elem.style.transform = `translateX(${item.draw}px)`
				}

				// condition next item
				if (Math.trunc(item.elem.getBoundingClientRect().x) == 0) {
					if (curItem < items.length - 1) {
						curItem = curItem + 1
					} else {
						curItem = 0
					}
				}
				// condition break
				if (item.elem.getBoundingClientRect().x > viewportW) {
					item.draw = 0
					item.move = false
					item.elem.style.transform = `translateX(0px)`
				}
			})

			requestAnimationFrame(animationId)
		})
	}

	get viewportW() {
		return window.innerWidth
	}
	set viewportW(value) {
		this._viewportW = value
	}

}