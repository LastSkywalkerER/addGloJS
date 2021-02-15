'use strict';

let registerButton = document.querySelector('.register-button'),
  loginButton = document.querySelector('.login-button'),
  userList = document.querySelector('.user-list');

let userData = JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : [];

const month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];


function addZero(number) {
  number = String(number);
  if (number.length === 1) {
    return '0' + number;
  }
  return number;
}

function render() {
  userList.textContent = '';

  for (let key in userData) {
    let li = document.createElement('li');
    li.innerHTML = '<div class="user-list__item">' +
      '<span' +
      '>Имя: ' + userData[key].name + ', фамилия: ' + userData[key].lastName + ', зарегистрирован: ' + userData[key].registerDate + '</span' + '>' +
      '<button class="button delete-button">X</button>' +
      '</div>';
    userList.append(li);

    li.querySelector('.delete-button').addEventListener('click', () => {
      userData.splice(key, 1);
      render();
    });

  }

  localStorage.setItem('userData', JSON.stringify(userData));
}

render();

registerButton.addEventListener('click', () => {
  let newUser = {
    name: '',
    lastName: '',
    login: '',
    password: '',
    registerDate: ''
  };

  let userName = '';
  do {
    userName = prompt('Введите ваше имя и фамилию через пробел');
  }
  while (userName.split(' ').length !== 2);

  newUser.name = userName.split(' ')[0];
  newUser.lastName = userName.split(' ')[1];
  newUser.login = prompt('Введите ваш логин');
  newUser.password = prompt('Введите ваш пароль');
  let date = new Date();
  newUser.registerDate = date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear() + ' г., ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getMinutes());

  if (newUser.name !== null && newUser.lastName !== null && newUser.login !== null && newUser.password !== null && newUser.registerDate !== null) {
    userData.push(newUser);
  }

  render();
});

loginButton.addEventListener('click', () => {
  let login = prompt('Введите логин');
  let password = prompt('Введите пароль');
  let userId = -1;
  for (let key in userData) {
    if (userData[key].login === login && userData[key].password === password) {
      userId = key;
    }
  }
  if (userId >= 0) {
    document.querySelector('.header>h1').textContent = 'Привет ' + userData[userId].name;
  } else {
    alert('Пользователя с таким логином или паролем не существует');
  }
});