export const READ_ORDER = "/order/READ_ORDER";

const readOrder = (order) => ({
  type: READ_ORDER,
  order,
});

export const fetchOneOrder = (userId, orderId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/orders/${orderId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(readOrder(data));
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case READ_ORDER:
      return { ...action.order };
    default:
      return state;
  }
};

export default orderReducer
