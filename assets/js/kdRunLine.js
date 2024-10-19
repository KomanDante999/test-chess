export class KdRunLine {
	_viewportW = null

	constructor(params) {
		this.animationId = null;
		this.speedAnimation = Number(params.speedAnimation) ? Number(params.speedAnimation) : 2;
		this.items = []
		this.$RunLine = document.getElementById(params.id)

		if (this.$RunLine) {
			this.rawItems = Array.from(this.$RunLine.querySelectorAll('[data-kd-runline-item]'))
			this.rawItems.forEach(item => {
				this.items.push({
					elem: item,
					num: Number(item.dataset.kdRunlineItem),
				})
			})

			// events
			window.addEventListener('load', () => {
				this.startSet()
				this.startAnimation()
			})

			window.addEventListener('resize', () => {
				this.stopAnimation()
				this.startSet()
				this.startAnimation()
			})
		}
	}

	startSet() {
		this.items.forEach(item => {
			item.width = item.elem.getBoundingClientRect().width
			item.elem.style.transform = `translateX(0px)`
			item.elem.style.top = '0px'
			item.elem.style.left = `-${item.width}px`
			item.draw = 0
			item.move = false
		})
	}

	startAnimation() {
		let curItem = 0

		const animate = () => {

			this.items.forEach(item => {
				// condition start 
				if (item.num == curItem) {
					item.move = true
				}
				// driver
				if (item.move) {
					item.draw += this.speedAnimation
					item.elem.style.transform = `translateX(${item.draw}px)`
				}
				// condition next item
				if (Math.trunc(item.elem.getBoundingClientRect().x) === 0) {
					curItem = (curItem < this.items.length - 1) ? curItem += 1 : 0
				}
				// condition break
				if (item.elem.getBoundingClientRect().x > this.viewportW) {
					item.draw = 0
					item.move = false
					item.elem.style.transform = `translateX(0px)`
				}
			})

			this.animationId = requestAnimationFrame(animate)
		}

		animate()
	}

	stopAnimation() {
		cancelAnimationFrame(this.animationId)
	}

	get viewportW() {
		return window.innerWidth
	}
	set viewportW(value) {
		this._viewportW = value
	}
}