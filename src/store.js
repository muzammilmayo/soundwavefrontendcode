import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import artistReducer from './features/artist/artistSlice';
import catalogReducer from './features/catalog/catalogSlice';
import api from './api';

const persistMiddleware = store => next => action => {
  const result = next(action);

  // Actions that modify user-specific catalog state (playlists, likes, saves, follows, notifications)
  const persistActions = [
    'catalog/toggleLikeSong',
    'catalog/toggleSaveAlbum',
    'catalog/toggleFollowArtist',
    'catalog/setPlaylists',
    'catalog/downloadSong',
    'catalog/removeDownloadedSong',
    'catalog/clearNotifications',
    'catalog/markNotificationsRead',
    'catalog/addNotification'
  ];

  if (persistActions.includes(action.type)) {
    const state = store.getState();
    const userId = state.auth?.user?.id || action.payload?.userId;
    if (userId && userId !== 'guest') {
      const catalog = state.catalog;
      const stateData = {
        playlists: catalog.playlistsMap[userId] || [],
        likedSongs: catalog.likedSongsMap[userId] || [],
        savedAlbums: catalog.savedAlbumsMap[userId] || [],
        followedArtists: catalog.followedArtistsMap[userId] || [],
        downloadedSongs: catalog.downloadedSongsMap[userId] || [],
        notifications: catalog.notificationsMap[userId] || []
      };

      // Save updated state back to the database in background
      api.post('/listener/state', stateData).catch(err => {
        console.error("Failed to persist user state to backend:", err);
      });
    }
  }

  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    artist: artistReducer,
    catalog: catalogReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistMiddleware),
});

export default store;
