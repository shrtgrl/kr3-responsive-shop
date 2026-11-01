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
