import { useEffect } from 'react';
import WaitingRoomHeader from './waiting/WaitingRoomHeader';
import RoomStats from './waiting/RoomStats';
import GameTypeToggle from './waiting/GameTypeToggle';
import GameSettingsSection from './waiting/GameSettingsSection';
import WaitingPlayerList from './waiting/WaitingPlayerList';
import StartGameButton from './waiting/StartGameButton';

/**
 * Sala de espera para juegos online de La Mafia
 * El host configura los roles y los jugadores esperan
 */
const OnlineWaitingRoom = ({
  roomData,
  isHost,
  leaveRoom,
  startGame,
  updateRoomSettings
}) => {
  const selectedRoles = roomData.settings.selectedRoles || { mafia: 1, civil: 0 };
  const currentPlayers = roomData.players.length;

  // Shortcut: Enter para iniciar (solo host)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isHost && currentPlayers >= 4) {
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHost, currentPlayers, startGame]);

  // Actualizar rol
  const updateRole = (roleId, count) => {
    if (!isHost) return;

    // Ensure at least 1 mafia
    if (roleId === 'mafia' && count < 1) {
      return;
    }

    const newRoles = {
      ...selectedRoles,
      [roleId]: count
    };

    // Limpiar roles con count = 0 (excepto mafia)
    Object.keys(newRoles).forEach(key => {
      if (newRoles[key] === 0 && key !== 'mafia') {
        delete newRoles[key];
      }
    });

    updateRoomSettings({ selectedRoles: newRoles });
  };

  // Actualizar tipo de juego
  const updateGameType = (type) => {
    if (!isHost) return;
    updateRoomSettings({ type });
  };

  return (
    <div className="p-6 relative z-10 h-full flex flex-col">
      <WaitingRoomHeader
        roomName={roomData.roomName}
        roomId={roomData.id}
        onLeave={leaveRoom}
      />

      <RoomStats
        currentPlayers={currentPlayers}
        maxPlayers={roomData.settings.players}
        gameType={roomData.settings.type}
      />

      <GameTypeToggle
        isHost={isHost}
        currentType={roomData.settings.type}
        onUpdateType={updateGameType}
      />

      <GameSettingsSection
        isHost={isHost}
        selectedRoles={selectedRoles}
        onUpdateRole={updateRole}
        totalPlayers={currentPlayers}
      />

      <WaitingPlayerList
        players={roomData.players}
        hostId={roomData.hostId}
      />

      <StartGameButton
        isHost={isHost}
        onStart={startGame}
        playerCount={currentPlayers}
      />
    </div>
  );
};

export default OnlineWaitingRoom;
