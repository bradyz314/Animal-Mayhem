import { EntityData } from "../../types"
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface InfoBarProps {
    data: EntityData,
    player: boolean,
}

export default function InfoBar({data, player} : InfoBarProps) {
    const maxHealth = useSelector((state: RootState) => player ? state.playerStats.maxHealth : state.enemyStats.maxHealth);
    const health = useSelector((state: RootState) => player ? state.playerStats.health : state.enemyStats.health);
    return (
        <div
            className='mb-3 border-solid rounded-md border-4 mx-auto border-slate-500'
        >
            <p
                className='entity-name ml-2 text-teal-400 capitalize text-3xl font-bold'
            >
                {data.name}
            </p>
            <progress 
                max={maxHealth}
                value={health}
                className='border-solid mx-2'
            />
            <p
                className='mx-2 justify-self-end'
            >
                {`HP: ${health}/${data.maxHealth}`}
            </p>
        </div>
    )
}