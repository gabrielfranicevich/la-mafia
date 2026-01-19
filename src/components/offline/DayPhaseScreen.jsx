import PrimaryButton from '../shared/PrimaryButton';

const DayPhaseScreen = ({ gameData, executePlayer }) => {
  if (!gameData) return null;

  const { players, playerStates, events } = gameData;
  const alivePlayers = playerStates.filter(p => p.alive);

  return (
    <div className="p-6 flex flex-col h-[600px] relative z-10 bg-day-warm-light/90">
      <div className="text-center mb-6">
        <div className="text-6xl mx-auto mb-4 animate-pulse-slow">☀️</div>
        <h1 className="text-4xl font-bold text-medieval-ink tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          AMANECER
        </h1>
        <p className="text-medieval-ink/70 mt-2">Día {gameData.round || 1}</p>
      </div>

      {/* Events Log */}
      <div className="mb-6 bg-white/80 p-4 rounded-xl border-2 border-medieval-stone shadow-inner max-h-40 overflow-y-auto">
        <h3 className="font-bold text-medieval-ink mb-2 uppercase text-sm tracking-wide border-b border-medieval-stone/20 pb-1">
          Reporte de la noche
        </h3>
        {events && events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event, idx) => (
              <li key={idx} className={`flex items-start gap-2 text-sm ${event.type === 'death' ? 'text-red-700 font-bold' :
                event.type === 'info' ? 'text-blue-700' :
                  'text-medieval-ink'
                }`}>
                <span>
                  {event.type === 'death' && '💀'}
                  {event.type === 'info' && '🛡️'}
                  {event.type === 'mutilation' && '⚔️'}
                </span>
                {event.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-medieval-ink/60 italic">Una noche tranquila. Nadie ha muerto.</p>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <h3 className="text-center font-bold text-medieval-ink mb-4">Votación del Pueblo</h3>
        <p className="text-center text-sm text-medieval-ink/70 mb-4">
          Selecciona a quién ejecutar o pasa al anochecer.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {alivePlayers.map(p => (
            <button
              key={p.id}
              onClick={() => {
                if (window.confirm(`¿Estás seguro de ejecutar a ${players[p.id]}?`)) {
                  executePlayer(p.id);
                }
              }}
              className="p-3 bg-medieval-paper border border-medieval-stone/50 rounded-lg text-medieval-ink hover:bg-red-50 hover:border-red-500 hover:text-red-800 transition-all font-bold flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-2">
                <span>💀 {players[p.id]}</span>
              </div>
              <div className="flex gap-1">
                {p.mutations.includes('hand') && <span title="Mano cortada">✋</span>}
                {p.mutations.includes('tongue') && <span title="Lengua cortada">👅</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <PrimaryButton
          onClick={() => executePlayer(null)} // Null means no execution
          className="bg-medieval-stone text-white hover:bg-medieval-dark-stone border-medieval-ink"
        >
          Saltar Votación (Anochecer)
        </PrimaryButton>
      </div>
    </div>
  );
};

export default DayPhaseScreen;
