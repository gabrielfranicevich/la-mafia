import { Users, ChevronUp, ChevronDown, Edit2, RotateCcw } from '../Icons';
import { ROLES } from '../../data/gameRoles';

const PlayingScreen = ({
  gameData, resetGame,
  turnOrderExpanded, setTurnOrderExpanded,
  allPlayersExpanded, setAllPlayersExpanded,
  rulesExpanded, setRulesExpanded
}) => {
  // Count roles by side
  const roleCounts = gameData?.roles?.reduce((acc, roleId) => {
    const role = ROLES[roleId];
    if (role) {
      const side = role.side || 'civil';
      acc[side] = (acc[side] || 0) + 1;
    }
    return acc;
  }, {}) || {};

  return (
    <div className="p-6 relative z-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-medieval-ink tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
        ⚔️ La Partida Comienza ⚔️
      </h1>

      {/* Composición de la Partida */}
      <div className="mb-6">
        <button
          onClick={() => setAllPlayersExpanded(!allPlayersExpanded)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-medieval-aged-parchment/30 transition-all border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(74,76,58,1)]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-royal-gold/30 p-2 rounded-lg text-medieval-ink">
              <Users size={20} />
            </div>
            <h2 className="text-lg font-bold text-medieval-ink leading-tight uppercase tracking-wide">Composición</h2>
          </div>
          {allPlayersExpanded ? <ChevronUp size={24} className="text-medieval-ink" /> : <ChevronDown size={24} className="text-medieval-ink" />}
        </button>
        {allPlayersExpanded && (
          <div className="mt-4 p-4 bg-day-warm-light/50 rounded-2xl border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,0.1)]">
            <div className="space-y-2 text-medieval-ink">
              <div className="flex justify-between p-2 bg-blue-100 rounded-lg border border-blue-300">
                <span className="font-bold">👥 Civiles:</span>
                <span className="font-bold">{roleCounts.civil || 0}</span>
              </div>
              <div className="flex justify-between p-2 bg-red-100 rounded-lg border border-red-300">
                <span className="font-bold">🕴️ Mafia:</span>
                <span className="font-bold">{roleCounts.mafia || 0}</span>
              </div>
              {roleCounts.loco > 0 && (
                <div className="flex justify-between p-2 bg-purple-100 rounded-lg border border-purple-300">
                  <span className="font-bold">🤪 Loco:</span>
                  <span className="font-bold">{roleCounts.loco}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Orden de Turnos */}
      <div className="mb-6">
        <button
          onClick={() => setTurnOrderExpanded(!turnOrderExpanded)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-medieval-aged-parchment/30 transition-all border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(74,76,58,1)]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-day-sandstone/30 p-2 rounded-lg text-medieval-ink">
              <Users size={20} />
            </div>
            <h2 className="text-lg font-bold text-medieval-ink leading-tight uppercase tracking-wide">Orden de Debate</h2>
          </div>
          {turnOrderExpanded ? <ChevronUp size={24} className="text-medieval-ink" /> : <ChevronDown size={24} className="text-medieval-ink" />}
        </button>
        {turnOrderExpanded && (
          <div className="mt-4 p-4 bg-day-warm-light/50 rounded-2xl border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,0.1)]">
            <div className="space-y-3">
              {gameData.playerOrder.map((playerIndex, i) => (
                <div key={i} className="flex items-center gap-3 text-medieval-ink bg-white/50 p-2 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-day-sandstone text-white flex items-center justify-center font-bold shadow-sm border border-medieval-dark-stone/20">
                    {i + 1}
                  </div>
                  <span className="font-bold text-lg">{gameData.players[playerIndex]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reglas Rápidas */}
      <div className="mb-8">
        <button
          onClick={() => setRulesExpanded(!rulesExpanded)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-medieval-aged-parchment/30 transition-all border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(74,76,58,1)]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-royal-purple/20 p-2 rounded-lg text-medieval-ink">
              <Edit2 size={20} />
            </div>
            <h2 className="text-lg font-bold text-medieval-ink leading-tight uppercase tracking-wide">Reglas Rápidas</h2>
          </div>
          {rulesExpanded ? <ChevronUp size={24} className="text-medieval-ink" /> : <ChevronDown size={24} className="text-medieval-ink" />}
        </button>
        {rulesExpanded && (
          <div className="mt-4 p-4 bg-royal-purple/10 rounded-2xl border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,0.1)]">
            <ul className="text-sm text-medieval-ink/90 space-y-2 font-medium">
              <li className="flex gap-2">
                <span>🌙</span>
                <span><strong>Noche:</strong> Roles especiales realizan acciones secretas</span>
              </li>
              <li className="flex gap-2">
                <span>☀️</span>
                <span><strong>Día:</strong> Todos debaten y votan para ejecutar a un sospechoso</span>
              </li>
              <li className="flex gap-2">
                <span>🕴️</span>
                <span><strong>Mafia gana:</strong> Cuando no quedan civiles o tienen mayoría de votos</span>
              </li>
              <li className="flex gap-2">
                <span>👥</span>
                <span><strong>Civiles ganan:</strong> Cuando eliminan a toda la Mafia</span>
              </li>
              <li className="flex gap-2">
                <span>🤪</span>
                <span><strong>Loco gana:</strong> Si es ejecutado de día (todos los demás pierden)</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={resetGame}
        className="w-full bg-wood-brown text-medieval-parchment py-5 rounded-2xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(44,24,16,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(44,24,16,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(44,24,16,1)] transition-all flex items-center justify-center gap-3 border-2 border-medieval-ink"
      >
        <RotateCcw size={24} />
        Jugar de Nuevo
      </button>
    </div>
  );
};

export default PlayingScreen;
