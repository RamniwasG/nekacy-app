import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

export const makeStore = () => configureStore({
  reducer: {
    app: appReducer,
  },
});

export const store = makeStore();
