import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import userReducer from './user';
import itemsReducer from './items';
import oneItemReducer from './item';
import cartReducer from './cart';
import orderReducer from './order';
import ordersReducer from './orders';
import countReducer from './itemsTotal';

const rootReducer = combineReducers({
  session,
  user: userReducer,
  items: itemsReducer,
  item: oneItemReducer,
  cart: cartReducer,
  order: orderReducer,
  orders: ordersReducer,
  count: countReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
