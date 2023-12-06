// Redux
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../features/MessageSlice";
import { RootState } from "../../app/store";
import { SkillInfo } from "../../types";

interface SkillMenuProps {
    calculateChanges: (player: boolean, skill: SkillInfo, hitCount: number) => void,
    setCanUseSkill: (b: boolean) => void,
    delay: (ms: number) => Promise<unknown>
    setPlayerTurn: (turn: boolean) => void,
    disabled: boolean,
}

export default function SkillMenu({ calculateChanges, delay, setCanUseSkill, setPlayerTurn, disabled }: SkillMenuProps) {
    const dispatch = useDispatch();
    const skills = useSelector((state: RootState) => state.playerStats.skills);
    return (
        <div
            className='row-start-3 col-start-3 grid grid-rows-2 grid-cols-2 border-solid rounded-s mx-10'
        >
            {skills.map((skill, index) =>
                <button
                    key={index}
                    disabled={disabled}
                    className='rounded-md w-11/12 bg-blue-600 text-2xl rounded-s m-2 hover:bg-emerald-400'
                    onClick={async () => {
                        setCanUseSkill(false);
                        dispatch(setMessage(`You used ${skill.name}!`));
                        await delay(1500);
                        calculateChanges(true, skill, 1);
                        await delay(1500);
                        setPlayerTurn(false);
                    }}
                >
                    {skill.name}
                </button>
            )}
        </div>
    )
}