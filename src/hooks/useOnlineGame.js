import { useState, useEffect, useCallback } from 'react';
import { useSocketConnection } from './game/useSocketConnection';

export const useOnlineGame = (setScreen, mySessionId, localIp, playerName) => {
  const { socket, isConnected } = useSocketConnection();
  const [onlineGames, setOnlineGames] = useState([]);
  const [lanGames, setLanGames] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [roomData, setRoomData] = useState(null);

  // Derived State
  const isHost = roomData?.hostPlayerId === mySessionId;

  // Creation Settings
  const [newGameSettings, setNewGameSettings] = useState({
    name: '',
    players: 0, // 0 = unlimited mode, shows as ∞ in UI
    type: 'in_person',
    isPrivate: false
  });

  // Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (room) => {
      console.log('Room created:', room);
      setRoomId(room.id);
      setRoomData(room);
      setScreen('online_waiting');
    };

    const handleRoomList = (rooms) => setOnlineGames(rooms);
    const handleLanGamesList = (games) => {
      console.log('LAN games list received:', games);
      setLanGames(games);
    };

    const handleRoomJoined = (room) => {
      console.log('Joined room:', room);
      setRoomId(room.id);
      setRoomData(room);
      setScreen('online_waiting');
    };

    const handleRoomUpdated = (room) => {
      console.log('Room updated:', room);
      setRoomData(room);
    };

    const handleGameStarted = (roomOrData) => {
      console.log('Game started:', roomOrData);
      // El servidor puede enviar room completo o solo gameData personalizado
      if (roomOrData.gameData) {
        setRoomData(roomOrData);
      } else {
        setRoomData(prevRoom => ({
          ...prevRoom,
          gameData: roomOrData
        }));
      }
      setScreen('online_playing');
    };

    const handleGameDataUpdated = (gameData) => {
      console.log('Game data updated:', gameData);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameData };
      });
    };

    const handleGameReset = (room) => {
      console.log('Game reset:', room);
      setRoomData(room);
      setScreen('online_waiting');
    };

    const handleRoomClosed = ({ message }) => {
      console.log('Room closed:', message);
      alert(message);
      setRoomData(null);
      setRoomId(null);
      setScreen('online_lobby');
    };

    const handleRejoinFailed = () => {
      console.log('Rejoin failed - clearing last room');
      localStorage.removeItem('lastRoomId');
      setRoomId(null);
      setRoomData(null);
    };

    // Mafia game phase events
    const handleNightPhaseStart = (gameData) => {
      console.log('Night phase started:', gameData);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameData };
      });
    };

    const handleDayPhaseStart = (gameData) => {
      console.log('Day phase started:', gameData);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameData };
      });
    };

    const handleVotingStart = (gameData) => {
      console.log('Voting started:', gameData);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameData };
      });
    };

    const handleKamikazeChoice = ({ kamikazeId, gameData }) => {
      console.log('Kamikaze choice:', kamikazeId, gameData);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameData };
      });
    };

    const handleGameEnded = (gameData) => {
      console.log('Game ended:', gameData);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameData };
      });
    };

    const handleNightProgress = ({ received, total }) => {
      console.log(`Night progress: ${received}/${total}`);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          gameData: {
            ...prevRoom.gameData,
            nightProgress: { received, total }
          }
        };
      });
    };

    const handleVotingProgress = ({ received, total }) => {
      console.log(`Voting progress: ${received}/${total}`);
      setRoomData(prevRoom => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          gameData: {
            ...prevRoom.gameData,
            votingProgress: { received, total }
          }
        };
      });
    };

    const handleActionReceived = ({ action }) => {
      console.log('Action received:', action);
      // Actualizar estado local para mostrar pantalla de espera
      if (socket) {
        setRoomData(prev => {
          if (!prev || !prev.gameData) return prev;
          return {
            ...prev,
            gameData: {
              ...prev.gameData,
              nightActions: {
                ...prev.gameData.nightActions,
                [socket.id]: action
              }
            }
          };
        });
      }
    };

    const handleActionError = ({ error }) => {
      console.error('Action error:', error);
      alert(`Error: ${error}`);
    };

    // Attach listeners
    socket.on('roomCreated', handleRoomCreated);
    socket.on('roomList', handleRoomList);
    socket.on('lanGamesList', handleLanGamesList);
    socket.on('roomJoined', handleRoomJoined);
    socket.on('roomUpdated', handleRoomUpdated);
    socket.on('gameStarted', handleGameStarted);
    socket.on('gameDataUpdated', handleGameDataUpdated);
    socket.on('gameReset', handleGameReset);
    socket.on('roomClosed', handleRoomClosed);
    socket.on('rejoinFailed', handleRejoinFailed);

    // Mafia game events
    socket.on('nightPhaseStart', handleNightPhaseStart);
    socket.on('dayPhaseStart', handleDayPhaseStart);
    socket.on('votingStart', handleVotingStart);
    socket.on('kamikazeChoice', handleKamikazeChoice);
    socket.on('gameEnded', handleGameEnded);
    socket.on('nightProgress', handleNightProgress);
    socket.on('votingProgress', handleVotingProgress);
    socket.on('actionReceived', handleActionReceived);
    socket.on('actionError', handleActionError);

    // Initial requests
    if (isConnected) {
      socket.emit('requestRoomList');
      if (mySessionId) {
        const lastRoomId = localStorage.getItem('lastRoomId');
        if (lastRoomId) {
          console.log(`Auto-rejoining room ${lastRoomId} with session ${mySessionId}`);
          socket.emit('rejoinRoom', { roomId: lastRoomId, playerId: mySessionId });
        }
      }
    }

    // Cleanup
    return () => {
      socket.off('roomCreated', handleRoomCreated);
      socket.off('roomList', handleRoomList);
      socket.off('lanGamesList', handleLanGamesList);
      socket.off('roomJoined', handleRoomJoined);
      socket.off('roomUpdated', handleRoomUpdated);
      socket.off('gameStarted', handleGameStarted);
      socket.off('gameDataUpdated', handleGameDataUpdated);
      socket.off('gameReset', handleGameReset);
      socket.off('roomClosed', handleRoomClosed);
      socket.off('rejoinFailed', handleRejoinFailed);
      socket.off('nightPhaseStart', handleNightPhaseStart);
      socket.off('dayPhaseStart', handleDayPhaseStart);
      socket.off('votingStart', handleVotingStart);
      socket.off('kamikazeChoice', handleKamikazeChoice);
      socket.off('gameEnded', handleGameEnded);
      socket.off('nightProgress', handleNightProgress);
      socket.off('votingProgress', handleVotingProgress);
      socket.off('actionReceived', handleActionReceived);
      socket.off('actionError', handleActionError);
    };
  }, [socket, isConnected, mySessionId, setScreen]);

  // Actions
  const createOnlineGame = useCallback((nameOverride) => {
    if (socket) {
      socket.emit('createRoom', {
        playerName: nameOverride || playerName || 'Host',
        roomName: newGameSettings.name,
        settings: {
          players: newGameSettings.players,
          type: newGameSettings.type,
          isPrivate: newGameSettings.isPrivate,
          selectedRoles: { mafia: 1, civil: 0 } // Default: 1 Mafia, resto Civiles
        },
        playerId: mySessionId,
        localIp: localIp
      });
      localStorage.setItem('lastRoomId', '');
    }
  }, [socket, playerName, newGameSettings, mySessionId, localIp]);

  const joinOnlineGame = useCallback((id, nameOverride) => {
    if (socket) {
      socket.emit('joinRoom', { roomId: id, playerName: nameOverride || playerName || 'Jugador', playerId: mySessionId });
      localStorage.setItem('lastRoomId', id);
    }
  }, [socket, playerName, mySessionId]);

  const updateRoomSettings = useCallback((settings) => {
    if (socket && roomId && isHost) {
      socket.emit('updateSettings', { roomId, settings });
    }
  }, [socket, roomId, isHost]);

  const leaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit('leaveRoom', { roomId, playerId: mySessionId });
    }
    setRoomData(null);
    setRoomId(null);
    setScreen('online_lobby');
    localStorage.removeItem('lastRoomId');
    window.history.pushState(null, '', '/online');
  }, [socket, roomId, mySessionId, setScreen]);

  const resetOnlineGame = useCallback(() => {
    if (socket && roomId) {
      socket.emit('resetGame', { roomId });
    }
  }, [socket, roomId]);

  const startOnlineGame = useCallback(() => {
    if (socket && isHost && roomId && roomData) {
      // Enviar configuración de roles
      const roles = roomData.settings.selectedRoles || { mafia: 1, civil: 0 };

      socket.emit('startGame', { roomId, roles });
    }
  }, [socket, isHost, roomId, roomData]);

  return {
    socket,
    onlineGames,
    setOnlineGames,
    lanGames,
    setLanGames,
    roomId,
    setRoomId,
    isHost,
    roomData,
    setRoomData,
    newGameSettings,
    setNewGameSettings,
    createOnlineGame,
    joinOnlineGame,
    updateRoomSettings,
    leaveRoom,
    resetOnlineGame,
    startOnlineGame
  };
};
