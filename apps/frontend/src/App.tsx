import './App.css'
import '@fontsource/vt323';
import GameScreen from './components/screens/GameScreen';
import MainScreen from './components/screens/MainScreen';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';

export default function App() {
  const screenToDisplay = useSelector((state: RootState) => state.screen.state);
  return (
    <>
      {screenToDisplay === 'MAIN' && <MainScreen />}
      {screenToDisplay === 'GAME' && <GameScreen />}
    </>
  )
}
