import { Schema, model } from "mongoose"

const SkillSchema = new Schema({
    skillId: Number,
    name: String,
    targetSelf: Boolean,
    statToChange: String,
    scaling: Number,
    additionalEffect: [{
        targetSelf: Boolean,
        statToChange: String,
        scaling: Number,
    }],
});
const Skill = model("Skill", SkillSchema);
export default Skill;