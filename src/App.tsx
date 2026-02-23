import { useGameStore } from '@/store/gameStore'
import HomeScreen from '@/components/HomeScreen'
import GameScreen from '@/components/GameScreen'

export default function App() {
  const screen = useGameStore(s => s.screen)

  return screen === 'home' ? <HomeScreen /> : <GameScreen />
}
