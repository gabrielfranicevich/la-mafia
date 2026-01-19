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
    <div className="min-h-screen bg-day-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Sun className="mx-auto mb-3 text-day-sandstone drop-shadow-lg" size={48} />
          <h1 className="text-3xl font-bold text-day-shadow mb-2">☀️ Día - Ronda {gameData.round}</h1>
          <p className="text-day-shadow/80">La ciudad despierta. Es hora de debatir y decidir quién será juzgado</p>
        </div>

        {/* Eventos de la noche */}
        {publicEvents.length > 0 && (
          <div className="mb-6 bg-day-warm-light/90 border-2 border-day-terracotta rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-day-shadow mb-4">📰 El Pregonero Anuncia</h2>
            <div className="space-y-2">
              {publicEvents.map((event, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border-2 ${event.type === 'death'
                    ? 'bg-red-50 border-red-400 text-red-900'
                    : event.type === 'mutilate'
                      ? 'bg-orange-100 border-orange-400 text-orange-900'
                      : event.type === 'investigate'
                        ? 'bg-blue-50 border-blue-400 text-blue-900'
                        : 'bg-gray-50 border-gray-400 text-gray-900'
                    }`}
                >
                  {event.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jugadores vivos */}
        <div className="mb-6 bg-day-warm-light/90 border-2 border-day-terracotta rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-day-shadow mb-4">👥 Ciudadanos en la Plaza ({alivePlayers.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {alivePlayers.map(player => (
              <div
                key={player.id}
                className={`p-3 rounded-xl border-2 ${player.id === myPlayerId
                  ? 'bg-day-sandstone/50 border-royal-gold shadow-md'
                  : 'bg-white/80 border-day-terracotta/50'
                  }`}
              >
                <div className="font-bold text-day-shadow">{player.name}</div>
                <div className="text-xs text-day-shadow/70 space-x-2">
                  {player.mutations?.includes('hand') && <span title="No puede votar">✋</span>}
                  {player.mutations?.includes('tongue') && <span title="No puede hablar">👅</span>}
                  {player.id === myPlayerId && <span>(Tú)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de debate */}
        <div className="mb-6 bg-day-warm-light/90 border-2 border-day-terracotta rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-day-shadow mb-4">💬 Asamblea del Pueblo</h2>
          {myPlayer?.alive && !myPlayer.mutations?.includes('tongue') ? (
            <div className="text-center text-day-shadow/80 p-8 border-2 border-dashed border-day-terracotta/50 rounded-xl bg-white/30">
              <p className="mb-2">Debate con los demás jugadores fuera de la aplicación</p>
              <p className="text-sm opacity-75">(Chat de voz, presencial, etc.)</p>
            </div>
          ) : (
            <div className="text-center text-red-700 p-8 border-2 border-dashed border-red-400 rounded-xl bg-red-50">
              {!myPlayer?.alive ? '☠️ No puedes hablar (estás muerto)' : '👅 No puedes hablar (lengua mutilada)'}
            </div>
          )}
        </div>

        {/* Botón para iniciar votación (solo narrador/app) */}
        {isHost && (
          <button
            onClick={onStartVoting}
            className="w-full py-4 rounded-xl bg-day-terracotta border-2 border-day-shadow text-white font-bold text-lg hover:bg-day-shadow transition-all shadow-lg"
          >
            ⚖️ Iniciar Votación
          </button>
        )}
      </div>
    </div>
  );
};

export default DayPhaseScreen;
