import { Eye } from '../Icons';
import { ROLES } from '../../data/gameRoles';

const RevealScreen = ({ gameData, currentPlayerIndex, numPlayers, roleRevealed, showRole, isRole, nextPlayer }) => {
  const playerRole = gameData?.roles?.[currentPlayerIndex];
  const role = ROLES[playerRole];

  return (
    <div className="p-6 flex flex-col h-[600px] relative z-10">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 rounded-full bg-medieval-stone/20 text-medieval-ink font-bold text-xs uppercase tracking-widest mb-3">
          Jugador {currentPlayerIndex + 1} / {numPlayers}
        </div>
        <h2 className="text-3xl font-bold text-medieval-ink">
          {gameData.players[currentPlayerIndex] || `Jugador ${currentPlayerIndex + 1}`}
        </h2>
      </div>

      {!roleRevealed ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-royal-gold/20 rounded-full blur-3xl transform scale-150"></div>
            <Eye size={80} className="relative z-10 mx-auto text-royal-gold drop-shadow-md" />
            <p className="mt-6 text-medieval-ink/60 font-bold text-lg">¿Estás listo?</p>
          </div>
          <button
            onClick={showRole}
            className="w-full bg-royal-gold text-medieval-ink py-5 rounded-2xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(74,76,58,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(74,76,58,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(74,76,58,1)] transition-all border-2 border-medieval-dark-stone"
          >
            Mostrar Rol
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center w-full">
              {role ? (
                <>
                  <div className="text-8xl mb-4 filter drop-shadow-xl animate-bounce">{role.emoji}</div>
                  <div className="text-3xl font-bold text-medieval-ink mb-2">{role.name}</div>
                  <div className={`inline-block px-4 py-1 rounded-full text-white font-bold text-sm mb-4 
                    ${role.side === 'mafia' ? 'bg-red-600' :
                      role.side === 'loco' ? 'bg-purple-600' :
                        'bg-blue-600'
                    }`}>
                    {role.side === 'civil' ? 'Bando: Civiles' : ''}
                  </div>
                  <div className="mt-4 p-4 bg-medieval-aged-parchment/50 rounded-xl border-2 border-medieval-stone/30">
                    <p className="text-sm text-medieval-ink/80">{role.description}</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-4">👤</div>
                  <div className="text-2xl font-bold text-medieval-ink">Rol no encontrado</div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={nextPlayer}
            className="w-full bg-wood-brown text-medieval-parchment py-5 rounded-2xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(44,24,16,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(44,24,16,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(44,24,16,1)] transition-all border-2 border-medieval-ink"
          >
            {currentPlayerIndex < numPlayers - 1 ? 'Siguiente Jugador' : 'Empezar Partida'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RevealScreen;
