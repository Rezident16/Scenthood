const READ_ORDERS = '/orders/READ_ORDERS'
const readOrders = (orders) => ({
    type: READ_ORDERS,
    orders,
  });

export const fetchUserOrders = (userId) => async (dispatch) => {
    const response = await fetch (`/api/users/${userId}/orders`)
    const orders = await response.json()
    dispatch(readOrders(orders))
}


  
  const ordersReducer = (state = {}, action) => {
    switch (action.type) {
      case READ_ORDERS:
        const orderState = {}
        action.orders.forEach(order => {
            orderState[order.id] = order
        })
        return orderState
      default:
        return state;
    }
  };
  
  export default ordersReducer
