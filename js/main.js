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
