import "./Cart.css";

function CartItemTile({ item }) {
  let total = item.price * item.qty;

  return (
    <div className="item_order_container">
      <div>
        <div className="item_name_order">
          {item.name} by {item.brand}
        </div>
        <div className="image_qty">
          <img className="order_image" src={item.preview_img} />
          <div className="item_qty_order">{item.qty}</div>
        </div>
      </div>
      <div>Price: ${item.price.toFixed(2)}</div>
    </div>
  );
}

export default CartItemTile;
