import axios from "axios"
import { useEffect, useState } from "react";

interface SkillSelectionMenuProps {
    hideMenu: (s : string) => void
}

interface SkillInfo {
    name: string,
    description: string
}

export default function SkillSelectionMenu({hideMenu} : SkillSelectionMenuProps) {
    const [ownedSkills, setOwnedSkills] = useState<SkillInfo[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    })
    useEffect(() => {
        axios.get('/account/currentData').then((dataRes) => {
            setSelectedSkills(dataRes.data.selectedSkills);
            const skills: SkillInfo[] = [];
            for (let i = 0; i < dataRes.data.ownedSkills.length; i++) {
                axios.get(`/skills/getSkill?name=${dataRes.data.ownedSkills[i]}`).then((skillRes) => {
                    setOwnedSkills(prevState => [...prevState, {
                        name: skillRes.data.name,
                        description: skillRes.data.description
                    }]);
                })
            }
            setOwnedSkills(skills); 
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div
            className='fixed z-10 top-0 left-0 w-full h-full overflow-auto flex-col flex items-center justify-center bg-black/[0.5]'
        >
            <div
                className='absolute flex flex-col items-center justify-center border-8 rounded-md border-emerald-400 shadow-lg shadow-emerald-300 w-1/2 h-4/5 bg-black justify-center items-center'
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
                            Select Skills
                        </p>
                        <div
                            className='flex flex-col min-h-[50%] min-w-[50%]'
                        >
                            <p
                                className='text-2xl ml-2 text-white'
                            >
                                Max 4
                            </p>
                            <div
                                className='overflow-y-auto min-h-[80%] min-w-full overflow-x-hidden'
                            >
                                {ownedSkills.map((skillInfo: SkillInfo, idx) => {
                                    return (
                                        <button
                                            key={idx}
                                            className={`rounded-lg w-full text-xl text-emerald-400 rounded-s m-2 ${selectedSkills.includes(skillInfo.name) ? `bg-blue-600 hover:bg-blue-700` : `bg-red-500 hover:bg-red-600`}`}
                                            onClick={() => {
                                                if (selectedSkills.includes(skillInfo.name)) {
                                                    if (selectedSkills.length === 1) {
                                                        alert('Must have at least 1 skill!');
                                                    } else {
                                                        setSelectedSkills(selectedSkills.filter((skillName: string) => skillName !== skillInfo.name));
                                                    }
                                                } else if (selectedSkills.length == 4) {
                                                    alert('Already selected 4 skills!');
                                                } else {
                                                    setSelectedSkills([...selectedSkills, skillInfo.name]); 
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
                                        </button>
                                    )})}
                                </div>
                            </div>
                        <div></div>
                        <button
                            className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700 mt-5'
                            onClick={() => {
                                    axios.post('/account/updateSelectedSkills', {
                                        selectedSkills
                                    });
                                    hideMenu('');
                                }
                            }
                        >
                            Close
                        </button>  
                    </>
            )}
        </div>
    </div>)
}