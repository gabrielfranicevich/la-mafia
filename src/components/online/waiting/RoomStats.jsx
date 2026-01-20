import { Users, MessageSquare } from '../../Icons';

const RoomStats = ({ currentPlayers, maxPlayers, gameType }) => (
  <div className="bg-black/30 p-4 border-y border-noir-gold/10 mb-8 text-center backdrop-blur-md">
    <div className="flex items-center justify-center gap-8 text-noir-gold font-bold">
      <div className="flex items-center gap-3">
        <Users size={16} />
        <span className="tracking-widest font-serif">{currentPlayers}/{maxPlayers === 2 ? '∞' : maxPlayers}</span>
      </div>
      <div className="w-px h-6 bg-noir-gold/20"></div>
      <div className="flex items-center gap-3">
        {gameType === 'chat' ? <MessageSquare size={16} /> : <Users size={16} />}
        <span className="uppercase text-xs tracking-[0.2em]">{gameType === 'chat' ? 'CHAT' : 'EN PERSONA'}</span>
      </div>
    </div>
  </div>
);

export default RoomStats;
