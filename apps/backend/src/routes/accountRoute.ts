import { Router } from "express";
import bcrypt from 'bcrypt';
import User from "../models/account";
import isAuthenticated from "../middleware/isAuthenticated";

const accountRouter = Router();

interface LoginCredentials {
    username: string,
    password: string,
}

// Sign Up Route
accountRouter.post('/signup', async (req, res) => {
    try {
        const {username, password} = req.body as LoginCredentials;
        const user = await User.findOne({username});
        if (user != null) {
            res.status(409).send('User already exists. Please use a different username.');
        } else {
            const newUser = new User({
                username,
                password,
                playerData: {
                    maxHealth: 100,
                    attack: 10,
                    defense: 10,
                    maxLevelUnlocked: 1,
                    selectedSkills: ["Peck"],
                    ownedSkills: ["Peck"], 
                    coins: 0,
                }
            });
            newUser.save();
            res.status(200).send('User successfully signed up!');
        }
    } catch (err) {
        res.send(500).send('Internal Server Error');
    }
});

// Log In Route
accountRouter.post('/login', async (req, res) => {
    const {username, password} = req.body as LoginCredentials;
    try {
        const user = await User.findOne({username});
        if (user === null) {
           res.status(401).send('User does not exist');
        } else {
            bcrypt.compare(password, user.password as string, (err, isRight) => {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else if (isRight) {
                    if (req.session) {
                        req.session.username = username;
                        res.status(200).send('Login Successful');
                    } else {
                        res.status(500).send('No cookie session');
                    }
                } else {
                    res.status(401).send('Wrong Password');
                }
            });
        }
    } catch(err) {
        res.send(500).send('Internal Server Error');
    }
});

// Log Out Route
accountRouter.post('/logout', isAuthenticated, (req, res) => {
    try {
        if (req.session) {
            req.session.username = '';
            res.send('User successfully logged out!');
        }
    } catch(err) {
        res.send(500).send('Internal Server Error');
    }
})

// Get User Route
accountRouter.get('/user', isAuthenticated, (req, res) => {
    if (req.session) {
        res.status(200).send(req.session.username);
    } else {
        res.send(500).send('Internal Server Error');
    }
});

accountRouter.get('/currentData', isAuthenticated, async (req, res) => {
    if (req.session) {
        const user = await User.findOne({username: req.session.username as string});
        if (user === null) {
            res.status(401).send('User does not exist');
        } else {
            res.status(200).send(user.playerData);
        }
    } else {
        res.send(500).send('Internal Server Error');
    }
});

interface ResultUpdate {
    coins: number,
    maxLevelCandidate: number,
}

accountRouter.post('/result', isAuthenticated, async (req, res) => {
    const {coins, maxLevelCandidate} = req.body as ResultUpdate;
    if (req.session) {
        const user = await User.findOne({username: req.session.username as string});
        if (user === null) {
            res.status(401).send('User does not exist');
        } else if (user.playerData !== undefined) {
            user.playerData = {
                maxHealth: user.playerData.maxHealth,
                attack: user.playerData.attack,
                defense: user.playerData.defense,
                maxLevelUnlocked: Math.max(user.playerData.maxLevelUnlocked as number, maxLevelCandidate),
                selectedSkills: user.playerData.selectedSkills,
                ownedSkills: user.playerData.ownedSkills,
                coins: (user.playerData.coins as number) + coins,
            };
            await user.save();
            res.status(200).send("Successful update");
        }
    } else {
        res.send(500).send('Internal Server Error');
    }
});

interface UpdateStats {
    attack: number,
    defense: number,
    health: number,
    coins: number,
}

accountRouter.post('/updateStats', isAuthenticated, async (req, res) => {
    const {attack, defense, health, coins} = req.body as UpdateStats;
    if (req.session) {
        const user = await User.findOne({username: req.session.username as string});
        if (user === null) {
            res.status(401).send('User does not exist');
        } else if (user.playerData !== undefined) {
            user.playerData = {
                maxHealth: health,
                attack,
                defense,
                maxLevelUnlocked: user.playerData.maxLevelUnlocked,
                selectedSkills: user.playerData.selectedSkills,
                ownedSkills: user.playerData.ownedSkills,
                coins,
            };
            await user.save();
            res.status(200).send("Successful update");
        }
    } else {
        res.send(500).send('Internal Server Error');
    }
});

interface UpdateSelectedSkills {
    selectedSkills: string[],
}

accountRouter.post('/updateSelectedSkills', isAuthenticated, async (req, res) => {
    const {selectedSkills} = req.body as UpdateSelectedSkills;
    if (req.session) {
        const user = await User.findOne({username: req.session.username as string});
        if (user === null) {
            res.status(401).send('User does not exist');
        } else if (user.playerData !== undefined) {
            user.playerData = {
                maxHealth: user.playerData.maxHealth,
                attack: user.playerData.attack,
                defense: user.playerData.defense,
                maxLevelUnlocked: user.playerData.maxLevelUnlocked,
                selectedSkills,
                ownedSkills: user.playerData.ownedSkills,
                coins: user.playerData.coins,
            };
            await user.save();
            res.status(200).send("Successful update");
        }
    } else {
        res.send(500).send('Internal Server Error');
    }
});

interface UpdateOwnedSkills {
    skillName: string,
}

accountRouter.post('/updateOwnedSkills', isAuthenticated, async (req, res) => {
    const {skillName} = req.body as UpdateOwnedSkills;
    if (req.session) {
        const user = await User.findOne({username: req.session.username as string});
        if (user === null) {
            res.status(401).send('User does not exist');
        } else if (user.playerData !== undefined) {
            user.playerData = {
                maxHealth: user.playerData.maxHealth,
                attack: user.playerData.attack,
                defense: user.playerData.defense,
                maxLevelUnlocked: user.playerData.maxLevelUnlocked,
                selectedSkills: user.playerData.selectedSkills,
                ownedSkills: [...user.playerData.ownedSkills, skillName],
                coins: user.playerData.coins,
            };
            await user.save();
            res.status(200).send("Successful update");
        }
    } else {
        res.send(500).send('Internal Server Error');
    }
});


export default accountRouter;