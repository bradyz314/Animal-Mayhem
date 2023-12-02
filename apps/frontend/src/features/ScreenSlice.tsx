import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ScreenState {
    state: string,
}

const initialState = {
    state: 'MAIN',
} as ScreenState;

export const screenSlice = createSlice({
    name: 'screen',
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<string>) => {
            state.state = action.payload;
        },
    }
});

export const { setState } = screenSlice.actions;
export default screenSlice.reducer;