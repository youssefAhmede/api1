const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const searchInputprice = document.getElementById('searchInputnumber');
const searchInputprice2 = document.getElementById('searchInputnumber2');
const categoryFilter = document.getElementById('categoryFilter');
const sort = document.getElementById('sort');
const submit = document.getElementById('submit');
const a = './a.json';

let allProducts = []; // متغير لحفظ جميع المنتجات
const cartItems = [];
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items');

// جلب المنتجات من API
fetch(a)
  .then(response => response.json())
  .then(products => {
    allProducts = products; // حفظ المنتجات في المتغير
    displayProducts(products); // عرض المنتجات
    populateCategoryFilter(products); // تعبئة فلتر الفئات

    // فلترة المنتجات بناءً على البحث والفئة
    searchInput.addEventListener('input', () => filterProducts(products));
    searchInputprice.addEventListener('input', () => filterProducts(products));
    searchInputprice2.addEventListener('input', () => filterProducts(products));
    categoryFilter.addEventListener('change', () => filterProducts(products));
  });

// عرض المنتجات
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

// تعبئة الفلتر بالفئات المتاحة
function populateCategoryFilter(products) {
  const categories = [...new Set(products.map(product => product.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// تطبيق الفلاتر
function filterProducts(products) {
  const searchText = searchInput.value;
  const searchNumber = searchInputprice.value;
  const searchNumber2 = searchInputprice2.value;
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(product => {
    const titleMatches = product.title.toLowerCase().includes(searchText.toLowerCase());
    const priceInRange = parseFloat(product.price) > parseFloat(searchNumber) && parseFloat(product.price) < parseFloat(searchNumber2);
    const categoryMatches = selectedCategory === '' || product.category === selectedCategory;
    return titleMatches && priceInRange && categoryMatches;
  });

  const sortedProducts = sort.value == 'min'
    ? filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    : filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

  displayProducts(sortedProducts);
}

// تبديل حالة المنتج بين الإضافة والحذف من السلة
function toggleCart(productId, button) {
  const product = allProducts.find(item => item.id === productId);
  if (!product) {
    console.error('Product not found');
    return;
  }

  const productIndex = cartItems.findIndex(item => item.id === productId);

  if (productIndex === -1) {
    // إضافة المنتج إلى السلة
    cartItems.push(product);
    button.textContent = 'Remove'; // تغيير النص إلى Remove
  } else {
    // إزالة المنتج من السلة
    cartItems.splice(productIndex, 1);
    button.textContent = 'Add to Cart'; // إعادة النص إلى Add to Cart
  }

  // تحديث عدد المنتجات في السلة
  cartCount.textContent = cartItems.length;
}

// عرض السلة عند الضغط على زر market
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

// إخفاء نافذة السلة
function hideCart() {
  cartModal.classList.add('hidden');
  productsContainer.classList.remove('hidden');
}


// إظهار نافذة عرض المنتج
// إظهار نافذة عرض المنتج
