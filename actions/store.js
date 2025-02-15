import rootReducer from './reducers/rootReducer';

import { configureStore } from '@reduxjs/toolkit';
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const persistConfig = {
    key: 'root',
    storage,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Configure the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializableCheck to work with non-serializable values (like the persist state)
        }),
});

export const persistor = persistStore(store);


export default store;