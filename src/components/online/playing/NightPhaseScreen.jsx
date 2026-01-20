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

  if (!myPlayer || !myPlayer.alive) {
    return (
      <div className="min-h-screen bg-noir-bg flex items-center justify-center p-4">
        <div className="text-center">
          <Moon className="mx-auto mb-6 text-noir-smoke/20" size={64} />
          <h2 className="text-3xl font-serif font-bold text-noir-smoke/40 tracking-[0.2em] uppercase mb-4">FALLECIDO</h2>
          <p className="text-noir-smoke/30 font-serif italic">"Los muertos no cuentan cuentos."</p>
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
      <div className="min-h-screen bg-noir-bg p-4 flex items-center justify-center">
        <div className="text-center max-w-md w-full p-8 border border-noir-gold/20 bg-noir-bg relative">
          <div className="absolute inset-0 bg-noir-gold/5 blur-sm"></div>
          <div className="relative z-10">
            <Moon className="mx-auto mb-6 text-noir-gold" size={48} />
            <h2 className="text-2xl font-serif font-bold text-noir-gold mb-2 tracking-[0.2em] uppercase">ACCIÓN REGISTRADA</h2>
            <p className="text-noir-smoke font-serif italic">Esperando a que la noche termine...</p>
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-noir-gold"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-bg p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 border-b border-noir-gold/10 pb-6">
          <Moon className="mx-auto mb-4 text-noir-gold" size={40} />
          <h1 className="text-3xl font-serif font-bold text-noir-gold mb-2 tracking-[0.2em] text-glow">
            NOCHE {gameData.round}
          </h1>
          <div className="mb-4 text-noir-smoke/50 font-mono text-sm tracking-widest">
            {timeLeft}s RESTANTES
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-noir-gold/30 bg-black/40 backdrop-blur-sm">
            <span className="text-2xl filter grayscale opacity-80">{myRole.emoji}</span>
            <span className="text-lg font-bold text-noir-gold uppercase tracking-wider">{myRole.name}</span>
          </div>
        </div>

        {/* Información de Mafia */}
        {myPlayer.side === 'mafia' && gameData.mafiaMembers && (
          <div className="mb-8 p-6 bg-noir-blood/5 border border-noir-blood/30">
            <h3 className="font-bold text-noir-blood mb-4 uppercase tracking-[0.2em] text-xs">LA FAMIGLIA</h3>
            <div className="flex flex-wrap gap-3">
              {gameData.mafiaMembers
                .filter(id => id !== myPlayerId)
                .map(id => {
                  const member = gameData.players.find(p => p.id === id);
                  return member ? (
                    <span key={id} className="px-3 py-1 bg-noir-blood/10 border border-noir-blood/30 text-noir-blood text-sm font-serif tracking-wide">
                      {member.name}
                    </span>
                  ) : null;
                })}
            </div>
          </div>
        )}

        {/* Acción Nocturna */}
        {hasAction ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-serif font-bold text-noir-paper mb-2 tracking-wider">ELIGE TU OBJETIVO</h2>
              <p className="text-noir-smoke/60 text-sm italic font-serif max-w-md mx-auto">{myRole.description}</p>
            </div>

            {/* Opciones de mutilación para Carnicero */}
            {myRole.id === 'carnicero' && (
              <div className="mb-6 border-t border-b border-noir-gold/10 py-4">
                <label className="block text-noir-gold/50 font-bold mb-3 text-xs uppercase tracking-[0.2em] text-center">TIPO DE MUTILACIÓN</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setMutationType('hand')}
                    className={`flex-1 p-4 border transition-all uppercase tracking-widest text-sm font-bold ${mutationType === 'hand'
                      ? 'bg-noir-blood text-black border-noir-blood'
                      : 'bg-transparent border-noir-smoke/20 text-noir-smoke hover:border-noir-blood/50'
                      }`}
                  >
                    ✋ MANO
                  </button>
                  <button
                    onClick={() => setMutationType('tongue')}
                    className={`flex-1 p-4 border transition-all uppercase tracking-widest text-sm font-bold ${mutationType === 'tongue'
                      ? 'bg-noir-blood text-black border-noir-blood'
                      : 'bg-transparent border-noir-smoke/20 text-noir-smoke hover:border-noir-blood/50'
                      }`}
                  >
                    👅 LENGUA
                  </button>
                </div>
              </div>
            )}

            {/* Selección de jugadores */}
            <div className="grid gap-3">
              <label className="block text-noir-gold/50 font-bold mb-1 text-xs uppercase tracking-[0.2em] text-center">
                {myRole.nightAction === 'swap' ? 'Selecciona DOS objetivos:' : 'Selecciona UN objetivo:'}
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
                    className={`w-full p-4 border transition-all text-left flex items-center justify-between group ${isSelected
                      ? 'bg-noir-gold text-black border-noir-gold'
                      : 'bg-black/40 border-noir-gold/20 text-noir-paper hover:border-noir-gold hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-serif tracking-wider ${isSelected ? 'font-bold' : ''}`}>{player.name}</span>
                      <div className="flex gap-1">
                        {hasHandCut && <span title="Sin mano" className="opacity-50 grayscale">✋</span>}
                        {hasTongueCut && <span title="Sin lengua" className="opacity-50 grayscale">👅</span>}
                      </div>
                    </div>
                    {isSelected && <div className="w-2 h-2 bg-black rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-noir-gold/10">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full py-4 bg-noir-gold text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                CONFIRMAR ACCIÓN
              </button>

              <button
                onClick={() => onSubmitAction({ type: 'no_action' })}
                className="w-full py-4 bg-transparent border border-noir-smoke/20 text-noir-smoke/50 font-bold uppercase tracking-[0.2em] hover:text-noir-smoke hover:border-noir-smoke transition-all text-xs"
              >
                OMITIR ACCIÓN
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-noir-gold/10 bg-black/20 text-center">
            <p className="text-noir-smoke/60 font-serif italic">No tienes asuntos esta noche. Permanece en las sombras.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NightPhaseScreen;
