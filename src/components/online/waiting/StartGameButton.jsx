import PrimaryButton from '../../shared/PrimaryButton';

/**
 * Botón para iniciar el juego
 * Validación: mínimo 4 jugadores
 */
const StartGameButton = ({ isHost, onStart, playerCount }) => {
  const canStart = playerCount >= 4;

  if (!isHost) return null;

  return (
    <div className="mt-auto pt-4 border-t border-noir-gold/10">
      <PrimaryButton
        onClick={onStart}
        disabled={!canStart}
        fullWidth
        className="uppercase tracking-[0.2em]"
      >
        {canStart
          ? 'Initiate Contract'
          : `Waiting for Operatives (${playerCount}/4)`}
      </PrimaryButton>
      {!canStart && (
        <p className="text-center text-[10px] text-noir-smoke/40 mt-3 uppercase tracking-widest">
          Minimum 4 players required to start operation
        </p>
      )}
    </div>
  );
};

export default StartGameButton;
