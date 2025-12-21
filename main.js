const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

const onlyDigits = v => v.replace(/\D/g, '');

function isValidLuhn(number) {
  let sum = 0;
  let doubleDigit = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let d = parseInt(number[i]);
    if (doubleDigit) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

function getCardType(number) {
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^2(2|3|4|5|6|7)/.test(number)) return 'Мир';
  return null;
}

function isValidExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [m, y] = expiry.split('/').map(Number);
  if (m < 1 || m > 12) return false;

  const now = new Date();
  const year = now.getFullYear() % 100;
  const month = now.getMonth() + 1;

  return y > year || (y === year && m >= month);
}

const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => {
  let d = onlyDigits(phoneInput.value).slice(0, 15);
  let v = '+' + d;

  if (d.startsWith('7') && d.length <= 11) {
    v = '+7';
    if (d.length > 1) v += ' (' + d.slice(1, 4);
    if (d.length >= 4) v += ') ' + d.slice(4, 7);
    if (d.length >= 7) v += '-' + d.slice(7, 9);
    if (d.length >= 9) v += '-' + d.slice(9, 11);
  }

  phoneInput.value = v;
});

const cardNumberInput = document.getElementById('card-number');
cardNumberInput.addEventListener('input', () => {
  let v = onlyDigits(cardNumberInput.value).slice(0, 16);
  cardNumberInput.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
});

const expiryInput = document.getElementById('card-expiry');
expiryInput.addEventListener('input', () => {
  let v = onlyDigits(expiryInput.value).slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  expiryInput.value = v;
});

const cvvInput = document.getElementById('card-cvv');
cvvInput.addEventListener('input', () => {
  cvvInput.value = onlyDigits(cvvInput.value).slice(0, 3);
});

const ticketForm = document.getElementById('ticketForm');
const paymentModal = document.getElementById('paymentModal');

ticketForm.addEventListener('submit', e => {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
    alert('Некорректный email');
    return;
  }

  if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phoneInput.value)) {
    alert('Введите номер телефона полностью');
    return;
  }

  const prices = {standard: 1500, vip: 3500, full: 6000};
  const total = prices[ticketForm['ticket-type'].value] * parseInt(ticketForm.quantity.value);
  document.getElementById('total-amount').value = total.toLocaleString() + ' ₽';
  paymentModal.classList.add('active');
});

const paymentForm = document.getElementById('paymentForm');

paymentForm.addEventListener('submit', e => {
  e.preventDefault();


  const card = onlyDigits(cardNumberInput.value);
  const expiry = expiryInput.value;
  const cvv = cvvInput.value;

  if (!/^\d{16}$/.test(card)) {
    alert('Номер карты должен содержать 16 цифр');
    return;
  }

  if (!isValidLuhn(card)) {
    alert('Некорректный номер карты');
    return;
  }

  if (!getCardType(card)) {
    alert('Поддерживаются только Visa / Mastercard / Мир');
    return;
  }

  if (!isValidExpiry(expiry)) {
    alert('Карта просрочена или срок некорректен');
    return;
  }

  if (!/^\d{3}$/.test(cvv)) {
    alert('CVV должен содержать 3 цифры');
    return;
  }

  alert('Оплата прошла успешно!');
  closeModal();
  ticketForm.reset();
  paymentForm.reset();
});

function closeModal() {
  paymentModal.classList.remove('active');
}

paymentModal.addEventListener('click', e => {
  if (e.target === paymentModal) closeModal();
});
const scheduleTabs = document.querySelectorAll('.schedule-tabs .tab-btn');
const scheduleContents = document.querySelectorAll('.schedule-content');

scheduleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetDay = tab.getAttribute('data-day');

    // Убираем active со всех вкладок и контента
    scheduleTabs.forEach(t => t.classList.remove('active'));
    scheduleContents.forEach(c => c.classList.remove('active'));

    // Добавляем active к выбранным
    tab.classList.add('active');
    document.querySelector(`.schedule-content[data-day="${targetDay}"]`).classList.add('active');
  });
});