import './App.css'
import '@fontsource/vt323';
import GameScreen from './components/screens/GameScreen';
import TitleScreen from './components/screens/TitleScreen';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import MainScreen from './components/screens/MainScreen';
import UpgradeScreen from './components/screens/UpgradeScreen';

export default function App() {
  const state = useSelector((state: RootState) => state.gameState.state);
  return (
    <>
      {state === 'TITLE' && <TitleScreen />}
      {state === 'MAIN MENU' && <MainScreen />}
      {state === 'GAME' && <GameScreen />}
      {state === 'UPGRADE' && <UpgradeScreen />}
    </>
  )
}
