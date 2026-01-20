import { useState, useEffect } from 'react';
import { Vote } from '../../Icons';

/**
 * Pantalla de votación diurna
 * Los jugadores votan para ejecutar a alguien
 */
const DayVotingScreen = ({ gameData, myPlayerId, onSubmitVote }) => {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const myPlayer = gameData.players.find(p => p.id === myPlayerId);
  const canVote = myPlayer?.alive && !myPlayer.mutations?.includes('hand');

  const alivePlayers = gameData.players.filter(p => p.alive && p.id !== myPlayerId);

  const handleSubmit = () => {
    if (selectedTarget && canVote) {
      onSubmitVote(selectedTarget);
    }
  };

  return (
    <div className="min-h-screen bg-noir-bg p-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 border-b border-noir-gold/10 pb-6">
          <Vote className="mx-auto mb-6 text-noir-gold" size={48} />
          <h1 className="text-3xl font-serif font-bold text-noir-gold mb-2 tracking-[0.2em] text-glow uppercase">
            JUICIO
          </h1>
          <p className="text-noir-smoke/60 font-serif italic mb-4">"Lanza tu piedra."</p>
          <div className="text-noir-gold font-mono text-2xl tracking-widest bg-black/40 inline-block px-4 py-2 border border-noir-gold/30">
            {timeLeft}s
          </div>
        </div>

        {canVote ? (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-noir-gold/50 uppercase tracking-[0.2em] text-center mb-4">SELECCIONA AL ACUSADO</h2>
            <div className="space-y-3">
              {alivePlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => setSelectedTarget(player.id)}
                  className={`w-full p-4 border transition-all text-left flex items-center justify-between group rounded-sm ${selectedTarget === player.id
                    ? 'bg-noir-blood text-black border-noir-blood shadow-[0_0_15px_rgba(139,0,0,0.4)]'
                    : 'bg-black/40 border-noir-gold/20 text-noir-paper hover:border-noir-blood hover:bg-noir-blood/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-serif tracking-wider uppercase ${selectedTarget === player.id ? 'font-bold' : ''}`}>
                      {player.name}
                    </span>
                    {player.mutations && player.mutations.length > 0 && (
                      <span className="text-xs opacity-70 flex gap-1">
                        {player.mutations.includes('hand') && '✋'}
                        {player.mutations.includes('tongue') && '👅'}
                      </span>
                    )}
                  </div>
                  {selectedTarget === player.id && <div className="text-black font-bold">⚠️</div>}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-noir-gold/10">
              <button
                onClick={handleSubmit}
                disabled={!selectedTarget}
                className="w-full py-5 bg-noir-blood text-black font-serif font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                CULPABLE - CONFIRMAR VOTO
              </button>

              <button
                onClick={() => onSubmitVote(null)}
                className="w-full py-4 bg-transparent border border-noir-smoke/20 text-noir-smoke/60 font-serif font-bold uppercase tracking-[0.2em] hover:text-noir-smoke hover:border-noir-smoke transition-all text-xs"
              >
                ABSTENERSE (OMITIR VOTO)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-noir-blood/30 bg-noir-blood/5 text-center mt-8">
            <p className="text-noir-blood text-lg font-serif font-bold tracking-widest uppercase">
              {!myPlayer?.alive ? '☠️ FALLECIDO' : '✋ MANO CORTADA - NO PUEDE VOTAR'}
            </p>
          </div>
        )}

        {/* Progreso de votación */}
        {gameData.votingProgress && (
          <div className="mt-8 text-center">
            <div className="inline-block px-4 py-2 border-t border-b border-noir-gold/20">
              <p className="text-noir-gold/60 font-serif text-sm tracking-widest uppercase">
                VOTOS EMITIDOS: <span className="text-noir-gold font-bold">{gameData.votingProgress.received} / {gameData.votingProgress.total}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayVotingScreen;
