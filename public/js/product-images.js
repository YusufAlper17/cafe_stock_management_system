function getCategoryImage(category, isDark) {
  const categoryMap = {
    Bakery: isDark ? 'images/bakery-placeholder-dark.svg' : 'images/bakery-placeholder.svg',
    Coffee: isDark ? 'images/coffee-placeholder-dark.svg' : 'images/coffee-placeholder.svg',
    Dessert: isDark ? 'images/dessert-placeholder-dark.svg' : 'images/dessert-placeholder.svg',
    Pastry: isDark ? 'images/dessert-placeholder-dark.svg' : 'images/dessert-placeholder.svg',
    Sandwich: isDark ? 'images/sandwich-placeholder-dark.svg' : 'images/sandwich-placeholder.svg',
    Salad: isDark ? 'images/sandwich-placeholder-dark.svg' : 'images/sandwich-placeholder.svg',
    'Hot Beverage': isDark ? 'images/coffee-placeholder-dark.svg' : 'images/coffee-placeholder.svg',
    'Cold Beverage': isDark ? 'images/coffee-placeholder-dark.svg' : 'images/coffee-placeholder.svg',
    Snack: isDark ? 'images/dessert-placeholder-dark.svg' : 'images/dessert-placeholder.svg'
  };

  return (
    categoryMap[category] ||
    (isDark ? 'images/product-placeholder-dark.svg' : 'images/product-placeholder.svg')
  );
}

function getProductImageUrl(product, isDark) {
  const fallback = getCategoryImage(product?.category, isDark);
  const imageUrl = product?.image_url;

  if (!imageUrl || imageUrl.includes('no-image')) {
    return fallback;
  }

  return imageUrl;
}
