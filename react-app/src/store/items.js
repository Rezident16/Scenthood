/** Action Type Constants: */
export const LOAD_ITEMS = "/items/LOAD_ITEMS";
export const REMOVE_ITEMS = "/items/REMOVE_ITEMS";


/**  Action Creators: */
export const loadItems = (items) => ({
    type: LOAD_ITEMS,
    items,
  });
  
  export const removeItem = (id) => ({
    type: REMOVE_ITEMS,
    id,
  });


// Thunks
// All Items
// export const fetchItems = () => async (dispatch) => {
//     const response = await fetch ('/api/items')
//     const data = await response.json()
//     dispatch(loadItems(data))
// }

// Fetch items by page and pageNum
export const fetchItems = (pageNum, itemNum) => async (dispatch) => {
    const response = await fetch(`/api/items/page/${pageNum}/count/${itemNum}`);
    const data = await response.json()
    dispatch(loadItems(data))
}

// Remove Item
export const fetchDeleteItem = (id) => async (dispatch) => {
    const response = await fetch (`/api/items/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    if (response.ok) {
        dispatch(removeItem(id))
    } else {
        const errors = response.json()
        return errors
    }
}


const itemsReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_ITEMS:
            const itemState = {}
            action.items.Items.forEach(item => {
                itemState[item.id] = item
            });
            return itemState

        case REMOVE_ITEMS:
            const newState = {...state}
            delete newState[action.id]
            return newState

        default:
            return state
    }
}

export default itemsReducer
