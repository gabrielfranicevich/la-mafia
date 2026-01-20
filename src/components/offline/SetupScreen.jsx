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
      className="w-full flex items-center justify-between p-4 border-b border-noir-gold/20 hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="text-noir-gold group-hover:scale-110 transition-transform duration-300">
          <Edit2 size={20} />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-serif font-bold text-noir-gold leading-tight tracking-widest uppercase">NOMBRES</h2>
          <span className="text-xs text-noir-smoke font-bold uppercase tracking-wide">
            {playerNames.slice(0, numPlayers).filter(n => n.trim()).length}/{numPlayers} LISTOS
          </span>
        </div>
      </div>
      {expanded ? <ChevronUp size={20} className="text-noir-gold/50" /> : <ChevronDown size={20} className="text-noir-gold/50" />}
    </button>

    {expanded && (
      <div className="animate-in fade-in slide-in-from-top-2 duration-300 py-4">
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
                className="w-12 h-12 flex items-center justify-center border border-noir-gold/30 text-noir-gold hover:bg-noir-gold hover:text-black transition-all"
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

  <div className="p-6 relative z-10 max-w-2xl mx-auto min-h-screen flex flex-col">
    <div className="mb-8">
      <div className="flex justify-start">
        <button
          onClick={() => setScreen('home')}
          className="p-3 text-noir-gold/50 hover:text-noir-gold hover:bg-white/5 rounded-full transition-all"
          title="Volver al inicio"
        >
          <ArrowLeft size={32} />
        </button>
      </div>
      <h1 className="text-[clamp(1rem,3.5vw,2.5rem)] font-serif font-bold text-noir-gold tracking-tight drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] uppercase text-center w-full -mt-2 px-2">
        CONFIGURACIÓN
      </h1>
    </div>

    <div className="flex-1">
      <PlayerCounter
        count={numPlayers}
        onIncrement={addPlayer}
        onDecrement={removePlayer}
        expanded={playersExpanded}
        onToggleExpand={() => setPlayersExpanded(!playersExpanded)}
        min={4}
        showMax={false}
        label="JUGADORES"
        subLabel={`${numPlayers} PERSONAS`}
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
    </div>

    <div className="mt-8">
      <PrimaryButton onClick={startGame} className="uppercase tracking-[0.2em]">
        <Play size={24} className="mr-2" />
        INICIAR PARTIDA
      </PrimaryButton>
    </div>
  </div>
);

export default SetupScreen;
