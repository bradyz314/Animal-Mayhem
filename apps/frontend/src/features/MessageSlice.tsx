import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MessageState {
    message: string,
}

const initialState = {
    message: '',
} as MessageState;

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        resetMessage: (state) => {
            state.message = 'Choose your move!';
        }
    }
});

export const { setMessage, resetMessage } = messageSlice.actions;
export default messageSlice.reducer;