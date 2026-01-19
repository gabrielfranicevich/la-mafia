import { useState, useEffect } from 'react';
import { Eye } from '../Icons';
import { ROLES } from '../../data/gameRoles';
import InputField from '../shared/InputField';
import PrimaryButton from '../shared/PrimaryButton';

/**
 * Night Phase Screen - Turn-based offline gameplay
 */
const NightPhaseScreen = ({
  gameData,
  currentNightPlayer,
  submitNightAction,
  getCurrentNightRole
}) => {
  const [selectedTargets, setSelectedTargets] = useState([]); // Array for multi-target
  const [mutationType, setMutationType] = useState('hand');
  const [canContinue, setCanContinue] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7);
  const [isTurnStarted, setIsTurnStarted] = useState(false);

  // Investigation Result State
  const [investigationResult, setInvestigationResult] = useState(null);

  if (!gameData || !gameData.playerStates) return null;

  const alivePlayers = gameData.playerStates.filter(p => p.alive);
  const currentPlayerState = alivePlayers[currentNightPlayer];

  if (!currentPlayerState) return null;

  const currentPlayerName = gameData.players[currentPlayerState.id];
  const roleId = getCurrentNightRole();
  const role = ROLES[roleId];

  // Minimum time timer
  useEffect(() => {
    // Reset state on new player
    setSelectedTargets([]);
    setInvestigationResult(null);
    setMutationType('hand');

    if (isTurnStarted) {
      setCanContinue(false);
      setTimeRemaining(7);

      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanContinue(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTurnStarted, role, currentNightPlayer]);

  const handleStartTurn = () => {
    setIsTurnStarted(true);
  };

  const handleTargetClick = (targetId) => {
    if (role.nightAction === 'swap') {
      // Espejo: Select 2 targets
      if (selectedTargets.includes(targetId)) {
        setSelectedTargets(prev => prev.filter(id => id !== targetId));
      } else {
        if (selectedTargets.length < 2) {
          setSelectedTargets(prev => [...prev, targetId]);
        }
      }
    } else {
      // Single target roles
      setSelectedTargets([targetId]);
    }
  };

  const handleSubmitAction = () => {
    if (!role?.nightAction) {
      submitNightAction({ type: 'no_action' });
      setIsTurnStarted(false); // Reset for next
      return;
    }

    // Special handling for Police
    if (role.nightAction === 'investigate') {
      const targetId = selectedTargets[0];
      const targetRoleId = gameData.roles[targetId];
      const targetRole = ROLES[targetRoleId];
      const isBad = targetRole.detectsAsBad;

      setInvestigationResult({
        name: gameData.players[targetId],
        isBad
      });
      return; // Don't submit yet, wait for user to close result
    }

    // Submit Action
    const payload = { type: role.nightAction };

    if (role.nightAction === 'mutilate') {
      payload.target = selectedTargets[0];
      payload.mutationType = mutationType;
    } else if (role.nightAction === 'swap') {
      payload.target1 = selectedTargets[0];
      payload.target2 = selectedTargets[1];
      payload.target = selectedTargets; // Keep generic target too just in case
    } else {
      payload.target = selectedTargets[0];
    }

    submitNightAction(payload);
    setIsTurnStarted(false);
  };

  const handleConfirmInvestigation = () => {
    submitNightAction({
      type: 'investigate',
      target: selectedTargets[0]
    });
    setIsTurnStarted(false);
  };

  const canSubmit = () => {
    if (!canContinue) return false;

    if (!role?.nightAction) return true;

    if (role.nightAction === 'swap') {
      return selectedTargets.length === 2;
    }

    if (['kill_group', 'investigate', 'protect', 'block', 'mutilate', 'choose_master'].includes(role.nightAction)) {
      return selectedTargets.length === 1;
    }

    return false;
  };

  // 1. Pass Phone Screen
  if (!isTurnStarted) {
    return (
      <div className="p-6 flex flex-col h-[600px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 rounded-full bg-night-deep/70 text-night-moonlight font-bold text-xs uppercase tracking-widest mb-3">
            Noche - Turno {currentNightPlayer + 1} / {alivePlayers.length}
          </div>
          <h2 className="text-2xl font-bold text-night-moonlight">Turno de Noche</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <Eye size={64} className="mx-auto mb-4 text-night-moonlight drop-shadow-lg" />
            <p className="text-night-moonlight/80 mb-2">Pasa el teléfono a:</p>
            <p className="text-3xl font-bold text-night-moonlight mb-6">{currentPlayerName}</p>
          </div>

          <PrimaryButton
            onClick={handleStartTurn}
            className="w-full max-w-sm"
          >
            Soy {currentPlayerName}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // 2. Investigation Result Screen
  if (investigationResult) {
    return (
      <div className="p-6 flex flex-col h-[600px] relative z-10 bg-night-gradient items-center justify-center">
        <div className="bg-white/90 p-8 rounded-xl text-center border-4 border-royal-gold shadow-2xl max-w-sm">
          <h3 className="text-xl font-bold text-medieval-ink mb-4">Resultado de la Investigación</h3>
          <p className="mb-6 text-lg">
            <span className="font-bold">{investigationResult.name}</span> es:
          </p>
          <div className={`text-4xl font-bold mb-8 ${investigationResult.isBad ? 'text-red-600' : 'text-blue-600'}`}>
            {investigationResult.isBad ? 'CULPABLE (Malo)' : 'INOCENTE (Bueno)'}
          </div>
          <PrimaryButton onClick={handleConfirmInvestigation}>
            Entendido
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // 3. Role Action Screen
  return (
    <div className="p-6 flex flex-col h-[600px] relative z-10 bg-night-gradient">
      <div className="text-center mb-4">
        <div className="inline-block px-4 py-1 rounded-full bg-night-deep/70 text-night-moonlight font-bold text-xs uppercase tracking-widest mb-2">
          Noche - Turno {currentNightPlayer + 1} / {alivePlayers.length}
        </div>
        {role && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">{role.emoji}</span>
            <h2 className="text-xl font-bold text-night-moonlight">{role.name}</h2>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!role?.nightAction ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌙</div>
            <p className="text-lg text-night-moonlight mb-4">No tienes acción nocturna</p>
            {!canContinue && (
              <p className="text-sm text-night-moonlight/60">Espera {timeRemaining} segundos...</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-night-moonlight/80 mb-4 text-center text-sm px-4">{role.description}</p>

            {/* Carnicero Mutation Type */}
            {role.id === 'carnicero' && (
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
                    ✋ Mano
                  </button>
                  <button
                    onClick={() => setMutationType('tongue')}
                    className={`flex-1 p-3 rounded-xl border-2 font-bold transition-all ${mutationType === 'tongue'
                      ? 'bg-torch-fire border-royal-gold text-white'
                      : 'bg-night-shadow border-night-moonlight/30 text-night-moonlight/70'
                      }`}
                  >
                    👅 Lengua
                  </button>
                </div>
              </div>
            )}

            {/* Target Selection */}
            <div className="space-y-2">
              <label className="block text-night-moonlight font-bold mb-2">
                {role.id === 'espejo' ? 'Selecciona DOS jugadores:' : 'Selecciona un jugador:'}
              </label>
              {alivePlayers.map(playerState => {
                const isSelected = selectedTargets.includes(playerState.id);
                const hasHandCut = playerState.mutations.includes('hand');
                const hasTongueCut = playerState.mutations.includes('tongue');

                return (
                  <button
                    key={playerState.id}
                    onClick={() => handleTargetClick(playerState.id)}
                    className={`w-full p-4 rounded-xl border-2 font-bold transition-all text-left flex justify-between items-center ${isSelected
                      ? 'bg-torch-fire border-royal-gold text-white shadow-lg'
                      : 'bg-night-shadow border-night-moonlight/30 text-night-moonlight hover:border-torch-fire'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{gameData.players[playerState.id]}</span>
                      <div className="flex gap-1">
                        {hasHandCut && <span title="Mano cortada">✋</span>}
                        {hasTongueCut && <span title="Lengua cortada">👅</span>}
                      </div>
                    </div>
                    {isSelected && <span>✅</span>}
                  </button>
                );
              })}
            </div>

            {/* Timer for action players */}
            {!canContinue && (
              <p className="text-sm text-night-moonlight/60 text-center mt-4">Espera {timeRemaining} segundos para confirmar...</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <PrimaryButton
          onClick={handleSubmitAction}
          disabled={!canSubmit()}
        >
          {!role?.nightAction ? 'Continuar' : 'Confirmar Acción'}
        </PrimaryButton>

        {role?.nightAction && (
          <button
            onClick={() => {
              submitNightAction({ type: 'no_action' });
              setIsTurnStarted(false);
            }}
            className="w-full p-4 bg-transparent border-2 border-night-moonlight/30 text-night-moonlight/70 rounded-xl font-bold hover:bg-night-moonlight/10 hover:text-night-moonlight transition-all"
          >
            No realizar acción
          </button>
        )}
      </div>
    </div>
  );
};

export default NightPhaseScreen;
