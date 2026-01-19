import { memo } from 'react';

const PrimaryButton = ({ onClick, children, disabled = false, className = '', title = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-full py-4 px-6 rounded-sm font-serif font-bold tracking-widest uppercase text-lg 
        bg-noir-surface border border-noir-gold/40 text-noir-gold 
        shadow-[0_0_15px_rgba(0,0,0,0.7)]
        hover:bg-noir-gold hover:text-noir-bg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
        active:scale-[0.98] transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-noir-surface disabled:hover:text-noir-gold
        flex items-center justify-center gap-3 ${className}`}
    >
      {children}
    </button>
  );
};

export default memo(PrimaryButton);
