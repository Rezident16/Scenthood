const GET_USER = "user/SET_USER"

const setUser = (user) => ({
	type: GET_USER,
    user
});

const initialState = { user: null };

export const getSpecific = (id) => async (dispatch) => {
	const response = await fetch(`/api/users/${id}`);
	if (response.ok) {
	  const data = await response.json();
	  dispatch(setUser(data));
	  return null;
	}
}

export default function userReducer(state = initialState, action) {
	switch (action.type) {
		case GET_USER:
			return { user: action.user };
		default:
			return state;
	}
}
