let categoryBtn = document.querySelector('.shop-main__top-select-btn');
let categoryList = document.querySelector('.shop-main__top-select-list');
let categoryIcon = document.querySelector('.shop-main__top-select-icon');
let cardList = document.querySelector('.shop-main__list');
let shopCart = document.querySelector('.shop-cart__inner');

categoryBtn.onclick = () => {
  categoryList.classList.toggle('hidden');
  categoryIcon.style.transform = (categoryList.classList.contains('hidden')) ? 'rotate(0deg)' : 'rotate(180deg)';
};

let balance = 11200; // баланс пользователя
let balanceText = document.querySelector('.balance');

function updateBalance() {
  balanceText.innerText = balance;
}

function addToCart(bookName, bookPrice) {
  let fragment = document.createDocumentFragment();

  let element = document.createElement('div');
  element.classList.add('shop-cart__inner-item');
  let name = document.createElement('p');
  name.classList.add('shop-cart__inner-item-name');

  fragment.appendChild(element);
  shopCart.appendChild(fragment);
}

updateBalance();

let books = {
  fetchBooks: function() {
    fetch('http://45.8.249.57/bookstore-api/books?filters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      redirect: 'follow'
    })
    .then((response) => response.json())
    .then((data) => this.printBooks(data));
  },

  printBooks: function(data) {
    let fragment = document.createDocumentFragment();
    let url = 'http://45.8.249.57/';
    for(let item of data) {
      console.log(item.name, item.authorName, item.price, item.coverUrl, item.categoryId);

      let card = document.createElement('div');
      card.classList.add('shop-main__list-card');
      let avatar = document.createElement('div')
      avatar.classList.add('shop-main__list-card-avatar');
      card.appendChild(avatar);
      let image = document.createElement('img');
      image.classList.add('shop-main__list-card-img');
      image.src = url + item.coverUrl;
      image.width = 83;
      image.height = 108;
      avatar.appendChild(image);
      let hero = document.createElement('div');
      hero.classList.add('shop-main__list-card-hero');
      card.appendChild(hero);
      let name = document.createElement('p');
      name.classList.add('shop-main__list-card-text');
      name.innerText = item.name + ', ' + item.authorName;
      hero.appendChild(name);
      let price = document.createElement('p');
      price.classList.add('shop-main__list-card-text');
      price.innerHTML = '<span class="shop-main__list-card-price">' + item.price + '</span> руб.';
      hero.appendChild(price);
      fragment.appendChild(card);
      let button = document.createElement('button');
      button.classList.add('shop-main__list-card-btn');
      button.innerText = 'В корзину';
      hero.appendChild(button);
      button.addEventListener("click", {
        //addToCart(name, price);
      })
    }
    cardList.appendChild(fragment);
    return data;
  },

  fetchCategories: function() {
    fetch(
      'http://45.8.249.57/bookstore-api/books/categories'
      )
    .then((response) => response.json())
    .then((data) => console.log(data));
  }
}

books.fetchCategories();
let bookArray = books.fetchBooks();

for(let book of bookArray) {
  console.log(book);
}

