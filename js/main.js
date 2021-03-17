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
  getData(url, cb) {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        cb(response);
      } else {
        new Error(request.statusText);
      }
    });

    request.open('GET', url);
    // request.setRequestHeader('Content-Type', 'application/json');
    request.send();
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
      const card = event.target.closest(this.cardSelector);
      if (card) {
        const name = card.querySelector(this.nameCardSelector).textContent;
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

  }
}

const addCards = new AddCards();