/**
 * Resolución de acciones nocturnas (Lógica Servidor)
 * Orden: Estudiante -> Bloqueo -> Intercambio -> Protección -> Muerte/Mutilación/Investigación
 */

const ROLE_ACTIONS = {
  policia: 'investigate',
  medico: 'protect',
  trabajadora: 'block',
  carnicero: 'mutilate',
  justiciero: 'kill_group',
  espejo: 'swap',
  estudiante: 'choose_master',
  mafia: 'kill_group'
};

const ROLES = {
  // Minimal role definitions needed for resolution logic
  mafia: { side: 'mafia', detectsAsBad: true },
  justiciero: { side: 'civil', detectsAsBad: false },
  // ... others implied
};

function getRoleNightAction(roleId) {
  return ROLE_ACTIONS[roleId] || null;
}

function validateNightAction(gameState, playerId, action) {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player || !player.alive) return { valid: false, error: 'Jugador no válido' };
  if (player.blockedThisNight) return { valid: false, error: 'Bloqueado' };

  // Estudiante only round 1
  if (player.role === 'estudiante' && gameState.round > 1) {
    return { valid: false, error: 'Estudiante solo actúa en ronda 1' };
  }

  const requiredAction = getRoleNightAction(player.role);
  if (action.type === 'no_action') return { valid: true }; // Allow skipping
  if (requiredAction !== action.type) return { valid: false, error: 'Acción incorrecta' };

  return { valid: true };
}

/**
 * Resuelve acciones nocturnas
 */
