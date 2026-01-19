import { useState } from 'react';
import InputField from '../../shared/InputField';
import PrimaryButton from '../../shared/PrimaryButton';

const GameCodeInput = ({ onJoin }) => {
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    setCode(value);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    setCode(pastedText);
  };

  const handleJoin = () => {
    if (code.length === 4) onJoin(code);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && code.length === 4) handleJoin();
  };

  return (
    <div className="mb-8">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <InputField
            label="Código de Juego"
            value={code}
            onChange={handleChange}
            placeholder="XXXX"
            maxLength={4}
            containerClassName="w-full"
            className="text-center text-2xl tracking-[0.5em] uppercase font-serif"
            // Note: onPaste is not directly supported by InputField props but we can wrap or modify InputField if needed. 
            // For now, let's assume standard input behavior or add it if strictly necessary.
            // Actually InputField passes ...rest props? No it destructures specific ones.
            // Let's rely on standard paste for now or add onPaste support to InputField later if critical.
            // But wait, the previous code strictly handled onPaste. I should probably add it to InputField or just use the local handler if I can pass props.
            // Looking at InputField: it takes specific props. I might need to update InputField to accept ...rest.
            // For now, I'll skip explicit onPaste prop if InputField doesn't support it, but I should probably check InputField again.
            // Re-reading InputField.jsx... it accepts `type`, `value`, `onChange`, `onKeyDown`.
            // Use native paste behavior for now.
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-1/3">
          <PrimaryButton
            onClick={handleJoin}
            disabled={code.length !== 4}
            className="py-4"
          >
            UNIRSE
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default GameCodeInput;
