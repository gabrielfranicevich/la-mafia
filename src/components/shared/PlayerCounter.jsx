import { memo } from 'react';
import { Users, ChevronUp, ChevronDown } from '../Icons';

const PlayerCounter = ({
  count,
  onIncrement,
  onDecrement,
  min,
  max,
  label = "Jugadores",
  subLabel = "",
  accordion = true,
  expanded = true,
  onToggleExpand,
  showMax = false // Show MAX MONOS text
}) => {
  const displayCount = count === 0 ? '∞' : count;
  const isMin = count <= min;
  const isMax = count >= max;

  const CounterControls = () => (
    <div className="flex items-center gap-4">
      <button
        onClick={onDecrement}
        disabled={isMin}
        className="w-12 h-12 flex items-center justify-center border border-noir-gold/30 text-noir-gold hover:bg-noir-gold hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed"
      >
        -
      </button>
      <div className="flex-1 text-center">
        <div className="text-5xl font-serif font-bold text-noir-gold">{displayCount}</div>
        {showMax && typeof max === 'number' && (
          <div className="text-xs font-bold uppercase text-noir-smoke tracking-widest mt-1">
            MÁX MAFIA: {Math.ceil(count / 2) - 1}
          </div>
        )}
      </div>
      <button
        onClick={onIncrement}
        disabled={isMax}
        className="w-12 h-12 flex items-center justify-center border border-noir-gold/30 text-noir-gold hover:bg-noir-gold hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );

  if (!accordion) {
    return (
      <div className="bg-black/20 p-2 border border-noir-gold/20">
        <CounterControls />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 border-b border-noir-gold/20 hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="text-noir-gold group-hover:scale-110 transition-transform duration-300">
            <Users size={20} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-serif font-bold text-noir-gold leading-tight tracking-widest uppercase">{label}</h2>
            <span className="text-xs text-noir-smoke font-bold uppercase tracking-wide">{subLabel || `${count} PERSONAS`}</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} className="text-noir-gold/50" /> : <ChevronDown size={20} className="text-noir-gold/50" />}
      </button>

      {expanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 py-4">
          <CounterControls />
        </div>
      )}
    </div>
  );
};

export default memo(PlayerCounter);
