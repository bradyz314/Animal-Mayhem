import { useState } from "react";
import SkillSelectionMenu from "../menus/SkillSelectionMenu";
import SkillStoreMenu from "../menus/SkillStoreMenu";
import UpgradeCharacterMenu from "../menus/UpgradeCharacterMenu";
import { useDispatch } from "react-redux";
import { setState } from "../../features/GameStateSlice";

export default function UpgradeScreen() {
    const dispatch = useDispatch();
    const [menuToShow, setMenuToShow] = useState('');
    return (
        <div
            className='flex flex-col min-h-full'
        >
            <button
                className='rounded-md w-[5%] text-4xl text-white rounded-s m-10 hover:text-rose-400'
                onClick={() => dispatch(setState('MAIN MENU'))}
            >
                X
            </button>
            <div
                className='flex flex-col place-items-center mt-5'
            >
                <button
                    className='rounded-md w-1/2 bg-blue-600 text-3xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                    onClick={() => setMenuToShow('CHARACTER')}
                >
                    Upgrade Character
                </button>
                <button
                    className='rounded-md w-1/2 bg-blue-600 text-3xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                    onClick={() => setMenuToShow('SELECT')}
                >
                    Select Skills to Use
                </button>
                <button
                    className='rounded-md w-1/2 bg-blue-600 text-3xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                    onClick={() => setMenuToShow('STORE')}
                >
                    Skill Store
                </button>
            </div>
            {menuToShow === 'CHARACTER' && <UpgradeCharacterMenu hideMenu={setMenuToShow}/>}
            {menuToShow === 'SELECT' && <SkillSelectionMenu hideMenu={setMenuToShow}/>}
            {menuToShow === 'STORE' && <SkillStoreMenu hideMenu={setMenuToShow}/>}
        </div>
    )
}