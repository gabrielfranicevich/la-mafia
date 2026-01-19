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
    if (winner === 'civil') return 'bg-green-50 border-green-500 text-green-800';
    if (winner === 'mafia') return 'bg-red-50 border-red-500 text-red-800';
    if (winner === 'loco') return 'bg-purple-50 border-purple-500 text-purple-800';
    return 'bg-gray-50 border-gray-500 text-gray-800';
  };

  const getWinnerTitle = () => {
    if (winner === 'civil') return '✨ ¡GANARON LOS CIVILES!';
    if (winner === 'mafia') return '🕴️ ¡GANÓ LA MAFIA!';
    if (winner === 'loco') return '🤪 ¡GANÓ EL LOCO!';
    return '🎮 FIN DEL JUEGO';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header de Victoria */}
        <div className={`p-6 rounded-2xl mb-6 text-center border-4 ${getWinnerColor()}`}>
          <Trophy className="mx-auto mb-4" size={64} />
          <h2 className="text-3xl font-black uppercase mb-4">{getWinnerTitle()}</h2>

          {winnerNames.length > 0 && (
            <div>
              <p className="text-lg font-bold mb-2">Ganadores:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {winnerNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/50 rounded-lg font-bold"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Revelación de Roles */}
        <div className="bg-white/80 border-2 border-amber-300 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-amber-900 mb-4">📜 Roles Revelados</h3>
          <div className="space-y-2">
            {gameData.players.map((player) => {
              const role = ROLES[player.role];
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 ${player.side === 'mafia'
                    ? 'bg-red-50 border-red-300'
                    : player.side === 'loco'
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-blue-50 border-blue-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{role?.emoji || '❓'}</span>
                    <div>
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm opacity-75">{role?.name || 'Desconocido'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {!player.alive && <span className="text-red-600 font-bold">☠️ Muerto</span>}
                    {player.alive && <span className="text-green-600 font-bold">✓ Vivo</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estadísticas del Juego */}
        <div className="bg-white/80 border-2 border-amber-300 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-amber-900 mb-4">📊 Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="text-3xl font-bold text-amber-900">{gameData.round}</div>
              <div className="text-sm text-amber-700">Rondas</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="text-3xl font-bold text-amber-900">
                {gameData.players.filter(p => !p.alive).length}
              </div>
              <div className="text-sm text-amber-700">Muertes</div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
          {isHost && (
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-amber-600 border-2 border-amber-800 text-white font-bold text-lg hover:bg-amber-700 transition-all shadow-lg"
            >
              <RotateCcw size={24} />
              Jugar de Nuevo
            </button>
          )}
          <button
            onClick={onLeave}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-600 border-2 border-gray-800 text-white font-bold text-lg hover:bg-gray-700 transition-all shadow-lg"
          >
            <LogOut size={24} />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
