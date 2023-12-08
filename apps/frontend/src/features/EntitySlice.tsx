import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SkillInfo } from "../types";

export interface EntityState {
    name: string,
    health: number,
    maxHealth: number,
    attack: number,
    defense: number,
    skills: SkillInfo[],
}

const initialState = {
    name: "",
    health: 1,
    maxHealth: 1,   
    attack: 0,
    defense: 0,
    skills: []
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

const setInitialStats = (state: EntityState, action: PayloadAction<[string, number[]]>) => {
    state.name = action.payload[0];
    const [maxHealth, attack, defense] = action.payload[1];
    state.maxHealth = maxHealth;
    state.health = maxHealth;
    state.attack = attack;
    state.defense = defense;
};

const emptySkillsArray = (state: EntityState) => {
    state.skills = [];
}

const addSkill = (state: EntityState, action: PayloadAction<SkillInfo>) => {
    state.skills.push(action.payload);
}

export const playerHealthSlice = createSlice({
    name: 'playerHealth',
    initialState,
    reducers: {
        updatePlayerHealth: (state, action: PayloadAction<number>) => updateHealth(state, action),
        updatePlayerAttack: (state, action: PayloadAction<number>) => updateAttack(state, action),
        updatePlayerDefense: (state, action: PayloadAction<number>) => updateDefense(state, action),
        setPlayerStats: (state, action: PayloadAction<[string, number[]]>) => setInitialStats(state, action),
        initializePlayerSkills: (state) => emptySkillsArray(state),
        addPlayerSkill: (state, action: PayloadAction<SkillInfo>) => addSkill(state, action),
    }
});

export const enemyHealthSlice = createSlice({
    name: 'enemyHealth',
    initialState,
    reducers: {
        updateEnemyHealth: (state, action: PayloadAction<number>) => updateHealth(state, action),
        updateEnemyAttack: (state, action: PayloadAction<number>) => updateAttack(state, action),
        updateEnemyDefense: (state, action: PayloadAction<number>) => updateDefense(state, action),
        setEnemyStats: (state, action: PayloadAction<[string, number[]]>) => setInitialStats(state, action),
        initializeEnemySkills: (state) => emptySkillsArray(state),
        addEnemySkill: (state, action: PayloadAction<SkillInfo>) => addSkill(state, action)
    }
})
export const { updatePlayerHealth, updatePlayerAttack, updatePlayerDefense, setPlayerStats, initializePlayerSkills, addPlayerSkill } = playerHealthSlice.actions;
export const { updateEnemyHealth, updateEnemyAttack, updateEnemyDefense, setEnemyStats, initializeEnemySkills, addEnemySkill } = enemyHealthSlice.actions;
export default [playerHealthSlice.reducer, enemyHealthSlice.reducer];