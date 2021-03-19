'use strict';

class FilterCards {

  // получение инфы по странице с картами и предварительная отрисовка из базы
  constructor({
    checkBoxFieldSelector,
    cardsWrapperSelector,
    urlDatabase,
    selectOptionSelector,
    cardSelector,
    nameCardSelector
  }) {
    this.select = document.querySelector(checkBoxFieldSelector);
    this.cardsWrapper = document.querySelector(cardsWrapperSelector);
    this.urlDataBase = urlDatabase;
    this.selectField = document.querySelector(selectOptionSelector);
    this.cardSelector = cardSelector;
    this.nameCardSelector = nameCardSelector;

    this.init();
    this.listeners();
  }

  // очищаем ключ и получаем все карты и свойства
  init() {
    this.searchKey = 'movies';
    this.selectedKeys = [];

    this.getData(this.urlDataBase, data => {
      this.renderCards(data);
      this.renderCheckbox(this.getValues(data, this.searchKey));
      this.renderSelect(this.getOptions(data));
    });
  }

  // очищаем фильтр и получаем все карты
  update() {
    this.selectedKeys = [];

    this.getData(this.urlDataBase, data => {
      this.renderCards(data);
      this.renderCheckbox(this.getValues(data, this.searchKey));
    });
  }

  // запрос на получение карт
  async getData(url, cb) {
    if (localStorage.getItem('data')) {
      cb(JSON.parse(localStorage.getItem('data')));
    } else {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      });
      const data = await response.json();
      cb(data);
      localStorage.setItem('data', JSON.stringify(data));
    }
  }

  // полчаем все ключи карт без повторений
  getOptions(heroes) {
    const values = new Set();

    heroes.forEach(hero => Object.keys(hero).forEach(option => {
      if (option !== 'photo') {
        values.add(option);
      }
    }));

    return values;
  }

  // получение всей информации из объектов по ключу без повторений
  getValues(heroes, key) {
    const values = new Set();
    heroes.forEach(item => {
      let arrOfHeroesWithKey = this.projection(key, item)[key];
      if (typeof arrOfHeroesWithKey !== 'string') {
        if (arrOfHeroesWithKey) {
          arrOfHeroesWithKey.forEach(item => {
            values.add(item);
          });
        }
      } else {
        if (arrOfHeroesWithKey) {
          if (arrOfHeroesWithKey.split(' ').length === 1) {
            arrOfHeroesWithKey = arrOfHeroesWithKey.slice(0, 1).toUpperCase() + arrOfHeroesWithKey.slice(1).toLowerCase();
          }
          values.add(arrOfHeroesWithKey);
        }
      }
    });

    return values;
  }

  // фильтрация информации из объектов по ключу
  projection(fields, obj) {
    return Object.keys(obj).filter(field => fields.includes(field)).reduce((mewObj, key) => {
      mewObj[key] = obj[key];
      return mewObj;
    }, {});
  }

  // выводим все свойства карт в селект
  renderSelect(options) {
    this.selectField.textContent = '';
    const box = document.createElement('option');
    box.textContent = 'Категория';
    this.selectField.append(box);
    options.forEach(item => {
      const box = document.createElement('option');
      box.value = item;
      box.textContent = item;
      this.selectField.append(box);
    });
  }

  // отрисовка чекбоксов для фильтрации по имеющимуся набору информации
  renderCheckbox(checkNames) {
    this.select.textContent = '';
    checkNames.forEach(item => {
      const box = document.createElement('div');
      box.classList.add('heroes-checkbox');
      box.innerHTML = `
                <input
                  type="checkbox"
                  class="checkbox custom-checkbox"
                  id="${item}"
                  value="${item}"
                />
                <label for="${item}">${item}</label>
                `;
      this.select.append(box);
    });
  }

  // отрисовка переданных карт
  renderCards(cards) {
    this.cardsWrapper.textContent = '';

    cards.forEach(cardData => {
      const card = document.createElement('div');
      card.classList.add('heroes-card');
      card.innerHTML = `
            <img src="${cardData.photo.replace(/\/$/, '')}"
            alt=""
            class="heroes-bckg"
            />
            <button class="delete">X</button>
            <span class="heroes-name">${cardData.name}</span>
            <div class="heroes-propertie-block">
            </div>
            `;
      const cardDataBlock = card.querySelector('.heroes-propertie-block');

      for (let key in cardData) {
        if (typeof cardData[key] === 'string' && cardData[key].split(' ').length === 1) {
          cardData[key] = cardData[key].slice(0, 1).toUpperCase() + cardData[key].slice(1).toLowerCase();
        }

        if (key !== 'name' && key !== 'photo') {
          const p = document.createElement('p');
          p.classList.add('heroes-propertie');
          p.innerHTML = `<span>${key.toUpperCase()} </span> <span>${cardData[key]}</span>`;

          cardDataBlock.append(p);
        }
      }

      this.cardsWrapper.append(card);
    });
  }

  // перерисовка карт по фильтру и ключу
  reDrowWithFilter(filter, key) {
    this.getData(this.urlDataBase, data => {
      const filteredData = data.filter(obj => {
        if (obj[key]) {
          return filter.every(item => {
            let reg = new RegExp(`(,|\\b)${item}(,|\\b)`, `gi`);
            return reg.test(obj[key]);
          });
        }
        return false;
      });

      if (filteredData.length) {
        this.renderCards(filteredData);
      } else {
        const emptyObj = [{
          name: 'UNIVERSAL',
          option: 'not found heroes with this options',
          photo: 'dbImage/Universal.jpg'
        }];
        this.renderCards(emptyObj);

      }
    });
  }

  // добавление прослушки на чекбоксы и карты
  listeners() {
    this.selectField.addEventListener('change', () => {
      this.searchKey = this.selectField.value;
      this.update();
    })

    this.select.addEventListener('change', event => {
      if (event.target.checked) {
        this.selectedKeys.push(event.target.value);
        this.reDrowWithFilter(this.selectedKeys, this.searchKey);
      } else {

        this.selectedKeys = this.selectedKeys.filter(item => item !== event.target.value);
        this.reDrowWithFilter(this.selectedKeys, this.searchKey);
      }
    });

    this.cardsWrapper.addEventListener('click', event => {
      const card = event.target.closest(this.cardSelector),
        deletectn = event.target.closest('.delete'),
        name = card.querySelector(this.nameCardSelector).textContent;
      if (deletectn) {
        this.getData(this.urlDataBase, (data) => {
          data = data.filter(hero => hero.name !== name);
          addCards.sendJson('./dbHeroes.json', data);
          this.init();
        });

        return;
      }
      if (card) {

        window.location.href = `https://yandex.by/search/?lr=157&oprnd=6064670731&text=${name} marvel`;
      }
    });
  }
}

