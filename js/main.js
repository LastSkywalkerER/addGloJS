'use strict';

const getData = (url, cb) => {
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

// getData('./dbHeroes.json', data => {
//   console.log(data);
// });

// в projection передаётся список параметров которые нужно выдрать из объекта, реализация 1

// const projection = (fields, obj) => Object.keys(obj).filter(field => fields.includes(field)).reduce((mewObj, key) => {
//   mewObj[key] = obj[key];
//   return mewObj;
// }, {});

// const brie = {
//   "name": "Captain Marvel",
//   "realName": "Carol Danvers",
//   "species": "human",
//   "citizenship": "American",
//   "gender": "female",
//   "status": "alive",
//   "actors": "Brie Larson",
//   "photo": "dbimage/CapMarvel-EndgameProfile.jpg",
//   "movies": [
//     "Captain Marvel",
//     "Avengers: Endgame"
//   ]
// };

// console.log(projection(['actors', 'gender', 'sdf'], brie));






// в projection передаётся список параметров которые нужно выдрать из объекта, реализация 2

// const projection = meta => {
//   const keys = Object.keys(meta);
//   return obj => {
//     const newObj = {};

//     keys.forEach(key => {
//       const def = meta[key];
//       const [field, fn] = def;
//       const val = obj[field];
//       newObj[key] = fn ? fn(val) : val;
//     })

//     return newObj;
//   };
// };

// getData('./dbHeroes.json', data => {
//   const newHeroes = data.map(item => projection(['name', 'movies', 'citizenship'], item));

//   console.log(newHeroes);
// });







// в projection передаётся метадата в котором перечислены параметры котоыре нужно выдрать и чт ос ними сделать, реализация 3

const projection = meta => {
  const keys = Object.keys(meta);

  return obj => keys.reduce((newObj, key) => {
    newObj[key] = meta[key].reduce((val, fn, i) => (
      i ? fn(val) : obj[fn]
    ), null);

    return newObj;
  }, {});
};

const metaData = {
  hero: ['name'],
  // nationality: ['citizenship'],
  // cinema: ['movies'],
};

const proMetaData = projection(metaData);

getData('./dbHeroes.json', data => {
  const newHero = data.map(proMetaData);
  console.log(newHero);
});

class FilterCards {
  constructor() {
    this.select = document.querySelector('#heroes-movie');
    this.cardsWrapper = document.querySelector('.heroes-wrapper');

    this.getData('./dbHeroes.json', data => {
      this.renderCards(data);
    });
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
          p.innerHTML = `<span>${key} </span> <span>${cardData[key]}</span>`;

          cardDataBlock.append(p);
        }
      }

      this.cardsWrapper.append(card);
    });
  }
}

const filterCards = new FilterCards();