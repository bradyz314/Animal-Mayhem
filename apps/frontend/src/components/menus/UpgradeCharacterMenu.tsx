import axios from "axios";
import { useEffect, useState } from "react";

interface UpgradeCharacterMenuProps {
    hideMenu: (s : string) => void
}

export default function UpgradeCharacterMenu({hideMenu} : UpgradeCharacterMenuProps) {
    const [attack, setAttack] = useState(1);
    const [defense, setDefense] = useState(1);
    const [health, setHealth] = useState(1);
    const [coins, setCoins] = useState(1);
    useEffect(() => {
        axios.get('/account/currentData').then((dataRes) => {
            setAttack(dataRes.data.attack as number);
            setDefense(dataRes.data.defense as number);
            setHealth(dataRes.data.maxHealth as number);
            setCoins(dataRes.data.coins as number);
        });
    }, []);
    return (
        <div
            className='fixed z-10 top-0 left-0 w-full h-full overflow-auto flex-col flex items-center justify-center bg-black/[0.5]'
        >
            <div
                className='absolute flex flex-col items-center justify-center border-8 rounded-md border-emerald-400 shadow-lg shadow-emerald-300 w-1/2 h-4/5 bg-black justify-center items-center'
            >
                <p
                    className='text-6xl text-white pb-5'
                >
                    Upgrades
                </p>
                <div
                    className='grid grid-cols-2 justify-center items-center'
                >
                    <div
                        className='col-start-1 self-center flex flex-col mx-5 mb-3'
                    >
                        <img 
                            src='/player/chicken.png'
                        />
                        <p
                            className='text-green-300 self-center text-xl pb-1'
                        >
                            {`Health: ${health}`}
                        </p>
                        <p
                            className='text-red-300 self-center text-xl pb-1'
                        >
                            {`Attack: ${attack}`}
                        </p>
                        <p
                            className='text-blue-300 self-center text-xl pb-1'
                        >
                            {`Defense: ${defense}`}
                        </p>
                    </div>
                    <div
                        className='col-start-2 self-center flex flex-col mx-5'
                    >
                        <p
                            className='text-2xl self-center text-yellow-300'
                        >
                            Cost: 5
                        </p>
                        <button
                            className='rounded-md w-full bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                            onClick={() => {
                                if (coins >= 5) {
                                    setCoins(prevState => prevState - 5);
                                    setHealth(prevState => prevState + 5);
                                } else {
                                    alert('Not enough coins :(');
                                }
                            }}
                        >
                            +5 HP
                        </button>
                        <button
                            className='rounded-md w-full bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                            onClick={() => {
                                if (coins >= 5) {
                                    setCoins(prevState => prevState - 5);
                                    setAttack(prevState => prevState + 1);
                                } else {
                                    alert('Not enough coins :(');
                                }
                            }}
                        >
                            +1 ATK
                        </button>
                        <button
                            className='rounded-md w-full bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                            onClick={() => {
                                if (coins >= 5) {
                                    setCoins(prevState => prevState - 5);
                                    setDefense(prevState => prevState + 1);
                                } else {
                                    alert('Not enough coins :(');
                                }
                            }}
                        >
                            +1 DEF
                        </button>
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
                    onClick={async () => {
                            await axios.post('account/updateStats', {
                                attack,
                                defense,
                                health,
                                coins
                            });
                            hideMenu('');
                        }
                    }
                >
                    Close
                </button>
            </div>
        </div>
    )
}