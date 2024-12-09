export class KdSimplSlider {
	_currentViewport = null

	constructor(params) {
		this.$Slider = document.getElementById(params.id)                // первоначальная инициализация слайдера
		if (this.$Slider) {

			this.setModelDef(params)
			this.handleNextClick = this.handleNextClick.bind(this)       // передача контекста this в функции событий на кнопках управления
			this.handlePrevClick = this.handlePrevClick.bind(this)
			this.handlePagClick = this.handlePagClick.bind(this)
			this.intervalTimerId = null                             // таймаут автолистания
			this.timeoutId = null                                   // таймаут возобновления автолистания
			// events
			window.addEventListener('load', () => {
				let sliderStatus = this.doEnabling()         // запуск слайдера в зависимости от параметров

				if (sliderStatus == 'enable') {
					this.setModel()                           // создание модели
					this.setView()                            // вывод представления

					if (this.model.autoplay.isEnable) {       // запуск автолистания в зависимости от параметров
						this.doAutoplay()
					}
				}
			})
			window.addEventListener('resize', () => {    // перезапуск при ресайзе

				let sliderStatus = this.doEnabling()

				if (sliderStatus == 'enable') {           // перезапуск слайдера
					this.cleanView()                       // очистка представления
					this.cleanModel()                      // очистка модели
					this.setModel()
					this.setView()
					if (this.model.autoplay.isEnable) {
						this.doAutoplay()
					}
				}

				if (sliderStatus == 'clean') {          // остановка слайдера с полной очисткой
					this.cleanView()
					this.cleanModel()
					this.model.status = 'disable'
				}

			})
		}
	}

	doEnabling() {                                           // определение статуса слайдера на брекпоинтах, возвращает this.model.status 
		this.model.mediaRange.forEach(point => {               // enable, clean или disable

			if (this.model.mobilFirst) {                         // учет mobile first или desktop first
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

	setModelDef(params) {                // создание базовой модели
		this.model = {                     // запускается после загрузки страницы, не изменяется при включении/отключении слайдера
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
			prop: {                     // динамические свойства (зависят от viewport и params)
				total: null,              // всего слайдов
				w: null,                  // текущая ширина слайда (рассчитывается)
				h: null,                  // текущая высота слайда (берется высота оболочки wrap)
				num: null,                // число видимых слайдов
				space: null,              // отступы между слайдами
				active: 0,                // номер (order) текущего активного слайда
				dir: null,                // направление движения слайдов next или prev (задается кнопками управления)
			},
			mobilFirst: true,
			isLoop: false,              // зацикливание
			autoplay: {                 // параметры автоматического листания
				isEnable: false,
				delay: 4,
				isPlayAfterStop: true,
				delayPlayAfterStop: 10,
			},
			anim: {                     // параметры анимации
				duration: 0.5,
				ease: 'ease-in-out'       // cubic-bezier(.21,.21,.27,1.83), ease, ease-in, ease-out, ease-in-out, linear
			},
			status: 'disable',          // состояние слайдера enable, clean или disable
		}
		// params
		if (params.mobilFirst !== undefined) { this.model.mobilFirst = params.mobilFirst }                       // установка параметров из настроек пользователя
		if (params.navigationEnable !== undefined) { this.model.nav.isEnable = params.navigationEnable }
		if (params.paginationEnable !== undefined) { this.model.pag.isEnable = params.paginationEnable }
		if (params.counterEnable !== undefined) { this.model.count.isEnable = params.counterEnable }
		if (params.navigationDisableClass) { this.model.nav.disableClass = params.navigationDisableClass }
		if (params.paginationActiveClass) { this.model.pag.activeClass = params.paginationActiveClass }

		if (params.loop !== undefined) { this.model.isLoop = params.loop }
		if (params.autoplay !== undefined) {
			if (params.autoplay.isEnable !== undefined) { this.model.autoplay.isEnable = params.autoplay.isEnable }
			if (this.model.autoplay.isEnable) { this.model.isLoop = true }     // включение зацикливания при включенном автовоспроизведении
			if (params.autoplay.delay !== undefined) { this.model.autoplay.delay = params.autoplay.delay }
			if (params.autoplay.isPlayAfterStop !== undefined) { this.model.autoplay.isPlayAfterStop = params.autoplay.isPlayAfterStop }
			if (params.autoplay.delayPlayAfterStop !== undefined) { this.model.autoplay.delayPlayAfterStop = params.autoplay.delayPlayAfterStop }
		}
		if (params.animation.duration) { this.model.anim.duration = params.animation.duration }
		if (params.animation.ease) { this.model.anim.ease = params.animation.ease }

		// breakpoints
		params.breakpoints.forEach(point => {                        // расчет брекпоитов
			if (!point.disable) {
				this.model.mediaRange.push({
					maxWidth: point.maxWidth,
					minWidth: point.minWidth,
					slides: (point.slides == undefined || point.slides == 0) ? 1 : point.slides,
					space: (point.space == undefined) ? 0 : point.space,
					status: 'disable',
				})
			}
		})
		this.model.mediaRange.sort((a, b) => b.maxWidth - a.maxWidth)

		// add elements
		this.raw = Array.from(this.$Slider.querySelectorAll('[data-kd-slider]'))  // поиск в разметке всех активных элементов слайдера (имеют атрибут data-kd-slider)

		this.raw.forEach(elem => {                     // разбор найденных элементов по значению атрибута data-kd-slider
			if (elem.dataset.kdSlider == 'wrap') {
				this.model.wrap.node = elem                // оболочка слайдов
			}
			// cards
			if (elem.dataset.kdSlider == 'card') {      // слайды
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
			if (this.model.nav.isEnable) {               // кнопки навигации, поддерживается несколько кнопок next и prev
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
			if (this.model.pag.isEnable) {                 // оболочка кнопок пагинации, поддерживается несколько оболочек
				if (elem.dataset.kdSlider == 'pag-wrap') {   // в разметке достаточно задать одну кнопку пагинации
					this.model.pag.wrap.push({                 // остальные будут созданы автоматически 
						node: elem,                              // в зависимости от общего числа слайдов и количества видимых слайдов
						buttons: [],
					})
				}
			}
			// count
			if (this.model.count.isEnable) {                    // счетчик слайдов, поддерживается несколько счетчиков
				if (elem.dataset.kdSlider == 'count-current') {   // элемент вывода текущего слайда
					this.model.count.current.push({
						node: elem,
						value: null,
					})
				}
				if (elem.dataset.kdSlider == 'count-total') {     // элемент вывода общего количества слайдов
					this.model.count.total.push({
						node: elem,
						value: null,
					})
				}
			}
		})
		this.raw = []

		// cards
		this.model.cards.forEach((card, index) => {           // первоначальное упорядочивание слайдов
			card.order = index                                  // order отражает положение слайда в разметке - 0,1,2,3...
			card.index = index                                  // index отражает, где должен находиться слайд после срабатывания событий на кнопках управления
		})                                                    // используется схема: -1 |0 1 2| 3 4... , где |0 1 2| - видимые слайды, а в позицию -1 всегда переносится последний слайд

		this.model.prop.total = this.model.cards.length     // общее число слайдов

		// pag
		if (this.model.pag.isEnable) {                     // поиск первой кнопки пагинации в разметке (остальные создаются автоматически)
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
				this.model.wrap.w = this.model.wrap.node.getBoundingClientRect().width         // получение текущих размеров оболочки wrap   
				this.model.wrap.h = this.model.wrap.node.getBoundingClientRect().height

				// card
				this.model.prop.space = point.space             // получение текущих значений отступов и числа видимых слайдов на данном брекпоинте
				this.model.prop.num = point.slides
				if (this.model.prop.num == 1) {                 // если имеется только один видимый слайд, его ширина равна ширине оболочки wrap
					this.model.prop.w = this.model.wrap.w
				} else {                                        // расчет ширины слайда в зависимости от отступов и числа видимых слайдов
					this.model.prop.w = Math.round((this.model.wrap.w - this.model.prop.space) / this.model.prop.num)
				}
				this.model.prop.h = this.model.wrap.h           // высота слайда регулируется высотой оболочки wrap

				// cards
				this.indexCardModel()                           // расчет положения слайдов
				this.positionCardModel()

				// nav
				if (this.model.nav.isEnable) {
					this.updateNavModel()
					// ADD EVENT SLIDER
					this.model.nav.next.forEach(btn => {          // распределение обработчика событий на кнопки управления
						btn.clickHandler = this.handleNextClick
					})
					// ADD EVENT SLIDER
					this.model.nav.prev.forEach(btn => {
						btn.clickHandler = this.handlePrevClick
					})
				}

				// pag
				if (this.model.pag.isEnable) {              // создание и нумерация кнопок пагинации

					this.model.pag.wrap.forEach(wrap => {
						for (let i = 1; i < (this.model.prop.total - (this.model.prop.num - 1)); i++) {
							wrap.buttons.push({
								node: wrap.buttons[0].node.cloneNode(true),    // клонируется элемент, найденный в разметке
								num: i,                                        // номер соответствует order слайда
								isActive: false,                               // состояние кнопки (активная блокируется и получает CSS класс active-btn)
								clickHandler: null,                            // обработчик события
							})
						}
						// ADD EVENT SLIDER
						wrap.buttons.forEach(btn => {                      // распределение обработчика событий на кнопки пагинации
							btn.clickHandler = () => this.handlePagClick(btn.num)
						})
					})
					this.updatePagModel()                                // актуализация состояния пагинации
				}

				// count
				if (this.model.count.isEnable) {
					this.updateCountModel()                          // актуализация счетчика (текущий активный слайд)
					this.model.count.total.forEach(item => {
						item.value = this.model.prop.total             // общее количество слайдов      
					})
				}

			}
		})
	}

	updateModel() {                             // обновление модели при срабатывании события
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

	indexCardModel() {            // расчет положения слайдов после обработки события

		let lengthArr = this.model.cards.filter(item => item.order >= this.model.prop.active).length

		this.model.cards                                            // псевдо-ротация массива слайдов согласно схемы -1 |0 1 2| 3 4 ...
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

	positionCardModel() {                      // позиционирование слайдов в зависимости от index
		// слайд с index=0 получает позицию 0 относительно wrap и далее позиция сдвигается на ширину слайда + отступ
		this.model.cards.forEach(item => {      // невидимые слайды уходят за правую границу wrap, слайд с index=-1 уходит за левую границу wrap
			item.position = `${this.model.prop.w * item.index + this.model.prop.space * item.index}`
		})
	}

	animationCardModel() {                 // расчет того, какие слайды получат время анимации, а какие будут перенесены мгновенно
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

	updateNavModel() {                          // расчет блокировки кнопок навигации, навешивается класс disable-btn (если нет зацикливания)
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

	updatePagModel() {                            // расчет активной кнопки пагинации (должна совпадать с активным слайдом)
		this.model.pag.wrap.forEach(wrap => {
			wrap.buttons.forEach(btn => {
				btn.isActive = false
				if (btn.num == this.model.prop.active) {
					btn.isActive = true
				}
			})
		})
	}

	updateCountModel() {                          // расчет показаний счетчика слайдов
		this.model.count.current.forEach(item => {
			item.value = this.model.prop.active + 1
		})
	}
	// ======= VIEW ========

	setView() {                                          // реализация модели
		// slider
		this.model.wrap.node.style.display = 'block'               // добавление критически необходимых стилей
		this.model.wrap.node.style.position = 'relative'           // на случай если они не добавляются через CSS
		this.model.wrap.node.style.overflow = 'hidden'
		// cards
		this.model.cards.forEach(card => {                         // все слайды позиционируются в левом верхнем углу wrap
			card.node.style.width = `${this.model.prop.w}px`         // и далее распределяются и двигаются с помощью translate
			card.node.style.height = `${this.model.prop.h}px`
			card.node.style.position = 'absolute'
			card.node.style.top = '0px'
			card.node.style.left = '0px'
			card.node.style.transform = `translateX(${card.position}px)`
		})
		// nav
		if (this.model.nav.isEnable) {
			this.updateNavView()                                // обновление представления кнопок навигации

			// ADD EVENT SLIDER
			this.model.nav.next.forEach(btn => {                // навешивание событий на кнопки навигации
				btn.node.addEventListener('click', btn.clickHandler)
			})
			// ADD EVENT SLIDER
			this.model.nav.prev.forEach(btn => {
				btn.node.addEventListener('click', btn.clickHandler)
			})
		}

		// pag
		if (this.model.pag.isEnable) {
			this.model.pag.wrap.forEach(wrap => {           // добавление недостающих кнопок пагинации в DOM
				wrap.buttons.forEach(btn => {
					wrap.node.append(btn.node)
					// ADD EVENT SLIDER
					btn.node.addEventListener('click', btn.clickHandler)  // навешивание событий на кнопки пагинации
				})
			})
			this.updatePagView()                             // обновление представления кнопок пагинации
		}

		// count
		if (this.model.count.isEnable) {
			this.updateCountView()                          // обновление представления счетчика
			this.model.count.total.forEach(item => {
				item.node.textContent = `${item.value}`
			})
		}
	}

	updateView() {                          // обновление представления после срабатывания события

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

	// ======= HANDLERS ========

	handleNextClick() {                      // обработчик события клика по кнопке next
		// stop autoplay
		if (this.model.autoplay.isEnable) {   // остановка автоматического воспроизведения
			this.stopAutoplay()
		}
		this.moveNext()
	}

	moveNext() {                          // драйвер события next
		this.model.prop.dir = 'next'

		if (this.model.prop.active == (this.model.prop.total - 1)) {  // возврат в начало при достижении конца слайдов
			this.model.prop.active = 0
		} else {
			this.model.prop.active += 1         // активация следующего слайда
		}
		this.updateModel()
		this.updateView()
	}

	handlePrevClick() {                   // обработчик события клика по кнопке prev
		// stop autoplay
		if (this.model.autoplay.isEnable) {
			this.stopAutoplay()
		}

		this.movePrev()
	}

	movePrev() {                             // драйвер события prev
		this.model.prop.dir = 'prev'

		if (this.model.prop.active == 0) {
			this.model.prop.active = this.model.prop.total - 1
		} else {
			this.model.prop.active -= 1
		}
		this.updateModel()
		this.updateView()
	}

	handlePagClick(num) {                        // обработчик события клика по кнопке пагинации (передается номер нажатой кнопки)
		// stop autoplay
		if (this.model.autoplay.isEnable) {
			this.stopAutoplay()
		}

		let n = this.model.prop.active - num            // число слайдов, которые необходимо пролистать
		let count = 0
		let durationSave = this.model.anim.duration     // сохраняем значение длительности анимации и функции времени по умолчанию
		let easeSave = this.model.anim.ease
		this.model.anim.duration = 0.1                 // временно увеличиваем скорость анимации
		this.model.anim.ease = 'linear'

		this.pagTimerId = setInterval(() => {          // пролистываем необходимое количество слайдов в зависимости от направления
			count += 1
			if (n < 0) {
				this.moveNext()
			} else {
				this.movePrev()
			}

			if (count == (Math.abs(n)) - 1) {        // последний слайд чуть замедляем
				this.model.anim.duration = 0.3
			}

			if (count == Math.abs(n)) {                     // восстанавливаем значение длительности анимации и функции времени по умолчанию
				this.model.anim.duration = durationSave
				this.model.anim.ease = easeSave
				clearInterval(this.pagTimerId)              // остановка и удаление setInterval
			}
		}, 100)
	}

	doAutoplay() {                                     // драйвер автовоспроизведения
		this.intervalTimerId = setInterval(() => {
			this.moveNext()
		}, this.model.autoplay.delay * 1000)
	}

	stopAutoplay() {                              // прерывание автовоспроизведения
		clearInterval(this.intervalTimerId)
		this.intervalTimerId = null
		// restart autoplay
		if (this.model.autoplay.isPlayAfterStop) {      // перезапуск автовоспроизведения при отсутствии событий
			clearTimeout(this.timeoutId)
			this.timeoutId = null
			this.timeoutId = setTimeout(() => {
				this.doAutoplay()
			}, this.model.autoplay.delayPlayAfterStop * 1000)
		}
	}

	doAnimView() {                                 // анимация слайдов
		this.model.cards.forEach(card => {
			card.node.style.transitionProperty = ''
			card.node.style.transitionDuration = ''
			card.node.style.transitionTimingFunction = ''

			if (card.isMove) {                                       // параметры transition получают только слайды, имеющие isMove=true
				card.node.style.transitionProperty = 'transform'
				card.node.style.transitionDuration = `${this.model.anim.duration}s`
				card.node.style.transitionTimingFunction = this.model.anim.ease
			}
			card.node.style.transform = `translateX(${card.position}px)`
		})
	}

	// ===== CLEAN ====

	cleanView() {                                        // очистка представления
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

	cleanModel() {                                      // очистка модели
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