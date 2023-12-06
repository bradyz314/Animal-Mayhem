import './App.css'
import '@fontsource/vt323';
import GameScreen from './components/screens/GameScreen';
import MainScreen from './components/screens/MainScreen';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';

export default function App() {
  const {state, levelNo} = useSelector((state: RootState) => state.gameState);
  return (
    <>
      {state === 'MAIN' && <MainScreen />}
      {state === 'GAME' && <GameScreen levelNo={levelNo}/>}
    </>
  )
}
