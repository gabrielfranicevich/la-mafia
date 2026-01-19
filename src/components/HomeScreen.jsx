import { Play, Users } from './Icons';
import PrimaryButton from './shared/PrimaryButton';

const HomeScreen = ({ setScreen }) => (
  <div className="p-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
    <div className="mb-16 text-center animate-flicker">
      <h1 className="text-8xl font-serif font-bold text-noir-gold tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] mb-4">
        OMERTÀ
      </h1>
      <p className="text-noir-gold/60 text-xl font-sans tracking-[0.5em] uppercase border-t border-b border-noir-gold/20 py-2 inline-block">
        La Mafia
      </p>
    </div>

    <div className="w-full max-w-md space-y-8">
      <PrimaryButton
        onClick={() => {
          setScreen('setup');
          window.history.pushState(null, '', '/offline');
        }}
        className="group"
      >
        <Play size={24} className="text-noir-gold group-hover:scale-110 transition-transform" />
        <span>Jugar Offline</span>
      </PrimaryButton>

      <PrimaryButton
        onClick={() => {
          setScreen('online_lobby');
          window.history.pushState(null, '', '/online');
        }}
        className="group"
      >
        <Users size={24} className="text-noir-gold group-hover:scale-110 transition-transform" />
        <span>Jugar Online</span>
      </PrimaryButton>
    </div>

    <div className="absolute bottom-8 text-noir-gold/20 text-xs tracking-widest font-serif">
      EST. 1920
    </div>
  </div>
);

export default HomeScreen;
