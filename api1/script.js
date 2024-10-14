const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const searchInputprice = document.getElementById('searchInputnumber');
const searchInputprice2 = document.getElementById('searchInputnumber2');
const categoryFilter = document.getElementById('categoryFilter');
const sort = document.getElementById('sort');
const submit = document.getElementById('submit');
const a = './a.json';

let allProducts = [];




fetch(a)
  .then(response => response.json())
  .then(products => {
    allProducts = products; 
    displayProducts(products); 
    CategoryFilter(products); 

    searchInput.addEventListener('input', () => filterProducts(products));
    searchInputprice.addEventListener('input', () => filterProducts(products));
    searchInputprice2.addEventListener('input', () => filterProducts(products));
    categoryFilter.addEventListener('change', () => filterProducts(products));
  });


function displayProducts(products) {
  productsContainer.innerHTML = '';
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <img src="${product.image}">
      <h3>${product.title}</h3>
      <p class="ss">${product.category}</p>
      <p>$${product.price}</p>
      <button class="ViewProduct" onclick="ViewProduct(${product.id})">View Product</button>
      <button class="addToCart" onclick="toggleCart(${product.id}, this)">Add to Cart</button>
    `;
    productsContainer.appendChild(productElement);
  });
}

function CategoryFilter(products) {
  const categories = [];
  products.forEach(product => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}


function filterProducts(products) {
  const searchText = searchInput.value.toLowerCase();
  const minPrice = parseFloat(searchInputprice.value);
  const maxPrice = parseFloat(searchInputprice2.value);
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(product => {
    const titleMatches = product.title.toLowerCase().includes(searchText);
    const priceMatches = product.price > minPrice && product.price < maxPrice;
    const categoryMatches = !selectedCategory || product.category === selectedCategory;
    return titleMatches && priceMatches && categoryMatches;
  });

  let sortedProducts;
  if (sort.value === 'min') {
    sortedProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else {
    sortedProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayProducts(sortedProducts);
}

const cartCount = document.getElementById('cart-count'); 
const cartItems = [];

function toggleCart(productId, button) {
  // البحث عن المنتج 
  const product = allProducts.find(item => item.id === productId);
  // تأكد المنتج ف  السلة
  const isInCart = cartItems.some(item => item.id === productId);

  if (!isInCart) {
    // إضافة المنتج إذا لم يكن موجودًا في السلة
    cartItems.push(product);
    button.textContent = 'Remove';
  } else {
    // إزالة المنتج إذا كان موجودًا في السلة
    cartItems = cartItems.filter(item => item.id !== productId);
    button.textContent = 'Add to Cart';
  }

  // تحديث عدد المنتجات في السلة
  cartCount.textContent = cartItems.length;
}



const cartItemsList = document.getElementById('cart-items');
function showCart() {
  cartItemsList.innerHTML = '';
  if (cartItems.length === 0) {
    cartItemsList.innerHTML = '<li>No items in the cart</li>';
  } else {
    cartItems.forEach(item => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = `
        <img src="${item.image}">
        <h3>${item.title}</h3>
        <p class="ss">${item.category}</p>
        <p>$${item.price}</p>
        <button class="addToCart" onclick="toggleCart(${item}, this)">Remove</button>
      `;
      cartItemsList.appendChild(productElement);
    });
  }
  cartModal.classList.remove('hidden');
  productsContainer.classList.add('hidden');
}

const cartModal = document.getElementById('cart-modal');

function hideCart() {
  cartModal.classList.add('hidden');
  productsContainer.classList.remove('hidden');
}

