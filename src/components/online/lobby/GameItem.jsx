import { Users, MessageSquare } from '../../Icons';

const GameItem = ({ game, onJoin }) => {
  return (
    <button
      onClick={() => {
        if (game.status === 'waiting') {
          onJoin(game.id);
        }
      }}
      disabled={game.status !== 'waiting'}
      className={`w-full text-left p-4 flex items-center justify-between group transition-all duration-300 cursor-pointer ${game.status === 'waiting'
        ? 'hover:bg-white/5 hover:pl-6 focus:bg-white/5 focus:pl-6 focus:outline-none'
        : 'opacity-50 cursor-not-allowed'
        }`}
    >
      <div>
        <h3 className="font-serif font-bold text-lg text-noir-gold tracking-wider group-hover:text-white transition-colors">{game.name}</h3>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-noir-smoke/60 mt-1">
          <span className="flex items-center gap-2">
            <Users size={12} /> {game.players}/{game.maxPlayers === 0 ? '∞' : game.maxPlayers}
          </span>
          <span className="flex items-center gap-2">
            {game.type === 'chat' ? <MessageSquare size={12} /> : <Users size={12} />}
            {game.type === 'chat' ? 'CHAT' : 'LIVE'}
          </span>
        </div>
      </div>
      <div className={`px-4 py-1 border border-current text-xs font-bold uppercase tracking-[0.2em] transition-all ${game.status === 'waiting'
        ? 'text-noir-gold border-noir-gold group-hover:bg-noir-gold group-hover:text-noir-bg'
        : 'text-noir-smoke/30 border-noir-smoke/30'
        }`}>
        {game.status === 'waiting' ? 'JOIN' : 'PLAYING'}
      </div>
    </button>
  );
};

export default GameItem;
