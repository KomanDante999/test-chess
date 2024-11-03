export class KdSimplSlider {
	_currentViewport = null

	constructor(params) {
		this.$Slider = document.getElementById(params.id)
		if (this.$Slider) {

			this.setModelDef(params)

			// events
			window.addEventListener('load', () => {
				console.log('Win load');
				let sliderStatus = this.doEnabling()

				if (sliderStatus == 'enable') {
					console.log('enable');
					this.setModel()
					this.setView()

				}
				console.log(this.model);
			})

			window.addEventListener('resize', () => {
				console.log('resize');

				let sliderStatus = this.doEnabling()

				if (sliderStatus == 'enable') {
					console.log('enable');
					this.cleanView()
					this.cleanModel()
					this.setModel()
					this.setView()
				}

				if (sliderStatus == 'clean') {
					console.log('clean');
					this.cleanView()
					this.cleanModel()
				}

				console.log(this.model);
			})
		}
	}

	doEnabling() {
		this.model.mediaRange.forEach(point => {
			if (this.currentViewport > point.minWidth && this.currentViewport <= point.maxWidth) {
				point.status = 'enable'
			} else {
				point.status = 'disable'
			}
		})

		if (this.model.mediaRange.find(point => point.status == 'enable')) {
			this.model.status = 'enable'
		} else {
			if (this.model.status == 'enable') {
				this.model.status = 'clean'
			}
		}
		return this.model.status
	}

	// ======= MODEL ========

	setModelDef(params) {
		this.model = {
			wrap: {
				node: null,
				w: null,
				h: null,
			},
			cards: [],
			nav: {
				next: [],
				prev: [],
				disableClass: 'disable-btn',
				isEnable: true,
				isHide: true,
			},
			pag: {
				wrap: [],
				activeClass: 'active-btn',
				isEnable: true,
				isHide: true,
			},
			mediaRange: [],
			card: {
				total: null,
				w: null,
				h: null,
				num: null,    // number of visible slides
				space: null,
				active: 1,
			},
			mobilFirst: true,
			anim: {
				duration: 0.5,
				ease: 'ease-in-out' // cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
			},
			status: 'disable', // 'enable', 'first', 'remove'
		}
		// params
		if (params.mobilFirst !== undefined) { this.model.mobilFirst = params.mobilFirst }
		if (params.navigationEnable !== undefined) { this.model.nav.isEnable = params.navigationEnable }
		if (params.paginationEnable !== undefined) { this.model.pag.isEnable = params.paginationEnable }
		if (params.navigationDisableClass) { this.model.nav.disableClass = params.navigationDisableClass }
		if (params.paginationActiveClass) { this.model.pag.activeClass = params.paginationActiveClass }

		if (params.animation.duration) { this.model.anim.duration = params.animation.duration }
		if (params.animation.ease) { this.model.anim.ease = params.animation.ease }

		// breakpoints
		params.breakpoints.forEach(point => {
			if (!point.disable) {
				this.model.mediaRange.push({
					maxWidth: point.maxWidth,
					minWidth: point.minWidth,
					slides: (point.slides == undefined || point.slides == 0) ? 1 : point.slides,
					space: (point.space == undefined) ? 0 : point.space,
					status: 'disable', // 'enable', 'first', 'remove',
				})
			}
		})
		this.model.mediaRange.sort((a, b) => b.maxWidth - a.maxWidth)
		// add elements
		this.raw = Array.from(this.$Slider.querySelectorAll('[data-kd-slider]'))
		this.raw.forEach(elem => {
			if (elem.dataset.kdSlider == 'wrap') {
				this.model.wrap.node = elem
			}
			if (elem.dataset.kdSlider == 'card') {
				this.model.cards.push({
					node: elem,
					order: null,
					position: null,
					isChange: false,
				})
			}
			if (this.model.nav.isEnable) {
				if (elem.dataset.kdSlider == 'next') {
					this.model.nav.next.push({
						node: elem,
						isDisable: false,
					})
				}
				if (elem.dataset.kdSlider == 'prev') {
					this.model.nav.prev.push({
						node: elem,
						isDisable: false,
					})
				}
			}
			if (this.model.pag.isEnable) {
				if (elem.dataset.kdSlider == 'pag-wrap') {
					this.model.pag.wrap.push({
						node: elem,
						buttons: [],
					})
				}
			}
		})
		// cards
		this.raw = []
		this.model.cards.forEach((card, index) => {
			card.order = index
		})
		this.model.card.total = this.model.cards.length
	}

	setModel() {

		this.model.mediaRange.forEach(point => {
			if (point.status == 'enable') {

				// wrap
				this.model.wrap.w = this.model.wrap.node.getBoundingClientRect().width
				this.model.wrap.h = this.model.wrap.node.getBoundingClientRect().height

				// card
				this.model.card.space = point.space
				this.model.card.num = point.slides
				this.model.card.w = Math.round((this.model.wrap.w - this.model.card.space) / this.model.card.num)
				this.model.card.h = this.model.wrap.h

				// cards
				this.positionCardModel()

				// nav
				if (this.model.nav.isEnable) {
					this.updateNavModel()
				}

				// pag
				if (this.model.pag.isEnable) {
					this.model.pag.wrap.forEach(wrap => {
						wrap.buttons.push({
							node: wrap.node.querySelector('[data-kd-slider="pag-btn"]'),
							num: 0,
							isActive: false,
						})
					})

					this.model.pag.wrap.forEach(wrap => {
						for (let i = 1; i < (this.model.card.total - (this.model.card.num - 1)); i++) {
							wrap.buttons.push({
								node: wrap.buttons[0].node.cloneNode(true),
								num: i,
								isActive: false,
							})
						}
					})
					this.updatePagModel()
				}
			}
		})
	}

	updateModel() {
		this.positionCardModel()
		console.log(this.model.card.active);
		if (this.model.nav.isEnable) {
			this.updateNavModel()
		}
		if (this.model.pag.isEnable) {
			this.updatePagModel()
		}

	}

	positionCardModel() {
		this.model.cards
			.filter(card => card.order < this.model.card.active)
			.forEach(card => { card.position = `-${this.model.card.w + this.model.card.space}` })

		this.model.cards
			.filter(card => card.order > (this.model.card.active + this.model.card.num - 1))
			.forEach(card => { card.position = `${this.model.wrap.w + this.model.card.space}` })

		this.model.cards
			.filter(card => card.order >= this.model.card.active)
			.filter(card => card.order <= (this.model.card.active + this.model.card.num - 1))
			.forEach((card, index) => {
				card.position = `${this.model.card.w * index + this.model.card.space * index}`
			})
	}

	updateNavModel() {
		if (this.model.card.active == (this.model.card.total - this.model.card.num)) {
			this.model.nav.next.forEach(btn => {
				btn.isDisable = true
			})
		}
		if (this.model.card.active < (this.model.card.total - this.model.card.num)) {
			this.model.nav.next.forEach(btn => {
				btn.isDisable = false
			})
		}
		if (this.model.card.active == 0) {
			this.model.nav.prev.forEach(btn => {
				btn.isDisable = true
			})
		}
		if (this.model.card.active > 0) {
			this.model.nav.prev.forEach(btn => {
				btn.isDisable = false
			})
		}
	}

	updatePagModel() {
		this.model.pag.wrap.forEach(wrap => {
			wrap.buttons.forEach(btn => {
				btn.isActive = false
				if (btn.num == this.model.card.active) {
					btn.isActive = true
				}
			})
		})
	}

	// ======= VIEW ========

	setView() {
		// slider
		this.model.wrap.node.style.display = 'block'
		this.model.wrap.node.style.position = 'relative'
		this.model.wrap.node.style.overflow = 'hidden'
		// cards
		this.model.cards.forEach(card => {
			card.node.style.width = `${this.model.card.w}px`
			card.node.style.height = `${this.model.card.h}px`
			card.node.style.position = 'absolute'
			card.node.style.top = '0px'
			card.node.style.left = '0px'
			card.node.style.transform = `translateX(${card.position}px)`
			card.node.style.transitionProperty = 'transform'
			card.node.style.transitionDuration = `${this.model.anim.duration}s`
			card.node.style.transitionTimingFunction = this.model.anim.ease
		})
		// nav
		if (this.model.nav.isEnable) {
			this.updateNavView()

			// ADD EVENT SLIDER
			this.model.nav.next.forEach(btn => {
				btn.node.addEventListener('click', () => {
					this.model.card.active += 1
					this.updateModel()
					this.updateView()
				})
			})
			// ADD EVENT SLIDER
			this.model.nav.prev.forEach(btn => {
				btn.node.addEventListener('click', () => {
					this.model.card.active -= 1
					this.updateModel()
					this.updateView()
				})
			})
		}

		// pag
		if (this.model.pag.isEnable) {
			this.model.pag.wrap.forEach(wrap => {
				wrap.buttons.forEach(btn => {
					wrap.node.append(btn.node)
					// ADD EVENT SLIDER
					btn.node.addEventListener('click', () => {
						this.model.card.active = btn.num
						this.updateModel()
						this.updateView()
					})
				})

			})
			this.updatePagView()
		}

	}

	updateView() {

		if (this.model.nav.isEnable) {
			this.updateNavView()
		}
		if (this.model.pag.isEnable) {
			this.updatePagView()
		}
		this.doAnimView()
	}

	updateNavView() {
		this.model.nav.next.forEach(btn => {
			if (btn.isDisable) {
				btn.node.classList.add(`${this.model.nav.disableClass}`)
				btn.node.disabled = true
			} else {
				if (btn.node.classList.contains(`${this.model.nav.disableClass}`)) {
					btn.node.classList.remove(`${this.model.nav.disableClass}`)
				}
				btn.node.disabled = false
			}
		})
		this.model.nav.prev.forEach(btn => {
			if (btn.isDisable) {
				btn.node.classList.add(`${this.model.nav.disableClass}`)
				btn.node.disabled = true
			} else {
				if (btn.node.classList.contains(`${this.model.nav.disableClass}`)) {
					btn.node.classList.remove(`${this.model.nav.disableClass}`)
				}
				btn.node.disabled = false
			}
		})
	}

	updatePagView() {
		this.model.pag.wrap.forEach(wrap => {
			wrap.buttons.forEach(btn => {
				if (btn.isActive) {
					btn.node.classList.add(`${this.model.pag.activeClass}`)
					btn.node.disabled = true
				} else {
					if (btn.node.classList.contains(`${this.model.pag.activeClass}`)) {
						btn.node.classList.remove(`${this.model.pag.activeClass}`)
					}
					btn.node.disabled = false
				}
			})
		})
	}

	doAnimView() {
		this.model.cards.forEach(card => {
			card.node.style.transform = `translateX(${card.position}px)`
		})
	}

	// ===== CLEAN ====

	cleanView() {
		this.model.wrap.node.style.display = ''
		this.model.wrap.node.style.position = ''
		this.model.wrap.node.style.overflow = ''
		this.model.cards.forEach(card => {
			card.node.style.position = ''
			card.node.style.transitionProperty = ''
			card.node.style.transitionDuration = ''
			card.node.style.transitionTimingFunction = ''
			card.node.style.width = ''
			card.node.style.height = ''
			card.node.style.transform = ''

		})
		if (this.model.pag.isEnable) {
			this.model.pag.wrap.forEach(wrap => {
				wrap.node.replaceChildren()
				wrap.node.append(wrap.buttons[0].node)
			})

		}
		this.model.status = 'disable'
	}
	cleanModel() {
		// clean pag buttons
		this.model.pag.wrap.forEach((wrap => {
			wrap.buttons = []
		}))
		this.model.card.active = 0
	}

	get currentViewport() {
		return window.innerWidth
	}
	set currentViewport(value) {
		this._currentViewport = value
	}

}