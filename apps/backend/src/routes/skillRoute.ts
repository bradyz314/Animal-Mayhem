import { Router } from "express";
import {SkillEffect, Skill} from "../models/skill";

const skillsRouter = Router();

interface SkillEffectInfo {
    targetSelf: boolean,
    stat: string,
    scaling: number[], // Scaling : ATK, DEF, HP
}

interface SkillInfo {
    name: string,
    description: string,
    cost?: number,
    patternIndex?: number,
    effects: SkillEffectInfo[]
}

skillsRouter.post('/addSkill', (req, res) => {
    try {
        const info = req.body as SkillInfo;
        const newSkill = new Skill({
           name: info.name,
           description: info.description,
           cost: info.cost,
           patternIndex: info.patternIndex,
           effects: [],
        });
        for (let i = 0; i < info.effects.length; i += 1) {
            const skillEffect = new SkillEffect({
                targetSelf: info.effects[i].targetSelf,
                stat: info.effects[i].stat,
                scaling: info.effects[i].scaling,
            });
            newSkill.effects.push(skillEffect);
        }
        newSkill.save();
        res.status(200).send('Skill successfully added');
    } catch (err) {
        res.status(500).send('Encountered issue saving skill');
    }
});

skillsRouter.get('/getSkill', async (req, res) => {
    try {
        const {name} = req.query;
        const skill = await Skill.findOne({name});
        if (skill === null) {
            res.status(401).send('Skill does not exist');
        } else {
            res.status(200).send(skill);
        }
    } catch(err) {
        res.status(500).send('Encountered issue getting skill');
    }
});

export default skillsRouter;