import { Sun } from '../../Icons';
import { ROLES } from '../../../data/gameRoles';

/**
 * Pantalla de fase diurna
 * Tema: Ciudad antigua dorada bajo el sol
 */
const DayPhaseScreen = ({ gameData, myPlayerId, onStartVoting, isHost }) => {
  const myPlayer = gameData.players.find(p => p.id === myPlayerId);
  const alivePlayers = gameData.players.filter(p => p.alive);

  // Mostrar eventos de la noche anterior
  const nightEvents = gameData.events || [];
  const publicEvents = nightEvents.filter(e => !e.private || e.visibleTo?.includes(myPlayerId));

  return (
    <div className="min-h-screen bg-noir-bg p-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 border-b border-noir-gold/10 pb-6">
          <Sun className="mx-auto mb-6 text-noir-gold" size={48} />
          <h1 className="text-4xl font-serif font-bold text-noir-gold mb-2 tracking-[0.2em] text-glow">
            DÍA {gameData.round}
          </h1>
          <p className="text-noir-smoke/60 font-serif italic text-sm">
            "La verdad rara vez es pura y nunca simple."
          </p>
        </div>

        {/* Eventos de la noche */}
        {publicEvents.length > 0 && (
          <div className="mb-8 bg-[#f5f5f5] text-black p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] transform -rotate-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-black/80"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/80"></div>
            <h2 className="text-3xl font-serif font-black text-center mb-6 uppercase tracking-wider border-b-2 border-black pb-2">
              CRÓNICAS MATUTINAS
            </h2>
            <div className="space-y-4">
              {publicEvents.map((event, idx) => (
                <div key={idx} className="border-b border-black/20 pb-2 last:border-0 last:pb-0">
                  <h3 className="font-bold font-serif text-lg leading-tight mb-1 uppercase">
                    {event.type === 'death' ? '¡TRAGEDIA!' : 'NOTICIAS'}
                  </h3>
                  <p className="font-serif text-sm leading-relaxed">
                    {event.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jugadores vivos */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-noir-gold/50 mb-4 uppercase tracking-[0.2em] text-center">SOSPECHOSOS ({alivePlayers.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {alivePlayers.map(player => (
              <div
                key={player.id}
                className={`p-4 border transition-all ${player.id === myPlayerId
                  ? 'bg-noir-gold text-black border-noir-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-black/40 border-noir-gold/20 text-noir-paper'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={`font-serif font-bold uppercase tracking-wider ${player.id !== myPlayerId ? 'text-sm' : ''}`}>{player.name}</div>
                  {player.id === myPlayerId && <span className="text-[10px] uppercase font-bold tracking-widest bg-black/20 px-1 rounded">TÚ</span>}
                </div>
                <div className="flex gap-2 text-xs opacity-70">
                  {player.mutations?.includes('hand') && <span title="Sin mano" className="grayscale">✋ MANCO</span>}
                  {player.mutations?.includes('tongue') && <span title="Silenciado" className="grayscale">👅 SILENCIADO</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de debate */}
        <div className="mb-8 p-6 text-center border-y border-noir-gold/10 bg-black/20">
          <h2 className="text-lg font-serif font-bold text-noir-gold mb-3 tracking-widest">DELIBERACIÓN</h2>
          {myPlayer?.alive && !myPlayer.mutations?.includes('tongue') ? (
            <div className="text-noir-smoke/60 text-sm font-serif italic">
              Discute la evidencia. Engaña o deduce.
            </div>
          ) : (
            <div className="text-noir-blood font-bold uppercase tracking-widest text-sm border p-2 border-noir-blood/30 inline-block">
              {!myPlayer?.alive ? '☠️ FALLECIDO - SILENCIO' : '👅 LENGUA CORTADA - SILENCIO'}
            </div>
          )}
        </div>

        {/* Botón para iniciar votación (solo narrador/app) */}
        {isHost && (
          <button
            onClick={onStartVoting}
            className="w-full py-5 bg-noir-paper text-black font-serif font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg"
          >
            ⚖️ INICIAR JUICIO
          </button>
        )}
      </div>
    </div>
  );
};

export default DayPhaseScreen;
