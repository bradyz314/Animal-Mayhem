// React
import { useEffect, useState } from 'react';
// Redux
import { useDispatch } from 'react-redux';
import { setEnemyStats, setPlayerStats, updateEnemyAttack, updateEnemyDefense, updateEnemyHealth, updatePlayerAttack, updatePlayerDefense, updatePlayerHealth } from '../../features/EntitySlice';
import { resetMessage, setMessage } from '../../features/MessageSlice';
// Components
import DodgeArea from '../gameplay/DodgeArea';
import EntityDisplay from '../gameplay/EntityDisplay';
import SkillMenu from '../gameplay/SkillMenu';
import Announcer from '../gameplay/Announcer';
// Types
import { Bullet, EntityData, Skill, Stat } from '../../types';
import { RootState, store } from '../../app/store';
import { initialize } from '../../features/DodgeSlice';

const tempSkill: Skill = {
    name: 'SKILL',
    targetSelf: false,
    statToChange: 'HP',
    additionalEffect: null,
    getValue(userAtk) {
        return -1.5 * userAtk
    },
}

const tempUserData: EntityData = {
    name: "Chicken",
    isPlayer: true,
    imgPath: '/player/chicken.png',
    maxHealth: 100,
    attack: 10,
    defense: 10,
    skills: [tempSkill, tempSkill, tempSkill, tempSkill],
}

const generateRandomBullet = () => {
    return {
        imgPath: '/bullets/red.png',
        radius: Math.floor(Math.random() * 10) * 2 + 10,
        pos: [Math.random() * 450, Math.random() * 200],
        speed: Math.random() * 50 + 50,
        acceleration: Math.random() * 100,
        direction: Math.random() * 2 * Math.PI,
    } as Bullet
};

const tempEnemySkill: Skill = {
    name: 'Bullet Hell',
    targetSelf: false,
    statToChange: 'HP',
    additionalEffect: null,
    getValue(atk: number) {
        return -atk;
    },
    pattern: {
        duration: 3500,
        getBullets: () => [...Array(15)].map(() => generateRandomBullet()),
    }
}

const tempEnemyData: EntityData = {
    name: 'birb',
    isPlayer: false,
    imgPath: '/enemies/bird.png',
    maxHealth: 100,
    attack: 15,
    defense: 5,
    skills: [tempEnemySkill]
}

export default function GameScreen() {
    // Make call to database to get user & level information
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPlayerStats([tempUserData.maxHealth, tempUserData.attack, tempUserData.defense]));
        dispatch(setEnemyStats([tempEnemyData.maxHealth, tempEnemyData.attack, tempEnemyData.defense]));
        dispatch(resetMessage());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const [playerTurn, setPlayerTurn] = useState(true);
    const [canUseSkill, setCanUseSkill] = useState(true);
    const [dodging, setDodging] = useState(false);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const handleChange = (targetSelf: boolean, statToChange: Stat, delta: number) => {
        switch (statToChange) {
            case 'ATK':
                if (targetSelf) {
                    dispatch(updatePlayerAttack(delta));
                } else {
                    dispatch(updateEnemyAttack(delta));
                }
                break;
            case 'HP':
                if (targetSelf) {
                    dispatch(updatePlayerHealth(delta));
                } else {
                    const enemyDef = store.getState().enemyStats.defense;
                    delta -= enemyDef;
                    dispatch(updateEnemyHealth(delta));
                }
                break;
            case "DEF":
                if (targetSelf) {
                    dispatch(updatePlayerDefense(delta));
                } else {
                    dispatch(updateEnemyDefense(delta));
                }
        }
        return `${targetSelf ? `You` : `The enemy`} ${delta < 0 ? `lost` : `gained`} ${delta} ${statToChange}!`;
    }
    useEffect(() => {
        let state: RootState = store.getState();
        if (state.playerStats.health <= 0) {
            delay(2000).then(() => {
                dispatch(setMessage(`You lost!`));
            })
            // Transition to RESULT screen
        } else if (state.enemyStats.health <= 0) {
            delay(2000).then(() => {
                dispatch(setMessage('You win!'));
            });
            // Transition to RESULT screen
        } else {
            if (!playerTurn) {
                const numOfSkills = tempEnemyData.skills.length;
                const skill: Skill = tempEnemyData.skills[Math.floor(Math.random() * numOfSkills)];
                dispatch(setMessage(`${tempEnemyData.name} used ${skill.name}! Prepare to dodge!`));
                delay(1500).then(() => {
                    if (skill.pattern) {
                        dispatch(initialize(skill.pattern.getBullets()));
                        setDodging(true);
                        delay(skill.pattern.duration).then(() => {
                            state = store.getState();
                            setDodging(false);
                            dispatch(setMessage(`You were hit ${state.dodge.hitCount} times!`));
                            delay(1000).then(() => {
                                const damage = state.dodge.hitCount * skill.getValue(tempEnemyData.attack);
                                dispatch(updatePlayerHealth(damage));
                                dispatch(setMessage(`You lost ${damage} health!`));
                                delay(1000).then(() => {
                                    setPlayerTurn(true);
                                    setCanUseSkill(true);
                                });
                            });
                        });
                    }
                })
            } else {
                dispatch(resetMessage());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerTurn])
    return (
        <div className='grid grid-rows-3 grid-cols-3 min-h-full justify-center items-center'>
            <EntityDisplay row={'row-start-1'} col={'col-start-3'} data={tempEnemyData} />
            {dodging ?
                <DodgeArea /> :
                <Announcer />
            }
            <EntityDisplay row={'row-start-3'} col={'col-start-1'} data={tempUserData} />
            <SkillMenu data={tempUserData} setPlayerTurn={setPlayerTurn} setCanUseSkill={setCanUseSkill} handleChange={handleChange} delay={delay} disabled={!canUseSkill} />
        </div>
    )
}