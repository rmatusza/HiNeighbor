import { createStore, combineReducers, compose } from 'redux';
import setUserCredsReducer from '../reducers/userCredsReducer'
import searchCategoryReducer from '../reducers/searchCategoryReducer'

// this line enables redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  session: setUserCredsReducer,
  entities: searchCategoryReducer
})

const initialState = {}

const configureStore = () => {
  return createStore(rootReducer, initialState, composeEnhancers())
}

export default configureStore;
