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
      <div className="min-h-screen bg-noir-bg flex items-center justify-center p-4">
        <div className="text-center animate-pulse">
          <div className="text-2xl font-serif font-bold text-noir-gold tracking-[0.2em]">CARGANDO...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-bg text-noir-paper">
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
        <div className="min-h-screen bg-black p-4 flex items-center justify-center border-[20px] border-noir-blood">
          <div className="max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-serif font-bold text-noir-blood mb-4 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(139,0,0,0.8)] animate-pulse">
                KAMIKAZE
              </h1>
              {gameData.executedPlayerId === playerId ? (
                <div>
                  <p className="text-noir-paper/80 text-lg mb-8 font-serif italic tracking-wide">
                    "Si caigo, te llevo conmigo."<br />
                    <span className="text-xs uppercase not-italic tracking-widest mt-2 block text-noir-blood">Elige una víctima</span>
                  </p>
                  <div className="space-y-4">
                    {gameData.players
                      .filter(p => p.alive && p.id !== playerId)
                      .map(player => (
                        <button
                          key={player.id}
                          onClick={() => handleKamikazeTarget(player.id)}
                          className="w-full p-6 rounded-sm bg-noir-blood/20 border-2 border-noir-blood text-noir-blood font-bold text-xl uppercase tracking-[0.2em] hover:bg-noir-blood hover:text-black transition-all hover:scale-105"
                        >
                          {player.name}
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-noir-blood text-xl uppercase tracking-widest animate-pulse border-t border-b border-noir-blood py-4">
                  Esperando el Juicio Final...
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
