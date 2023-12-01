import { configureStore } from '@reduxjs/toolkit';
import entityReducers from '../features/EntitySlice';
import messageReducer from '../features/MessageSlice';
import dodgeReducer from '../features/DodgeSlice';

export const store = configureStore({
    reducer: {
        playerStats: entityReducers[0],
        enemyStats: entityReducers[1],
        message: messageReducer,
        dodge: dodgeReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;