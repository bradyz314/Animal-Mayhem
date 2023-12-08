import axios from "axios"
import { useEffect, useState } from "react";

interface SkillStoreMenuProps {
    hideMenu: (s : string) => void
}

interface SkillInfo {
    name: string,
    description: string
    cost: number
}

export default function SkillStoreMenu({hideMenu} : SkillStoreMenuProps) {
    const [buyableSkills, setBuyableSkills] = useState<SkillInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState(1);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 750);
    })
    useEffect(() => {
        axios.get('/account/currentData').then((dataRes) => {
            const owned = dataRes.data.ownedSkills;
            setCoins(dataRes.data.coins);
            axios.get('/skills/getBuyable').then((skillsRes) => {
                for (let i = 0; i < skillsRes.data.length; i++) {
                    if (!owned.includes(skillsRes.data[i].name)) {
                        setBuyableSkills(prevState => [...prevState, {
                            name: skillsRes.data[i].name as string,
                            description: skillsRes.data[i].description as string,
                            cost: skillsRes.data[i].cost as number,
                        }]);
                    }
                }
            }
        )});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div
            className='fixed z-10 top-0 left-0 w-full h-full overflow-auto flex-col flex items-center justify-center bg-black/[0.5]'
        >
            <div
                className='absolute flex flex-col items-center justify-center border-8 rounded-md border-emerald-400 shadow-lg shadow-emerald-300 w-1/2 h-3/5 bg-black justify-center items-center'
            >
                {loading ? (
                    <p
                        className='text-2xl text-white'
                    >
                        Loading...
                    </p>
                ) : (
                    <>
                        <p
                            className='text-6xl text-emerald-400 pb-2'
                        >
                            Skill Store
                        </p>
                        <div
                            className='flex flex-col text-2xl text-white min-h-[50%] min-w-[50%]'
                        >
                            <div
                                className='overflow-y-auto min-h-full min-w-full overflow-x-hidden'
                            >
                                {buyableSkills.map((skillInfo: SkillInfo, idx) => {
                                    return (
                                        <button
                                            key={idx}
                                            className={`rounded-lg w-full text-xl text-emerald-400 rounded-s m-2 ${skillInfo.cost <= coins ? `bg-blue-600 hover:bg-blue-700` : `bg-red-500 hover:bg-red-600`}`}
                                            onClick={() => {
                                                if (skillInfo.cost > coins) {
                                                    alert('Not enough coins :(');
                                                } else {
                                                    setCoins(prevState => prevState - skillInfo.cost);
                                                    axios.post('/account/updateOwnedSkills', {
                                                        skillName: skillInfo.name
                                                    });
                                                    setBuyableSkills(prevState => prevState.filter((skill) => skill.name !== skillInfo.name));
                                                }
                                            }}
                                        >
                                            <p
                                                className='text-start ml-2 '
                                            >
                                                {skillInfo.name}
                                            </p>
                                            <p
                                                className='text-start text-md ml-2'
                                            >
                                                {skillInfo.description}
                                            </p>
                                            <p
                                                className='text-start text-md ml-2'
                                            >
                                                {`Cost: ${skillInfo.cost}`}
                                            </p>
                                        </button>
                                )})}
                            </div>
                        </div>
                    <div
                        className='grid-rows-1 grid-cols-2 grid'
                    >
                        <img 
                            className='col-start-1'
                            src='/coin.png'
                        />
                        <p
                            className='text-4xl text-amber-400 col-start-2'
                        >
                                {coins}
                        </p>
                    </div>
                    <button
                        className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                        onClick={() => {
                                axios.get('account/currentData').then((dataRes) => {
                                    axios.post('account/updateStats', {
                                        attack: dataRes.data.attack,
                                        defense: dataRes.data.defense,
                                        health: dataRes.data.maxHealth,
                                        coins
                                    });
                                })
                                hideMenu('');
                            }
                        }
                    >
                        Close
                    </button>  
                </>
                )
            }
            </div>
        </div>
    )
}