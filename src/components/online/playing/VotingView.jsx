import { useState } from 'react';
import { Vote } from '../../Icons';

/**
 * Pantalla de votación diurna
 * Los jugadores votan para ejecutar a alguien
 */
const DayVotingScreen = ({ gameData, myPlayerId, onSubmitVote }) => {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const myPlayer = gameData.players.find(p => p.id === myPlayerId);
  const canVote = myPlayer?.alive && !myPlayer.mutations?.includes('hand');

  const alivePlayers = gameData.players.filter(p => p.alive && p.id !== myPlayerId);

  const handleSubmit = () => {
    if (selectedTarget && canVote) {
      onSubmitVote(selectedTarget);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Vote className="mx-auto mb-3 text-amber-700" size={48} />
          <h1 className="text-3xl font-bold text-amber-900 mb-2">⚖️ Votación</h1>
          <p className="text-amber-700">Vota para ejecutar a un jugador</p>
        </div>

        {canVote ? (
          <div className="bg-white/80 border-2 border-amber-300 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">¿A quién quieres ejecutar?</h2>
            <div className="space-y-2 mb-6">
              {alivePlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => setSelectedTarget(player.id)}
                  className={`w-full p-4 rounded-xl border-2 font-bold transition-all text-left ${selectedTarget === player.id
                    ? 'bg-amber-600 border-amber-800 text-white'
                    : 'bg-white border-amber-300 text-amber-900 hover:border-amber-500'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{player.name}</span>
                    {player.mutations && player.mutations.length > 0 && (
                      <span className="text-xs opacity-70">
                        {player.mutations.includes('hand') && '✋'}
                        {player.mutations.includes('tongue') && '👅'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={!selectedTarget}
                className="w-full py-4 rounded-xl bg-amber-600 border-2 border-amber-800 text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-700 transition-all shadow-lg"
              >
                Confirmar Voto
              </button>

              <button
                onClick={() => onSubmitVote(null)}
                className="w-full p-4 bg-transparent border-2 border-amber-800/30 text-amber-900/70 rounded-xl font-bold hover:bg-amber-800/10 hover:text-amber-900 transition-all"
              >
                Saltar Votación
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 border-2 border-red-300 rounded-2xl p-6 text-center">
            <p className="text-red-600 text-lg font-bold">
              {!myPlayer?.alive ? '☠️ No puedes votar (estás muerto)' : '✋ No puedes votar (mano mutilada)'}
            </p>
          </div>
        )}

        {/* Progreso de votación */}
        {gameData.votingProgress && (
          <div className="mt-6 bg-white/80 border-2 border-amber-300 rounded-2xl p-4 text-center">
            <p className="text-amber-900 font-bold">
              Votos recibidos: {gameData.votingProgress.received} / {gameData.votingProgress.total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayVotingScreen;
