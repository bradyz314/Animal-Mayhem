import {Router} from "express";
import Level from "../models/level";

const levelRouter = Router();

interface EnemyData {
    name: string,
    imgPath: string,
    maxHealth: number,
    attack: number,
    defense: number,
    skills: string[]
}

interface LevelInfo {
    levelNo: number,
    enemyData: EnemyData,
    reward: number,
}

levelRouter.post('/addLevel', (req, res) => {
    try {
        const info = req.body as LevelInfo;
        const newLevel = new Level({
            levelNo: info.levelNo,
            enemyData: info.enemyData,
            reward: info.reward
        });
        newLevel.save();
        res.status(200).send('Level successfully added');
    } catch (err) {
        res.status(500).send('Encountered issues with saving level');
    }
});

levelRouter.get('/getLevel', async (req, res) => {
    try {
        const {levelNo} = req.query;
        const level = await Level.findOne({levelNo});
        if (level === null) {
            res.status(401).send('Level does not exist');
        } else {
            res.status(200).send(level);
        }
    }catch(err) {
        res.status(500).send('Encountered issue getting level');
    }
});

levelRouter.get('/getSortedLevelNumbers', async (req, res) => {
    try {
        const levels = await Level.find({}).select('levelNo -_id').sort('levelNo');
        if (levels === null) {
            res.status(401).send('Levels do not exist');
        } else {
            res.status(200).send(levels);
        }
    } catch(err) {
        res.status(500).send('Encountered issue getting levels');
    }
})

export default levelRouter;