const filterCards = new FilterCards({
  checkBoxFieldSelector: '.heroes-movie',
  cardsWrapperSelector: '.heroes-wrapper',
  urlDatabase: './dbHeroes.json',
  selectOptionSelector: '#searchKey',
  cardSelector: '.heroes-card',
  nameCardSelector: '.heroes-name'
});

class AddCards {
  constructor() {
    this.addButton = document.querySelector('.add-card');
    this.modal = document.querySelector('.modal-wrapper');
    this.modalForm = this.modal.querySelector('form');
    this.submitButton = this.modal.querySelector('button');
    this.inputName = document.querySelector('#input-name');
    this.inputOption = [...document.querySelectorAll('#input-option')];
    this.inputValue = [...document.querySelectorAll('#input-value')];
    this.addFieldsButton = document.querySelector('#add-fields');
    this.addPhoto = document.querySelector('#input-photo');

    this.init();
    this.listeners();
  }

  init() {
    this.tempData = [];

    this.modalForm.setAttribute('novalidate', '');
    this.submitButton.setAttribute('disabled', '');
  }

  sendJson(url, data, cb) {

    // return new Promise((outputData, errorData) => {
    //   const request = new XMLHttpRequest();
    //   request.addEventListener('readystatechange', () => {
    //     if (request.readyState !== 4) {
    //       return;
    //     }
    //     if (request.status === 200) {
    //       outputData();
    //     } else {
    //       errorData(request.status);
    //     }
    //   });
    //   request.open('POST', url);
    //   request.setRequestHeader("Content-Type", 'application/json');
    //   request.send(`jsonTxt=${JSON.stringify(data)}`);
    // });

    localStorage.setItem('data', JSON.stringify(data));

    return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        // 'Content-Type': 'application/json'
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'multipart/form-data'
      },
      body: `jsonTxt=${JSON.stringify(data)}`
      // body data type must match "Content-Type" header
    });
  }

  sendPhoto(url, photo, cb) {
    const data = new FormData();
    data.append('photo', photo, photo.name);
    console.log(data);

    return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'multipart/form-data'
        // 'Content-Type': `${photo.type}`,
      },
      body: data
      // body data type must match "Content-Type" header
    });
  }

  listeners() {
    this.addButton.addEventListener('click', () => {
      this.modal.style.display = 'flex';
    });

    this.modal.addEventListener('click', event => {
      if (!event.target.closest(this.modalForm.tagName)) {
        this.modal.style.display = 'none';
      }
    });

    this.addFieldsButton.addEventListener('click', () => {
      const div = document.createElement('div');
      div.classList.add('input-properties');
      div.innerHTML = `
        <input
          type="text"
          placeholder="option"
          class="input-option"
          id="input-option"
          required
        />
        <input
          type="text"
          placeholder="value"
          class="input-value"
          id="input-value"
          required
        />
      `;
      this.addFieldsButton.insertAdjacentElement('beforebegin', div);

      this.inputValue = [...document.querySelectorAll('#input-value')];
      this.inputOption = [...document.querySelectorAll('#input-option')];
    });

    this.inputName.addEventListener('input', () => {
      if (this.inputName.value && this.addPhoto.value) {
        this.submitButton.removeAttribute('disabled');
      }
    });

    this.addPhoto.addEventListener('input', () => {
      if (this.inputName.value && this.addPhoto.value) {
        this.submitButton.removeAttribute('disabled');
      }

    });

    this.modalForm.addEventListener('submit', event => {
      event.preventDefault();
      this.modal.style.display = 'none';

      const newCard = {
        name: this.inputName.value,
        photo: this.addPhoto.value,
      };

      this.inputOption.forEach((item, index) => {
        if (item.value && this.inputValue[index].value) {
          if (item.value === 'movies') {
            newCard[item.value] = this.inputValue[index].value.split(/, ?/);
          } else {
            newCard[item.value] = this.inputValue[index].value;
          }
        }


      });

      [...this.modalForm.elements].forEach(item => item.value = '');
      // this.sendPhoto(`./savephoto.php`, this.addPhoto.files[0]);

      filterCards.getData(filterCards.urlDataBase, (data) => {
        data.push(newCard);
        this.sendJson('./dbHeroes.json', data);
        filterCards.init();
        // filterCards.renderCards(data);
      });

    });
  }
}

const addCards = new AddCards();