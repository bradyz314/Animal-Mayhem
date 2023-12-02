import { useState } from "react";
import axios from "axios";

interface AccountMenuProps {
    login: boolean,
    setShow: (show: boolean) => void,
    setUser: (user: string) => void,
}

export default function AccountMenu({ login, setShow, setUser }: AccountMenuProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div
            className='fixed z-10 top-0 left-0 w-full h-full overflow-auto flex-col flex items-center justify-center bg-black/[0.5]'
        >
            <div
                className='absolute flex flex-col items-center justify-center border-8 rounded-md border-emerald-400 shadow-lg shadow-emerald-300 w-[30%] h-3/5 bg-black'
            >
                <h2
                    className="text-6xl text-emerald-400 pb-2"
                >
                    Username
                </h2>
                <input
                    type='text'
                    value={username}
                    spellCheck={false}
                    className='text-xl mb-3 resize-none text-center block p-1 w-5/6 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-emerald-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <h2
                    className="text-6xl text-emerald-400 pb-2"
                >
                    Password
                </h2>
                <input
                    type='text'
                    value={password}
                    spellCheck={false}
                    className='text-xl mb-3 resize-none text-center block p-1 w-5/6 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-emerald-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                    onClick={() => {
                        axios.post(`/account/${login ? `login` : `signup`}`, { username, password })
                        .then(() => {
                            if (login) setUser(username);
                            setShow(false);
                        }).catch((err) => {
                            alert(`${err.response.data}!`);
                        })
                    }}
                >
                    {login ? 'Login' : 'Sign Up'} 
                </button>
                <button
                    onClick={() => setShow(false)}
                    className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                >
                    Close
                </button>
            </div>
        </div>
    )

}