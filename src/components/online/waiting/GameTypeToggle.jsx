import { MessageSquare, Users } from '../../Icons';

/**
 * Toggle para cambiar el tipo de juego entre Chat y En Persona
 * Solo visible y funcional para el host
 */
const GameTypeToggle = ({ isHost, currentType, onUpdateType }) => {
  if (!isHost) return null;

  return (
    <div className="mb-6">
      <label className="text-sm font-bold text-noir-gold uppercase tracking-wider ml-1 mb-3 block">
        Tipo de Juego
      </label>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onUpdateType('chat')}
          className={`p-3 rounded-xl border-2 text-center transition-all ${currentType === 'chat'
            ? 'bg-noir-gold text-noir-deep border-noir-gold shadow-[3px_3px_0px_0px_rgba(212,175,55,0.3)]'
            : 'bg-white/5 text-noir-gold/60 border-noir-gold/30 hover:bg-white/10 hover:border-noir-gold/60 hover:text-noir-gold'
            }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg transition-colors ${currentType === 'chat' ? 'bg-noir-deep/20' : 'bg-black/40 group-hover:bg-black/60'}`}>
              <MessageSquare size={20} />
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">Chat</span>
          </div>
        </button>

        <button
          onClick={() => onUpdateType('in_person')}
          className={`p-3 rounded-xl border-2 text-center transition-all ${currentType === 'in_person'
            ? 'bg-noir-gold text-noir-deep border-noir-gold shadow-[3px_3px_0px_0px_rgba(212,175,55,0.3)]'
            : 'bg-white/5 text-noir-gold/60 border-noir-gold/30 hover:bg-white/10 hover:border-noir-gold/60 hover:text-noir-gold'
            }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg transition-colors ${currentType === 'in_person' ? 'bg-noir-deep/20' : 'bg-black/40 group-hover:bg-black/60'}`}>
              <Users size={20} />
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">En persona</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GameTypeToggle;
