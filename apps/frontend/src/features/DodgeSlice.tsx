import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Bullet } from "../types";

export interface DodgeState {
    bullets: Bullet[],
    hitCount: number,
    areaDimensions: [number, number],
    playerDimensions: [number, number],
    lastUpdate: number,
}

const initialState = {
    bullets: [],
    hitCount: 0,
    areaDimensions: [0, 0],
    playerDimensions: [0, 0],
    lastUpdate: 0,
} as DodgeState;

export const dodgeSlice = createSlice({
    name: 'dodge',
    initialState,
    reducers: {
        setAreaDimensions: (state, action: PayloadAction<[number, number]>) => {
            state.areaDimensions = action.payload;
        },
        setPlayerDimensions: (state, action: PayloadAction<[number, number]>) => {
            state.playerDimensions = action.payload;
        },
        initialize: (state) => {
            state.bullets = [];
            state.hitCount = 0;
            state.lastUpdate = 0;
        },
        updateBullets: (state, action: PayloadAction<[number, number]>) => {
            const currTime = Date.now();
            const deltaTime = state.lastUpdate !== 0 ? currTime - state.lastUpdate : 50;
            state.lastUpdate = currTime;
            const playerX = action.payload[0] + (state.playerDimensions[0] / 2);
            const playerY = action.payload[1] + (state.playerDimensions[1] / 2);
            const updatedBullets: Bullet[] = [];
            for (let i = 0; i < state.bullets.length; i++) {
                const curr = state.bullets[i];
                const bulletX = curr.pos[0] + (curr.radius / 2);
                const bulletY = curr.pos[1] + (curr.radius / 2);
                const dist = Math.sqrt(Math.pow(bulletX - playerX, 2) + Math.pow(bulletY - playerY, 2));
                if (dist < Math.max(state.playerDimensions[0], state.playerDimensions[1])) {
                    state.hitCount += 1;
                } else {
                    curr.speed += curr.acceleration * deltaTime / 1000;
                    curr.pos[0] += Math.floor((Math.cos(curr.direction) * curr.speed * deltaTime) / 1000);
                    curr.pos[1] += Math.floor((Math.sin(curr.direction) * curr.speed * deltaTime) / 1000);
                    if (!(curr.pos[0] < 0 || curr.pos[0] > state.areaDimensions[0] - curr.radius ||
                        curr.pos[1] < 0 || curr.pos[1] > state.areaDimensions[1] - curr.radius)) {
                        updatedBullets.push(curr);
                    }
                }
            }
            state.bullets = JSON.parse(JSON.stringify(updatedBullets));
        },
        addBullets: (state, action: PayloadAction<Bullet[]>) => {
            state.bullets = state.bullets.concat(JSON.parse(JSON.stringify(action.payload)));
        },
    }
});

export const { setAreaDimensions, setPlayerDimensions, initialize, updateBullets, addBullets } = dodgeSlice.actions;
export default dodgeSlice.reducer;