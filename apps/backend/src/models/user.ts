import { Schema, model } from "mongoose"
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: String,
    password: String,
    playerData: {
        maxHealth: Number,
        attack: Number,
        defense: Number,
        maxLevelUnlocked: Number,
        selectedSkills: [Number],
        ownedSkills: [Number],
    }
});

userSchema.pre('save', function generateHash(next) {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(this.password as string | Buffer, salt, (err2, hash) => {
            if (err2) next(err2);
            this.password = hash;
            next();
       });
    })
});

const User = model('User', userSchema);
export default User;