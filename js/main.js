// Бургер-меню: показать/скрыть навигацию на мобильных экранах.
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#site-nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
}

// Сворачиваемый фильтр каталога на мобильных экранах.
const filtersToggle = document.querySelector('.catalog-filters__toggle');
const filtersForm = document.querySelector('#filters-form');

if (filtersToggle && filtersForm) {
  filtersToggle.addEventListener('click', () => {
    const isOpen = filtersForm.classList.toggle('is-open');
    filtersToggle.setAttribute('aria-expanded', isOpen);
    filtersToggle.textContent = isOpen ? 'Скрыть фильтры' : 'Показать фильтры';
  });
}

// Минимальная логика модального окна: открыть по кнопке «Заказать» и закрыть.
const orderDialog = document.querySelector('#order-dialog');

if (orderDialog) {
  const productInput = document.querySelector('#dialog-product');
  const closeButton = document.querySelector('#close-order-dialog');
  const orderButtons = document.querySelectorAll('.product-card__button');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      productInput.value = button.dataset.product;
      orderDialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

// Карусель «Как это носят»: автопрокрутка по кругу и точки для перехода.
const lookbook = document.querySelector('.lookbook');

if (lookbook) {
  const track = lookbook.querySelector('.lookbook__track');
  const slides = track.querySelectorAll('.lookbook__slide');
  const dotsBox = lookbook.querySelector('.lookbook__dots');

  const DELAY = 5000; // 5 секунд на слайд
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let total = 0;            // сколько позиций (на десктопе видно 2 слайда — позиций меньше)
  let timer = null;
  const paused = reduceMotion; // если пользователь просил меньше анимации — не крутим сами
  let hovered = false;
  let focused = false;

  // Шаг = ширина слайда + gap.
  const getStep = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const getCurrent = () => Math.round(track.scrollLeft / getStep());

  // Переход с зацикливанием: после последнего — первый, перед первым — последний.
  const goTo = (index) => {
    const target = (index + total) % total;
    track.scrollTo({ left: target * getStep() });
  };

  const updateDots = () => {
    const current = getCurrent();
    dotsBox.querySelectorAll('.slider-dot').forEach((dot, index) => {
      if (index === current) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  };

  // Точки строим из JS: их число зависит от того, сколько слайдов видно сразу.
  const buildDots = () => {
    total = Math.round((track.scrollWidth - track.clientWidth) / getStep()) + 1;
    dotsBox.innerHTML = '';

    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Слайд ${i + 1} из ${total}`);
      dot.addEventListener('click', () => goTo(i));
      dotsBox.append(dot);
    }

    updateDots();
  };

  // Автопрокрутка идёт, только если её не остановили и пользователь не взаимодействует с каруселью.
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (!paused && !hovered && !focused && !document.hidden) {
      timer = setInterval(() => goTo(getCurrent() + 1), DELAY);
    }
  };

  // Пауза при наведении мыши и при фокусе с клавиатуры.
  lookbook.addEventListener('mouseenter', () => { hovered = true; stop(); });
  lookbook.addEventListener('mouseleave', () => { hovered = false; start(); });
  lookbook.addEventListener('focusin', () => { focused = true; stop(); });
  lookbook.addEventListener('focusout', (event) => {
    if (!lookbook.contains(event.relatedTarget)) {
      focused = false;
      start();
    }
  });

  // Вкладка скрыта — не крутим зря.
  document.addEventListener('visibilitychange', start);

  track.addEventListener('scroll', updateDots);
  window.addEventListener('resize', buildDots);

  buildDots();
  start();
}

// Слайдеры фото в карточках товаров: только точки и свайп, без автопрокрутки.
document.querySelectorAll('.card-slider').forEach((slider) => {
  const track = slider.querySelector('.card-slider__track');
  const slides = track.querySelectorAll('.card-slider__slide');
  const dotsBox = slider.querySelector('.card-slider__dots');
  const title = slider.closest('.product-card').querySelector('.product-card__title').textContent;

  if (slides.length < 2) return; // одно фото — листать нечего

  // В карточке всегда видно одно фото, поэтому шаг = ширина ленты.
  const getCurrent = () => Math.round(track.scrollLeft / track.clientWidth);

  const dots = [...slides].map((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `${title}: фото ${i + 1} из ${slides.length}`);
    dot.addEventListener('click', () => {
      track.scrollTo({ left: i * track.clientWidth });
    });
    dotsBox.append(dot);
    return dot;
  });

  const updateDots = () => {
    const current = getCurrent();
    dots.forEach((dot, i) => {
      if (i === current) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  };

  track.addEventListener('scroll', updateDots);
  updateDots();
});
