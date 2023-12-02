import { Router } from "express";
import Skill from "../models/skill";

export interface SkillData {
    targetSelf: boolean,
    statToChange: string,
    scaling: number,
}

export interface SkillInfo {
    skillId: number,
    name: string,
    primary: SkillData,
    secondary: SkillData | undefined,
}

const skillRouter = Router();

interface GetById {
    skillId: number
}

// POST TO ADD SKILLS

// GET ALL

// Get Skill by ID
skillRouter.get('/getById', async (req, res) => {
    const {skillId} = req.body as GetById;
    try {
        const skill = await Skill.findOne({skillId});
        if (skill != null) {
            const secondary: SkillData | undefined = skill.additionalEffect ? {
                 targetSelf: skill.additionalEffect[0].targetSelf as boolean,
                 statToChange: skill.additionalEffect[0].statToChange as string,
                 scaling: skill.additionalEffect[0].scaling as number,
            } : undefined
            res.status(200).send({
                skillId,
                name: skill.name,
                primary: {
                    targetSelf: skill.targetSelf,
                    statToChange: skill.statToChange,
                    scaling: skill.scaling,
                },
                secondary,
            });
        } else {
            res.status(400).send("ID does not correspond to skill");
        }
    } catch(err) {
        res.status(500).send("Internal server error");
    }
});
