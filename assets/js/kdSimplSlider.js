export class KdSimplSlider {
	_currentViewport = null
	_currentCard = 0


	constructor(params) {
		this.$Slider = document.getElementById(params.id)
		if (this.$Slider) {

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
					isEnable: true
				},
				pag: {
					wrap: [],
					activeClass: 'active-btn',
					isEnable: true
				},
				mediaRange: [],
				card: {
					total: null,
					w: null,
					h: null,
					view: null,
					space: null,
					active: 0,
				},
				mobilFirst: true,
				anim: {
					duration: 0.5,
					ease: 'ease-in-out' // cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
				},
				status: 'disable', // 'enable', 'first', 'remove'
			}


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

			// events
			window.addEventListener('load', () => {
				console.log('Win load');
				let status = this.doEnabling()

				if (status == 'first') {
					this.setFirstModel()
					this.setFirstView()

					console.log('first');
				}

				if (status == 'first' || status == 'enable') {
					this.setModel()
					this.setView()

					console.log('enable');
				}
				console.log(this.model);
			})

			window.addEventListener('resize', () => {
				console.log('resize');
				let status = this.doEnabling()

				if (status == 'first') {
					this.setFirstModel()
					this.setFirstView()


					console.log('first');
				}

				if (status == 'first' || status == 'enable') {
					this.setModel()
					this.setView()

					console.log('enable');
				}

				if (status == 'clean') {
					this.clean()
					console.log('clean');
				}

				console.log(this.model);
			})
		}
	}

	doEnabling() {
		this.model.mediaRange.forEach(point => {
			if (this.currentViewport > point.minWidth && this.currentViewport <= point.maxWidth) {
				if (point.status == 'first') { point.status = 'enable' }
				if (point.status == 'disable') {
					this.model.mediaRange.forEach(item => {
						item.status = 'disable'
					})
					point.status = 'first'
				}
			} else {
				point.status = 'disable'
			}
		})

		if (this.model.mediaRange.find(point => point.status !== 'disable')) {
			if (this.model.status == 'disable') {
				this.model.status = 'first'
			} else {
				this.model.status = 'enable'
			}
		} else {
			if (this.model.status == 'first' || this.model.status == 'enable') {
				this.model.status = 'clean'
			}
		}
		return this.model.status
	}

	setFirstModel() {

		// cards
		this.model.wrap.node = this.$Slider.querySelector('[data-kd-slider-wrap]')
		Array
			.from(this.$Slider.querySelectorAll('[data-kd-slider-card]'))
			.forEach(item => {
				this.model.cards.push({
					node: item,
					num: Number(item.dataset.kdSliderCard),
					position: null,
					isChange: false,
				})
			})
		this.model.card.total = this.model.cards.length
		this.model.cards.sort((a, b) => a.num - b.num)
		for (let i = 0; i < this.model.card.total; i++) {
			this.model.cards[i].num = i
		}

		// nav
		if (this.model.nav.isEnable) {
			Array
				.from(this.$Slider.querySelectorAll('[data-kd-slider-nav]'))
				.forEach(btn => {
					if (btn.dataset.kdSliderNav == 'next') {
						this.model.nav.next.push({
							node: btn,
							isDisable: false,
						})
					}
					if (btn.dataset.kdSliderNav == 'prev') {
						this.model.nav.prev.push({
							node: btn,
							isDisable: false,
						})
					}
				})
		}

		// pag
		if (this.model.pag.isEnable) {
			this.setPagFirstModel()
		}

	}

	setFirstView() {
		// slider
		this.model.wrap.node.style.display = 'block'
		this.model.wrap.node.style.position = 'relative'
		this.model.wrap.node.style.overflow = 'hidden'
		// cards
		this.model.cards.forEach(card => {
			card.node.style.position = 'absolute'
			card.node.style.top = '0px'
			card.node.style.left = '0px'
			card.node.style.transitionProperty = 'transform'
			card.node.style.transitionDuration = `${this.model.anim.duration}s`
			card.node.style.transitionTimingFunction = this.model.anim.ease
		})
		// nav
		if (this.model.nav.isEnable) {
			this.model.nav.next.forEach(btn => {
				btn.node.addEventListener('click', () => {  // ADD EVENT SLIDER
					this.model.card.active += 1
					this.updateModel()
					this.updateView()
				})
			})
			this.model.nav.prev.forEach(btn => {
				btn.node.addEventListener('click', () => {  // ADD EVENT SLIDER
					this.model.card.active -= 1
					this.updateModel()
					this.updateView()
				})
			})
		}
	}

	setModel() {
		this.model.mediaRange.forEach(point => {
			if (point.status == 'first') {            // first start current breakpoint
				this.model.wrap.h = this.model.wrap.node.getBoundingClientRect().height
				this.model.card.h = this.model.wrap.h
				this.model.card.space = point.space
				this.model.card.view = point.slides
				// check last card 
				this.checkPositionLastCard()
				// PAG add buttons
				if (this.model.pag.isEnable) {
					this.setPagModel()
				}
			}
			if (point.status == 'first' || point.status == 'enable') {
				this.model.wrap.w = this.model.wrap.node.getBoundingClientRect().width
				this.model.card.w = Math.round((this.model.wrap.w - point.space) / point.slides)

				this.positionCardModel()
				if (this.model.nav.isEnable) {
					this.updateNavModel()
				}
				// PAG set active button
				if (this.model.pag.isEnable) {
					this.updatePagModel()
				}
			}
		})
	}

	setView() {
		this.model.cards.forEach(card => {
			card.node.style.width = `${this.model.card.w}px`
			card.node.style.height = `${this.model.card.h}px`
			card.node.style.transform = `translateX(${card.position}px)`
		})
		if (this.model.nav.isEnable) {
			this.updateNavView()
		}

		if (this.model.pag.isEnable) {
			this.setPagView()
			this.updatePagView()
		}
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
	updateView() {

		if (this.model.nav.isEnable) {
			this.updateNavView()
		}
		if (this.model.pag.isEnable) {
			this.updatePagView()
		}
		this.doAnimView()
	}


	positionCardModel() {
		this.model.cards
			.filter(card => card.num < this.model.card.active)
			.forEach(card => { card.position = `-${this.model.card.w + this.model.card.space}` })
		this.model.cards
			.filter(card => card.num > (this.model.card.active + this.model.card.view - 1))
			.forEach(card => { card.position = `${this.model.wrap.w + this.model.card.space}` })
		this.model.cards
			.filter(card => card.num >= this.model.card.active)
			.filter(card => card.num <= (this.model.card.active + this.model.card.view - 1))
			.forEach((card, index) => {
				card.position = `${this.model.card.w * index + this.model.card.space * index}`
			})
	}

	checkPositionLastCard() {
		if (this.model.card.active > (this.model.card.total - this.model.card.view)) {
			this.model.card.active = (this.model.card.total - this.model.card.view)
		}
	}

	updateNavModel() {
		if (this.model.card.active == (this.model.card.total - this.model.card.view)) {
			this.model.nav.next.forEach(btn => {
				btn.isDisable = true
			})
		}
		if (this.model.card.active < (this.model.card.total - this.model.card.view)) {
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

	setPagFirstModel() {
		if (this.model.pag.wrap.length == 0) {
			Array
				.from(this.$Slider.querySelectorAll('[data-kd-slider-pag="wrap"]'))
				.forEach(wrap => {
					this.model.pag.wrap.push({
						node: wrap,
						buttons: []
					})
				})

			this.model.pag.wrap.forEach(wrap => {
				wrap.buttons.push({
					node: wrap.node.querySelector('[data-kd-slider-pag="btn"]'),
					num: 0,
					isActive: false,
				})
			})
		}

	}

	setPagModel() {
		this.cleanPagModel()
		this.model.pag.wrap.forEach(wrap => {
			for (let i = 1; i < (this.model.card.total - (this.model.card.view - 1)); i++) {
				wrap.buttons.push({
					node: wrap.buttons[0].node.cloneNode(true),
					num: i,
					isActive: false,
				})
			}
			wrap.buttons.forEach(btn => {
				btn.node.addEventListener('click', () => {// ADD EVENT SLIDER
					this.model.card.active = btn.num
					this.updateModel()
					this.updateView()
				})
			})
		})
	}

	setPagView() {
		this.cleanPagView()
		this.model.pag.wrap.forEach(wrap => {
			wrap.buttons.forEach(btn => {
				wrap.node.append(btn.node)
			})
		})
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

	cleanPagView() {
		this.model.pag.wrap.forEach(wrap => {
			wrap.node.replaceChildren()
		})
	}

	cleanPagModel() {
		this.model.pag.wrap.forEach(wrap => {
			if (wrap.buttons.length > 1) {
				wrap.buttons.splice(1, wrap.buttons.length - 1)
			}
		})
	}

	doAnimView() {
		this.model.cards.forEach(card => {
			card.node.style.transform = `translateX(${card.position}px)`
		})
	}


	clean() {
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
			this.cleanPagModel()
			this.cleanPagView()
		}
		this.model.status = 'disable'
	}

	get currentViewport() {
		return window.innerWidth
	}
	set currentViewport(value) {
		this._currentViewport = value
	}

	get currentCard() {
		return this._currentCard
	}
	set currentCard(value) {
		this._currentCard = value
	}
}