import { Schema, model } from "mongoose";

const levelSchema = new Schema({
    levelNo: Number,
    enemyData: {
        name: String,
        imgPath: String,
        maxHealth: Number,
        attack: Number,
        defense: Number,
        skills: [String]
    },
    reward: Number,
});

const Level = model('Level', levelSchema);
export default Level;