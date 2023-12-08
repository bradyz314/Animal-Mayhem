// React
import { useEffect } from 'react';
// Redux
import { RootState, store } from '../../app/store';
import { setState } from '../../features/GameStateSlice';
import { useDispatch } from 'react-redux';
// Axios
import axios from 'axios';
import { setEnemyStats, setPlayerStats } from '../../features/EntitySlice';

export default function ResultMenu() {
    const state: RootState = store.getState();  
    const playerHealth = state.playerStats.health;
    const reward = playerHealth === 0 ? Math.trunc(state.gameState.reward / 2) : state.gameState.reward;
    const dispatch = useDispatch(); 
    useEffect(() => {
        axios.post('/account/result', {
            coins: reward,
            maxLevelCandidate: state.gameState.levelNo + 1
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            className='fixed z-10 top-0 left-0 w-full h-full overflow-auto flex-col flex items-center justify-center bg-black/[0.5]'
        >
            <div
                className='absolute flex flex-col items-center justify-center border-8 rounded-md border-emerald-400 shadow-lg shadow-emerald-300 w-[20%] h-2/5 bg-black justify-center items-center'
            >
                <h2
                    className='text-6xl text-emerald-400 pb-2'
                >
                    {playerHealth === 0 ? `Defeat` : `Victory`}
                </h2>
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
                        {reward}
                    </p>
                </div>
                <button
                    className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                    onClick={() => {
                        dispatch(setPlayerStats(['', [1, 0, 0]]));
                        dispatch(setEnemyStats(['', [1, 0, 0]]));
                        dispatch(setState('MAIN MENU'));
                    }}
                >
                    Return
                </button>
            </div>
        </div>
    )  
}