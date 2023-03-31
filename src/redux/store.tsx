import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { CollapsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
import { TagsReducer } from "./reducers/TagsReducer";

const persistConfig = {
    key: 'news',
    storage,
    backlist: ['LoadingReducer']
}

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer,
    TagsReducer
})



const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persiststore = persistStore(store)

export {
    store,
    persiststore
}