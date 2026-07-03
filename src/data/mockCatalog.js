const MOCK_STORES = [
  {
    store_name: 'Central Bakery',
    address: '123 Istiklal Cad., Beyoglu, Istanbul',
    phone: '+90 212 555 0101'
  },
  {
    store_name: 'Downtown Cafe',
    address: '456 Bagdat Cad., Kadikoy, Istanbul',
    phone: '+90 216 555 0202'
  },
  {
    store_name: 'Uptown Restaurant',
    address: '789 Nispetiye Cad., Etiler, Istanbul',
    phone: '+90 212 555 0303'
  }
];

const MOCK_USERS = [
  { username: 'admin1', password: 'password123', role: 'admin', storeIndex: 0 },
  { username: 'staff1', password: 'password123', role: 'cashier', storeIndex: 0 },
  { username: 'admin2', password: 'password123', role: 'admin', storeIndex: 1 },
  { username: 'staff2', password: 'password123', role: 'cashier', storeIndex: 1 },
  { username: 'admin3', password: 'password123', role: 'admin', storeIndex: 2 },
  { username: 'staff3', password: 'password123', role: 'cashier', storeIndex: 2 }
];

const MOCK_PRODUCTS = [
  {
    name: 'Artisan Baguette',
    image_url: 'images/products/artisan-baguette.jpg',
    cost_price: 1.2,
    price: 3.5,
    category: 'Bakery',
    stock: 50
  },
  {
    name: 'Sourdough Bread',
    image_url: 'images/products/sourdough-bread.jpg',
    cost_price: 1.8,
    price: 5.0,
    category: 'Bakery',
    stock: 30
  },
  {
    name: 'Croissant',
    image_url: 'images/products/croissant.jpg',
    cost_price: 1.3,
    price: 3.8,
    category: 'Bakery',
    stock: 40
  },
  {
    name: 'Espresso',
    image_url: 'images/products/espresso.jpg',
    cost_price: 0.8,
    price: 2.5,
    category: 'Coffee',
    stock: 100
  },
  {
    name: 'Cappuccino',
    image_url: 'images/products/cappuccino.jpg',
    cost_price: 1.5,
    price: 4.5,
    category: 'Coffee',
    stock: 80
  },
  {
    name: 'Latte',
    image_url: 'images/products/latte.jpg',
    cost_price: 1.7,
    price: 5.0,
    category: 'Coffee',
    stock: 60
  },
  {
    name: 'Blueberry Muffin',
    image_url: 'images/products/blueberry-muffin.jpg',
    cost_price: 1.2,
    price: 3.5,
    category: 'Pastry',
    stock: 25
  },
  {
    name: 'Cheesecake Slice',
    image_url: 'images/products/cheesecake.jpg',
    cost_price: 2.5,
    price: 6.5,
    category: 'Dessert',
    stock: 15
  },
  {
    name: 'Turkey Club Sandwich',
    image_url: 'images/products/turkey-club-sandwich.jpg',
    cost_price: 3.5,
    price: 8.5,
    category: 'Sandwich',
    stock: 20
  },
  {
    name: 'Caesar Salad',
    image_url: 'images/products/caesar-salad.jpg',
    cost_price: 2.8,
    price: 6.8,
    category: 'Salad',
    stock: 18
  }
];

function buildMockSales(products, storeId) {
  const sales = [];
  const now = Date.now();
  const salePatterns = [
    { dayOffset: 0, hour: 9, productIndex: 3, quantity: 2 },
    { dayOffset: 0, hour: 11, productIndex: 4, quantity: 3 },
    { dayOffset: 0, hour: 14, productIndex: 8, quantity: 2 },
    { dayOffset: 1, hour: 8, productIndex: 0, quantity: 4 },
    { dayOffset: 1, hour: 10, productIndex: 2, quantity: 6 },
    { dayOffset: 1, hour: 16, productIndex: 5, quantity: 2 },
    { dayOffset: 2, hour: 9, productIndex: 6, quantity: 3 },
    { dayOffset: 2, hour: 12, productIndex: 7, quantity: 2 },
    { dayOffset: 3, hour: 11, productIndex: 1, quantity: 2 },
    { dayOffset: 3, hour: 15, productIndex: 9, quantity: 1 },
    { dayOffset: 4, hour: 10, productIndex: 4, quantity: 5 },
    { dayOffset: 5, hour: 9, productIndex: 3, quantity: 4 },
    { dayOffset: 5, hour: 13, productIndex: 8, quantity: 3 },
    { dayOffset: 6, hour: 8, productIndex: 0, quantity: 3 },
    { dayOffset: 6, hour: 17, productIndex: 5, quantity: 2 },
    { dayOffset: 7, hour: 11, productIndex: 2, quantity: 8 },
    { dayOffset: 8, hour: 10, productIndex: 6, quantity: 4 },
    { dayOffset: 9, hour: 12, productIndex: 7, quantity: 3 },
    { dayOffset: 10, hour: 9, productIndex: 1, quantity: 2 },
    { dayOffset: 12, hour: 14, productIndex: 9, quantity: 2 },
    { dayOffset: 14, hour: 11, productIndex: 4, quantity: 6 },
    { dayOffset: 16, hour: 10, productIndex: 8, quantity: 4 },
    { dayOffset: 18, hour: 15, productIndex: 5, quantity: 3 },
    { dayOffset: 20, hour: 9, productIndex: 0, quantity: 5 },
    { dayOffset: 22, hour: 13, productIndex: 3, quantity: 7 },
    { dayOffset: 25, hour: 12, productIndex: 2, quantity: 10 },
    { dayOffset: 28, hour: 16, productIndex: 6, quantity: 5 }
  ];

  salePatterns.forEach(pattern => {
    const product = products[pattern.productIndex];
    if (!product) {
      return;
    }

    const saleDate = new Date(now - pattern.dayOffset * 24 * 60 * 60 * 1000);
    saleDate.setHours(pattern.hour, 15, 0, 0);

    sales.push({
      product_id: product.id,
      store_id: storeId,
      quantity: pattern.quantity,
      price: product.price,
      date: saleDate
    });
  });

  return sales;
}

function isPlaceholderImage(imageUrl) {
  if (!imageUrl) {
    return true;
  }

  return (
    imageUrl.includes('no-image') ||
    imageUrl.includes('placeholder') ||
    imageUrl.endsWith('.svg')
  );
}

module.exports = {
  MOCK_STORES,
  MOCK_USERS,
  MOCK_PRODUCTS,
  buildMockSales,
  isPlaceholderImage
};
