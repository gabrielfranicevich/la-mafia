import { useState, useEffect } from 'react';
import NightPhaseScreen from './playing/NightPhaseScreen';
import DayPhaseScreen from './playing/DayPhaseScreen';
import VotingView from './playing/VotingView';
import ResultsView from './playing/ResultsView';
import { GAME_PHASES } from '../../data/gameConstants';

/**
 * Pantalla principal de juego online para La Mafia
 * Maneja las diferentes fases del juego (noche, día, votación, resultados)
 */
const OnlinePlayingScreen = ({
  roomData,
  playerId,
  socket,
  leaveRoom,
  isHost,
  resetGame
}) => {
  const gameData = roomData?.gameData;
  const phase = gameData?.phase || GAME_PHASES.NIGHT;

  // Encontrar mi jugador
  const myPlayer = roomData?.players.find(p => p.id === playerId);

  // Handlers para acciones
  const handleNightAction = (action) => {
    if (socket && roomData?.id) {
      socket.emit('nightAction', {
        roomId: roomData.id,
        action
      });
    }
  };

  const handleStartVoting = () => {
    if (socket && roomData?.id && isHost) {
      socket.emit('startVoting', { roomId: roomData.id });
    }
  };

  const handleDayVote = (targetId) => {
    if (socket && roomData?.id) {
      socket.emit('submitDayVote', {
        roomId: roomData.id,
        targetId
      });
    }
  };

  const handleKamikazeTarget = (targetId) => {
    if (socket && roomData?.id) {
      socket.emit('kamikazeTarget', {
        roomId: roomData.id,
        targetId
      });
    }
  };

  // Renderizar según la fase
  if (!gameData || !myPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-4">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fase Nocturna */}
      {phase === GAME_PHASES.NIGHT && (
        <NightPhaseScreen
          gameData={gameData}
          myPlayerId={playerId}
          onSubmitAction={handleNightAction}
        />
      )}

      {/* Fase Diurna */}
      {phase === GAME_PHASES.DAY && (
        <DayPhaseScreen
          gameData={gameData}
          myPlayerId={playerId}
          onStartVoting={handleStartVoting}
          isHost={isHost}
        />
      )}

      {/* Votación */}
      {phase === GAME_PHASES.VOTING && (
        <VotingView
          gameData={gameData}
          myPlayerId={playerId}
          onSubmitVote={handleDayVote}
        />
      )}

      {/* Resultados */}
      {phase === GAME_PHASES.RESULTS && (
        <ResultsView
          gameData={gameData}
          roomData={roomData}
          isHost={isHost}
          onReset={resetGame}
          onLeave={leaveRoom}
        />
      )}

      {/* Kamikaze Choice */}
      {phase === 'kamikaze_choice' && (
        <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">💣 ¡Kamikaze!</h1>
              {gameData.executedPlayerId === playerId ? (
                <div>
                  <p className="text-white text-lg mb-6">
                    Fuiste ejecutado, pero puedes llevar a alguien contigo...
                  </p>
                  <div className="space-y-2">
                    {gameData.players
                      .filter(p => p.alive && p.id !== playerId)
                      .map(player => (
                        <button
                          key={player.id}
                          onClick={() => handleKamikazeTarget(player.id)}
                          className="w-full p-4 rounded-xl bg-red-700 border-2 border-red-400 text-white font-bold hover:bg-red-600 transition-all"
                        >
                          {player.name}
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-white text-lg">
                  Esperando que el Kamikaze elija su víctima...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlinePlayingScreen;
