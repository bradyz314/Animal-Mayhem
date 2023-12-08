import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
    state: string,
    levelNo: number,
    reward: number,
}

const initialState = {
    state: 'TITLE',
    levelNo: 1,
    reward: 0,
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
        },
        setReward: (state, action: PayloadAction<number>) => {
            console.log(action.payload);
            state.reward = action.payload;
        }
    }
});

export const { setState, setLevelNo, setReward } = gameStateSlice.actions;
export default gameStateSlice.reducer;