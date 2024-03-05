const LOAD_ALL_ITEMS = "/total/LOAD_ALL_ITEMS";



const loadCount = (qty) => ({
    type: LOAD_ALL_ITEMS,
    qty
  });


  export const fetchItems = () => async (dispatch) => {
    const response = await fetch ('/api/items/count')
    const data = await response.json()
    dispatch(loadCount(data))
}


const countReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_ALL_ITEMS:
            return action.qty
        default:
            return state
    }
}

export default countReducer;
