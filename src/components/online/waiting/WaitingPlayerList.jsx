const WaitingPlayerList = ({ players, hostId }) => (
  <div className="flex-1 overflow-y-auto mb-6 px-1 scrollbar-thin scrollbar-thumb-noir-gold/50 scrollbar-track-transparent">
    <h3 className="text-xs font-bold text-noir-gold/50 uppercase tracking-[0.2em] mb-3 ml-1">Jugadores</h3>
    <div className="space-y-2">
      {players.map((p, i) => (
        <div key={p.id} className="bg-white/5 p-3 flex items-center gap-4 border border-noir-gold/10 hover:border-noir-gold/30 transition-all">
          <div className="w-6 h-6 rounded-full border border-noir-gold/50 text-noir-gold flex items-center justify-center font-serif text-xs font-bold">
            {i + 1}
          </div>
          <span className="font-bold text-noir-paper flex-1 font-serif tracking-wider">{p.name}</span>
          {p.id === hostId && (
            <span className="text-[10px] font-bold border border-noir-gold text-noir-gold px-2 py-0.5 uppercase tracking-widest">Host</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default WaitingPlayerList;
