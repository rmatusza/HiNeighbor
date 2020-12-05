import { createStore, combineReducers, compose } from 'redux';
import setUserCredsReducer from '../reducers/userCredsReducer'
import searchCategoryReducer from '../reducers/searchCategoryReducer'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const rootReducer = combineReducers({
//   session: setUserCredsReducer,
//   search_params: searchCategoryReducer
// })
const rootReducer = combineReducers({

    session: setUserCredsReducer,
    entities: searchCategoryReducer
    // entities: {
    //   search_params: searchCategoryReducer
    // }
  })

const initialState = {}

const configureStore = () => {
  return createStore(rootReducer, initialState, composeEnhancers())
}

export default configureStore;
