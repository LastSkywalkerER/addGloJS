'use strict';

class FilterCards {
  constructor() {
    this.select = document.querySelector('#heroes-movie');
    this.cardsWrapper = document.querySelector('.heroes-wrapper');

    this.getData('./dbHeroes.json', data => {
      this.renderCards(data);
      this.getValues(data, 'movies');
    });
  }

  getValues(heroes, key) {
    const values = new Set();

    heroes.forEach(item => item[key].forEach(item => {}));
    console.log(values);
  }

  filterHeroes(heroes, key, value) {
    return heroes.filter(item => [...item[key]].includes(value));
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

  renderCards(cards) {
    this.cardsWrapper.textContent = '';

    cards.forEach(cardData => {
      const card = document.createElement('div');
      card.classList.add('heroes-card');
      card.innerHTML = `
              <img src="${cardData.photo}"
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
}

const filterCards = new FilterCards();