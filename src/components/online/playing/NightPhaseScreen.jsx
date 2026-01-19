import { useState } from 'react';
import { Moon } from '../../Icons';
import { ROLES } from '../../../data/gameRoles';

/**
 * Pantalla de fase nocturna
 * Tema: Ciudad antigua bajo la luna (calles oscuras y sombras)
 */
const NightPhaseScreen = ({ gameData, myPlayerId, onSubmitAction }) => {
  const myPlayer = gameData.players.find(p => p.id === myPlayerId);
  const myRole = ROLES[myPlayer?.role];

  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedTargets, setSelectedTargets] = useState([]); // Para Espejo (2 targets)
  const [mutationType, setMutationType] = useState('hand');

  if (!myPlayer || !myPlayer.alive) {
    return (
      <div className="min-h-screen bg-night-gradient flex items-center justify-center p-4">
        <div className="text-center">
          <Moon className="mx-auto mb-4 text-night-moonlight drop-shadow-lg" size={64} />
          <h2 className="text-2xl font-bold text-night-moonlight mb-2">Estás Muerto</h2>
          <p className="text-night-moonlight/70">Observa cómo se desarrolla la partida desde las sombras</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    let action = null;

    switch (myRole.nightAction) {
      case 'investigate':
      case 'protect':
      case 'block':
        action = { type: myRole.nightAction, target: selectedTarget };
        break;
      case 'kill_group':
        action = { type: 'kill_group', target: selectedTarget };
        break;
      case 'mutilate':
        action = { type: 'mutilate', target: selectedTarget, mutationType };
        break;
      case 'swap':
        action = { type: 'swap', targets: selectedTargets };
        break;
      case 'choose_master':
        action = { type: 'choose_master', target: selectedTarget };
        break;
      default:
        return;
    }

    onSubmitAction(action);
  };

  const canSubmit = () => {
    if (myRole.nightAction === 'swap') return selectedTargets.length === 2;
    if (myRole.nightAction) return selectedTarget !== null;
    return false;
  };

  // Jugadores elegibles
  const eligiblePlayers = gameData.players.filter(p => {
    if (!p.alive) return false;
    if (p.id === myPlayerId) return false; // No puede elegirse a sí mismo (excepto médico)
    if (myRole.id === 'medico') return true; // Médico puede protegerse
    return true;
  });

  // Check if already submitted
  const hasSubmitted = gameData.nightActions && gameData.nightActions[myPlayerId];

  // Estudiante only acts in round 1
  const hasAction = myRole.nightAction && (myRole.id !== 'estudiante' || gameData.round === 1);

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-night-gradient p-4 flex items-center justify-center">
        <div className="text-center max-w-md w-full bg-night-deep/70 border-2 border-night-moonlight/30 rounded-2xl p-8 shadow-lg">
          <Moon className="mx-auto mb-4 text-night-moonlight drop-shadow-lg" size={48} />
          <h2 className="text-2xl font-bold text-night-moonlight mb-2">Acción Confirmada</h2>
          <p className="text-night-moonlight/80">Esperando a que los demás terminen...</p>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-gradient p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <Moon className="mx-auto mb-3 text-night-moonlight drop-shadow-lg" size={48} />
          <h1 className="text-3xl font-bold text-night-moonlight mb-2">🌙 Noche - Ronda {gameData.round}</h1>
          <div className="inline-block px-4 py-2 bg-night-deep/70 border-2 border-night-moonlight/30 rounded-xl shadow-lg">
            <span className="text-2xl mr-2">{myRole.emoji}</span>
            <span className="text-lg font-bold text-night-moonlight">{myRole.name}</span>
          </div>
        </div>

        {/* Información de Mafia */}
        {myPlayer.side === 'mafia' && gameData.mafiaMembers && (
          <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/30 rounded-xl">
            <h3 className="font-bold text-red-300 mb-2">🕴️ Compañeros de Mafia:</h3>
            <div className="flex flex-wrap gap-2">
              {gameData.mafiaMembers
                .filter(id => id !== myPlayerId)
                .map(id => {
                  const member = gameData.players.find(p => p.id === id);
                  return member ? (
                    <span key={id} className="px-3 py-1 bg-red-800/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                      {member.name}
                    </span>
                  ) : null;
                })}
            </div>
          </div>
        )}

        {/* Acción Nocturna */}
        {hasAction ? (
          <div className="bg-night-deep/70 border-2 border-night-moonlight/30 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-night-moonlight mb-4">🗡️ Tu Acción en las Sombras</h2>
            <p className="text-night-moonlight/80 mb-6">{myRole.description}</p>

            {/* Opciones de mutilación para Carnicero */}
            {myRole.id === 'carnicero' && (
              <div className="mb-4">
                <label className="block text-night-moonlight font-bold mb-2">Tipo de mutilación:</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMutationType('hand')}
                    className={`flex-1 p-3 rounded-xl border-2 font-bold transition-all ${mutationType === 'hand'
                      ? 'bg-torch-fire border-royal-gold text-white'
                      : 'bg-night-shadow border-night-moonlight/30 text-night-moonlight/70'
                      }`}
                  >
                    ✋ Mano (no vota)
                  </button>
                  <button
                    onClick={() => setMutationType('tongue')}
                    className={`flex-1 p-3 rounded-xl border-2 font-bold transition-all ${mutationType === 'tongue'
                      ? 'bg-torch-fire border-royal-gold text-white'
                      : 'bg-night-shadow border-night-moonlight/30 text-night-moonlight/70'
                      }`}
                  >
                    👅 Lengua (no habla)
                  </button>
                </div>
              </div>
            )}

            {/* Selección de jugadores */}
            <div className="space-y-2">
              <label className="block text-night-moonlight font-bold mb-2">
                {myRole.nightAction === 'swap' ? 'Selecciona DOS jugadores:' : 'Selecciona un jugador:'}
              </label>
              {eligiblePlayers.map(player => {
                const isSelected = myRole.nightAction === 'swap'
                  ? selectedTargets.includes(player.id)
                  : selectedTarget === player.id;

                const hasHandCut = player.mutations?.includes('hand');
                const hasTongueCut = player.mutations?.includes('tongue');

                return (
                  <button
                    key={player.id}
                    onClick={() => {
                      if (myRole.nightAction === 'swap') {
                        if (selectedTargets.includes(player.id)) {
                          setSelectedTargets(selectedTargets.filter(id => id !== player.id));
                        } else if (selectedTargets.length < 2) {
                          setSelectedTargets([...selectedTargets, player.id]);
                        }
                      } else {
                        setSelectedTarget(player.id);
                      }
                    }}
                    className={`w-full p-4 rounded-xl border-2 font-bold transition-all text-left ${isSelected
                      ? 'bg-torch-fire border-royal-gold text-white shadow-lg'
                      : 'bg-night-shadow border-night-moonlight/30 text-night-moonlight hover:border-torch-fire'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{player.name}</span>
                        <div className="flex gap-1">
                          {hasHandCut && <span title="Mano cortada">✋</span>}
                          {hasTongueCut && <span title="Lengua cortada">👅</span>}
                        </div>
                      </div>
                      {isSelected && <span>✅</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full py-4 rounded-xl bg-torch-fire border-2 border-royal-gold text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-royal-gold hover:text-medieval-ink transition-all shadow-lg"
              >
                ⚔️ Confirmar Acción
              </button>

              <button
                onClick={() => onSubmitAction({ type: 'no_action' })}
                className="w-full p-4 bg-transparent border-2 border-night-moonlight/30 text-night-moonlight/70 rounded-xl font-bold hover:bg-night-moonlight/10 hover:text-night-moonlight transition-all"
              >
                No realizar acción
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-night-deep/70 border-2 border-night-moonlight/30 rounded-2xl p-6 text-center shadow-lg">
            <p className="text-night-moonlight/80 text-lg">No tienes acción nocturna. Espera en las sombras a que amanezca...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NightPhaseScreen;
