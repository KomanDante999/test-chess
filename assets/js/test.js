class Animation {
	constructor(viewportW) {
		this.viewportW = viewportW;
		this.animationId = null; // Для хранения идентификатора анимации
		this.isAnimating = false; // Флаг для отслеживания состояния анимации
	}

	animateTest(items) {
		let curItem = 0;

		const animate = () => {
			items.forEach(item => {
				// condition start 
				if (item.num === curItem) {
					item.move = true;
				}

				// driver
				if (item.move) {
					item.draw += 2; // Увеличиваем позицию
					item.elem.style.transform = `translateX(${item.draw}px)`; // Применяем трансформацию
				}

				// condition next item
				if (Math.trunc(item.elem.getBoundingClientRect().x) === 0) {
					curItem = (curItem < items.length - 1) ? curItem + 1 : 0; // Переход к следующему элементу
				}

				// condition break
				if (item.elem.getBoundingClientRect().x > this.viewportW) {
					item.draw = 0;
					item.move = false;
					item.elem.style.transform = 'translateX(0px)';
				}
			});

			this.animationId = requestAnimationFrame(animate); // Запрашиваем следующий кадр
		};

		if (!this.isAnimating) {
			this.isAnimating = true; // Устанавливаем флаг анимации
			animate(); // Запускаем анимацию
		}
	}

	stopAnimation() {
		if (this.isAnimating) {
			cancelAnimationFrame(this.animationId); // Отменяем анимацию
			this.isAnimating = false; // Сбрасываем флаг
		}
	}
}