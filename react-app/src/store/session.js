// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const UPDATE_USER = "session/UPDATE_USER";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const getCurr = () => async (dispatch) => {
  const response = await fetch("/api/users/current");
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  }
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    console.log(response)
    return ["An error occurred. Please try again."];
  }
};

export const logout = () => async (dispatch) => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export const signUp =
  (
    username,
    email,
    password,
    firstName,
    lastName,
    address,
    city,
    state,
    profile_img,
    description
  ) =>
  async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("profile_img", profile_img);
      formData.append("description", description);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
        return null;
      } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
          return data.errors;
        }
      } else {
        console.log(response)
        return ["An error occurred. Please try again."];
      }
    } catch (error) {
      console.error("Error in signUp action:", error);
      return ["An unexpected error occurred. Please try again."];
    }
  };


  export const update =
  ( id,
    payload
  ) =>
  async (dispatch) => {
    try {
      const response = await fetch(`/api/users/${id}/edit`, {
        method: "POST",
        body: payload,
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(updateUser(data));
      } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
          return data.errors;
        }
      } else {
        console.log(response)
        return ["An error occurred. Please try again."];
      }
    } catch (error) {
      console.error("Error in signUp action:", error);
      return ["An unexpected error occurred. Please try again."];
    }
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    case UPDATE_USER:
      return { user: action.payload };
    default:
      return state;
  }
}
