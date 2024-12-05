export class KdSimplSlider {
	_currentViewport = null

	constructor(params) {
		this.$Slider = document.getElementById(params.id)
		if (this.$Slider) {

			this.setModelDef(params)
			this.handleNextClick = this.handleNextClick.bind(this)
			this.handlePrevClick = this.handlePrevClick.bind(this)
			this.handlePagClick = this.handlePagClick.bind(this)
			this.intervalTimerId = null
			this.timeoutId = null
			// events
			window.addEventListener('load', () => {
				let sliderStatus = this.doEnabling()

				if (sliderStatus == 'enable') {
					this.setModel()
					this.setView()

					if (this.model.autoplay.isEnable) {
						this.doAutoplay()
					}
				}
			})
			window.addEventListener('resize', () => {

				let sliderStatus = this.doEnabling()

				if (sliderStatus == 'enable') {
					this.cleanView()
					this.cleanModel()
					this.setModel()
					this.setView()
					if (this.model.autoplay.isEnable) {
						this.doAutoplay()
					}
				}

				if (sliderStatus == 'clean') {
					this.cleanView()
					this.cleanModel()
					this.model.status = 'disable'
				}

			})
		}
	}

	doEnabling() {
		this.model.mediaRange.forEach(point => {

			if (this.model.mobilFirst) {
				if (this.currentViewport >= point.minWidth && this.currentViewport < point.maxWidth) {
					point.status = 'enable'
				} else {
					point.status = 'disable'
				}
			} else {
				if (this.currentViewport > point.minWidth && this.currentViewport <= point.maxWidth) {
					point.status = 'enable'
				} else {
					point.status = 'disable'
				}

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
				isEnable: false,
			},
			pag: {
				wrap: [],
				activeClass: 'active-btn',
				isEnable: false,
			},
			count: {
				current: [],
				total: [],
				isEnable: false,
			},
			mediaRange: [],
			prop: {
				total: null,  // total cards
				w: null,
				h: null,
				num: null,    // number of visible slides
				space: null,
				active: 0,    // active order card 
				dir: null,
			},
			mobilFirst: true,
			isLoop: false,
			autoplay: {
				isEnable: false,
				delay: 4,
				isPlayAfterStop: true,
				delayPlayAfterStop: 10,
			},
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
		if (params.counterEnable !== undefined) { this.model.count.isEnable = params.counterEnable }
		if (params.navigationDisableClass) { this.model.nav.disableClass = params.navigationDisableClass }
		if (params.paginationActiveClass) { this.model.pag.activeClass = params.paginationActiveClass }

		if (params.loop !== undefined) { this.model.isLoop = params.loop }
		if (params.autoplay !== undefined) {
			if (params.autoplay.isEnable !== undefined) { this.model.autoplay.isEnable = params.autoplay.isEnable }
			if (params.autoplay.delay !== undefined) { this.model.autoplay.delay = params.autoplay.delay }
			if (params.autoplay.isPlayAfterStop !== undefined) { this.model.autoplay.isPlayAfterStop = params.autoplay.isPlayAfterStop }
			if (params.autoplay.delayPlayAfterStop !== undefined) { this.model.autoplay.delayPlayAfterStop = params.autoplay.delayPlayAfterStop }
		}
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
			// cards
			if (elem.dataset.kdSlider == 'card') {
				this.model.cards.push({
					node: elem,
					order: null,
					index: null,
					position: null,
					isMove: false,
					isTransfer: false,
				})
			}
			// nav
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
			// pag
			if (this.model.pag.isEnable) {
				if (elem.dataset.kdSlider == 'pag-wrap') {
					this.model.pag.wrap.push({
						node: elem,
						buttons: [],
					})
				}
			}
			// count
			if (this.model.count.isEnable) {
				if (elem.dataset.kdSlider == 'count-current') {
					this.model.count.current.push({
						node: elem,
						value: null,
					})
				}
				if (elem.dataset.kdSlider == 'count-total') {
					this.model.count.total.push({
						node: elem,
						value: null,
					})
				}
			}
		})
		// cards
		this.raw = []
		this.model.cards.forEach((card, index) => {
			card.order = index
			card.index = index
		})
		this.model.prop.total = this.model.cards.length

		// pag
		if (this.model.pag.isEnable) {
			this.model.pag.wrap.forEach(wrap => {
				wrap.buttons.push({
					node: wrap.node.querySelector('[data-kd-slider="pag-btn"]'),
					num: 0,
					isActive: false,
					clickHandler: null,
				})
			})
		}

	}

	setModel() {

		this.model.mediaRange.forEach(point => {
			if (point.status == 'enable') {

				// wrap
				this.model.wrap.w = this.model.wrap.node.getBoundingClientRect().width
				this.model.wrap.h = this.model.wrap.node.getBoundingClientRect().height

				// card
				this.model.prop.space = point.space
				this.model.prop.num = point.slides
				if (this.model.prop.num == 1) {
					this.model.prop.w = this.model.wrap.w
				} else {
					this.model.prop.w = Math.round((this.model.wrap.w - this.model.prop.space) / this.model.prop.num)
				}
				this.model.prop.h = this.model.wrap.h

				// cards
				this.indexCardModel()
				this.positionCardModel()

				// nav
				if (this.model.nav.isEnable) {
					this.updateNavModel()
					// ADD EVENT SLIDER
					this.model.nav.next.forEach(btn => {
						btn.clickHandler = this.handleNextClick
					})
					// ADD EVENT SLIDER
					this.model.nav.prev.forEach(btn => {
						btn.clickHandler = this.handlePrevClick
					})
				}

				// pag
				if (this.model.pag.isEnable) {

					this.model.pag.wrap.forEach(wrap => {
						for (let i = 1; i < (this.model.prop.total - (this.model.prop.num - 1)); i++) {
							wrap.buttons.push({
								node: wrap.buttons[0].node.cloneNode(true),
								num: i,
								isActive: false,
								clickHandler: null,
							})
						}
						// ADD EVENT SLIDER
						wrap.buttons.forEach(btn => {
							btn.clickHandler = () => this.handlePagClick(btn.num)
						})
					})
					this.updatePagModel()
				}

				// count
				if (this.model.count.isEnable) {
					this.updateCountModel()
					this.model.count.total.forEach(item => {
						item.value = this.model.prop.total
					})
				}

			}
		})
	}

	updateModel() {
		// cards
		this.indexCardModel()
		this.positionCardModel()
		this.animationCardModel()
		// nav
		if (this.model.nav.isEnable) {
			this.updateNavModel()
		}
		// pag
		if (this.model.pag.isEnable) {
			this.updatePagModel()
		}
		// count
		if (this.model.count.isEnable) {
			this.updateCountModel()
		}

	}

	indexCardModel() {

		let lengthArr = this.model.cards.filter(item => item.order >= this.model.prop.active).length
		this.model.cards
			.filter(item => item.order >= this.model.prop.active)
			.forEach((item, index) => {
				item.index = index
			})

		this.model.cards
			.filter(item => item.order < this.model.prop.active)
			.forEach((item, index) => {
				item.index = index + lengthArr
			})

		this.model.cards.forEach(item => {
			if (item.index == (this.model.prop.total - 1)) {
				item.index = -1
			}
		})
	}

	positionCardModel() {

		this.model.cards.forEach(item => {
			item.position = `${this.model.prop.w * item.index + this.model.prop.space * item.index}`
		})
	}

	animationCardModel() {
		this.model.cards.forEach(item => {
			item.isMove = false
			if (item.index >= 0 && item.index < this.model.prop.num) {
				item.isMove = true
			}
			if (this.model.prop.dir == 'next' && item.index == -1) {
				item.isMove = true
			}
			if (this.model.prop.dir == 'prev' && item.index == this.model.prop.num) {
				item.isMove = true
			}
		})
	}

	updateNavModel() {
		if (!this.model.isLoop) {
			if (this.model.prop.active == (this.model.prop.total - this.model.prop.num)) {
				this.model.nav.next.forEach(btn => {
					btn.isDisable = true
				})
			}
			if (this.model.prop.active < (this.model.prop.total - this.model.prop.num)) {
				this.model.nav.next.forEach(btn => {
					btn.isDisable = false
				})
			}
			if (this.model.prop.active == 0) {
				this.model.nav.prev.forEach(btn => {
					btn.isDisable = true
				})
			}
			if (this.model.prop.active > 0) {
				this.model.nav.prev.forEach(btn => {
					btn.isDisable = false
				})
			}
		}
	}

	updatePagModel() {
		this.model.pag.wrap.forEach(wrap => {
			wrap.buttons.forEach(btn => {
				btn.isActive = false
				if (btn.num == this.model.prop.active) {
					btn.isActive = true
				}
			})
		})
	}

	updateCountModel() {
		this.model.count.current.forEach(item => {
			item.value = this.model.prop.active + 1
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
			card.node.style.width = `${this.model.prop.w}px`
			card.node.style.height = `${this.model.prop.h}px`
			card.node.style.position = 'absolute'
			card.node.style.top = '0px'
			card.node.style.left = '0px'
			card.node.style.transform = `translateX(${card.position}px)`
		})
		// nav
		if (this.model.nav.isEnable) {
			this.updateNavView()

			// ADD EVENT SLIDER
			this.model.nav.next.forEach(btn => {
				btn.node.addEventListener('click', btn.clickHandler)
			})
			// ADD EVENT SLIDER
			this.model.nav.prev.forEach(btn => {
				btn.node.addEventListener('click', btn.clickHandler)
			})
		}

		// pag
		if (this.model.pag.isEnable) {
			this.model.pag.wrap.forEach(wrap => {
				wrap.buttons.forEach(btn => {
					wrap.node.append(btn.node)
					// ADD EVENT SLIDER
					btn.node.addEventListener('click', btn.clickHandler)
				})
			})
			this.updatePagView()
		}

		// count
		if (this.model.count.isEnable) {
			this.updateCountView()
			this.model.count.total.forEach(item => {
				item.node.textContent = `${item.value}`
			})
		}
	}

	updateView() {

		if (this.model.nav.isEnable) {
			this.updateNavView()
		}
		if (this.model.pag.isEnable) {
			this.updatePagView()
		}
		// count
		if (this.model.count.isEnable) {
			this.updateCountView()
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

	updateCountView() {
		this.model.count.current.forEach(item => {
			item.node.textContent = `${item.value}`
		})
	}

	handleNextClick() {
		// stop autoplay
		if (this.model.autoplay.isEnable) {
			this.stopAutoplay()
		}
		this.moveNext()
	}

	moveNext() {
		this.model.prop.dir = 'next'
		if (this.model.isLoop && this.model.prop.active == (this.model.prop.total - 1)) {
			this.model.prop.active = 0
		} else {
			this.model.prop.active += 1
		}
		this.updateModel()
		this.updateView()
	}

	handlePrevClick() {
		// stop autoplay
		if (this.model.autoplay.isEnable) {
			this.stopAutoplay()
		}

		this.movePrev()
	}

	movePrev() {
		this.model.prop.dir = 'prev'

		if (this.model.isLoop && this.model.prop.active == 0) {
			this.model.prop.active = this.model.prop.total - 1
		} else {
			this.model.prop.active -= 1
		}
		this.updateModel()
		this.updateView()
	}

	handlePagClick(num) {
		// stop autoplay
		if (this.model.autoplay.isEnable) {
			this.stopAutoplay()
		}

		let n = this.model.prop.active - num
		let count = 0
		let durationSave = this.model.anim.duration
		let easeSave = this.model.anim.ease
		this.model.anim.duration = 0.1
		this.model.anim.ease = 'linear'

		this.pagTimerId = setInterval(() => {
			count += 1
			if (n < 0) {
				this.moveNext()
			} else {
				this.movePrev()
			}

			if (count == (Math.abs(n)) - 1) {
				this.model.anim.duration = 0.3
			}

			if (count == Math.abs(n)) {
				this.model.anim.duration = durationSave
				this.model.anim.ease = easeSave
				clearInterval(this.pagTimerId)
			}
		}, 100)
	}

	doAutoplay() {
		this.intervalTimerId = setInterval(() => {
			this.moveNext()
		}, this.model.autoplay.delay * 1000)
	}

	stopAutoplay() {
		clearInterval(this.intervalTimerId)
		this.intervalTimerId = null
		// restart autoplay
		if (this.model.autoplay.isPlayAfterStop) {
			clearTimeout(this.timeoutId)
			this.timeoutId = null
			this.timeoutId = setTimeout(() => {
				this.doAutoplay()
			}, this.model.autoplay.delayPlayAfterStop * 1000)
		}
	}

	doAnimView() {
		this.model.cards.forEach(card => {
			card.node.style.transitionProperty = ''
			card.node.style.transitionDuration = ''
			card.node.style.transitionTimingFunction = ''

			if (card.isMove) {
				card.node.style.transitionProperty = 'transform'
				card.node.style.transitionDuration = `${this.model.anim.duration}s`
				card.node.style.transitionTimingFunction = this.model.anim.ease
			}
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
			card.node.style.opacity = ''
		})
		// clean autoplay
		if (this.model.autoplay.isEnable) {
			clearInterval(this.intervalTimerId)
			if (this.model.autoplay.isPlayAfterStop) {
				clearTimeout(this.timeoutId)
			}
		}
		// nav
		if (this.model.nav.isEnable) {
			// REMOVE EVENT SLIDER
			this.model.nav.next.forEach(btn => {
				btn.node.removeEventListener('click', btn.clickHandler)
			})
			// REMOVE EVENT SLIDER
			this.model.nav.prev.forEach(btn => {
				btn.node.removeEventListener('click', btn.clickHandler)
			})
		}

		// pag
		if (this.model.pag.isEnable) {
			this.model.pag.wrap.forEach(wrap => {
				wrap.buttons.forEach(btn => {
					if (btn.num !== 0) {
						wrap.node.removeChild(btn.node)
					}
				})
				// REMOVE EVENT SLIDER
				if (wrap.buttons[0].clickHandler) {
					wrap.buttons[0].node.removeEventListener('click', wrap.buttons[0].clickHandler)
				}
			})
		}
	}

	cleanModel() {
		// clean autoplay
		if (this.model.autoplay.isEnable) {
			this.intervalTimerId = null
			if (this.model.autoplay.isPlayAfterStop) {
				this.timeoutId = null
			}
		}
		// nav
		if (this.model.nav.isEnable) {
			// REMOVE EVENT SLIDER
			this.model.nav.next.forEach(btn => {
				if (btn.clickHandler) {
					btn.clickHandler = null
				}
			})
			// REMOVE EVENT SLIDER
			this.model.nav.prev.forEach(btn => {
				if (btn.clickHandler) {
					btn.clickHandler = null
				}
			})
		}

		// pag
		this.model.pag.wrap.forEach((wrap => {
			wrap.buttons.splice(1, (wrap.buttons.length - 1))
			wrap.buttons[0].clickHandler = null
		}))
		this.model.prop.active = 0
	}

	get currentViewport() {
		return window.innerWidth
	}
	set currentViewport(value) {
		this._currentViewport = value
	}

}