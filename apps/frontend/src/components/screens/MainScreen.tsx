import { useEffect, useState } from "react";
import axios from "axios"
import LevelSelectionMenu from "../menus/LevelSelectionMenu";
import { useDispatch } from "react-redux";
import { setState } from "../../features/GameStateSlice";

interface LevelNum {
    levelNo: number,
}

export default function MainScreen() {
    const dispatch = useDispatch();
    const [levels, setLevels] = useState<number[]>([]);
    const [maxUnlocked, setMaxUnlocked] = useState(1);
    useEffect(() => {
        axios.get('/level/getSortedLevelNumbers').then(levelsRes => {
            setLevels(levelsRes.data.map((level: LevelNum) => level.levelNo));
        });
        axios.get('/account/currentData').then((dataRes) => {
            setMaxUnlocked(dataRes.data.maxLevelUnlocked);
        })
    }, []); 
    return (
        <div
            className='flex flex-col min-h-full relative'
        >
            <button
                className='rounded-md w-[5%] text-4xl text-white rounded-s m-10 hover:text-rose-400'
                onClick={() => dispatch(setState('TITLE'))}
            >
                X
            </button>
            <LevelSelectionMenu levels={levels} maxUnlocked={maxUnlocked}/>
            <div
                className='absolute top-[85%] left-[88%]'
            >
                <button
                    className='text-white text-3xl absolute top-1/4 left-0 hover:text-red-400'
                    onClick={() => dispatch(setState('UPGRADE'))}
                >
                    UPGRADES
                </button>
                <img
                    src='/crossed-swords.png'
                    className='mx-auto'
                />
            </div>
        </div>
    )   
}