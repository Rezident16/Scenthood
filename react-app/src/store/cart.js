const LOAD_CART_COOKIE = "cart/LOAD_CART_COOKIE";
const ADD_TO_CART = "cart/ADD_TO_CART";
const REMOVE_FROM_CART = "cart/REMOVE_FROM_CART";
const UPDATE_CART_ITEM_QTY = "cart/UPDATE_CART_ITEM_QTY";
const CHECKOUT_CART = "cart/CHECKOUT_CART";

// Action Creators
export const loadCart = () => ({
    type: LOAD_CART_COOKIE,
  });
  
export const addToCart = (item, qty = 1) => (
  {
    type: ADD_TO_CART,
    item,
    qty,
  });
  
export const removeFromCart = (item) => ({
    type: REMOVE_FROM_CART,
    item,
  });
  
export const updateCartQty = (item, qty) => ({
    type: UPDATE_CART_ITEM_QTY,
    item,
    qty,
  });
  
export const clearCart = () => ({
    //Empty Cart
    type: CHECKOUT_CART,
  });

export const submitOrder = (body) => async (dispatch) => {
    const response = await fetch(`/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(clearCart());
      return data;
    } else {
      const errors = await response.json();
      return errors;
    }
  };

export const fetchLoadCart = () => async (dispatch) => {
    let cart = localStorage.getItem("scenthoodcart");
    const  cartItems = {};
    if (cart) {
      const objectItems = Object.values(JSON.parse(cart));
      for (const key in objectItems) {
        const item = objectItems[key];
        const res = await fetch(`/api/items/${item.id}`);
        if (res.ok) {
          const data = await res.json()
          cartItems[item.id] = {...item, ...data};
        }
      }
    }
    localStorage.setItem("scenthoodcart", JSON.stringify(cartItems));
    dispatch(loadCart());
  };

  const cartReducer = (state = {}, action) => {
    console.log("Action:", action);
    console.log("State:", state);
    switch (action.type) {
      case LOAD_CART_COOKIE:
        let cart = localStorage.getItem("scenthoodcart");
        return cart ? JSON.parse(cart) : {};
      case ADD_TO_CART:
        localStorage.setItem(
          "scenthoodcart",
          JSON.stringify({
            ...state,
            [action.item.id]: { ...action.item, qty: parseInt(action.qty) },
          })
        );
        console.log(action)
        return {
          ...state,
          [action.item.id]: { ...action.item, qty: parseInt(action.qty) },
        };
      case REMOVE_FROM_CART:
        const newState = { ...state };
        delete newState[action.item.id];
        localStorage.setItem("scenthoodcart", JSON.stringify(newState));
        return newState;
      case UPDATE_CART_ITEM_QTY:
        localStorage.setItem(
          "scenthoodcart",
          JSON.stringify({
            ...state,
            [action.item.id]: { ...action.item, qty: parseInt(action.qty) },
          })
        );
        return {
          ...state,
          [action.item.id]: { ...action.item, qty: parseInt(action.qty) },
        };
      case CHECKOUT_CART:
        localStorage.removeItem("scenthoodcart");
        return {};
      default:
        return state;
    }
  };
  export default cartReducer;
