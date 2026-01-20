import { useState } from 'react';
import { ArrowLeft, Check, Copy } from '../../Icons';

const WaitingRoomHeader = ({ roomName, roomId, onLeave }) => {
  const [copied, setCopied] = useState(false);

  const copyGameCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
      } else {
        // Fallback for non-secure contexts (http on LAN)
        const textArea = document.createElement("textarea");
        textArea.value = roomId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="relative mb-8 flex flex-col items-center justify-center border-b border-noir-gold/20 pb-4">
        <button
          onClick={onLeave}
          className="absolute left-0 p-2 text-noir-gold hover:text-white transition-colors"
          title="BACK"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-noir-gold/50 uppercase tracking-[0.4em] mb-1">SALA</h1>
          <h2 className="text-3xl font-serif font-bold text-noir-gold tracking-widest text-glow">{roomName}</h2>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-sm border border-noir-gold/20 mb-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-noir-smoke uppercase tracking-[0.2em]">CÓDIGO</span>
            <div className="text-4xl font-serif font-bold text-noir-gold tracking-[0.5em] mt-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{roomId}</div>
          </div>
          <button
            onClick={copyGameCode}
            className={`p-3 border transition-all duration-300 ${copied
              ? 'bg-noir-gold border-noir-gold text-noir-bg shadow-[0_0_15px_rgba(212,175,55,0.5)]'
              : 'bg-transparent border-noir-gold/50 text-noir-gold hover:bg-noir-gold hover:text-noir-bg'
              }`}
            title={copied ? 'COPIED' : 'COPY'}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default WaitingRoomHeader;
