async function queredItems(pageNum, itemNum) {
  const request = await fetch(`/api/items/page/${pageNum}/count/${itemNum}`);
  if (request.ok) {
    const data = await request.json();
    return data;
  }

  return null;
}

export default queredItems;
