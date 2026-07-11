import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import HomeScreen from '@/components/HomeScreen'
import GameScreen from '@/components/GameScreen'
import HostSetupScreen from '@/components/HostSetupScreen'
import LobbyScreen from '@/components/LobbyScreen'
import JoinScreen from '@/components/JoinScreen'
import RoomGameScreen from '@/components/RoomGameScreen'
import TicketsScreen from '@/components/TicketsScreen'

export default function App() {
  const screen = useGameStore(s => s.screen)
  const goToScreen = useGameStore(s => s.goToScreen)

  // Scanning a lobby QR code / opening a shared join link drops you straight into the join form
  useEffect(() => {
    if (new URLSearchParams(location.search).has('join')) {
      goToScreen('join')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  switch (screen) {
    case 'home':
      return <HomeScreen />
    case 'host-setup':
      return <HostSetupScreen />
    case 'lobby':
      return <LobbyScreen />
    case 'join':
      return <JoinScreen />
    case 'room-game':
      return <RoomGameScreen />
    case 'tickets':
      return <TicketsScreen />
    case 'game':
    default:
      return <GameScreen />
  }
}
