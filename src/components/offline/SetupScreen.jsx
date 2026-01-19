import { memo } from 'react';
import { ArrowLeft, Edit2, ChevronUp, ChevronDown, Play } from '../Icons';

import PlayerCounter from '../shared/PlayerCounter';
import RoleSelector from '../shared/RoleSelector';
import PrimaryButton from '../shared/PrimaryButton';
import InputField from '../shared/InputField';

const NameEditor = memo(({ playerNames, numPlayers, updatePlayerName, generateRandomName, expanded, setExpanded }) => (
  <div className="mb-8">
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-medieval-aged-parchment/30 transition-all border-2 border-medieval-dark-stone shadow-[4px_4px_0px_0px_rgba(74,76,58,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(74,76,58,1)]"
    >
      <div className="flex items-center gap-3">
        <div className="bg-royal-purple/20 p-2 rounded-lg text-medieval-ink">
          <Edit2 size={20} />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-bold text-medieval-ink leading-tight">Nombres</h2>
          <span className="text-xs text-medieval-ink/70 font-bold uppercase tracking-wide">
            {playerNames.slice(0, numPlayers).filter(n => n.trim()).length}/{numPlayers} listos
          </span>
        </div>
      </div>
      {expanded ? <ChevronUp size={24} className="text-medieval-ink" /> : <ChevronDown size={24} className="text-medieval-ink" />}
    </button>
    {expanded && (
      <div className="mt-4 p-4 bg-medieval-stone/10 rounded-2xl border-2 border-medieval-dark-stone/10 border-dashed">
        <div className="space-y-3">
          {Array.from({ length: numPlayers }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1">
                <InputField
                  placeholder={`Jugador ${i + 1}`}
                  value={playerNames[i] || ''}
                  onChange={(e) => updatePlayerName(i, e.target.value)}
                  containerClassName="space-y-0"
                />
              </div>
              <button
                onClick={() => generateRandomName(i)}
                className="w-12 h-12 rounded-xl bg-royal-gold border-2 border-medieval-ink text-medieval-ink hover:bg-medieval-ink hover:text-medieval-parchment transition-all flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(44,24,16,1)] active:translate-y-0.5 active:shadow-none"
                title="Nombre aleatorio"
              >
                <Edit2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
));

const SetupScreen = ({
  setScreen, selectedRoles, toggleRole, rolesExpanded, setRolesExpanded,
  numPlayers, addPlayer, removePlayer, playersExpanded, setPlayersExpanded,
  playerNames, updatePlayerName, generateRandomName, namesExpanded, setNamesExpanded,
  startGame
}) => (

  <div className="p-6 relative z-10">
    <div className="relative mb-8 flex items-center justify-center">
      <button
        onClick={() => setScreen('home')}
        className="absolute left-0 p-2 rounded-xl hover:bg-medieval-stone/20 text-medieval-ink transition-all active:scale-95"
        title="Volver al inicio"
      >
        <ArrowLeft size={28} />
      </button>
      <h1 className="text-4xl font-bold text-medieval-ink tracking-wider drop-shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>
        ⚔️ LA MAFIA ⚔️
      </h1>
    </div>

    <PlayerCounter
      count={numPlayers}
      onIncrement={addPlayer}
      onDecrement={removePlayer}
      expanded={playersExpanded}
      onToggleExpand={() => setPlayersExpanded(!playersExpanded)}
      min={4}
      showMax={false}
    />

    <RoleSelector
      selectedRoles={selectedRoles}
      onUpdateRole={toggleRole}
      totalPlayers={numPlayers}
      expanded={rolesExpanded}
      setExpanded={setRolesExpanded}
      isHost={true}
    />

    <NameEditor
      playerNames={playerNames}
      numPlayers={numPlayers}
      updatePlayerName={updatePlayerName}
      generateRandomName={generateRandomName}
      expanded={namesExpanded}
      setExpanded={setNamesExpanded}
    />

    <PrimaryButton onClick={startGame}>
      <Play size={28} />
      JUGAR AHORA
    </PrimaryButton>
  </div>
);

export default SetupScreen;
