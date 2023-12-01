// Redux
import { useDispatch } from "react-redux";
import { setMessage } from "../../features/MessageSlice";
// Types
import { EntityData, Stat } from "../../types"

interface SkillMenuProps {
    data: EntityData,
    handleChange: (targetSelf: boolean, statToChange: Stat, delta: number) => string,
    setCanUseSkill: (b: boolean) => void,
    delay: (ms: number) => Promise<unknown>
    setPlayerTurn: (turn: boolean) => void,
    disabled: boolean,
}

export default function SkillMenu({data, handleChange,  delay, setCanUseSkill, setPlayerTurn, disabled} : SkillMenuProps) {
    const dispatch = useDispatch();
    return (
        <div
            className='row-start-3 col-start-3 grid grid-rows-2 grid-cols-2 border-solid rounded-s mx-10'
        >
            {data.skills.map((skill, index) => 
                <button
                    key={index}
                    disabled={disabled}
                    className='rounded-md w-11/12 bg-blue-600 text-2xl rounded-s m-2 hover:bg-emerald-400'
                    onClick={async () => {
                        setCanUseSkill(false);
                        dispatch(setMessage(`${data.name} used ${skill.name}!`));
                        await delay(1500);
                        const delta = skill.getValue(data.attack);
                        const additionalDelta = skill.additionalEffect != null ? skill.additionalEffect.getValue(data.attack) : 0;
                        const resString = handleChange(skill.targetSelf, skill.statToChange, delta);
                        const additionalResString = skill.additionalEffect == null ? '' : handleChange(skill.additionalEffect.targetSelf, 
                            skill.additionalEffect.statToChange, additionalDelta);
                        dispatch(setMessage(resString + additionalResString));
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