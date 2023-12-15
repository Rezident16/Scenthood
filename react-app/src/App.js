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
import { fetchLoadCart } from "./store/cart";
import Checkout from "./components/Cart/Checkout";
import IntroPage from "./components/Splash/SplashPage";
import Footer from "./components/Splash/footer";
import { fetchItems } from "./store/items";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    const storage = localStorage.getItem("scenthoodcart");
    if (storage) {
      dispatch(fetchLoadCart(JSON.parse(storage)));
    }
  }, [dispatch]);
  
  useEffect(() => {
    (async () => {
      await dispatch(fetchItems());
    })();
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route exact path="/">
            <IntroPage />
          </Route>
          <Route exact path="/checkout">
            <Checkout />
          </Route>
          <Route exact path="/users/:userId">
            <UserDetails />
          </Route>
          <Route exact path="/items/:itemId">
            <ItemContainer />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/items">
            <ItemsComponent />
          </Route>
          <Route path="/:notHome">
            <Footer />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
