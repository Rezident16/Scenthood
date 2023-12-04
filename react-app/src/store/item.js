export const CREATE_ITEM = "/item/LOAD_ITEMS";
export const UPDATE_ITEM = "/item/UPDATE_ITEMS";
export const RECEIVE_ITEM = "/item/RECEIVE_ITEMS";
export const REMOVE_ITEM = "/item/REMOVE_ITEM"
export const CREATE_REVIEW = "/review/CREATE_REVIEW"
export const UPDATE_REVIEW = "/review/UPDATE_REVIEW"
export const DELETE_REVIEW = "/review/DELETE_REVIEW"
export const CREATE_FAVORITE = "/favorite/CREATE_FAVORITE"
export const UPDATE_FAVORITE = "/favorite/UPDATE_FAVORITE"
export const DELETE_FAVORITE = "/favorite/DELETE_FAVORITE"
export const CLEAR_STATE = '/item/CLEAR_STATE'

export const loadItem = (item) => ({
    type: RECEIVE_ITEM,
    item,
  });

export const clearItemState = () => ({
    type: CLEAR_STATE
})
  
export const updateItem = (item) => ({
    type: UPDATE_ITEM,
    item,
  });
  
export const createItem = (item) => ({
    type: CREATE_ITEM,
    item,
  });

export const removeItem = (id) => ({
    type: REMOVE_ITEM,
    id
})

export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
})
export const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    review
})
export const deleteReview = (id) => ({
    type: DELETE_REVIEW,
    id
})
export const createFavorite = (favorite) => ({
    type: CREATE_FAVORITE,
    favorite
})
export const updateFavorite = (favorite) => ({
    type: UPDATE_FAVORITE,
    favorite
})
export const deleteFavorite = (id) => ({
    type: DELETE_FAVORITE,
    id
})

export const fetchOneItem = (id) => async (dispatch) => {
    const response = await fetch (`/api/items/${id}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadItem(data))
        return data
    } else {
        const errors = await response.json()
        return errors
    }
}

export const fetchCreateNewItem = (payload) => async(dispatch) => {
    const response = await fetch('/api/items', {
        method: 'POST',
        body: payload
    });
    if (response.ok) {
        const data = await response.json()
        dispatch(createItem(data))
        return data
    } else {
        const errors = await response.json()
        return errors
    }
}

export const fetchUpdateItem = (id, payload) => async (dispatch) => {
    const response = await fetch (`/api/items/${id}`, {
        method: "POST",
        body: payload
    })
    if (response.ok) {
        const data = await response.json()
        await dispatch(updateItem(data))
        return data
    } else {
        const errors = await response.json()
        return errors
    }
}

export const createReviewThunk = (itemId, orderId, review) => async (dispatch) => {
    const res = await fetch (`/api/orders/${orderId}/items/${itemId}/reviews`, {
        method: "POST",
        body: review
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(createReview(data))
        return data
    } else {
        const errors = await res.json()
        return errors
    }
}

export const updateReviewThunk = (reviewId, review) => async (dispatch) => {
    const res = await fetch (`/api/reviews/${reviewId}`, {
        method: "POST",
        body: review
    })
    if (res.ok) {
        const data = res.json()
        dispatch(updateReview(data))
        return data
    } else {
        const errors = await res.json()
        return errors
    }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const res = await fetch (`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
        dispatch(deleteReview(reviewId))
        return;
    } else {
        const errors = res.json()
        return errors
    }
}

export const createFavoriteThunk = (itemId, favorite) => async (dispatch) => {
    const res = await fetch (`/api/items/${itemId}/favorites`, {
        method: "POST",
        body: favorite
    })
    if (res.ok) {
        const data = res.json()
        dispatch(createFavorite(data))
        return data
    } else {
        const errors = res.json()
        return errors
    }
}

export const updateFavoriteThunk = (favId, favorite) => async (dispatch) => {
    const res = await fetch (`/api/favorites/${favId}`, {
        method: "POST",
        body: favorite
    })
    if (res.ok) {
        const data = res.json()
        dispatch(updateFavorite(data))
        return data
    } else {
        const errors = res.json()
        return errors
    }
}

export const deleteFavoriteThunk = (favId) => async (dispatch) => {
    const res = await fetch (`/api/favorites/${favId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
        dispatch(deleteReview(favId))
        return
    } else {
        const errors = res.json()
        return errors
    }
}



const oneItemReducer = (state ={}, action) => {
    switch(action.type) {
        case RECEIVE_ITEM:
            return {...action.item}
        case REMOVE_ITEM:
            return {}
        case UPDATE_ITEM:
            return {...state, ...action.item}
        case CREATE_ITEM:
            return {...action.item}
        case CREATE_REVIEW:
            return {
                ...state,
                reviews: {...state.reviews, [action.review.id]: action.review}
            }
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: {...state.reviews, [action.review.id]: action.review}
            }
        case DELETE_REVIEW:
            const reviews = {
                ...state,
                reviews: state.reviews.filter(
                    review => review.id !== action.id
                )
            }
            return reviews
        case CLEAR_STATE:
            return {}
        case CREATE_FAVORITE:
            return {
                ...state,
                favorites: {...state.favorites, [action.favorite.id]: action.favorite}
            }
        case UPDATE_FAVORITE:
            return {
                ...state,
                favorites: {...state.favorites, [action.favorite.id]: action.favorite}
            }
        case DELETE_FAVORITE:
            return {
                ...state,
                favorites: state.favorites.filter(
                    favorite => favorite.id !== action.id
                )
            }
        default:
            return state
    }
}
export default oneItemReducer
