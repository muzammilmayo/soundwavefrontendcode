import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import artistReducer from './features/artist/artistSlice';
import catalogReducer from './features/catalog/catalogSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    artist: artistReducer,
    catalog: catalogReducer,
  },
});

export default store;
