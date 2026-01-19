import { memo } from 'react';

const SlidingToggle = ({
  value,
  onChange,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  className = ""
}) => {
  const isLeft = value === leftValue;

  return (
    <div className={`inline-flex bg-black/40 rounded-full p-1 border border-noir-gold/30 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(leftValue)}
        className={`px-6 py-2 rounded-full font-serif font-bold text-sm tracking-widest transition-all duration-300 ${isLeft
          ? 'bg-noir-gold text-noir-bg shadow-[0_0_10px_rgba(212,175,55,0.4)]'
          : 'text-noir-gold/60 hover:text-noir-gold hover:bg-white/5'
          }`}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(rightValue)}
        className={`px-6 py-2 rounded-full font-serif font-bold text-sm tracking-widest transition-all duration-300 ${!isLeft
          ? 'bg-noir-gold text-noir-bg shadow-[0_0_10px_rgba(212,175,55,0.4)]'
          : 'text-noir-gold/60 hover:text-noir-gold hover:bg-white/5'
          }`}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default memo(SlidingToggle);
