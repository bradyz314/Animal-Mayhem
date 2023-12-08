// React
import { useEffect, useState } from 'react';
// Redux
import { useDispatch } from 'react-redux';
import { setReward, setState } from '../../features/GameStateSlice';
import { addEnemySkill, addPlayerSkill, initializeEnemySkills, initializePlayerSkills, setEnemyStats, setPlayerStats, updateEnemyAttack, updateEnemyDefense, updateEnemyHealth, updatePlayerAttack, updatePlayerDefense, updatePlayerHealth } from '../../features/EntitySlice';
import { resetMessage, setMessage } from '../../features/MessageSlice';
import { initialize, addBullets } from '../../features/DodgeSlice';
// Components
import DodgeArea from '../gameplay/DodgeArea';
import EntityDisplay from '../gameplay/EntityDisplay';
import SkillMenu from '../gameplay/SkillMenu';
import Announcer from '../gameplay/Announcer';
// Types
import { Bullet, SkillEffectInfo, SkillInfo } from '../../types';
import { RootState, store } from '../../app/store';
import patterns from '../../attackPatterns';
// Axios
import axios from "axios";
import ResultMenu from '../menus/ResultMenu';

export default function GameScreen() {
    // Constants
    const dispatch = useDispatch();
    const levelNo = store.getState().gameState.levelNo;
    const [playerTurn, setPlayerTurn] = useState(true);
    const [enemyImgPath, setEnemyImgPath] = useState('');
    const [canUseSkill, setCanUseSkill] = useState(true);
    const [dodging, setDodging] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const handleChange = (targetPlayer: boolean, statToChange: string, delta: number) => {
        const state = store.getState();
        delta = Math.floor(delta);
        switch (statToChange) {
            case 'ATK':
                if (targetPlayer) {
                    const prevAtk = state.playerStats.attack;
                    if (prevAtk == 0 && delta < 0) {
                        return `Player ATK is as low as it goes!`;
                    }
                    dispatch(updatePlayerAttack(delta));
                } else {
                    const prevAtk = state.enemyStats.attack;
                    if (prevAtk == 0 && delta < 0) {
                        return `Enemy ATK is as low as it goes! `;
                    }
                    dispatch(updateEnemyAttack(delta));
                }
                break;
            case 'HP':
                if (delta < 0) {
                    delta += (targetPlayer ? store.getState().playerStats.defense : store.getState().enemyStats.defense) / 2;
                    if (delta > 0) delta = 0;
                }
                if (targetPlayer) {
                    dispatch(updatePlayerHealth(delta));
                } else {
                    dispatch(updateEnemyHealth(delta));
                }
                break;
            case "DEF":
                if (targetPlayer) {
                    const prevDef = state.playerStats.attack;
                    if (prevDef == 0 && delta < 0) {
                        return `Enemy DEF is as low as it goes! `;
                    }
                    dispatch(updatePlayerDefense(delta));
                } else {
                    const prevDef = state.enemyStats.defense;
                    if (prevDef == 0 && delta < 0) {
                        return `Enemy DEF is as low as it goes! `;
                    }
                    dispatch(updateEnemyDefense(delta));
                }
        }
        if (delta == 0) {
            return ``;
        } else {
            return `${targetPlayer ? `You` : `The enemy`} ${delta < 0 ? `lost` : `gained`} ${delta} ${statToChange}! `;
        }
    }
    const calculateChanges = (playerCasting: boolean, skill: SkillInfo, hitCount: number) => {
        const state = store.getState();
        let resultString = '';
        for (let i = 0; i < skill.effects.length; i++) {
            const { targetSelf, stat, scaling } = skill.effects[i];
            const delta = (state.playerStats.attack * scaling[0] + state.playerStats.defense * scaling[1] + state.playerStats.maxHealth * scaling[2]) * hitCount;

            resultString += handleChange(playerCasting ? targetSelf : !targetSelf, stat, delta);
        }
        dispatch(setMessage(resultString === '' ? 'Nothing happened!' : resultString));
    }
    const setSkills = (player: boolean, skills: string[]) => {
        if (player) {
            dispatch(initializePlayerSkills());
        } else {
            dispatch(initializeEnemySkills());
        }
        for (let i = 0; i < skills.length; i += 1) {
            axios.get(`/skills/getSkill?name=${skills[i]}`).then(skillRes => {
                const effectInfo: SkillEffectInfo[] = [];
                const { name, description, cost, patternIndex, effects } = skillRes.data;
                for (let j = 0; j < effects.length; j += 1) {
                    const { targetSelf, stat, scaling } = effects[j];
                    effectInfo.push({
                        targetSelf,
                        stat,
                        scaling
                    });
                }
                const info = {
                    name,
                    description,
                    cost,
                    patternIndex,
                    effects: effectInfo
                };
                if (player) {
                    dispatch(addPlayerSkill(info));
                } else {
                    dispatch(addEnemySkill(info));
                }
            });
        }
    }
    const enemyMove = () => {
        const enemyData = store.getState().enemyStats;
        const usedSkill = enemyData.skills[Math.floor(Math.random() * enemyData.skills.length)];
        dispatch(setMessage(`${enemyData.name} used ${usedSkill.name}! Prepare to dodge!`));
        delay(1500).then(() => {
            if (usedSkill.patternIndex !== undefined) {
                const pattern = patterns[usedSkill.patternIndex];
                dispatch(initialize());
                setDodging(true);
                delay(500).then(() => {
                    dispatch(addBullets(pattern.getBullets()));
                    const spawnId = setInterval(() => {
                        const bullets = pattern.getBullets() as Bullet[];
                        dispatch(addBullets(bullets));
                    }, pattern.spawnTime);
                    delay(pattern.duration).then(() => {
                        const state = store.getState();
                        clearInterval(spawnId);
                        setDodging(false);
                        dispatch(setMessage(`You were hit ${state.dodge.hitCount} times!`));
                        delay(1000).then(() => {
                            calculateChanges(false, usedSkill, state.dodge.hitCount);
                            delay(1000).then(() => {
                                setPlayerTurn(true);
                                setCanUseSkill(true);
                            });
                        });
                    });
                });
            }
        })
    }
    const initializeStats = async () => {
        axios.get("/account/user").then(username => {
            axios.get("/account/currentData").then(dataRes => {
                dispatch(setPlayerStats([username.data, [dataRes.data.maxHealth, dataRes.data.attack, dataRes.data.defense]]));
                setSkills(true, dataRes.data.selectedSkills);
            });
        });
        axios.get(`/level/getLevel?levelNo=${levelNo}`).then(levelRes => {
            const data = levelRes.data.enemyData;
            dispatch(setReward(levelRes.data.reward));
            dispatch(setEnemyStats([data.name, [data.maxHealth, data.attack, data.defense]]));
            setEnemyImgPath(data.imgPath);
            setSkills(false, data.skills);
        });
        dispatch(resetMessage());
    }
    // Use Effect to set up User/Enemy
    useEffect(() => {
        initializeStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Use Effect to handle gameplay
    useEffect(() => {
        const state: RootState = store.getState();
        if (state.playerStats.health <= 0 || state.enemyStats.health <= 0) {
            setShowResult(true);
        } else {
            if (!playerTurn) {
                enemyMove();
            } else {
                dispatch(resetMessage());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerTurn]);
    return (
        <div className='grid grid-rows-3 grid-cols-3 min-h-full justify-center items-center'>
            <button
                className='rounded-md w-[5%] justify-self-center row-start-1 col-start-1 text-4xl text-white rounded-s m-10 hover:text-red-600'
                onClick={() => {
                    dispatch(setState('MAIN MENU'))
                }}
            >
                X
            </button>
            <EntityDisplay row={'row-start-1'} col={'col-start-3'} player={false} imgPath={enemyImgPath} />
            {dodging ?
                <DodgeArea /> :
                <Announcer />
            }
            <EntityDisplay row={'row-start-3'} col={'col-start-1'} player={true} imgPath={'/player/chicken.png'} />
            <SkillMenu
                setPlayerTurn={setPlayerTurn}
                setCanUseSkill={setCanUseSkill}
                calculateChanges={calculateChanges}
                delay={delay}
                disabled={!canUseSkill}
            />
            {showResult && <ResultMenu />}
        </div>
    );
}