/**
 * Game logic handlers for La Mafia
 */
const { checkVictory, getWinnerNames } = require('./victoryConditions.cjs');
const { resolveNightActions, validateNightAction } = require('./nightResolution.cjs');

// Roles con sus bandos
const ROLE_SIDES = {
  civil: 'civil',
  policia: 'civil',
  medico: 'civil',
  trabajadora: 'civil',
  carnicero: 'civil',
  kamikaze: 'civil',
  justiciero: 'civil',
  espejo: 'civil',
  estudiante: 'civil',
  mafia: 'mafia',
  loco: 'loco'
};

function setupGameHandlers(socket, roomManager) {

  /**
   * Iniciar juego - Asignar roles y comenzar fase nocturna
   */
  socket.on('startGame', ({ roomId, roles }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || room.hostId !== socket.id || room.players.length < 4) {
      return;
    }

    // Construir pool de roles
    let rolesPool = [];
    Object.entries(roles).forEach(([roleId, count]) => {
      for (let i = 0; i < count; i++) {
        rolesPool.push(roleId);
      }
    });

    // Rellenar con civiles si faltan roles
    while (rolesPool.length < room.players.length) {
      rolesPool.push('civil');
    }

    // Asignar roles aleatoriamente
    const shuffledRoles = rolesPool.sort(() => Math.random() - 0.5);
    const gamePlayers = room.players.map((player, index) => ({
      id: player.id,
      playerId: player.playerId,
      name: player.name,
      role: shuffledRoles[index],
      side: ROLE_SIDES[shuffledRoles[index]],
      alive: true,
      canVote: true,
      canSpeak: true,
      mutations: [],
      protectedBy: [],
      blockedThisNight: false
    }));

    // Identificar compañeros de mafia
    const mafiaIds = gamePlayers.filter(p => p.side === 'mafia').map(p => p.id);

    room.gameData = {
      phase: 'night',
      round: 1,
      players: gamePlayers,
      mafiaIds: mafiaIds,
      nightActions: {},
      dayVotes: {},
      executedPlayerId: null,
      locoExecutedToday: false,
      kamikazeTargetId: null,
      studentMaster: null,
      winner: null,
      winnerNames: [],
      events: []
    };

    // ... (rest of initial gameData setup above) ...

    room.status = 'playing';

    // Start Night Timer (45s)
    startPhaseTimer(room, roomManager, 'night', 45);

    // Enviar información personalizada a cada jugador
    room.players.forEach(player => {
      const gamePlayer = gamePlayers.find(p => p.id === player.id);
      if (gamePlayer) {
        const personalizedGameData = {
          ...room.gameData,
          myRole: gamePlayer.role,
          mySide: gamePlayer.side
        };

        roomManager.io.to(player.id).emit('gameStarted', personalizedGameData);
      }
    });

    console.log(`Game started in room ${roomId} with ${gamePlayers.length} players`);
  });

  /**
   * Recibir acción nocturna de un jugador
   */
  socket.on('nightAction', ({ roomId, action }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || !room.gameData || room.gameData.phase !== 'night') {
      socket.emit('actionError', { error: 'No es fase nocturna' });
      return;
    }

    const player = room.players.find(p => p.id === socket.id);
    if (!player) {
      socket.emit('actionError', { error: 'Jugador no encontrado' });
      return;
    }

    const gamePlayer = room.gameData.players.find(p => p.id === player.id);
    if (!gamePlayer || !gamePlayer.alive) {
      socket.emit('actionError', { error: 'No puedes realizar acciones' });
      return;
    }

    // Validar acción
    const validation = validateNightAction(action, gamePlayer, room.gameData);
    if (!validation.valid) {
      socket.emit('actionError', { error: validation.error });
      return;
    }

    // Guardar acción
    room.gameData.nightActions[player.id] = action;
    socket.emit('actionReceived', { action });

    // Verificar si todos los jugadores activos han enviado su acción
    const playersWithActions = room.gameData.players.filter(p =>
      p.alive && (p.role !== 'civil' || p.side === 'mafia')
    );

    roomManager.emitToRoom(roomId, 'nightProgress', {
      received: Object.keys(room.gameData.nightActions).length,
      total: playersWithActions.length
    });

    if (Object.keys(room.gameData.nightActions).length >= playersWithActions.length) {
      resolveNight(room, roomManager);
    }
  });

  function resolveNight(room, roomManager) {
    if (room.timer) clearTimeout(room.timer); // Clear timer on resolution

    const { gameState, events } = resolveNightActions(room.gameData, room.gameData.nightActions);

    // Actualizar gameData con el nuevo estado
    room.gameData = gameState;
    room.gameData.events = events;
    room.gameData.nightActions = {}; // Reiniciar acciones

    // Verificar condiciones de victoria
    const victoryCheck = checkVictory(room.gameData);
    if (victoryCheck.winner) {
      room.gameData.winner = victoryCheck.winner;
      room.gameData.winnerNames = getWinnerNames(room.gameData, victoryCheck.winner);
      room.gameData.phase = 'results';
      roomManager.emitToRoom(room.id, 'gameEnded', room.gameData);
      return;
    }

    // Transición a fase diurna
    room.gameData.phase = 'day';
    room.gameData.previousPhase = 'night';

    roomManager.emitToRoom(room.id, 'dayPhaseStart', room.gameData);
    console.log(`Room ${room.id}: Night resolved, moving to day phase`);
  }

  socket.on('startVoting', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || !room.gameData || room.gameData.phase !== 'day') {
      return;
    }

    room.gameData.phase = 'voting';
    room.gameData.dayVotes = {};

    startPhaseTimer(room, roomManager, 'voting', 45); // 45s for Voting
    roomManager.emitToRoom(roomId, 'votingStart', room.gameData);
  });

  socket.on('submitDayVote', ({ roomId, targetId }) => {
    // ...
    if (Object.keys(room.gameData.dayVotes).length >= playersWithVote.length) {
      resolveDayVoting(room, roomManager); // This will clear timer inside next setup or we should clear here? 
      // resolveDayVoting doesn't clear timer explicitly at start, but sets next phase timer.
      // We should clear it to be safe.
      if (room.timer) clearTimeout(room.timer);
    }
  });

  function resolveDayVoting(room, roomManager) {
    if (room.timer) clearTimeout(room.timer);
    // ...
  }

  /**
   * Enviar voto diurno
   */
  socket.on('submitDayVote', ({ roomId, targetId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || !room.gameData || room.gameData.phase !== 'voting') {
      return;
    }

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const gamePlayer = room.gameData.players.find(p => p.id === player.id);
    if (!gamePlayer || !gamePlayer.alive || gamePlayer.mutations?.includes('hand')) {
      return; // No puede votar
    }

    room.gameData.dayVotes[player.id] = targetId;

    // Verificar si todos votaron
    const playersWithVote = room.gameData.players.filter(p =>
      p.alive && !p.mutations?.includes('hand')
    );

    if (Object.keys(room.gameData.dayVotes).length >= playersWithVote.length) {
      resolveDayVoting(room, roomManager);
    } else {
      roomManager.emitToRoom(roomId, 'votingProgress', {
        received: Object.keys(room.gameData.dayVotes).length,
        total: playersWithVote.length
      });
    }
  });

  /**
   * Resolver votación diurna
   */
  function resolveDayVoting(room, roomManager) {
    const voteCounts = {};
    Object.values(room.gameData.dayVotes).forEach(targetId => {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });

    const sortedTargets = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);

    if (sortedTargets.length > 0) {
      const executedId = sortedTargets[0][0];
      const executed = room.gameData.players.find(p => p.id === executedId);

      if (executed) {
        room.gameData.executedPlayerId = executedId;
        executed.alive = false;
        executed.deathReason = 'execution';

        // Verificar si es Loco
        if (executed.role === 'loco') {
          room.gameData.locoExecutedToday = true;
          const victoryCheck = checkVictory(room.gameData);
          room.gameData.winner = victoryCheck.winner;
          room.gameData.winnerNames = getWinnerNames(room.gameData, victoryCheck.winner);
          room.gameData.phase = 'results';
          roomManager.emitToRoom(room.id, 'gameEnded', room.gameData);
          return;
        }

        // Verificar si es Kamikaze
        if (executed.role === 'kamikaze') {
          room.gameData.phase = 'kamikaze_choice';
          roomManager.emitToRoom(room.id, 'kamikazeChoice', {
            kamikazeId: executedId,
            gameData: room.gameData
          });
          return;
        }
      }
    }

    // Verificar victoria
    const victoryCheck = checkVictory(room.gameData);
    if (victoryCheck.winner) {
      room.gameData.winner = victoryCheck.winner;
      room.gameData.winnerNames = getWinnerNames(room.gameData, victoryCheck.winner);
      room.gameData.phase = 'results';
      roomManager.emitToRoom(room.id, 'gameEnded', room.gameData);
      return;
    }

    // Siguiente ronda nocturna
    room.gameData.round++;
    room.gameData.phase = 'night';
    room.gameData.previousPhase = 'voting';
    room.gameData.locoExecutedToday = false;
    room.gameData.dayVotes = {};

    startPhaseTimer(room, roomManager, 'night', 45); // 45s for Night
    roomManager.emitToRoom(room.id, 'nightPhaseStart', room.gameData);
  }

  /**
   * Kamikaze elige víctima
   */
  socket.on('kamikazeTarget', ({ roomId, targetId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || !room.gameData || room.gameData.phase !== 'kamikaze_choice') {
      return;
    }

    // Clear kamikaze timer if we had one (optional, logic simplified)
    if (room.timer) clearTimeout(room.timer);

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.id !== room.gameData.executedPlayerId) {
      return;
    }

    const target = room.gameData.players.find(p => p.id === targetId);
    if (target && target.alive) {
      target.alive = false;
      target.deathReason = 'kamikaze';
      room.gameData.kamikazeTargetId = targetId;
    }

    // Verificar victoria
    const victoryCheck = checkVictory(room.gameData);
    if (victoryCheck.winner) {
      room.gameData.winner = victoryCheck.winner;
      room.gameData.winnerNames = getWinnerNames(room.gameData, victoryCheck.winner);
      room.gameData.phase = 'results';
      roomManager.emitToRoom(room.id, 'gameEnded', room.gameData);
      return;
    }

    // Siguiente ronda
    room.gameData.round++;
    room.gameData.phase = 'night';
    room.gameData.previousPhase = 'voting';
    room.gameData.locoExecutedToday = false;

    startPhaseTimer(room, roomManager, 'night', 45);
    roomManager.emitToRoom(room.id, 'nightPhaseStart', room.gameData);
  });

  /**
   * Helper: Start Phase Timer
   */
  function startPhaseTimer(room, roomManager, phase, durationSeconds) {
    if (room.timer) clearTimeout(room.timer);

    console.log(`Starting ${phase} timer for room ${room.id}: ${durationSeconds}s`);

    room.timer = setTimeout(() => {
      console.log(`Timer expired for room ${room.id} (${phase})`);
      if (phase === 'night' && room.gameData.phase === 'night') {
        resolveNight(room, roomManager);
      } else if (phase === 'voting' && room.gameData.phase === 'voting') {
        resolveDayVoting(room, roomManager);
      }
    }, durationSeconds * 1000);
  }

  /**
   * Reiniciar juego
   */
  socket.on('resetGame', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.hostId === socket.id) {
      if (room.timer) clearTimeout(room.timer);
      room.gameData = null;
      room.status = 'waiting';
      roomManager.emitToRoom(roomId, 'gameReset', room);
      roomManager.broadcastRoomList();
    }
  });
}

module.exports = { setupGameHandlers };
