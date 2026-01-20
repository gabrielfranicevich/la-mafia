import { Trophy, RotateCcw, LogOut } from '../../Icons';
import { ROLES } from '../../../data/gameRoles';

/**
 * Pantalla de resultados
 * Muestra quién ganó y revela todos los roles
 */
const ResultsView = ({ gameData, roomData, isHost, onReset, onLeave }) => {
  const winner = gameData.winner;
  const winnerNames = gameData.winnerNames || [];

  // Determinar color del ganador
  const getWinnerColor = () => {
    if (winner === 'civil') return 'border-noir-gold text-noir-gold';
    if (winner === 'mafia') return 'border-noir-blood text-noir-blood';
    if (winner === 'loco') return 'border-purple-500 text-purple-500';
    return 'border-noir-smoke text-noir-smoke';
  };

  const getWinnerTitle = () => {
    if (winner === 'civil') return 'LA JUSTICIA PREVALECE';
    if (winner === 'mafia') return 'OMERTÀ PARA SIEMPRE';
    if (winner === 'loco') return 'EL CAOS REINA';
    return 'FIN DEL JUEGO';
  };

  return (
    <div className="min-h-screen bg-noir-bg p-4 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Header de Victoria */}
        <div className={`p-8 mb-8 text-center border-y-4 bg-black/50 ${getWinnerColor()}`}>
          <Trophy className="mx-auto mb-6 opacity-80" size={64} />
          <h2 className="text-5xl font-serif font-black uppercase mb-6 tracking-[0.2em] text-glow">{getWinnerTitle()}</h2>

          {winnerNames.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.4em] mb-4 opacity-70">VENCEDORES</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {winnerNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-6 py-2 border border-current bg-white/5 font-bold uppercase tracking-widest"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Revelación de Roles */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-noir-gold/50 mb-4 uppercase tracking-[0.2em] text-center">EXPEDIENTE REVELADO</h3>
          <div className="grid gap-2">
            {gameData.players.map((player) => {
              const role = ROLES[player.role];
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 border-b border-noir-gold/10 ${player.side === 'mafia' ? 'bg-noir-blood/5' : 'bg-transparent'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl filter grayscale opacity-70">{role?.emoji || '❓'}</span>
                    <div>
                      <div className="font-serif font-bold text-noir-paper uppercase tracking-wider">{player.name}</div>
                      <div className="text-xs text-noir-smoke font-mono uppercase">{role?.name || 'Desconocido'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {!player.alive && <span className="text-noir-blood font-bold text-xs uppercase tracking-widest">☠️ FALLECIDO</span>}
                    {player.alive && <span className="text-noir-gold/70 font-bold text-xs uppercase tracking-widest">SOBREVIVIENTE</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estadísticas del Juego */}
        <div className="mb-8 p-6 border border-noir-gold/20 bg-black/40">
          <h3 className="text-xs font-bold text-noir-gold/50 mb-6 uppercase tracking-[0.2em] text-center">ESTADÍSTICAS DEL CASO</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-noir-paper">{gameData.round}</div>
              <div className="text-xs text-noir-smoke uppercase tracking-widest mt-1">RONDAS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-noir-blood">
                {gameData.players.filter(p => !p.alive).length}
              </div>
              <div className="text-xs text-noir-smoke uppercase tracking-widest mt-1">BAJAS</div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isHost && (
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-3 py-5 bg-noir-gold text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <RotateCcw size={20} />
              REPETIR
            </button>
          )}
          <button
            onClick={onLeave}
            className="flex-1 flex items-center justify-center gap-3 py-5 bg-transparent border border-noir-smoke/30 text-noir-smoke font-bold uppercase tracking-[0.2em] hover:bg-noir-smoke hover:text-black transition-all"
          >
            <LogOut size={20} />
            SALIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
