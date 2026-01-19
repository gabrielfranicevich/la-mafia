import PrimaryButton from '../../shared/PrimaryButton';

/**
 * Botón para iniciar el juego
 * Validación: mínimo 4 jugadores
 */
const StartGameButton = ({ isHost, onStart, playerCount }) => {
  const canStart = playerCount >= 4;

  if (!isHost) return null;

  return (
    <div className="mt-auto pt-4">
      <PrimaryButton
        onClick={onStart}
        disabled={!canStart}
        fullWidth
      >
        {canStart
          ? '🎮 Iniciar Juego'
          : `⏳ Esperando jugadores (${playerCount}/4 mínimo)`}
      </PrimaryButton>
      {!canStart && (
        <p className="text-center text-xs text-brand-wood/60 mt-2">
          Se necesitan al menos 4 jugadores para jugar
        </p>
      )}
    </div>
  );
};

export default StartGameButton;
