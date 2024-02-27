export const filter = (items, filters) => {
    let filteredItems = [...items];

    if (filters.min_price || filters.max_price) {
      filteredItems = filteredItems.filter(item => item.price <= filters.max_price && item.price >= filters.min_price);
    }
    if (filters.brand) {
      filteredItems = filteredItems.filter(item => filters.brand.includes(item.brand));
    }
    if (filters.availability) {
      filteredItems = filteredItems.filter(item => item.available_qty > 0);
    }

    return filteredItems;
}
