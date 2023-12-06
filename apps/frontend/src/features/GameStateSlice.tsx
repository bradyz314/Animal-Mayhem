import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
    state: string,
    levelNo: number,
}

const initialState = {
    state: 'MAIN',
    levelNo: 1,
} as GameState;

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<string>) => {
            state.state = action.payload;
        },
        setLevelNo: (state, action: PayloadAction<number>) => {
            state.levelNo = action.payload;
        }
    }
});

export const { setState, setLevelNo } = gameStateSlice.actions;
export default gameStateSlice.reducer;