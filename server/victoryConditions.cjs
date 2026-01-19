/**
 * Lógica de condiciones de victoria
 */

/**
 * Verifica todas las condiciones de victoria y retorna el ganador
 * @param {Object} gameState - Estado actual del juego
 * @returns {Object} { winner: 'civil'|'mafia'|'loco'|null, details: string }
 */
function checkVictory(gameState) {
  // Primero verificar si el Loco ganó (tiene prioridad)
  const locoVictory = checkLocoVictory(gameState);
  if (locoVictory.winner) return locoVictory;

  // Verificar victoria de Mafia
  const mafiaVictory = checkMafiaVictory(gameState);
  if (mafiaVictory.winner) return mafiaVictory;

  // Verificar victoria de Civiles
  const civilVictory = checkCivilVictory(gameState);
  if (civilVictory.winner) return civilVictory;

  return { winner: null, details: 'El juego continúa' };
}

/**
 * Victoria del Loco: fue ejecutado en votación diurna
 */
function checkLocoVictory(gameState) {
  if (gameState.locoExecutedToday) {
    return {
      winner: 'loco',
      details: 'El Loco fue ejecutado de día y gana automáticamente'
    };
  }
  return { winner: null };
}

/**
 * Victoria de Civiles: eliminaron a toda la Mafia
 */
function checkCivilVictory(gameState) {
  const aliveMafias = gameState.players.filter(p => p.alive && p.side === 'mafia');

  if (aliveMafias.length === 0) {
    return {
      winner: 'civil',
      details: 'Los Civiles eliminaron a toda la Mafia'
    };
  }

  return { winner: null };
}

/**
 * Victoria de Mafia - 3 condiciones:
 * 1. No quedan civiles
 * 2. Superioridad numérica directa
 * 3. Victoria inminente (post-día)
 */
function checkMafiaVictory(gameState) {
  const alivePlayers = gameState.players.filter(p => p.alive);
  const aliveCivils = alivePlayers.filter(p => p.side === 'civil');
  const aliveMafias = alivePlayers.filter(p => p.side === 'mafia');
  const aliveLoco = alivePlayers.find(p => p.side === 'loco');

  // Condición 1: No quedan civiles
  if (aliveCivils.length === 0) {
    return {
      winner: 'mafia',
      details: 'No quedan civiles vivos'
    };
  }

  // Condición 2: Superioridad Numérica Directa
  const civilsWithVote = aliveCivils.filter(p => !p.mutations?.includes('hand')).length;
  const mafiasWithVote = aliveMafias.filter(p => !p.mutations?.includes('hand')).length;

  if (mafiasWithVote >= civilsWithVote) {
    // Verificar excepciones
    const hasActiveJusticieros = aliveCivils.some(p => p.role === 'justiciero');
    const hasActiveCarnicero = aliveCivils.some(p => p.role === 'carnicero');
    const kamikazeCount = aliveCivils.filter(p => p.role === 'kamikaze').length;
    const locoAlive = aliveLoco !== undefined;

    if (!hasActiveJusticieros && !hasActiveCarnicero && kamikazeCount < aliveMafias.length && !locoAlive) {
      return {
        winner: 'mafia',
        details: 'La Mafia tiene superioridad numérica directa'
      };
    }
  }

  // Condición 3: Victoria Inminente (después del día)
  if (gameState.phase === 'night' && gameState.previousPhase === 'voting') {
    if (civilsWithVote === mafiasWithVote + 1) {
      // Verificar si hay roles que puedan prevenir la condición 2 después de la noche
      const hasMedico = aliveCivils.some(p => p.role === 'medico');
      const hasActiveJusticieros = aliveCivils.some(p => p.role === 'justiciero');
      const hasActiveCarnicero = aliveCivils.some(p => p.role === 'carnicero');
      const trabajadorasCount = aliveCivils.filter(p => p.role === 'trabajadora').length;
      const locoAlive = aliveLoco !== undefined;

      const canPrevent = hasMedico || hasActiveJusticieros || hasActiveCarnicero ||
        trabajadorasCount >= aliveMafias.length || locoAlive;

      if (!canPrevent) {
        return {
          winner: 'mafia',
          details: 'Victoria inminente de la Mafia (se cumplirá la condición 2 después de la noche)'
        };
      }
    }
  }

  return { winner: null };
}

/**
 * Obtiene los nombres de los jugadores ganadores
 */
function getWinnerNames(gameState, winner) {
  if (winner === 'loco') {
    const loco = gameState.players.find(p => p.side === 'loco');
    return loco ? [loco.name] : [];
  }

  if (winner === 'mafia') {
    return gameState.players
      .filter(p => p.side === 'mafia')
      .map(p => p.name);
  }

  if (winner === 'civil') {
    return gameState.players
      .filter(p => p.side === 'civil')
      .map(p => p.name);
  }

  return [];
}

module.exports = {
  checkVictory,
  checkLocoVictory,
  checkCivilVictory,
  checkMafiaVictory,
  getWinnerNames
};