function resolveNightActions(gameState, nightActionsMap) {
  const events = [];

  // Clone state
  const state = JSON.parse(JSON.stringify(gameState));

  // Reset nightly flags
  state.players.forEach(p => {
    p.blockedThisNight = false;
    p.protectedBy = [];
  });

  // Initialize/ensure studentLinks exists
  if (!state.studentLinks) state.studentLinks = {};

  // Convert map to array for easier processing
  const actions = Object.entries(nightActionsMap).map(([playerId, action]) => ({
    ...action,
    playerIndex: playerId, // playerId is string socket ID here
    actorId: playerId
  })).filter(a => a.type !== 'no_action');

  const getPlayer = (id) => state.players.find(p => p.id === id);

  // 0. Process Estudiante Links (First Round)
  if (state.round === 1) {
    actions.filter(a => a.type === 'choose_master').forEach(action => {
      state.studentLinks[action.actorId] = action.target;
      // Optional: Log private event?
    });
  }

  // 1. Trabajadora Blocks
  const blockedPlayerIds = new Set();
  actions.filter(a => a.type === 'block').forEach(action => {
    blockedPlayerIds.add(action.target);
    const target = getPlayer(action.target);
    if (target) {
      target.blockedThisNight = true;
      events.push({ type: 'block', message: `${target.name} fue bloqueado.` });
    }
  });

  const validActions = actions.filter(action => {
    // If actor is blocked, action fails
    if (blockedPlayerIds.has(action.actorId)) return false;
    // Also check if actor is alive (sanity check)
    const actor = getPlayer(action.actorId);
    if (!actor || !actor.alive) return false;
    return true;
  });

  // 2. Espejo Swaps (Redirect Map)
  const redirectMap = {};
  validActions.filter(a => a.type === 'swap').forEach(action => {
    // Expecting action.target1 and action.target2 or action.targets array
    let t1, t2;
    if (Array.isArray(action.target)) {
      [t1, t2] = action.target;
    } else {
      t1 = action.target1;
      t2 = action.target2;
    }

    if (t1 && t2) {
      redirectMap[t1] = t2;
      redirectMap[t2] = t1;
      events.push({ type: 'info', message: 'Se intercambiaron efectos entre dos jugadores.', private: true, visibleTo: [action.actorId] });
    }
  });

  const getTarget = (originalTarget) => {
    if (redirectMap[originalTarget]) return redirectMap[originalTarget];
    return originalTarget;
  };

  // 3. Medico Protections & Cures
  const protectedPlayers = new Set();
  const protectionCounts = {};

  validActions.filter(a => a.type === 'protect').forEach(action => {
    const realTargetId = getTarget(action.target);

    protectionCounts[realTargetId] = (protectionCounts[realTargetId] || 0) + 1;
    protectedPlayers.add(realTargetId);

    const target = getPlayer(realTargetId);
    if (target && target.mutations && target.mutations.length > 0) {
      target.mutations = [];
      events.push({ type: 'info', message: `${target.name} fue curado de sus heridas.` });
    }
  });

  // 4. Investigations
  validActions.filter(a => a.type === 'investigate').forEach(action => {
    const realTargetId = getTarget(action.target);
    const target = getPlayer(realTargetId);
    const actor = getPlayer(action.actorId);

    if (target && actor) {
      const isBad = (target.side === 'mafia' || target.role === 'carnicero');
      events.push({
        type: 'investigate',
        message: `${target.name} es ${isBad ? 'CULPABLE (Malo)' : 'INOCENTE (Bueno)'}.`,
        private: true,
        visibleTo: [action.actorId]
      });
    }
  });

  // 5. Kills
  const mafiaVotes = {};
  const justicieroVotes = {};

  validActions.forEach(action => {
    if (action.type === 'kill_group' || action.type === 'kill_direct') {
      const realTargetId = getTarget(action.target);
      const actor = getPlayer(action.actorId);

      if (actor.side === 'mafia') {
        mafiaVotes[realTargetId] = (mafiaVotes[realTargetId] || 0) + 1;
      } else if (actor.role === 'justiciero') {
        justicieroVotes[realTargetId] = (justicieroVotes[realTargetId] || 0) + 1;
      }
    }
  });

  const resolveKillVote = (votes) => {
    let max = 0;
    let targetId = null;
    Object.entries(votes).forEach(([tid, count]) => {
      if (count > max) {
        max = count;
        targetId = tid;
      } else if (count === max) {
        targetId = null; // Tie
      }
    });
    return targetId;
  };

  const mafiaTargetId = resolveKillVote(mafiaVotes);
  const justicieroTargetId = resolveKillVote(justicieroVotes);

  const checkStudentInheritance = (deadId) => {
    Object.entries(state.studentLinks).forEach(([studentId, masterId]) => {
      if (masterId === deadId) {
        const student = getPlayer(studentId);
        const master = getPlayer(masterId);
        if (student && student.alive && master) {
          student.role = master.role;
          student.side = master.side; // Inherit side too? usually yes
          events.push({ type: 'info', message: 'Un estudiante ha ascendido.' });
        }
      }
    });
  };

  const tryKill = (targetId, reason) => {
    if (!targetId) return;

    // Overdose check
    if (protectedPlayers.has(targetId) && (protectionCounts[targetId] || 0) < 2) {
      events.push({ type: 'info', message: 'Alguien fue atacado pero sobrevivió.' });
    } else {
      const target = getPlayer(targetId);
      if (target && target.alive) {
        target.alive = false;
        target.deathReason = reason;
        events.push({ type: 'death', message: `${target.name} ha muerto.` });
        checkStudentInheritance(targetId);
      }
    }
  };

  if (mafiaTargetId) tryKill(mafiaTargetId, 'mafia');
  if (justicieroTargetId) tryKill(justicieroTargetId, 'justiciero');

  // Overdose Deaths (Medic >= 2) - trigger explicitly if not killed by attack?
  // Logic: If protected by 2 meds, they die. Even if not attacked.
  Object.entries(protectionCounts).forEach(([id, count]) => {
    if (count >= 2) {
      const target = getPlayer(id);
      if (target && target.alive) {
        target.alive = false;
        target.deathReason = 'overdose';
        events.push({ type: 'death', message: `${target.name} murió por sobredosis de protección.` });
        checkStudentInheritance(id);
      }
    }
  });

  // 6. Mutilations
  validActions.filter(a => a.type === 'mutilate').forEach(action => {
    const realTargetId = getTarget(action.target);

    if (protectedPlayers.has(realTargetId)) {
      events.push({ type: 'info', message: 'Un intento de mutilación fue prevenido.' });
    } else {
      const target = getPlayer(realTargetId);
      if (target && target.alive) {
        if (!target.mutations) target.mutations = [];
        target.mutations.push(action.mutationType);

        const part = action.mutationType === 'hand' ? 'mano' : 'lengua';
        events.push({ type: 'mutilation', message: `${target.name} fue mutilado (${part}).` });

        if (target.mutations.length >= 2) {
          target.alive = false;
          target.deathReason = 'mutilation';
          events.push({ type: 'death', message: `${target.name} murió por sus heridas.` });
          checkStudentInheritance(realTargetId);
        }
      }
    }
  });

  return { gameState: state, events };
}

module.exports = {
  resolveNightActions,
  validateNightAction,
  getRoleNightAction
};
