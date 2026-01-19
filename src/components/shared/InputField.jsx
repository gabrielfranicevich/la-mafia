import { memo } from 'react';

const InputField = ({
  value,
  onChange,
  placeholder = '',
  label = null,
  type = 'text',
  autoFocus = false,
  onKeyDown,
  className = '',
  containerClassName = '',
  ...rest
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold text-noir-gold/70 uppercase tracking-[0.2em] ml-1 block border-l-2 border-noir-gold pl-2">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          {...rest}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          className={`w-full p-4 bg-black/40 border-b-2 border-noir-gold/30 text-noir-paper placeholder-noir-smoke/20 font-serif tracking-wide
            focus:border-noir-gold focus:outline-none focus:bg-black/60 transition-all duration-300
            ${className}`}
        />
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-noir-gold transition-all duration-500 group-focus-within:w-full opacity-50 shadow-[0_0_10px_#D4AF37]" />
      </div>
    </div>
  );
};

export default memo(InputField);
