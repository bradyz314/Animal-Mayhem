import { useEffect, useState } from "react";
import axios from "axios";
import AccountMenu from "../menus/AccountMenu";
import { useDispatch } from "react-redux";
import { setState } from "../../features/GameStateSlice";

export default function MainScreen() {
    const [show, setShow] = useState(false);
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        axios.get('/account/user')
            .then(res => {
                if (!res.data) {
                    setUser('')
                } else {
                    setUser(res.data)
                }
            }).catch((err) => {
                console.log(err);
            })
    }, [user]);
    return (
        <div
            className='min-h-full flex-col flex items-center justify-center'
        >
            <h1
                className='text-9xl flex bg-gradient-to-r from-amber-300 via-cyan-300 to-rose-300 text-transparent bg-clip-text'
            >
                Animal Mayhem
            </h1>
            {user ?
                <>
                    <h2
                        className='text-4xl text-white my-2'
                    >
                        {`Welcome ${user}!`}
                    </h2>
                    <button
                        className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                        onClick={() => {
                            dispatch(setState('GAME'));
                        }}
                    >
                        Play
                    </button>
                    <button
                        className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                        onClick={() => {
                            axios.post(`/account/logout`).then(() => {
                                setUser('');
                            }).catch((err) => {
                                alert(`${err.response.data}!`);
                            })
                        }}
                    >
                        Log Out
                    </button>
                </> :
                <>
                    <h2
                        className='text-4xl text-white my-2'
                    >
                        Please sign up and/or log in!
                    </h2>
                    <button
                        className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                        onClick={() => {
                            setLogin(true);
                            setShow(true);
                        }}
                    >
                        Login
                    </button>
                    <button
                        className='rounded-md w-1/4 bg-blue-600 text-xl text-emerald-400 rounded-s m-2 hover:bg-blue-700'
                        onClick={() => {
                            setLogin(false);
                            setShow(true);
                        }}
                    >
                        Sign Up
                    </button>
                </>
            }
            {show && <AccountMenu login={login} setShow={setShow} setUser={setUser} />}
        </div>
    )
}