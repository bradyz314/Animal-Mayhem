import { useDispatch } from "react-redux";
import { setLevelNo, setState } from "../../features/GameStateSlice";

interface LevelSelectionMenuProps {
    levels: number[],
    maxUnlocked: number
}

export default function LevelSelectionMenu({levels, maxUnlocked} : LevelSelectionMenuProps) {
    const dispatch = useDispatch();
    return (
        <div
            className='flex flex-col place-items-center'
        >
            {levels.map((levelNo, index) =>
                <button
                    key={index}
                    className={`rounded-md w-4/12 bg-blue-600 text-2xl rounded-s m-2 ${levelNo <= maxUnlocked ? 'hover:bg-emerald-400' : 'hover:bg-red-700'}`}
                    onClick={() => {
                        if (levelNo <= maxUnlocked) {
                            dispatch(setLevelNo(levelNo));
                            dispatch(setState('GAME'));
                        } else {
                            alert('Level Locked');
                        }
                    }}
                >
                    {`Level ${levelNo}`}
                </button>
            )}
        </div>
    )
}