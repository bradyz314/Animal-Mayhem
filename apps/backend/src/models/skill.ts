import { Schema, model } from "mongoose";

const skillEffectSchema = new Schema({
    targetSelf: Boolean,
    stat: String,
    scaling: [Number],
});

const skillSchema = new Schema({
    name: String,
    description: String,
    cost: Number,
    patternIndex: Number,
    effects: [skillEffectSchema]
});

export const SkillEffect = model('SkillEffect', skillEffectSchema);
export const Skill = model('Skill', skillSchema);