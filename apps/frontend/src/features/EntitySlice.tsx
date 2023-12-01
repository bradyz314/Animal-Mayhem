import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EntityState {
    health: number,
    maxHealth: number,
    attack: number,
    defense: number,
}

const initialState = {
    health: 0,
    maxHealth: 0,
    attack: 0,
    defense: 0
} as EntityState;

const updateHealth = (state: EntityState, action: PayloadAction<number>) => {
    state.health += action.payload;
    if (state.health >= state.maxHealth) state.health = state.maxHealth;
    if (state.health < 0) state.health = 0;
};

const updateAttack = (state: EntityState, action: PayloadAction<number>) => {
    state.attack += action.payload
    if (state.attack < 0) state.attack = 0;
}

const updateDefense = (state: EntityState, action: PayloadAction<number>) => {
    state.defense += action.payload
    if (state.defense < 0) state.defense = 0;
}

const setInitialStats = (state: EntityState, action: PayloadAction<number[]>) => {
    const [maxHealth, attack, defense] = action.payload;
    state.maxHealth = maxHealth;
    state.health = maxHealth;
    state.attack = attack;
    state.defense = defense;
};

export const playerHealthSlice = createSlice({
    name: 'playerHealth',
    initialState,
    reducers: {
        updatePlayerHealth: (state, action: PayloadAction<number>) => updateHealth(state, action),
        updatePlayerAttack: (state, action: PayloadAction<number>) => updateAttack(state, action),
        updatePlayerDefense: (state, action: PayloadAction<number>) => updateDefense(state, action),
        setPlayerStats: (state, action: PayloadAction<number[]>) => setInitialStats(state, action),
    }
});

export const enemyHealthSlice = createSlice({
    name: 'enemyHealth',
    initialState,
    reducers: {
        updateEnemyHealth: (state, action: PayloadAction<number>) => updateHealth(state, action),
        updateEnemyAttack: (state, action: PayloadAction<number>) => updateAttack(state, action),
        updateEnemyDefense: (state, action: PayloadAction<number>) => updateDefense(state, action),
        setEnemyStats: (state, action: PayloadAction<number[]>) => setInitialStats(state, action),
    }
})

export const { updatePlayerHealth, updatePlayerAttack, updatePlayerDefense, setPlayerStats } = playerHealthSlice.actions;
export const { updateEnemyHealth, updateEnemyAttack, updateEnemyDefense, setEnemyStats } = enemyHealthSlice.actions;
export default [playerHealthSlice.reducer, enemyHealthSlice.reducer];