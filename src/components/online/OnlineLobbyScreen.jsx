import { useState, useEffect } from 'react';
import { ArrowLeft, Users } from '../Icons';
import JoinGameForm from './lobby/JoinGameForm';
import GameCodeInput from './lobby/GameCodeInput';
import GameListSection from './lobby/GameListSection';

const OnlineLobbyScreen = ({ setScreen, onlineGames = [], lanGames = [],
  joinOnlineGame, playerName,
  setPlayerName, roomIdFromUrl, clearRoomId, socket, getRandomName, localIp }) => {
  const [roomStatus, setRoomStatus] = useState(null);
  const [checkingRoom, setCheckingRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [lanGamesExpanded, setLanGamesExpanded] = useState(true);
  const [onlineGamesExpanded, setOnlineGamesExpanded] = useState(true);

  const targetRoomId = roomIdFromUrl || selectedRoomId;

  // Request LAN games when connected
  useEffect(() => {
    if (socket) {
      socket.emit('requestLanGames', { localIp });
    }
  }, [socket, localIp]);

  // Check room status when targetRoomId changes
  useEffect(() => {
    if (targetRoomId && socket) {
      setCheckingRoom(true);
      socket.emit('checkRoom', { roomId: targetRoomId });

      const handleRoomStatus = (status) => {
        setRoomStatus(status);
        setCheckingRoom(false);
      };

      socket.on('roomStatus', handleRoomStatus);

      return () => {
        socket.off('roomStatus', handleRoomStatus);
      };
    } else {
      setRoomStatus(null);
    }
  }, [targetRoomId, socket]);

  const safeLanGames = Array.isArray(lanGames) ? lanGames : [];
  const lanGameIds = new Set(safeLanGames.map(g => g.id));
  const safeOnlineGames = (Array.isArray(onlineGames) ? onlineGames : [])
    .filter(g => !lanGameIds.has(g.id));
  const showDirectJoin = !!roomIdFromUrl || !!selectedRoomId;



  return (
    <div className="p-6 relative z-10 h-full flex flex-col max-w-2xl mx-auto w-full">
      <div className="relative mb-8 flex items-center justify-center border-b border-noir-gold/20 pb-4">
        <button
          onClick={() => {
            if (showDirectJoin) {
              if (roomIdFromUrl && clearRoomId) {
                clearRoomId();
              } else {
                setSelectedRoomId(null);
              }
            } else {
              setScreen('home');
              window.history.pushState(null, '', '/');
            }
          }}
          className="absolute left-0 p-2 text-noir-gold hover:text-white transition-colors"
          title="BACK"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-noir-gold tracking-[0.2em] text-glow">
          {showDirectJoin ? 'JOIN ROOM' : 'LOBBY'}
        </h1>
      </div>

      {showDirectJoin ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <JoinGameForm
            checkingRoom={checkingRoom}
            roomStatus={roomStatus}
            targetRoomId={targetRoomId}
            playerName={playerName}
            setPlayerName={setPlayerName}
            joinOnlineGame={joinOnlineGame}
            getRandomName={getRandomName}
          />
        </div>
      ) : (
        <>
          {/* Game Code Input */}
          <GameCodeInput onJoin={setSelectedRoomId} />

          {/* Scrollable game lists */}
          <div className="flex-1 mb-6 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-noir-gold/50 scrollbar-track-transparent">
            {/* LAN Games Section */}
            <GameListSection
              title="LAN NET"
              subtitle={`${safeLanGames.length} AVAILABLE`}
              icon={<Users size={16} />}
              games={safeLanGames}
              isExpanded={lanGamesExpanded}
              onToggle={() => setLanGamesExpanded(!lanGamesExpanded)}
              onJoin={setSelectedRoomId}
              headerClassName=""
            />

            {/* All Online Games Section */}
            <GameListSection
              title="ONLINE"
              icon={<Users size={16} />}
              games={safeOnlineGames}
              isExpanded={onlineGamesExpanded}
              onToggle={() => setOnlineGamesExpanded(!onlineGamesExpanded)}
              onJoin={setSelectedRoomId}
            />
          </div>

          <button
            onClick={() => setScreen('online_create')}
            className="w-full py-4 border border-noir-gold/50 text-noir-gold font-serif font-bold tracking-[0.2em] hover:bg-noir-gold hover:text-noir-bg transition-all duration-300 uppercase flex items-center justify-center gap-4 bg-black/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <Users size={20} />
            CREAR SALA
          </button>
        </>
      )}
    </div>
  );
};

export default OnlineLobbyScreen;
