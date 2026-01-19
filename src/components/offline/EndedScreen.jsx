import { RotateCcw } from '../Icons';
import PrimaryButton from '../shared/PrimaryButton';
import { ROLES } from '../../data/gameRoles';

const EndedScreen = ({ gameData, resetGame }) => {
  if (!gameData || !gameData.winner) return null;

  const winner = gameData.winner; // 'civil', 'mafia', 'loco'

  const getWinnerText = () => {
    switch (winner) {
      case 'civil': return '¡VICTORIA DEL PUEBLO!';
      case 'mafia': return '¡VICTORIA DE LA MAFIA!';
      case 'loco': return '¡VICTORIA DEL LOCO!';
      default: return 'PARTIDA TERMINADA';
    }
  };

  const getWinnerColor = () => {
    switch (winner) {
      case 'civil': return 'text-blue-700';
      case 'mafia': return 'text-red-700';
      case 'loco': return 'text-purple-700';
      default: return 'text-medieval-ink';
    }
  };

  return (
    <div className="p-6 flex flex-col h-[600px] relative z-10 bg-medieval-paper">
      <div className="text-center mb-8 pt-8">
        <div className={`text-6xl mx-auto mb-4 drop-shadow-lg animate-bounce`}>🏆</div>
        <h1 className={`text-3xl font-bold tracking-widest ${getWinnerColor()}`} style={{ fontFamily: 'Georgia, serif' }}>
          {getWinnerText()}
        </h1>
      </div>

      <div className="flex-1 overflow-auto bg-white/50 rounded-xl border border-medieval-stone p-4">
        <h3 className="font-bold text-center mb-4 text-medieval-ink border-b border-medieval-stone/30 pb-2">
          Roles Revelados
        </h3>
        <ul className="space-y-3">
          {gameData.players.map((name, idx) => {
            const roleId = gameData.roles[idx];
            const role = ROLES[roleId];
            const pState = gameData.playerStates.find(p => p.id === idx);
            const isDead = !pState?.alive;

            return (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{role.emoji}</span>
                  <span className={`${isDead ? 'line-through text-gray-500' : 'text-medieval-ink font-bold'}`}>
                    {name}
                  </span>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded text-white font-bold text-xs ${role.side === 'mafia' ? 'bg-red-600' :
                      role.side === 'loco' ? 'bg-purple-600' :
                        'bg-blue-600'
                    }`}>
                    {role.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={resetGame}>
          <RotateCcw size={20} className="mr-2" />
          Jugar de Nuevo
        </PrimaryButton>
      </div>
    </div>
  );
};

export default EndedScreen;
