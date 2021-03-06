'use strict';

class FilterCards {
  constructor() {
    this.select = document.querySelector('.heroes-movie');
    this.cardsWrapper = document.querySelector('.heroes-wrapper');
    this.selectedKeys = [];

    this.getData('./dbHeroes.json', data => {
      this.renderCards(data);
      this.renderCheckbox(this.getValues(data, 'movies'))
    });

    this.listeners();
  }

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

  getValues(heroes, key) {
    const values = new Set();
    heroes.forEach(item => {
      const arrOfHeroesWithKey = this.projection(key, item);
      if (arrOfHeroesWithKey[key]) {
        arrOfHeroesWithKey[key].forEach(item => values.add(item));
      }

    });

    return values;
  }

  projection(fields, obj) {
    return Object.keys(obj).filter(field => fields.includes(field)).reduce((mewObj, key) => {
      mewObj[key] = obj[key];
      return mewObj;
    }, {});
  }


  renderCheckbox(textArr) {
    this.select.textContent = '';
    textArr.forEach(item => {
      const box = document.createElement('div');
      box.classList.add('heroes-checkbox');
      box.innerHTML = `
                <input
                  type="checkbox"
                  class="checkbox"
                  id="${item}"
                  value="${item}"
                />
                <label for="${item}">${item}</label>
                `;
      this.select.append(box);
    });
  }

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

  reDrowWithFilter(filter, key) {
    this.getData('./dbHeroes.json', data => {
      const filteredData = data.filter(obj => {

        if (obj[key]) {
          return filter.every(item => {
            return obj[key].includes(item);
          });
        }
        return false;
      });

      if (filteredData.length) {
        this.renderCards(filteredData);
      } else {
        const emptyObj = [{
          name: 'UNIVERSAL',
          movies: 'not found heroes with this movies',
          photo: 'dbImage/Universal.jpg'
        }];
        this.renderCards(emptyObj);

      }
    });
  }

  listeners() {
    this.select.addEventListener('change', event => {
      if (event.target.checked) {
        this.selectedKeys.push(event.target.value);
        this.reDrowWithFilter(this.selectedKeys, 'movies');
      } else {

        this.selectedKeys = this.selectedKeys.filter(item => item !== event.target.value);
        this.reDrowWithFilter(this.selectedKeys, 'movies');
      }

    });
  }
}

const filterCards = new FilterCards();