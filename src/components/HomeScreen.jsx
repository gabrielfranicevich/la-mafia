import { Play, Users } from './Icons';

const HomeScreen = ({ setScreen }) => (
  <div className="p-8 relative z-10 flex flex-col items-center justify-center min-h-[500px]">
    <div className="mb-12 text-center transform hover:scale-105 transition-transform duration-500">
      <div className="text-8xl mb-4 filter drop-shadow-xl">⚔️</div>
      <h1 className="text-6xl font-bold text-medieval-ink tracking-wider drop-shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>
        LA MAFIA
      </h1>
    </div>

    <div className="w-full space-y-6">
      <button
        onClick={() => {
          setScreen('setup');
          window.history.pushState(null, '', '/offline');
        }}
        className="w-full bg-wood-brown text-medieval-parchment py-6 rounded-2xl font-bold text-2xl shadow-[4px_4px_0px_0px_rgba(44,24,16,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(44,24,16,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(44,24,16,1)] transition-all flex items-center justify-center gap-4 border-2 border-medieval-ink group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        <Play size={32} className="group-hover:scale-110 transition-transform relative z-10" />
        <span className="relative z-10">Jugar Offline</span>
      </button>

      <button
        onClick={() => {
          setScreen('online_lobby');
          window.history.pushState(null, '', '/online');
        }}
        className="w-full bg-royal-gold text-medieval-ink py-6 rounded-2xl font-bold text-2xl shadow-[4px_4px_0px_0px_rgba(44,24,16,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(44,24,16,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(44,24,16,1)] transition-all flex items-center justify-center gap-4 border-2 border-medieval-ink group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10"></div>
        <Users size={32} className="group-hover:scale-110 transition-transform relative z-10" />
        <span className="relative z-10">Jugar Online</span>
      </button>
    </div>
  </div>
);

export default HomeScreen;
