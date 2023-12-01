import './App.css'
import '@fontsource/vt323';
import { useState } from 'react';
import GameScreen from './components/screens/GameScreen';
import MainScreen from './components/screens/MainScreen';

export default function App() {
  const [screenToDisplay, setScreenToDisplay] = useState('GAME');
  return (
    <>
      {screenToDisplay === 'MAIN' && <MainScreen />}
      {screenToDisplay === 'GAME' && <GameScreen />}
    </>
  )
}
