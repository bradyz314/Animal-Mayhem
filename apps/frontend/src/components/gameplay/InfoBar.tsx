import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface InfoBarProps {
    player: boolean,
}

export default function InfoBar({ player }: InfoBarProps) {
    const name = useSelector((state: RootState) => player ? state.playerStats.name : state.enemyStats.name);
    const maxHealth = useSelector((state: RootState) => player ? state.playerStats.maxHealth : state.enemyStats.maxHealth);
    const health = useSelector((state: RootState) => player ? state.playerStats.health : state.enemyStats.health);
    return (
        <div
            className='mb-3 border-solid rounded-md border-4 mx-auto border-slate-500'
        >
            <p
                className='ml-2 text-blue-300 capitalize text-3xl font-bold'
            >
                {name}
            </p>
            <progress
                max={maxHealth}
                value={health}
                className='border-solid mx-2'
            />
            <p
                className='mx-2 text-blue-300 justify-self-end'
            >
                {`HP: ${health}/${maxHealth}`}
            </p>
        </div>
    )
}