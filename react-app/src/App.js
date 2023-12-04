import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import ItemsComponent from "./components/Items/items";
import ItemContainer from "./components/Items/itemContainer";
import UserDetails from "./components/UserPage/userDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route
          exact path = "/users/:userId"
          >
            <UserDetails />
          </Route>
          <Route exact path="/items/:itemId">
            <ItemContainer />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path='/items'>
            <ItemsComponent/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
