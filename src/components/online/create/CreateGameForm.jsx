import GameTypeToggle from '../waiting/GameTypeToggle';
import InputField from '../../shared/InputField';
import PlayerCounter from '../../shared/PlayerCounter';

const CreateGameForm = ({
  playerName,
  setPlayerName,
  newGameSettings,
  setNewGameSettings,
  onSubmit,
  getRandomName
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
      {/* Host Name */}
      <InputField
        label="Tu Nombre"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Tu nombre (Host)"
        autoFocus
        onKeyDown={handleKeyDown}
        className="p-4 rounded-2xl text-lg" // Custom large style
      />

      {/* Game Name */}
      <InputField
        label="Nombre de la Partida"
        value={newGameSettings.name}
        onChange={(e) => setNewGameSettings({ ...newGameSettings, name: e.target.value })}
        placeholder="Ej: La Mafia"
        onKeyDown={handleKeyDown}
        className="p-4 rounded-2xl text-lg" // Custom large style
      />

      {/* Players Count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <label className="text-sm font-bold text-brand-wood uppercase tracking-wider">Cantidad de Jugadores</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newGameSettings.players === 0}
              onChange={(e) => setNewGameSettings(s => ({
                ...s,
                players: e.target.checked ? 0 : 4
              }))}
              className="w-4 h-4 accent-brand-bronze"
            />
            <span className="text-xs font-bold text-brand-wood/70">Ilimitados</span>
          </label>
        </div>
        <PlayerCounter
          count={newGameSettings.players}
          onIncrement={() => setNewGameSettings(s => ({ ...s, players: s.players === 0 ? 4 : s.players + 1 }))}
          onDecrement={() => setNewGameSettings(s => ({ ...s, players: s.players === 4 ? 0 : Math.max(4, s.players - 1) }))}
          min={0}
          accordion={false}
        />
      </div>

      {/* Game Type */}
      <GameTypeToggle
        isHost={true}
        currentType={newGameSettings.type}
        onUpdateType={(type) => setNewGameSettings({ ...newGameSettings, type })}
      />
    </div>
  );
};

export default CreateGameForm;
