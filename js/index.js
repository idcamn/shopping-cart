let categoryBtn = document.querySelector('.shop-main__top-select-btn');
let categoryList = document.querySelector('.shop-main__top-select-list');
let categoryIcon = document.querySelector('.shop-main__top-select-icon');
let cardList = document.querySelector('.shop-main__list');
let shopCart = document.querySelector('.shop-cart__inner');
let noCartItemsText = document.querySelector('.shop-cart__empty-text');

let books = [];
let totalCount = 0;
let totalPrice = 0;
let sortPrice = "ASC";
let category = 0;

let clickSound = new Audio('../sound/click.wav');
clickSound.volume = 0.4;

categoryBtn.onclick = () => {
  categoryList.classList.toggle('hidden');
  categoryIcon.style.transform = (categoryList.classList.contains('hidden')) ? 'rotate(0deg)' : 'rotate(180deg)';
};

let balance = 11200; // баланс пользователя
let balanceText = document.querySelector('.balance');

function updateBalance() {
  balanceText.innerText = balance;
}
updateBalance();

function addToCart(book) {
  totalCount++;
  noCartItemsText.classList.add('hidden');
  document.querySelector('.shop-cart__bottom').classList.remove('hidden');
  totalPrice += book.price;
  document.querySelector('.shop-cart__bottom-price').innerText = totalPrice;

  if(book.count == null) {
    book.count = 1;
    let fragment = document.createDocumentFragment();
    let item = document.createElement('div');
    item.classList.add('shop-cart__inner-item');
    let count = document.createElement('p');
    count.classList.add('shop-cart__inner-item-count');
    let name = document.createElement('p');
    name.classList.add('shop-cart__inner-item-name');
    name.innerText = book.name;
    item.appendChild(name);
    count.innerText = book.count + ' шт.';
    item.appendChild(count);
    let price = document.createElement('p');
    price.classList.add('shop-cart__inner-item-price');
    price.innerText = book.price + ' руб.';
    item.appendChild(price);
    let close = document.createElement('button');
    close.classList.add('shop-cart__inner-item-btn');
    item.appendChild(close);
    close.addEventListener("click", () => {
      book.count--;
      totalCount--;
      if(book.count === 0) {
        removeFromCart(book);
      } else {
        console.log(book.count, totalCount);
      }
    });
    fragment.appendChild(item);
    shopCart.appendChild(fragment);
  } else { 
    // ------------- Не разобрался, как у созданного элемента изменить текст -------------
    book.count++;
  }
  console.log(book.count);
  clickSound.play();
}

function removeFromCart(book) {
  console.log('remove');

  // ------------- Пытался сделать удаление предмета из корзины, но не разобрался, как обратиться к нужному элементу -------------

  // let itemsNode = document.querySelectorAll('.shop-cart__inner-item');
  // itemsNode.forEach(
  //   function(currentValue, currentIndex) {
  //     if(book.id === currentIndex) {
  //       currentValue.remove();
  //       books.splice(book.id, book.id+1);
  //     }
  //   }
  // );
}

function buyBooks() {
  let notify = document.querySelector('.shop-cart__bottom-notify');
  if(balance >= totalPrice) {
    balance -= totalPrice;
    notify.innerText = 'Покупка совершена!';
    notify.classList.add('shop-cart__bottom-notify--apply');
    // -------- Необходимо очистить корзину -----------
    updateBalance();
  } else {
    notify.innerText = 'Не удалось совершить покупку!';
    notify.classList.add('shop-cart__bottom-notify--deny');
  }
  notify.classList.remove('hidden');
  
}

document.querySelector('.shop-cart__bottom-btn').addEventListener('click', () => {
  buyBooks();
});

let bookStore = {
  fetchBooksFilter: function(search = "", sortPrice = "ASC", categoryId = 0) {
    fetch('http://45.8.249.57/bookstore-api/books?filters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "filters": {
          "search": search,
          "sortPrice": sortPrice,
          "categoryId": categoryId
        }
      }),
      redirect: 'follow'
    })
    .then((response) => response.json())
    .then((data) => this.printBooks(data, ''));
  },
  
  printBooks: function(data, url = 'http://45.8.249.57/') {
    console.log(data);
    while(cardList.firstChild) {
      cardList.firstChild.remove();
    }
    books = [];
    let fragment = document.createDocumentFragment();
    for(let [index, item] of data.entries()) {
      books.push(item);
      books[index].id = index;

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
      button.addEventListener("click", () => {
        addToCart(books[index]);
      });
    }
    cardList.appendChild(fragment);
  },

  fetchCategories: function() {
    fetch(
      'http://45.8.249.57/bookstore-api/books/categories'
      )
    .then((response) => response.json())
    .then((data) => this.addCategories(data));
  },

  addCategories: function(data) {
    let categoryList = document.querySelector('.shop-main__top-select-list');
    let fragment = document.createDocumentFragment();
    for(let item of data) {
      let input = document.createElement('input');
      input.type = 'radio';
      input.id = 'category-' + item.id;
      input.value = item.name;
      input.addEventListener('change', () => {
        category = item.id;
        categoryList.classList.add('hidden');
        categoryIcon.style.transform = 'rotate(0deg)';
        bookStore.fetchBooksFilter('', sortPrice, category);
      });
      fragment.appendChild(input);
      let label = document.createElement('label');
      label.htmlFor = input.id;
      label.innerText = item.name;
      fragment.appendChild(label);
    }
    categoryList.appendChild(fragment);
  }
}

bookStore.fetchCategories();
bookStore.fetchBooksFilter();

document.querySelector('.shop-main__top-sort-btn').addEventListener('click', () => {
  if(sortPrice === 'ASC') {
    sortPrice = 'DESC';
  } else {
    sortPrice = 'ASC';
  }
  bookStore.fetchBooksFilter(document.querySelector('.shop-main__search-bar').value, sortPrice, category);
});

document.querySelector('.shop-main__search-bar').addEventListener('input', (enter) => {
  bookStore.fetchBooksFilter(enter.target.value, sortPrice, category);
});